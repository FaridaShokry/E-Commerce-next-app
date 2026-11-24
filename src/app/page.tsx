import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CategorySection from "@/components/CategorySection";
import PromoBanners from "@/components/PromoBanners";
import FeaturedProducts from "@/components/FeaturedProducts";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
     
      <main>
        <Hero />
        <Features />
        <CategorySection />
        <PromoBanners />
        <FeaturedProducts />
        <NewsletterSection />
      </main>
      
    </>
  );
}