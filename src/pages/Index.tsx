import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustSignals } from "@/components/TrustSignals";
import { Features } from "@/components/Features";
import { ExampleAnalysis } from "@/components/ExampleAnalysis";
import { Comparison } from "@/components/Comparison";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="purple-overlay" />
      <div className="content-wrapper">
        <Navbar />
        <Hero />
        <TrustSignals />
        <div id="features">
          <Features />
        </div>
        <ExampleAnalysis />
        <Comparison />
        <Testimonials />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
