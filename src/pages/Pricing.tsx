import { Navbar } from "@/components/Navbar";
import { Pricing as PricingComponent } from "@/components/Pricing";
import { Footer } from "@/components/Footer";

const Pricing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-hero">
      <Navbar />
      <div className="flex-1">
        <PricingComponent />
      </div>
      <Footer />
    </div>
  );
};

export default Pricing;
