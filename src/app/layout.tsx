import type { Metadata } from "next";
import { Outfit, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FreshCart",
  description: "Fresh products delivered to your door",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${outfit.className} bg-slate-50 text-slate-800 antialiased`}>
      
        <AuthProvider>
  <CartProvider>
    <TopBar />
<Navbar />
{children}
<Footer />
  </CartProvider>
</AuthProvider>
      </body>
    </html>
  );
}