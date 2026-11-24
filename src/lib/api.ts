const BASE_URL = "https://ecommerce.routemisr.com/api/v1";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  priceAfterDiscount?: number;
  quantity: number;
  sold: number;
  imageCover: string;
  images: string[];
  ratingsAverage: number;
  ratingsQuantity: number;
  category: Category;
  brand: Brand;
  subcategory: SubCategory[];
}

export interface PageMetadata {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage?: number;
  prevPage?: number;
}

async function request(path: string) {
  const res = await fetch(`${BASE_URL}${path}`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

async function get<T>(path: string): Promise<T> {
  const json = await request(path);
  return json.data as T;
}

export const getCategories = () => get<Category[]>("/categories");
export const getCategory = (id: string) => get<Category>(`/categories/${id}`);
export const getSubCategories = () => get<SubCategory[]>("/subcategories");
export const getSubCategory = (id: string) => get<SubCategory>(`/subcategories/${id}`);
export const getCategorySubCategories = (id: string) =>
  get<SubCategory[]>(`/categories/${id}/subcategories`);

export async function getProducts(page = 1) {
  const json = await request(`/products?page=${page}`);
  return {
    products: json.data as Product[],
    metadata: json.metadata as PageMetadata,
  };
}

export const getProduct = (id: string) => get<Product>(`/products/${id}`);

export async function getAllProducts(): Promise<Product[]> {
  const first = await getProducts(1);
  const pages = first.metadata.numberOfPages;
  if (pages <= 1) return first.products;

  const rest = await Promise.all(
    Array.from({ length: pages - 1 }, (_, i) => getProducts(i + 2))
  );
  return [...first.products, ...rest.flatMap((r) => r.products)];
}

export const getBrands = () => get<Brand[]>("/brands");
export const getBrand = (id: string) => get<Brand>(`/brands/${id}`);

export async function getProductsByBrand(brandId: string): Promise<Product[]> {
  const json = await request(`/products?brand=${brandId}`);
  return json.data as Product[];
}

async function authRequest<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { token } : {}),
      ...options.headers,
    },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || "Something went wrong");
  return json as T;
}

export interface AuthUser {
  name: string;
  email: string;
}

export const signIn = (body: { email: string; password: string }) =>
  authRequest<{ message: string; user: AuthUser; token: string }>("/auth/signin", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const signUp = (body: {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}) =>
  authRequest<{ message: string; token: string }>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(body),
  });

/* ---------- Cart ---------- */
export interface CartProduct {
  count: number;
  _id: string;
  price: number;
  product: { _id: string; title: string; imageCover: string; category?: { name: string }; };
}

export interface Cart {
  numOfCartItems: number;
  cartId: string;
  data: { totalCartPrice: number; products: CartProduct[] };
}

export const getCart = (token: string) => authRequest<Cart>("/cart", {}, token);

export const addToCart = (productId: string, token: string) =>
  authRequest<Cart>("/cart", { method: "POST", body: JSON.stringify({ productId }) }, token);

export const updateCartItem = (productId: string, count: number, token: string) =>
  authRequest<Cart>(`/cart/${productId}`, { method: "PUT", body: JSON.stringify({ count }) }, token);

export const removeCartItem = (productId: string, token: string) =>
  authRequest<Cart>(`/cart/${productId}`, { method: "DELETE" }, token);

export const clearCart = (token: string) =>
  authRequest<unknown>("/cart", { method: "DELETE" }, token);

export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
}

export interface OrderItem {
  _id: string;
  count: number;
  price: number;
  product: { _id: string; title: string; imageCover: string };
}

export interface Order {
  _id: string;
  id: number;
  createdAt: string;
  totalOrderPrice: number;
  paymentMethodType: "cash" | "card";
  isPaid: boolean;
  isDelivered: boolean;
  shippingAddress?: Partial<ShippingAddress>;
  cartItems: OrderItem[];
}

export function getUserIdFromToken(token: string): string | null {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload)).id ?? null;
  } catch {
    return null;
  }
}

export const createCashOrder = (cartId: string, shippingAddress: ShippingAddress, token: string) =>
  authRequest<{ status: string; data: Order }>(
    `/orders/${cartId}`,
    { method: "POST", body: JSON.stringify({ shippingAddress }) },
    token
  );

export const createCheckoutSession = (
  cartId: string,
  shippingAddress: ShippingAddress,
  token: string,
  returnUrl: string
) =>
  authRequest<{ status: string; session: { url: string } }>(
    `/orders/checkout-session/${cartId}?url=${encodeURIComponent(returnUrl)}`,
    { method: "POST", body: JSON.stringify({ shippingAddress }) },
    token
  );

export async function getUserOrders(userId: string, token: string): Promise<Order[]> {
  const res = await authRequest<Order[] | { data: Order[] }>(`/orders/user/${userId}`, {}, token);
  return Array.isArray(res) ? res : res.data ?? [];
}