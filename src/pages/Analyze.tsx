import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Loader2, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";

export default function Analyze() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
        body: { image: base64 },
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
                    <div className="space-y-4">
                      <Card className="bg-card/80 border-success/30">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center flex-shrink-0">
                              <TrendingUp className="w-6 h-6 text-success" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-2">{result.signal}</h3>
                              <p className="text-muted-foreground mb-4">{result.analysis}</p>
                              
                              {result.entry && (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <ArrowUp className="w-4 h-4 text-success" />
                                    <span className="text-sm">Entry: <span className="font-mono font-semibold">{result.entry}</span></span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <ArrowDown className="w-4 h-4 text-destructive" />
                                    <span className="text-sm">Stop Loss: <span className="font-mono font-semibold">{result.stopLoss}</span></span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-accent" />
                                    <span className="text-sm">Target: <span className="font-mono font-semibold">{result.target}</span></span>
                                  </div>
                                </div>
                              )}

                              <div className="mt-4 flex items-center gap-2">
                                <div className="text-3xl font-bold text-success">{result.confidence}</div>
                                <span className="text-sm text-muted-foreground">Confidence</span>
                              </div>
                            </div>
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
