import AnnouncementBar from "./components/AnnouncementBar";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductCarousel from "./components/ProductCarousel";
import Editorial from "./components/Editorial";
import Feature from "./components/Feature";
import BrandValues from "./components/BrandValues";
import Footer from "./components/Footer";
import ScrollAnimations from "./components/ScrollAnimations";

export default function Home() {
  return (
    <>
      <ScrollAnimations />
      <AnnouncementBar />
      <Header />

      <main>
        <Hero />

        <div className="fade-in">
          <ProductCarousel />
        </div>

        <div className="fade-in">
          <Editorial />
        </div>

        <div className="fade-in">
          <Feature />
        </div>

        <div className="fade-in">
          <BrandValues />
        </div>
      </main>

      <Footer />
    </>
  );
}
