import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useHaptic } from '@/hooks/useHaptic';
import { ArrowRight } from 'lucide-react';

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
        <div className="container mx-auto px-4 pt-32 pb-12">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                Hello, <span className="text-primary">{displayName}</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Ready to analyze your next opportunity
              </p>
            </div>

            <div className="pt-4">
              <Button 
                size="lg" 
                className="bg-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-6 group" 
                onClick={() => {
                  lightTap();
                  navigate('/analyze');
                }}
              >
                Analyze Chart
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="pt-12 text-sm text-muted-foreground max-w-md mx-auto">
              AI-powered technical analysis for informed trading decisions
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
