import { Navbar } from "@/components/Navbar";
import { Pricing as PricingComponent } from "@/components/Pricing";
import { Footer } from "@/components/Footer";

const Pricing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="purple-overlay" />
      <div className="content-wrapper">
        <Navbar />
        <div className="flex-1">
          <PricingComponent />
        </div>
        <Footer />
      </div>
    </div>
    </div>
  );
};

export default Pricing;
