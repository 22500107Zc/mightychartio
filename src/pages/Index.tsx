import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-hero">
      <Navbar />
      <Hero />
      <div id="features">
        <Features />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
