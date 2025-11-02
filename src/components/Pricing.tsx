import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Zap, Loader2 } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const tiers = [
  {
    name: "Starter",
    price: 44,
    generations: 11,
    priceId: "price_1SP9GjLs7KD65wZP1vT5W67z",
    description: "Perfect for getting started",
    featured: false,
  },
  {
    name: "Pro",
    price: 77,
    generations: 33,
    priceId: "price_1SP9GwLs7KD65wZPiuSlXtBV",
    description: "Most popular choice",
    featured: true,
  },
  {
    name: "Premium",
    price: 144,
    generations: 77,
    priceId: "price_1SP9HILs7KD65wZPRUZaiGj8",
    description: "For serious traders",
    featured: false,
  },
  {
    name: "Elite",
    price: 255,
    generations: 133,
    priceId: "price_1SP9HdLs7KD65wZPt1FdSy9Q",
    description: "Ultimate trading power",
    featured: false,
  },
];

export const Pricing = () => {
  const { user } = useAuth();
  const { createCheckout, subscriptionStatus } = useSubscription();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string, tierName: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      setLoading(priceId);
      const url = await createCheckout(priceId);
      window.open(url, "_blank");
      toast.success(`Redirecting to checkout for ${tierName}...`);
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Failed to start checkout");
    } finally {
      setLoading(null);
    }
  };

  return (
    <section className="py-24 px-4 md:px-6 bg-gradient-hero">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-muted-foreground">
            Premium AI chart analysis at $1 per generation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-12">
          {tiers.map((tier) => {
            const isCurrentTier = subscriptionStatus.subscribed && 
              tier.priceId === subscriptionStatus.product_id;
            
            return (
              <Card 
                key={tier.name} 
                className={`bg-card/80 backdrop-blur-sm relative transition-all hover:shadow-lg ${
                  tier.featured ? 'border-primary/50 shadow-glow' : 'border-border'
                } ${isCurrentTier ? 'ring-2 ring-primary' : ''}`}
              >
                {tier.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-primary px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}
                {isCurrentTier && (
                  <div className="absolute -top-4 right-4">
                    <div className="bg-success px-3 py-1 rounded-full text-xs font-semibold">
                      Your Plan
                    </div>
                  </div>
                )}
                <CardHeader className="text-center pt-8">
                  <CardTitle className="text-2xl font-bold mb-2">{tier.name}</CardTitle>
                  <CardDescription className="text-sm mb-4">
                    {tier.description}
                  </CardDescription>
                  <div className="space-y-1">
                    <div className="text-4xl font-bold">
                      ${tier.price}
                      <span className="text-lg text-muted-foreground font-normal">/mo</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {tier.generations} generations/month
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ${(tier.price / tier.generations).toFixed(2)}/generation
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full"
                    onClick={() => handleSubscribe(tier.priceId, tier.name)}
                    disabled={loading === tier.priceId || isCurrentTier}
                    variant={tier.featured ? "default" : "outline"}
                  >
                    {loading === tier.priceId ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : isCurrentTier ? (
                      "Current Plan"
                    ) : (
                      "Subscribe"
                    )}
                  </Button>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success" />
                      <span>AI chart analysis</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success" />
                      <span>Trade management</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success" />
                      <span>Pattern detection</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success" />
                      <span>Risk analysis</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="max-w-md mx-auto">
          <Card className="bg-card/80 backdrop-blur-sm border-border">
            <CardHeader className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Pay As You Go</CardTitle>
              <CardDescription>
                Single generation for $8 each
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold mb-4">
                $8
                <span className="text-lg text-muted-foreground font-normal">/generation</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Perfect for trying out the service or occasional use
              </p>
              <Button 
                className="w-full"
                variant="outline"
                onClick={() => {
                  if (!user) {
                    navigate("/auth");
                    return;
                  }
                  toast.info("Single generation checkout coming soon!");
                }}
              >
                Buy Single Generation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
