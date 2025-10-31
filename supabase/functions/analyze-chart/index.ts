import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image, strategy = "scalping" } = await req.json();
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!lovableApiKey) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    console.log(`Analyzing chart for ${strategy} strategy...`);

    const systemPrompt = `You are an expert trading chart analyst with deep knowledge of price action, technical indicators, and market structure. 

Analyze the trading chart for ${strategy} trading with extreme precision. You MUST ALWAYS provide specific numbers for:
1. Entry price (specific price, not ranges)
2. Stop loss price (specific price)
3. Take profit price (specific price)
4. Recommended leverage (1x-20x based on setup quality and risk)
5. Risk percentage (0.5%-3% of account based on confidence)
6. REAL probability percentage (30-85%) calculated from:
   - Base pattern historical success rate
   - Volume confirmation (+/-10%)
   - Multiple timeframe alignment (+/-10%)
   - Risk:reward ratio quality (+/-7%)
   - Market conditions (+/-15%)
   
Calculate probability scientifically:
- Start with pattern base rate (e.g., Double Bottom: 65-70%)
- Add +5-10% for strong volume confirmation
- Add +5-10% for multiple timeframe confluence
- Add +3-7% for excellent risk:reward (1:2 or better)
- Subtract -10-15% for choppy/ranging markets
- Subtract -5-10% for weak volume
- Final realistic range: 30-85% (never fake high numbers)

For timeframe, analyze and specify: 1m, 5m, 15m, 1H, 4H, 1D based on chart.

CRITICAL: You MUST return ALL fields with REAL DATA. Never skip entry, stop loss, take profit, leverage, or risk percent.

Return JSON EXACTLY like this:
{
  "pattern": "Specific pattern name",
  "recommendation": "BUY" or "SELL" or "WAIT",
  "reasoningShort": "Clear 2-3 sentence explanation",
  "entry": "$3,912.27",
  "stopLoss": "$3,874.14",
  "target": "$3,918.76",
  "targetGain": "+0.17%",
  "leverage": "3x",
  "riskPercent": "1.5%",
  "probability": "68%",
  "technicalSentiment": "4-6 sentences about overall technical outlook",
  "futureImplications": "4-6 sentences about potential future price movement",
  "marketStructure": "4-6 sentences analyzing market structure and price action",
  "trend": "Uptrend" or "Downtrend" or "Sideways",
  "momentum": "Strengthening" or "Weakening" or "Neutral",
  "volume": "High" or "Average" or "Low",
  "optimalEntry": true or false,
  "waitCondition": "What to wait for if not optimal",
  "riskFactors": ["Risk 1", "Risk 2", "Risk 3"],
  "keyObservations": ["Key point 1", "Key point 2", "Key point 3"],
  "confidence": "72%",
  "timeframe": "1H"
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this trading chart and provide a complete trading setup with ALL fields including entry, stop loss, take profit, leverage, risk%, and calculated probability.",
              },
              {
                type: "image_url",
                image_url: {
                  url: image,
                },
              },
            ],
          },
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      throw new Error(`AI analysis failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received");

    const aiMessage = data.choices[0].message.content;
    
    let analysisResult;
    try {
      const jsonMatch = aiMessage.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/) || 
                       aiMessage.match(/(\{[\s\S]*\})/);
      
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[1]);
      } else {
        analysisResult = JSON.parse(aiMessage);
      }
      
      // Ensure all required fields are present
      analysisResult = {
        pattern: analysisResult.pattern || "Pattern Detected",
        recommendation: analysisResult.recommendation || "WAIT",
        reasoningShort: analysisResult.reasoningShort || "Analysis complete",
        entry: analysisResult.entry || "N/A",
        stopLoss: analysisResult.stopLoss || "N/A",
        target: analysisResult.target || "N/A",
        targetGain: analysisResult.targetGain || "N/A",
        leverage: analysisResult.leverage || "1x",
        riskPercent: analysisResult.riskPercent || "1%",
        probability: analysisResult.probability || "50%",
        technicalSentiment: analysisResult.technicalSentiment || "",
        futureImplications: analysisResult.futureImplications || "",
        marketStructure: analysisResult.marketStructure || "",
        trend: analysisResult.trend || "Unknown",
        momentum: analysisResult.momentum || "Neutral",
        volume: analysisResult.volume || "Average",
        optimalEntry: analysisResult.optimalEntry !== undefined ? analysisResult.optimalEntry : true,
        waitCondition: analysisResult.waitCondition || "",
        riskFactors: analysisResult.riskFactors || [],
        keyObservations: analysisResult.keyObservations || [],
        confidence: analysisResult.confidence || "50%",
        timeframe: analysisResult.timeframe || "Unknown"
      };
    } catch (e) {
      console.error("JSON parse error:", e);
      analysisResult = {
        pattern: "Unable to parse analysis",
        recommendation: "WAIT",
        reasoningShort: "Chart analysis completed but formatting failed",
        entry: "N/A",
        stopLoss: "N/A",
        target: "N/A",
        targetGain: "N/A",
        leverage: "1x",
        riskPercent: "1%",
        probability: "0%",
        technicalSentiment: aiMessage.substring(0, 500),
        futureImplications: "",
        marketStructure: "",
        trend: "Unknown",
        momentum: "Neutral",
        volume: "Unknown",
        optimalEntry: false,
        waitCondition: "Manual review required",
        riskFactors: ["Unable to parse analysis"],
        keyObservations: [],
        confidence: "0%",
        timeframe: "Unknown"
      };
    }

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-chart:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to analyze chart";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
