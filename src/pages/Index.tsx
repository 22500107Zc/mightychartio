import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="purple-overlay" />
      <div className="content-wrapper">
        <Navbar />
        <Hero />
        <div id="features">
          <Features />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
