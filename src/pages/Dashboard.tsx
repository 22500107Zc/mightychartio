import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Trash2, CheckCircle, XCircle } from 'lucide-react';

interface Trade {
  id: string;
  entry_price: number;
  stop_loss: number;
  take_profit: number;
  pnl: number;
  won: boolean;
  timeframe: string;
  strategy: string;
  created_at: string;
  recommendation: string;
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loadingTrades, setLoadingTrades] = useState(true);
  
  const [displayName, setDisplayName] = useState<string>('trader');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchTrades();
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

      // Set display name or default to 'trader' if empty/null
      const name = data?.display_name?.trim();
      setDisplayName(name && name.length > 0 ? name : 'trader');
    } catch (error) {
      console.error('Error fetching display name:', error);
      setDisplayName('trader');
    }
  };

  const fetchTrades = async () => {
    try {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrades(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading trades",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoadingTrades(false);
    }
  };

  const deleteTrade = async (id: string) => {
    try {
      const { error } = await supabase
        .from('trades')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Trade deleted",
        description: "Trade has been removed from your journal."
      });
      
      fetchTrades();
    } catch (error: any) {
      toast({
        title: "Error deleting trade",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const markTradeResult = async (id: string, won: boolean) => {
    try {
      console.log('Marking trade:', id, 'as', won ? 'Win' : 'Loss');
      
      const { data, error } = await supabase
        .from('trades')
        .update({ won })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error updating trade:', error);
        throw error;
      }

      console.log('Trade updated successfully:', data);

      toast({
        title: "Trade updated",
        description: `Trade marked as ${won ? 'Win' : 'Loss'}.`
      });
      
      await fetchTrades();
    } catch (error: any) {
      console.error('Full error:', error);
      toast({
        title: "Error updating trade",
        description: error.message,
        variant: "destructive"
      });
    }
  };


  const totalPnL = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  const winningTrades = trades.filter(t => t.won).length;
  const losingTrades = trades.filter(t => t.won === false).length;
  const winRate = trades.length > 0 ? (winningTrades / trades.length * 100).toFixed(1) : '0';

  if (loading || loadingTrades) {
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
        <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, <span className="text-primary">{displayName}</span>
          </h1>
          <p className="text-muted-foreground">Track your trading performance</p>
        </div>


        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Analyze Charts</CardTitle>
            <CardDescription>All your analyzed trades</CardDescription>
          </CardHeader>
          <CardContent>
            {trades.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No trades yet. Start by analyzing a chart!</p>
                <Button variant="secondary" onClick={() => navigate('/analyze')}>Analyze Chart</Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Strategy</TableHead>
                      <TableHead>Entry</TableHead>
                      <TableHead>SL</TableHead>
                      <TableHead>TP</TableHead>
                      <TableHead>P&L</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trades.map((trade) => (
                      <TableRow key={trade.id}>
                        <TableCell>{new Date(trade.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>{trade.strategy || 'N/A'}</TableCell>
                        <TableCell>${trade.entry_price?.toFixed(2) || 'N/A'}</TableCell>
                        <TableCell>${trade.stop_loss?.toFixed(2) || 'N/A'}</TableCell>
                        <TableCell>${trade.take_profit?.toFixed(2) || 'N/A'}</TableCell>
                        <TableCell className={trade.pnl >= 0 ? 'text-accent' : 'text-red-600'}>
                          ${trade.pnl?.toFixed(2) || '0.00'}
                        </TableCell>
                        <TableCell>
                          {trade.won === null ? (
                            <Badge variant="outline">Pending</Badge>
                          ) : trade.won ? (
                            <Badge className="bg-accent text-accent-foreground">Win</Badge>
                          ) : (
                            <Badge className="bg-red-600">Loss</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {trade.won === null && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markTradeResult(trade.id, true)}
                                  title="Mark as Win"
                                >
                                  <CheckCircle className="h-4 w-4 text-accent" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markTradeResult(trade.id, false)}
                                  title="Mark as Loss"
                                >
                                  <XCircle className="h-4 w-4 text-red-600" />
                                </Button>
                              </>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteTrade(trade.id)}
                              title="Delete trade"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trading Insight</CardTitle>
            <CardDescription>Professional trading wisdom</CardDescription>
          </CardHeader>
          <CardContent className="py-8">
            <blockquote className="text-center space-y-4">
              <p className="text-lg md:text-xl italic text-muted-foreground">
                "The market is a device for transferring money from the impatient to the patient."
              </p>
              <footer className="text-sm text-muted-foreground">— Warren Buffett</footer>
            </blockquote>
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Remember: AI analysis is a tool for confluence, not a guarantee of success.
              </p>
              <Button variant="outline" onClick={() => navigate('/disclaimer')}>
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
