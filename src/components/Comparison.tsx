import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Check } from "lucide-react";

export const Comparison = () => {
  return (
    <section className="py-24 px-4 md:px-6 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Traditional vs{" "}
            <span className="text-primary">AI Analysis</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            See what you're missing without AI-powered insights
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Traditional Analysis */}
          <Card className="bg-card/50 backdrop-blur-sm border-destructive/30">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <X className="w-5 h-5 text-destructive" />
                Manual Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Takes 30-60 minutes per chart</span>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Miss hidden patterns & divergences</span>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Emotional bias affects decisions</span>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Limited to single timeframe view</span>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Inconsistent risk calculations</span>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">50-60% average win rate</span>
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis */}
          <Card className="bg-card/50 backdrop-blur-sm border-accent/30 shadow-glow">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Check className="w-5 h-5 text-accent" />
                MightyChart AI
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-foreground font-medium">Analysis in 8 seconds flat</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-foreground font-medium">Identifies 92% of patterns accurately</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-foreground font-medium">100% objective, zero emotions</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-foreground font-medium">Multi-timeframe correlation analysis</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-foreground font-medium">Precise risk/reward calculations</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-foreground font-medium">89% average success rate</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <div className="inline-block p-6 rounded-lg bg-primary/10 border border-primary/30">
            <div className="text-4xl font-bold text-primary mb-2">37% Higher</div>
            <div className="text-muted-foreground">Average profitability with AI analysis</div>
          </div>
        </div>
      </div>
    </section>
  );
};
