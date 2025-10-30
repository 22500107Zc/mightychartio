import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  "Unlimited AI chart analysis",
  "Swing & scalp trading patterns",
  "Advanced risk management",
  "Trade journaling system",
  "Learning resources center",
  "Real-time market insights",
  "Position sizing calculator",
  "AI trade performance reviews",
];

export const Pricing = () => {
  return (
    <section className="py-24 px-4 md:px-6 bg-gradient-hero">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-muted-foreground">
            No upsells or hidden fees, just results
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <Card className="bg-card/80 backdrop-blur-sm border-primary/50 shadow-glow relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="bg-gradient-primary px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
            </div>
            <CardHeader className="text-center pt-8">
              <CardTitle className="text-4xl font-bold">$19.99<span className="text-lg text-muted-foreground">/month</span></CardTitle>
              <CardDescription className="text-base mt-2">
                Everything you need to trade with confidence
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-success" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <Link to="/analyze">
                <Button className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg py-6">
                  Start Analyzing
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
