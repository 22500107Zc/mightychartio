import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useHaptic } from "@/hooks/useHaptic";
import { useAuth } from "@/hooks/useAuth";

export const Hero = () => {
  const { lightTap } = useHaptic();
  const { user } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden pt-16 md:pt-20">
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-6 max-w-5xl mx-auto">

          {/* Main heading with gradient and animation */}
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
              <span className="inline-block animate-[slide-in-right_0.6s_ease-out]">AI-Powered</span>{" "}
              <span className="inline-block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-[slide-in-right_0.8s_ease-out]">
                Confluence Analysis
              </span>
              <br />
              <span className="inline-block animate-[slide-in-right_1s_ease-out]">For Modern Traders</span>
            </h1>
            
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
          </div>

          {/* Subheading with animation */}
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl animate-[fade-in_1s_ease-out_0.3s_both]">
            Upload any trading chart and receive instant AI-driven confluence analysis. 
            <span className="text-foreground font-semibold"> Identify high-probability setups</span> with 
            <span className="text-primary font-semibold"> 12+ technical factors</span> in under a minute.
          </p>

          {/* Enhanced Stats Grid with animations */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 py-8 w-full max-w-4xl animate-[fade-in_1s_ease-out_0.5s_both]">
            <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:scale-105 transition-transform duration-300">
              <div className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">30-60s</div>
              <div className="text-xs md:text-sm text-muted-foreground font-medium">Lightning Fast</div>
            </div>
            
            <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:scale-105 transition-transform duration-300">
              <div className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">12+</div>
              <div className="text-xs md:text-sm text-muted-foreground font-medium">Confluence Factors</div>
            </div>
            
            <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:scale-105 transition-transform duration-300">
              <div className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">AI</div>
              <div className="text-xs md:text-sm text-muted-foreground font-medium">Powered Analysis</div>
            </div>

            <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:scale-105 transition-transform duration-300">
              <div className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">24/7</div>
              <div className="text-xs md:text-sm text-muted-foreground font-medium">Always Available</div>
            </div>
          </div>

          {/* Key Features List */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 text-sm md:text-base animate-[fade-in_1s_ease-out_0.7s_both]">
            <span className="px-4 py-2 rounded-full bg-primary/10 text-foreground border border-primary/20">Support & Resistance</span>
            <span className="px-4 py-2 rounded-full bg-accent/10 text-foreground border border-accent/20">Fibonacci Levels</span>
            <span className="px-4 py-2 rounded-full bg-primary/10 text-foreground border border-primary/20">Chart Patterns</span>
            <span className="px-4 py-2 rounded-full bg-accent/10 text-foreground border border-accent/20">Risk Management</span>
          </div>

          {/* CTA Buttons with enhanced styling */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 animate-[fade-in_1s_ease-out_0.9s_both]">
            <Link to={user ? "/dashboard" : "/analyze"}>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300 text-base md:text-lg px-8 md:px-12 py-6 group" 
                onClick={lightTap}
              >
                {user ? "Go to Dashboard" : "Start Free Analysis"}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/feedback">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-base md:text-lg px-8 md:px-12 py-6 border-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300" 
                onClick={lightTap}
              >
                Share Feedback
              </Button>
            </Link>
          </div>

          {/* Trust indicator */}
          <p className="text-xs md:text-sm text-muted-foreground animate-[fade-in_1s_ease-out_1.1s_both] pt-4">
            ✨ No credit card required • Built by traders, for traders
          </p>
        </div>
      </div>
    </section>
  );
};
