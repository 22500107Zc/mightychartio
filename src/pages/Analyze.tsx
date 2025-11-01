import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Loader2, TrendingUp, ArrowUp, ArrowDown, Check, AlertTriangle, BarChart3, Heart, Clock, Zap, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const tradingStrategies = [
  { value: "scalping", label: "Scalping", description: "Quick trades on 1-5m charts" },
  { value: "day", label: "Day Trading", description: "Intraday positions" },
  { value: "swing", label: "Swing Trading", description: "Multi-day holds" },
  { value: "position", label: "Position Trading", description: "Long-term setups" },
  { value: "momentum", label: "Momentum Trading", description: "Breakout confirmation" },
  { value: "counter", label: "Counter-Trend", description: "Reversal patterns" },
];

export default function Analyze() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [strategy, setStrategy] = useState("scalping");

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setAnalyzing(true);
    setResult(null);

    try {
      // Convert image to base64
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      // Call edge function
      const { data, error } = await supabase.functions.invoke("analyze-chart", {
        body: { image: base64, strategy },
      });

      if (error) throw error;

      setResult(data);
      toast.success("Chart analyzed successfully!");
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast.error(error.message || "Failed to analyze chart");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      
      <div className="container mx-auto px-4 md:px-6 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              AI Chart{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Analysis
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Upload your trading chart and get instant AI-powered insights
            </p>
          </div>

          <Card className="bg-card/50 backdrop-blur-sm border-border mb-8">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Trading Strategy</h2>
                  <p className="text-sm text-muted-foreground">Select your preferred trading approach for optimized analysis</p>
                </div>
              </div>
              
              <RadioGroup value={strategy} onValueChange={setStrategy} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tradingStrategies.map((strat) => (
                  <div key={strat.value} className="relative">
                    <RadioGroupItem
                      value={strat.value}
                      id={strat.value}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={strat.value}
                      className="flex items-start gap-3 p-4 rounded-lg border-2 border-border cursor-pointer transition-all hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                    >
                      <div className="w-5 h-5 rounded-full border-2 border-border peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-semibold">{strat.label}</div>
                        <div className="text-sm text-muted-foreground">{strat.description}</div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="p-8">
              {!imagePreview ? (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG or JPEG (MAX. 10MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={analyzing}
                  />
                </label>
              ) : (
                <div className="space-y-6">
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Uploaded chart"
                      className="w-full rounded-lg"
                    />
                    {analyzing && (
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
                        <div className="text-center">
                          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                          <p className="text-sm text-muted-foreground">
                            Analyzing chart patterns...
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {result && (
                    <div className="space-y-6">
                      {/* Header with Pattern and Clear Button */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                            <Check className="w-5 h-5 text-success" />
                          </div>
                          <h2 className="text-2xl font-bold">Chart Analysis Results</h2>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setImagePreview(null);
                            setResult(null);
                          }}
                          className="gap-2"
                        >
                          <X className="w-4 h-4" />
                          Clear
                        </Button>
                      </div>

                      {/* Pattern Detected */}
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Pattern Detected</h3>
                        <Card className="bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30">
                          <CardContent className="p-6">
                            <h4 className="text-2xl font-bold text-center">{result.pattern}</h4>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Trading Recommendation */}
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Trading Recommendation</h3>
                        <Card className={`border-2 ${
                          result.recommendation === "BUY" 
                            ? "bg-gradient-to-br from-success/20 to-success/5 border-success" 
                            : result.recommendation === "SELL"
                            ? "bg-gradient-to-br from-destructive/20 to-destructive/5 border-destructive"
                            : "bg-gradient-to-br from-amber-500/20 to-amber-500/5 border-amber-500"
                        }`}>
                          <CardContent className="p-8">
                            <div className={`text-5xl font-black text-center mb-4 ${
                              result.recommendation === "BUY" 
                                ? "text-success" 
                                : result.recommendation === "SELL"
                                ? "text-destructive"
                                : "text-amber-500"
                            }`}>
                              {result.recommendation}
                            </div>
                            <p className="text-center text-lg">{result.reasoningShort}</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Not Optimal Warning */}
                      {!result.optimalEntry && (
                        <Card className="bg-gradient-to-br from-destructive/20 to-destructive/5 border-destructive/50 border-2">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
                                <X className="w-6 h-6 text-destructive" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                                  <h4 className="text-xl font-bold text-destructive">NOT OPTIMAL - WAIT FOR BETTER SETUP</h4>
                                </div>
                                <p className="mb-4">{result.waitCondition}</p>
                                {result.riskFactors?.length > 0 && (
                                  <div className="bg-card/50 rounded-lg p-4 border border-destructive/30">
                                    <div className="flex items-center gap-2 mb-2">
                                      <AlertTriangle className="w-4 h-4 text-destructive" />
                                      <span className="font-semibold text-destructive">Risk Factors:</span>
                                    </div>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                      {result.riskFactors.map((risk: string, i: number) => (
                                        <li key={i}>{risk}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Wait Condition (if optimal) */}
                      {result.optimalEntry && result.waitCondition && (
                        <Card className="bg-gradient-to-br from-amber-500/20 to-amber-500/5 border-amber-500/50">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-3">
                              <Clock className="w-5 h-5 text-amber-500 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-lg mb-2">Wait for this</h4>
                                <p>{result.waitCondition}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Trading Setup - ALWAYS SHOWN */}
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Trading Setup</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/50">
                            <CardContent className="p-4">
                              <div className="text-sm text-purple-300 mb-1">Recommended Leverage</div>
                              <div className="text-2xl font-bold">{result.leverage || "1x"}</div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/50">
                            <CardContent className="p-4">
                              <div className="text-sm text-orange-300 mb-1">Risk Per Trade</div>
                              <div className="text-2xl font-bold">{result.riskPercent || "1%"}</div>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="space-y-4">
                          <Card className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/50">
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-sm text-blue-300 mb-1">Entry Point</div>
                                  <div className="text-3xl font-bold">{result.entry}</div>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                  <ArrowUp className="w-5 h-5 text-blue-400" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="bg-gradient-to-r from-red-500/20 to-red-700/20 border-destructive/50">
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-sm text-red-300 mb-1">Stop Loss</div>
                                  <div className="text-3xl font-bold">{result.stopLoss}</div>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                                  <ArrowDown className="w-5 h-5 text-destructive" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-success/50">
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-sm text-green-300 mb-1">Take Profit 1 (Conservative)</div>
                                  <div className="text-3xl font-bold mb-1">{result.target}</div>
                                  <div className="text-success font-semibold">{result.targetGain} gain</div>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                                  <TrendingUp className="w-5 h-5 text-success" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Probability */}
                      <Card className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500/50">
                        <CardContent className="p-6">
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground mb-2">Trade Probability</div>
                            <div className="text-5xl font-black text-indigo-400">{result.probability || "0%"}</div>
                            <div className="text-xs text-muted-foreground mt-2">Based on pattern history, volume, structure & risk:reward</div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Technical Sentiment */}
                      <Card className="bg-card/80 border-primary/30">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-3 mb-4">
                            <Heart className="w-5 h-5 text-primary mt-1" />
                            <h3 className="text-xl font-semibold text-primary">Technical Sentiment Overview</h3>
                          </div>
                          <p className="leading-relaxed">{result.technicalSentiment}</p>
                        </CardContent>
                      </Card>

                      {/* Future Implications */}
                      {result.futureImplications && (
                        <Card className="bg-card/80 border-accent/30">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-3 mb-4">
                              <TrendingUp className="w-5 h-5 text-accent mt-1" />
                              <h3 className="text-xl font-semibold text-accent">Future Price Movement Implications</h3>
                            </div>
                            <p className="leading-relaxed">{result.futureImplications}</p>
                          </CardContent>
                        </Card>
                      )}

                      {/* Chart Sentiment Analysis */}
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-primary" />
                          </div>
                          <h3 className="text-xl font-semibold">Chart Sentiment Analysis</h3>
                        </div>

                        {result.marketStructure && (
                          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30 mb-4">
                            <CardContent className="p-6">
                              <div className="flex items-start gap-3 mb-3">
                                <TrendingUp className="w-5 h-5 text-primary mt-1" />
                                <h4 className="text-lg font-semibold text-primary">Market Structure & Price Action</h4>
                              </div>
                              <p className="leading-relaxed">{result.marketStructure}</p>
                            </CardContent>
                          </Card>
                        )}
                      </div>

                      {/* Chart Status */}
                      <Card className="bg-card/80">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <BarChart3 className="w-6 h-6 text-primary" />
                            <CardTitle>Chart Status</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Card className="bg-card/50">
                            <CardContent className="p-4">
                              <div className="text-sm text-muted-foreground mb-1">Trend</div>
                              <div className={`text-2xl font-bold ${
                                result.trend === "Downtrend" ? "text-destructive" : 
                                result.trend === "Uptrend" ? "text-success" : ""
                              }`}>
                                {result.trend}
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="bg-card/50">
                            <CardContent className="p-4">
                              <div className="text-sm text-muted-foreground mb-1">Momentum</div>
                              <div className="text-2xl font-bold">{result.momentum}</div>
                            </CardContent>
                          </Card>

                          <Card className="bg-card/50">
                            <CardContent className="p-4">
                              <div className="text-sm text-muted-foreground mb-1">Volume</div>
                              <div className="text-2xl font-bold">{result.volume}</div>
                            </CardContent>
                          </Card>

                          {result.keyObservations?.length > 0 && (
                            <Card className="bg-card/50">
                              <CardContent className="p-4">
                                <div className="text-sm text-muted-foreground mb-3">Key Observations</div>
                                <div className="space-y-2">
                                  {result.keyObservations.map((obs: string, i: number) => (
                                    <div key={i} className="flex items-start gap-2">
                                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                      <span className="text-sm">{obs}</span>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </CardContent>
                      </Card>

                      {/* Confidence */}
                      <Card className="bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30">
                        <CardContent className="p-6">
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground mb-2">Analysis Confidence</div>
                            <div className="text-6xl font-black text-primary">{result.confidence}</div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setImagePreview(null);
                      setResult(null);
                    }}
                  >
                    Analyze Another Chart
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
