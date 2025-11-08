import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustSignals } from "@/components/TrustSignals";
import { Features } from "@/components/Features";
import { ExampleAnalysis } from "@/components/ExampleAnalysis";
import { Comparison } from "@/components/Comparison";
import { MarketData } from "@/components/MarketData";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState<string>('trader');

  useEffect(() => {
    if (user) {
      fetchDisplayName();
    }
  }, [user]);

  const fetchDisplayName = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching display name:', error);
        setDisplayName('trader');
        return;
      }

      const name = data?.display_name?.trim();
      setDisplayName(name && name.length > 0 ? name : 'trader');
    } catch (error) {
      console.error('Error fetching display name:', error);
      setDisplayName('trader');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="purple-overlay" />
      <div className="content-wrapper">
        <Navbar />
        {user && (
          <div className="container mx-auto px-4 pt-20">
            <div className="text-center py-8">
              <h2 className="text-3xl font-bold">
                Welcome back, <span className="text-primary">{displayName}</span>
              </h2>
            </div>
          </div>
        )}
        <Hero />
        <TrustSignals />
        <div id="features">
          <Features />
        </div>
        <ExampleAnalysis />
        <Comparison />
        <MarketData />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
