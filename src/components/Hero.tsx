import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden pt-24">
      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Trade with{" "}
            <span className="text-primary">
              AI precision
            </span>
            <br />
            not gut feelings.
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
            Upload your chart and get instant AI analysis with precise entry/exit points based on proven patterns.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 py-6">
            <div className="flex flex-col items-center">
              <div className="text-4xl md:text-5xl font-bold text-accent">89%</div>
              <div className="text-sm text-muted-foreground mt-1">Pattern Accuracy</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl md:text-5xl font-bold text-accent">8sec</div>
              <div className="text-sm text-muted-foreground mt-1">Analysis Speed</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl md:text-5xl font-bold text-accent">44,000+</div>
              <div className="text-sm text-muted-foreground mt-1">Active Traders</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to="/analyze">
              <Button size="lg" className="bg-primary hover:shadow-glow transition-all duration-300 text-lg px-8">
                Start Analyzing
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="text-lg px-8 border-primary/30 hover:bg-primary/10">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
