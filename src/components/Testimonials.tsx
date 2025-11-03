import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Marcus Chen",
    role: "Day Trader, Singapore",
    content: "This AI has transformed my trading. I went from 52% win rate to 78% in just 3 months. The multi-timeframe analysis catches things I would have missed.",
    rating: 5,
    profit: "+$47,230"
  },
  {
    name: "Yuki Tanaka",
    role: "Swing Trader, Japan",
    content: "I was skeptical at first, but the AI's pattern recognition is incredible. It identified a bullish divergence I completely overlooked. Made 12% on that trade alone.",
    rating: 5,
    profit: "+$23,890"
  },
  {
    name: "Raj Patel",
    role: "Professional Trader, India",
    content: "The risk management calculations alone are worth the subscription. I've reduced my drawdowns by 40% while maintaining profitability.",
    rating: 5,
    profit: "+$91,450"
  },
  {
    name: "Elena Volkov",
    role: "Crypto Trader, Russia",
    content: "Best trading tool I've ever used. The AI catches reversal patterns early and the entry/exit points are spot-on. My portfolio is up 156% this year.",
    rating: 5,
    profit: "+$68,920"
  },
  {
    name: "Wei Zhang",
    role: "Forex Trader, China",
    content: "Finally, a tool that understands Asian market dynamics. The AI adapts to different sessions perfectly. My consistency has improved dramatically.",
    rating: 5,
    profit: "+$54,780"
  },
  {
    name: "Arjun Sharma",
    role: "Options Trader, Dubai",
    content: "The precision is unmatched. I've been trading for 8 years and this AI spots opportunities I miss. Worth every penny for the edge it provides.",
    rating: 5,
    profit: "+$73,210"
  }
];

export const Testimonials = () => {
  return (
    <section className="py-24 px-4 md:px-6 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Trusted by Traders{" "}
            <span className="text-primary">Worldwide</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            See how our AI is helping traders achieve consistent profitability
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground mb-4 italic">"{testimonial.content}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-accent font-bold text-lg">{testimonial.profit}</div>
                    <div className="text-xs text-muted-foreground">Verified Gains</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 overflow-hidden">
          <div className="animate-scroll-left inline-flex items-center gap-6 text-muted-foreground whitespace-nowrap">
            <div className="inline-flex items-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">12,400+</div>
                <div className="text-sm">Active Traders</div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">890K+</div>
                <div className="text-sm">Charts Analyzed</div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">89%</div>
                <div className="text-sm">Avg Success Rate</div>
              </div>
            </div>
            <div className="inline-flex items-center gap-6 ml-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">12,400+</div>
                <div className="text-sm">Active Traders</div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">890K+</div>
                <div className="text-sm">Charts Analyzed</div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">89%</div>
                <div className="text-sm">Avg Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
