import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { useEffect, useState } from "react";

const marketPairs = [
  { pair: "BTC/USD", price: "64,250", change: "+2.4%", trend: "up" },
  { pair: "ETH/USD", price: "3,180", change: "+1.8%", trend: "up" },
  { pair: "EUR/USD", price: "1.0842", change: "-0.3%", trend: "down" },
  { pair: "GBP/USD", price: "1.2634", change: "+0.5%", trend: "up" },
  { pair: "XAU/USD", price: "2,345", change: "+1.2%", trend: "up" },
  { pair: "S&P 500", price: "5,234", change: "-0.4%", trend: "down" },
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
            Live Market{" "}
            <span className="text-primary">Overview</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Track key market movements in real-time
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
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
                    <div className="text-2xl font-bold text-foreground mt-1">${item.price}</div>
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
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Data updates every 3 seconds</span>
          </div>
        </div>
      </div>
    </section>
  );
};
