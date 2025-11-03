import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, TrendingUp, Target, Zap, Clock, BarChart3, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const TipsTricks = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-hero">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Tips & Tricks for Maximum Accuracy</h1>
            <p className="text-lg text-muted-foreground">
              Master the art of AI-powered chart analysis and maximize your trading edge
            </p>
          </div>

          <Card className="mb-6 border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Lightbulb className="w-5 h-5" />
                The Multi-Timeframe Magnifying Glass Approach
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground font-semibold">
                Our AI analyzes your charts like a professional trader - starting from the big picture and zooming in progressively.
              </p>
              <p>
                Think of it as a <strong>magnifying glass technique</strong>: The AI first examines higher timeframes (Weekly, Daily) 
                to understand the overall trend and market structure, then progressively scales down through intermediate timeframes 
                (4H, 1H) to identify precise entry zones. This hierarchical analysis ensures every trading decision is aligned with 
                the broader market context.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Essential: Upload Multiple Timeframes
              </CardTitle>
              <CardDescription>Give the AI complete market context (works with any timeframe)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <strong>The AI can analyze any timeframe</strong> you provide, but for maximum accuracy, use multiple timeframes. 
                Professional traders never look at just one timeframe - the same principle applies to AI analysis. 
                By providing charts from different timeframes, you enable the AI to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Weekly/Daily charts:</strong> Identify major support/resistance levels and overall trend direction</li>
                <li><strong>4H/1H charts:</strong> Spot intermediate patterns and confirm momentum shifts</li>
                <li><strong>15m/5m charts:</strong> Pinpoint exact entry and exit points with precision</li>
              </ul>
              <div className="mt-4 p-4 bg-success/10 border border-success/20 rounded-lg">
                <p className="text-sm font-semibold text-success">
                  💡 Pro Tip: The tool works with ANY timeframe you choose, but upload 6-8 screenshots covering at least 3 different 
                  timeframes for optimal results. Higher timeframes should always be included first - this is how professional analysis works.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Critical Indicators: What to Include
              </CardTitle>
              <CardDescription>More data = better accuracy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The AI's pattern recognition becomes exponentially more accurate when you provide comprehensive technical indicator data:
              </p>
              
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Always Visible (Every Screenshot):</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Volume:</strong> Confirms the strength behind price movements</li>
                    <li><strong>RSI (Relative Strength Index):</strong> Identifies overbought/oversold conditions</li>
                    <li><strong>KDJ:</strong> Provides momentum and trend reversal signals</li>
                    <li><strong>MACD:</strong> Shows trend direction and momentum shifts</li>
                  </ul>
                </div>

                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Alternate Between Screenshots:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Bollinger Bands:</strong> Use on 1-2 screenshots to show volatility and price extremes</li>
                    <li><strong>Ichimoku Cloud:</strong> Use on 1-2 other screenshots to reveal trend strength and support/resistance</li>
                    <li><strong>MA (Moving Average):</strong> Include on 1-2 screenshots to track price trend direction</li>
                    <li><strong>EMA (Exponential Moving Average):</strong> Add to 1-2 screenshots for faster trend signals</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="text-sm">
                  <strong>Why this matters:</strong> Each indicator provides unique data points. The AI synthesizes all this information 
                  to give you a confidence score and precise entry/exit levels. Missing indicators = reduced accuracy.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Strategy Selection: Match Your Trading Style
              </CardTitle>
              <CardDescription>Optimize AI analysis for your specific approach</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Selecting the right strategy helps the AI calibrate its analysis to your trading timeframe and risk tolerance:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-card border border-border rounded-lg">
                  <h4 className="font-semibold mb-1">Scalping (1-5m charts)</h4>
                  <p className="text-sm text-muted-foreground">AI focuses on tight ranges and quick momentum shifts</p>
                </div>
                <div className="p-3 bg-card border border-border rounded-lg">
                  <h4 className="font-semibold mb-1">Day Trading</h4>
                  <p className="text-sm text-muted-foreground">Intraday patterns and key level breakouts</p>
                </div>
                <div className="p-3 bg-card border border-border rounded-lg">
                  <h4 className="font-semibold mb-1">Swing Trading</h4>
                  <p className="text-sm text-muted-foreground">Multi-day setups with stronger trend confirmation</p>
                </div>
                <div className="p-3 bg-card border border-border rounded-lg">
                  <h4 className="font-semibold mb-1">Position Trading</h4>
                  <p className="text-sm text-muted-foreground">Long-term trend analysis with major support/resistance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6 border-success/50 bg-success/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                <Award className="w-5 h-5" />
                Maximize Your Edge: Upgrade Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-semibold">
                Every successful trader knows: consistency and volume matter. Here's what you unlock with higher tiers:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>More Generations = More Opportunities:</strong> Analyze every potential setup without worrying about limits. 
                  The more charts you analyze, the more profitable setups you'll find.
                </li>
                <li>
                  <strong>Multi-Position Analysis:</strong> Compare multiple trade ideas simultaneously. Is BTC looking better than ETH? 
                  Run both through the AI and compare the confidence scores.
                </li>
                <li>
                  <strong>Backtest Your Strategy:</strong> Use your monthly generations to analyze historical charts and validate your 
                  trading approach. Higher tiers mean more backtesting power.
                </li>
                <li>
                  <strong>Risk Management:</strong> Never miss an exit signal. Use your generations to regularly re-analyze open positions 
                  and adjust stops/targets based on new market data.
                </li>
                <li>
                  <strong>Market Scanning:</strong> Professional traders scan multiple assets daily. With 244 generations (Ultimate tier), 
                  you can analyze 8+ charts every single day and never miss a high-probability setup.
                </li>
              </ul>
              <div className="mt-6 p-5 bg-gradient-primary rounded-lg text-center">
                <p className="text-primary-foreground font-bold text-lg mb-3">
                  One winning trade pays for months of subscription
                </p>
                <Link to="/pricing">
                  <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                    View Pricing Plans
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Advanced Tips for Power Users
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-3 ml-4">
                <li>
                  <strong>Clean Charts Work Best:</strong> Hide unnecessary drawing tools and annotations before taking screenshots. 
                  The AI focuses better on pure price action and indicators.
                </li>
                <li>
                  <strong>Consistent Timeframes:</strong> If you're day trading, include daily/4H/1H consistently across all your analyses. 
                  This helps you develop pattern recognition alongside the AI.
                </li>
                <li>
                  <strong>Save Your Best Setups:</strong> When the AI identifies a high-confidence trade, take note of the pattern, 
                  indicators, and timeframe combination. You're building your edge.
                </li>
                <li>
                  <strong>Reanalyze Before Entry:</strong> Market conditions change. Before entering a position, upload fresh screenshots 
                  to confirm the setup is still valid.
                </li>
                <li>
                  <strong>Compare Brokers' Charts:</strong> Different platforms may show slightly different data. If you have multiple 
                  platforms, upload screenshots from each for the most comprehensive analysis.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Remember: AI Analysis is a Tool, Not a Crystal Ball
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                While our AI achieves 92% pattern accuracy, always use it as <strong>one confluence factor</strong> in your trading decisions. 
                Combine AI insights with your own analysis, risk management, and market knowledge. The most successful traders use multiple 
                tools - and MightyChart.io is designed to be your most powerful technical analysis tool.
              </p>
              <div className="mt-4 text-center">
                <Link to="/disclaimer">
                  <Button variant="outline" size="sm">
                    Read Full Disclaimer
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TipsTricks;
