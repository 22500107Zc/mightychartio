import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useHaptic } from '@/hooks/useHaptic';

const tradingQuotes = [
  {
    quote: "The market is a device for transferring money from the impatient to the patient.",
    author: "Warren Buffett"
  },
  {
    quote: "Risk comes from not knowing what you're doing.",
    author: "Warren Buffett"
  },
  {
    quote: "The trend is your friend until the end when it bends.",
    author: "Ed Seykota"
  },
  {
    quote: "It's not whether you're right or wrong that's important, but how much money you make when you're right and how much you lose when you're wrong.",
    author: "George Soros"
  },
  {
    quote: "The four most dangerous words in investing are: 'This time it's different.'",
    author: "Sir John Templeton"
  },
  {
    quote: "The goal of a successful trader is to make the best trades. Money is secondary.",
    author: "Alexander Elder"
  }
];

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { lightTap } = useHaptic();
  const [displayName, setDisplayName] = useState<string>('trader');
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchDisplayName();
    }
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % tradingQuotes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="purple-overlay" />
        <div className="content-wrapper">
          <Navbar />
          <div className="container mx-auto px-4 pt-24">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentQuote = tradingQuotes[currentQuoteIndex];

  return (
    <div className="min-h-screen bg-background">
      <div className="purple-overlay" />
      <div className="content-wrapper">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, <span className="text-primary">{displayName}</span>
            </h1>
            <p className="text-muted-foreground">Ready to analyze your next opportunity</p>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="text-center py-6">
                <Button 
                  size="lg" 
                  className="bg-primary hover:shadow-glow transition-all duration-300" 
                  onClick={() => {
                    lightTap();
                    navigate('/analyze');
                  }}
                >
                  Analyze Chart
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Trading Insight</CardTitle>
              <CardDescription>Professional trading wisdom</CardDescription>
            </CardHeader>
            <CardContent className="py-6">
              <blockquote className="text-center space-y-3">
                <p className="text-base md:text-lg italic text-muted-foreground transition-all duration-500">
                  "{currentQuote.quote}"
                </p>
                <footer className="text-sm text-muted-foreground">— {currentQuote.author}</footer>
              </blockquote>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Remember: AI analysis is a tool for confluence, not a guarantee of success.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    lightTap();
                    navigate('/disclaimer');
                  }}
                >
                  Read Full Disclaimer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
