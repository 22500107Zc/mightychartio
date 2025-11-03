import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Shield, TrendingUp, BookOpen } from "lucide-react";

const Disclaimer = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Risk Disclaimer & Terms of Use</h1>
            <p className="text-lg text-muted-foreground">
              Important information about using MightyChart.io for trading analysis
            </p>
          </div>

          <Card className="mb-6 border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                Important Notice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground font-semibold">
                Trading financial instruments involves substantial risk of loss and is not suitable for all investors. 
                The high degree of leverage can work against you as well as for you.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                No Financial Advice
              </CardTitle>
              <CardDescription>Understanding the nature of our service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                MightyChart.io provides AI-powered technical analysis tools for educational and informational purposes only. 
                <strong> We are not financial advisors, brokers, or investment professionals.</strong>
              </p>
              <p>
                Our AI analysis should <strong>never be used as the sole basis</strong> for making trading decisions. 
                The information provided by our platform:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Does not constitute financial, investment, trading, or other advice</li>
                <li>Is not a recommendation to buy, sell, or hold any security or financial instrument</li>
                <li>Should not be relied upon without independent verification</li>
                <li>May contain errors, inaccuracies, or be incomplete</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Market Volatility & Risk Factors
              </CardTitle>
              <CardDescription>Understanding market dynamics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Financial markets are inherently unpredictable and can move significantly differently than any analysis 
                or projection suggests. Key risk factors include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Market Volatility:</strong> Prices can change rapidly and unpredictably</li>
                <li><strong>Leverage Risk:</strong> Using leverage amplifies both gains and losses</li>
                <li><strong>Liquidity Risk:</strong> You may not be able to exit positions at desired prices</li>
                <li><strong>Gap Risk:</strong> Markets can open significantly different from closing prices</li>
                <li><strong>Systemic Risk:</strong> Broader economic events can impact all positions</li>
                <li><strong>AI Limitations:</strong> AI analysis is based on historical data and patterns that may not repeat</li>
              </ul>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm font-semibold">
                  ⚠️ Past performance does not guarantee future results. Historical data and patterns may not continue or repeat.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Proper Use of Our Platform
              </CardTitle>
              <CardDescription>How to use MightyChart.io responsibly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                MightyChart.io is designed to be used as a <strong>confluence tool</strong> in your trading analysis. 
                This means:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use our analysis to <strong>supplement</strong> your own research and due diligence</li>
                <li>Combine AI insights with multiple sources of information and analysis</li>
                <li>Never risk more than you can afford to lose</li>
                <li>Consider consulting with qualified financial professionals</li>
                <li>Develop and follow your own risk management strategy</li>
                <li>Understand that AI predictions can be incorrect</li>
              </ul>
              <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="text-sm">
                  <strong>Best Practice:</strong> Always use multiple forms of analysis (fundamental, technical, sentiment) 
                  and never rely on a single tool or indicator when making trading decisions.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                By using MightyChart.io, you acknowledge and agree that:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You are solely responsible for your trading decisions and outcomes</li>
                <li>MightyChart.io and its operators are not liable for any trading losses</li>
                <li>We make no guarantees about the accuracy, completeness, or reliability of our analysis</li>
                <li>Technical issues, errors, or service interruptions may occur</li>
                <li>You use our service entirely at your own risk</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>As a user of MightyChart.io, you are responsible for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Understanding the risks associated with trading</li>
                <li>Conducting your own research and due diligence</li>
                <li>Making independent investment decisions</li>
                <li>Complying with all applicable laws and regulations</li>
                <li>Seeking professional advice when appropriate</li>
                <li>Managing your own risk and capital</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle>No Guarantee of Profits</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">
                There is no guarantee that you will make money using our platform. Many traders lose money. 
                The decision to trade and the method of trading are solely your responsibility. 
                MightyChart.io cannot and does not guarantee profits or freedom from loss.
              </p>
            </CardContent>
          </Card>

          <div className="mt-8 p-6 bg-muted rounded-lg text-sm text-muted-foreground">
            <p className="font-semibold mb-2">Last Updated: {new Date().toLocaleDateString()}</p>
            <p>
              By using MightyChart.io, you acknowledge that you have read, understood, and agree to this disclaimer. 
              If you do not agree with any part of this disclaimer, you should not use our service.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Disclaimer;
