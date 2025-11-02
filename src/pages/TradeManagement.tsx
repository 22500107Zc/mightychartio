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
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

interface Trade {
  id: string;
  entry_price: number;
  stop_loss: number;
  take_profit: number;
  pnl: number;
  won: boolean | null;
  timeframe: string;
  strategy: string;
  created_at: string;
  recommendation: string;
}

const TradeManagement = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loadingTrades, setLoadingTrades] = useState(true);

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

  const pendingTrades = trades.filter(t => t.won === null);

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
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Trade Management</h1>
          <p className="text-muted-foreground">Mark your trades as wins or losses</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Trades</CardTitle>
            <CardDescription>
              {pendingTrades.length} trade{pendingTrades.length !== 1 ? 's' : ''} waiting for result
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingTrades.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No pending trades. All trades have been marked!</p>
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
                      <TableHead>Expected P&L</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingTrades.map((trade) => (
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
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => markTradeResult(trade.id, true)}
                              className="text-green-600 hover:bg-green-600 hover:text-white"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Win
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => markTradeResult(trade.id, false)}
                              className="text-red-600 hover:bg-red-600 hover:text-white"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Loss
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
      </div>
    </div>
  );
};

export default TradeManagement;
