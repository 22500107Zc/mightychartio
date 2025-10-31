import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">MightyChart.io</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/#features" className="text-sm hover:text-primary transition-colors">
              Features
            </Link>
            <Link to="/#pricing" className="text-sm hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link to="/analyze">
              <Button size="sm" className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                Try Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
