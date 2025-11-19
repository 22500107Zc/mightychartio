import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Upload, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";

const contractTimeframes = [
  { value: "3m", label: "3 Minutes" },
  { value: "5m", label: "5 Minutes" },
  { value: "15m", label: "15 Minutes" },
  { value: "30m", label: "30 Minutes" },
  { value: "1h", label: "1 Hour" },
];

const chartTimeframes = [
  { value: "1s", label: "1 Second" },
  { value: "5s", label: "5 Seconds" },
  { value: "15s", label: "15 Seconds" },
  { value: "30s", label: "30 Seconds" },
  { value: "1m", label: "1 Minute" },
  { value: "5m", label: "5 Minutes" },
  { value: "15m", label: "15 Minutes" },
  { value: "30m", label: "30 Minutes" },
  { value: "1h", label: "1 Hour" },
];

export default function EventContracts() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [contractTimeframe, setContractTimeframe] = useState("5m");
  const [chartTimeframe, setChartTimeframe] = useState("1m");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);

      setAnalyzing(true);
      try {
      const { data, error } = await supabase.functions.invoke("analyze-chart", {
        body: {
          images: [base64String],
          mode: "event-contract",
          contractTimeframe,
          chartTimeframe,
        },
      });

        if (error) throw error;
        setResult(data);
        toast.success("Analysis complete!");
      } catch (error: any) {
        console.error("Analysis error:", error);
        toast.error(error.message || "Failed to analyze chart");
      } finally {
        setAnalyzing(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setResult(null);
    setImagePreview("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-20">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6 hover:bg-secondary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Event Contract Analyzer
            </h1>
            <p className="text-muted-foreground">
              Upload your chart and get a clear HIGHER or LOWER prediction for your event contract
            </p>
          </div>

          {!result && (
            <div className="space-y-6">
              <Card className="p-6">
                <div className="space-y-6">
                  <div>
                    <Label className="text-lg font-semibold mb-4 block">
                      Contract Timeframe
                    </Label>
                    <RadioGroup
                      value={contractTimeframe}
                      onValueChange={setContractTimeframe}
                      className="grid grid-cols-2 md:grid-cols-5 gap-4"
                    >
                      {contractTimeframes.map((timeframe) => (
                        <div key={timeframe.value}>
                          <RadioGroupItem
                            value={timeframe.value}
                            id={`contract-${timeframe.value}`}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`contract-${timeframe.value}`}
                            className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
                          >
                            <span className="text-sm font-medium">{timeframe.label}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-lg font-semibold mb-4 block">
                      Chart Timeframe
                    </Label>
                    <RadioGroup
                      value={chartTimeframe}
                      onValueChange={setChartTimeframe}
                      className="grid grid-cols-3 md:grid-cols-5 gap-4"
                    >
                      {chartTimeframes.map((timeframe) => (
                        <div key={timeframe.value}>
                          <RadioGroupItem
                            value={timeframe.value}
                            id={`chart-${timeframe.value}`}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`chart-${timeframe.value}`}
                            className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
                          >
                            <span className="text-sm font-medium">{timeframe.label}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </Card>

              <Card className="p-8">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="chart-upload"
                    disabled={analyzing}
                  />
                  <label
                    htmlFor="chart-upload"
                    className="cursor-pointer flex flex-col items-center gap-4"
                  >
                    <Upload className="h-12 w-12 text-muted-foreground" />
                    <div>
                      <p className="text-lg font-medium mb-2">
                        {analyzing ? "Analyzing..." : "Upload Chart Screenshot"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Click to upload your chart (Max 5MB)
                      </p>
                    </div>
                  </label>
                </div>

                {imagePreview && (
                  <div className="mt-6">
                    <img
                      src={imagePreview}
                      alt="Uploaded chart"
                      className="w-full rounded-lg border"
                    />
                  </div>
                )}
              </Card>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              <Card className="p-8 text-center">
                <div className="mb-6">
                  {(result.direction === "HIGHER" || result.recommendation === "BUY") ? (
                    <TrendingUp className="h-24 w-24 mx-auto text-green-500" />
                  ) : (
                    <TrendingDown className="h-24 w-24 mx-auto text-red-500" />
                  )}
                </div>
                <h2 className="text-5xl font-bold mb-4">
                  {(result.direction === "HIGHER" || result.recommendation === "BUY") ? (
                    <span className="text-green-500">HIGHER</span>
                  ) : (
                    <span className="text-red-500">LOWER</span>
                  )}
                </h2>
                <p className="text-xl text-muted-foreground mb-4">
                  Contract Timeframe: {contractTimeframes.find(t => t.value === contractTimeframe)?.label}
                </p>
                <div className="inline-block px-6 py-3 bg-primary/10 rounded-lg">
                  <p className="text-lg font-semibold">
                    Confidence: {result.confidence || result.probability}
                  </p>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Analysis Details</h3>
                <div className="space-y-4 text-muted-foreground">
                  <p>{result.reasoning || result.reasoningShort || result.technicalSentiment}</p>
                  {result.keyFactors && (
                    <div>
                      <p className="font-semibold text-foreground mb-2">Key Factors:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {result.keyFactors.map((factor: string, index: number) => (
                          <li key={index}>{factor}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {(result.entry || result.stopLoss || result.target) && (
                    <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                      {result.entry && (
                        <div>
                          <p className="font-semibold text-foreground">Entry</p>
                          <p>{result.entry}</p>
                        </div>
                      )}
                      {result.stopLoss && (
                        <div>
                          <p className="font-semibold text-foreground">Stop Loss</p>
                          <p>{result.stopLoss}</p>
                        </div>
                      )}
                      {result.target && (
                        <div>
                          <p className="font-semibold text-foreground">Target</p>
                          <p>{result.target}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>

              {imagePreview && (
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Analyzed Chart</h3>
                  <img
                    src={imagePreview}
                    alt="Analyzed chart"
                    className="w-full rounded-lg border"
                  />
                </Card>
              )}

              <Button onClick={handleClear} className="w-full" size="lg">
                Analyze Another Chart
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
