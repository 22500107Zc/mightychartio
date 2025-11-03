import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Zap, Shield, LineChart, DollarSign, BookOpen } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "AI Trade Analysis",
    description: "Get detailed trade reviews with our AI that analyzes your chart patterns and trading decisions.",
  },
  {
    icon: Zap,
    title: "Scalp Trading Analysis",
    description: "Discover short-term opportunities with lightning-fast AI analysis for scalp traders.",
  },
  {
    icon: LineChart,
    title: "Price Action Analysis",
    description: "Understand key support, resistance levels and market structure with AI-driven insights.",
  },
  {
    icon: Shield,
    title: "Risk Management",
    description: "Optimize your position sizes and see potential returns based on AI-calculated risk profiles.",
  },
  {
    icon: DollarSign,
    title: "Swing Trading Analysis",
    description: "Identify optimal entry and exit points with our AI-powered swing trading pattern recognition.",
  },
  {
    icon: BookOpen,
    title: "Trade Journaling",
    description: "Track your trading progress with our comprehensive journaling system to improve consistency.",
  },
];

export const Features = () => {
  return (
    <section className="py-24 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything you need for{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              data-driven trading
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our AI doesn't just analyze charts—it understands market psychology, risk, and opportunity to give you the edge you need.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
