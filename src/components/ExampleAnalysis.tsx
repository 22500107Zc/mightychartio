import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, TrendingUp, Shield, Target, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const ExampleAnalysis = () => {
  return (
    <section className="py-24 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            See AI Analysis{" "}
            <span className="text-primary">In Action</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Real example of how our AI identifies high-probability setups
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">BTC/USD Analysis - Daily Chart</CardTitle>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  <span className="font-semibold text-accent">BULLISH</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pattern Detection */}
              <div className="p-6 rounded-lg bg-primary/10 border border-primary/30">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Pattern Detected: Ascending Triangle + RSI Divergence
                </h3>
                <p className="text-muted-foreground">
                  Multi-timeframe analysis reveals strong bullish momentum on Daily and 4H charts. 
                  Price consolidating at resistance with decreasing volume - typical pre-breakout behavior.
                  RSI showing bullish divergence while MACD histogram turning positive.
                </p>
              </div>

              {/* Trading Setup */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="bg-accent/10 border-accent/30">
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">Entry Point</div>
                    <div className="text-2xl font-bold text-accent flex items-center gap-2">
                      <ArrowUp className="w-5 h-5" />
                      $67,250
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Break above resistance</div>
                  </CardContent>
                </Card>

                <Card className="bg-destructive/10 border-destructive/30">
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">Stop Loss</div>
                    <div className="text-2xl font-bold text-destructive">$65,100</div>
                    <div className="text-xs text-muted-foreground mt-1">Below support zone</div>
                  </CardContent>
                </Card>

                <Card className="bg-accent/10 border-accent/30">
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">Take Profit</div>
                    <div className="text-2xl font-bold text-accent">$72,800</div>
                    <div className="text-xs text-muted-foreground mt-1">8.2% gain target</div>
                  </CardContent>
                </Card>
              </div>

              {/* Risk Management */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-card/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Shield className="w-5 h-5 text-primary" />
                      <span className="font-semibold">Risk Management</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Risk Per Trade:</span>
                        <span className="font-semibold">1.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Risk/Reward:</span>
                        <span className="font-semibold text-accent">1:3.8</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Position Size:</span>
                        <span className="font-semibold">0.15 BTC</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                      <span className="font-semibold">Key Confluences</span>
                    </div>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>✓ Volume profile support at $66K</li>
                      <li>✓ 50 EMA acting as dynamic support</li>
                      <li>✓ Weekly timeframe still bullish</li>
                      <li>✓ Fear & Greed at 42 (opportunity)</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Result Badge */}
              <div className="p-4 rounded-lg bg-accent/20 border border-accent/30 text-center">
                <div className="text-sm text-muted-foreground mb-1">Historical Result</div>
                <div className="text-3xl font-bold text-accent mb-1">+$8,340 Profit</div>
                <div className="text-sm text-muted-foreground">
                  Target hit in 4 days - This is the kind of setup our AI identifies daily
                </div>
              </div>

              <div className="text-center pt-4">
                <Link to="/pricing">
                  <Button size="lg" className="bg-primary hover:shadow-glow transition-all">
                    Start Analyzing Your Charts
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
