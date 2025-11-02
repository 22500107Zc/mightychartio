import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Trash2, CheckCircle, XCircle, CreditCard, Loader2 } from 'lucide-react';

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
  const { subscriptionStatus, currentTier, openCustomerPortal } = useSubscription();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loadingTrades, setLoadingTrades] = useState(true);
  const [managingSubscription, setManagingSubscription] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchTrades();
    }
  }, [user]);

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
      const { error } = await supabase
        .from('trades')
        .update({ won })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Trade updated",
        description: `Trade marked as ${won ? 'Win' : 'Loss'}.`
      });
      
      fetchTrades();
    } catch (error: any) {
      toast({
        title: "Error updating trade",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleManageSubscription = async () => {
    try {
      setManagingSubscription(true);
      const url = await openCustomerPortal();
      window.open(url, '_blank');
      toast({
        title: "Opening subscription management",
        description: "Redirecting you to manage your subscription..."
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setManagingSubscription(false);
    }
  };

  const totalPnL = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  const winningTrades = trades.filter(t => t.won).length;
  const losingTrades = trades.filter(t => t.won === false).length;
  const winRate = trades.length > 0 ? (winningTrades / trades.length * 100).toFixed(1) : '0';

  if (loading || loadingTrades) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Track your trading performance</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Subscription Status
                </CardTitle>
                <CardDescription>Manage your AI analysis subscription</CardDescription>
              </div>
              {subscriptionStatus.subscribed && (
                <Button 
                  variant="outline" 
                  onClick={handleManageSubscription}
                  disabled={managingSubscription}
                >
                  {managingSubscription ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Manage Subscription'
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {subscriptionStatus.subscribed ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-card border">
                    <div className="text-sm text-muted-foreground mb-1">Current Plan</div>
                    <div className="text-2xl font-bold">{currentTier?.name || 'Subscribed'}</div>
                    <div className="text-sm text-muted-foreground">${currentTier?.price}/month</div>
                  </div>
                  <div className="p-4 rounded-lg bg-card border">
                    <div className="text-sm text-muted-foreground mb-1">Generations Used</div>
                    <div className="text-2xl font-bold">
                      {subscriptionStatus.generations_used}/{subscriptionStatus.generations_limit}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {subscriptionStatus.generations_remaining} remaining
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-card border">
                    <div className="text-sm text-muted-foreground mb-1">Next Billing</div>
                    <div className="text-lg font-bold">
                      {subscriptionStatus.subscription_end 
                        ? new Date(subscriptionStatus.subscription_end).toLocaleDateString()
                        : 'N/A'
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">Resets monthly</div>
                  </div>
                </div>
                {subscriptionStatus.generations_remaining <= 3 && (
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/50">
                    <p className="text-sm text-destructive font-semibold">
                      ⚠️ You're running low on generations. Consider upgrading to continue analyzing charts.
                    </p>
                    <Button 
                      size="sm" 
                      className="mt-2 bg-gradient-primary"
                      onClick={() => navigate('/pricing')}
                    >
                      View Plans
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No active subscription. Subscribe to start analyzing charts with AI.
                </p>
                <Button 
                  className="bg-gradient-primary"
                  onClick={() => navigate('/pricing')}
                >
                  View Subscription Plans
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Trade Journal</CardTitle>
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
                        <TableCell className={trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}>
                          ${trade.pnl?.toFixed(2) || '0.00'}
                        </TableCell>
                        <TableCell>
                          {trade.won === null ? (
                            <Badge variant="outline">Pending</Badge>
                          ) : trade.won ? (
                            <Badge className="bg-green-600">Win</Badge>
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
                                  <CheckCircle className="h-4 w-4 text-green-600" />
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${totalPnL.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{winRate}%</div>
              <p className="text-xs text-muted-foreground">{winningTrades}W / {losingTrades}L</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Winning Trades</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{winningTrades}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Losing Trades</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{losingTrades}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Manage Trades</CardTitle>
            <CardDescription>Mark your pending trades as wins or losses</CardDescription>
          </CardHeader>
          <CardContent className="py-4">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">View and update your pending trade outcomes</p>
              <Button variant="secondary" size="lg" onClick={() => navigate('/trade-management')}>
                Manage Trades
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
