import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useHaptic } from '@/hooks/useHaptic';
import { ArrowRight, TrendingUp, Target, Zap, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { lightTap } = useHaptic();
  const [displayName, setDisplayName] = useState<string>('trader');

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

  return (
    <div className="min-h-screen bg-background">
      <div className="purple-overlay" />
      <div className="content-wrapper">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12 max-w-6xl">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Welcome back, <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{displayName}</span>
            </h1>
            <p className="text-muted-foreground text-lg">Your trading command center</p>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Main Action Card */}
            <Card className="md:col-span-2 lg:col-span-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Zap className="w-6 h-6 text-primary" />
                  Quick Analysis
                </CardTitle>
                <CardDescription>Upload a chart and get instant confluence analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300 group" 
                  onClick={() => {
                    lightTap();
                    navigate('/analyze');
                  }}
                >
                  Analyze Chart Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="border-accent/20 hover:border-accent/40 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-accent" />
                  Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Analyses</p>
                  <p className="text-3xl font-bold text-accent">-</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                  <p className="text-3xl font-bold text-success">-</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:border-primary/40 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5 text-primary" />
                  Precision Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  12+ technical factors analyzed in under 60 seconds
                </p>
              </CardContent>
            </Card>

            <Card className="hover:border-accent/40 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  Pattern Recognition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  AI-powered detection of chart patterns and setups
                </p>
              </CardContent>
            </Card>

            <Card className="hover:border-success/40 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="w-5 h-5 text-success" />
                  Risk Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Automated stop-loss and take-profit suggestions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
