import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { useEffect, useState } from "react";

// Note: These are placeholder values for demonstration
// In production, integrate with a real-time market data API
const marketPairs = [
  { pair: "BTC/USD", price: "96,847", change: "+1.3%", trend: "up" },
  { pair: "S&P 500", price: "5,918", change: "+0.8%", trend: "up" },
  { pair: "NASDAQ", price: "19,364", change: "+1.2%", trend: "up" },
];

export const MarketData = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % marketPairs.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 px-4 md:px-6 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Key Market{" "}
            <span className="text-primary">Indicators</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Track confluence-relevant market movements
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {marketPairs.map((item, index) => (
            <Card 
              key={item.pair} 
              className={`bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all cursor-pointer ${
                index === activeIndex ? 'ring-2 ring-primary scale-105' : ''
              }`}
              onClick={() => {
                if ('vibrate' in navigator) {
                  navigator.vibrate(10);
                }
                setActiveIndex(index);
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-bold text-lg text-foreground">{item.pair}</div>
                    <div className="text-2xl font-bold text-foreground mt-1">{item.price}</div>
                  </div>
                  <div className={`p-2 rounded-full ${item.trend === 'up' ? 'bg-accent/20' : 'bg-destructive/20'}`}>
                    {item.trend === 'up' ? (
                      <TrendingUp className="w-5 h-5 text-accent" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`font-semibold ${item.trend === 'up' ? 'text-accent' : 'text-destructive'}`}>
                    {item.change}
                  </span>
                  <Activity className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Reference values for confluence analysis</span>
          </div>
        </div>
      </div>
    </section>
  );
};
