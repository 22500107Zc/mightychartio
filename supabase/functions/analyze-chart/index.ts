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
    const { image } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    console.log("Analyzing chart with AI...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an expert trading analyst. Provide comprehensive trading analysis in JSON format:

{
  "pattern": "Detected pattern name (e.g., Bullish Reversal Attempt after Downtrend)",
  "recommendation": "BUY or SELL or WAIT",
  "reasoningShort": "Brief reasoning for the recommendation (2-3 sentences)",
  "technicalSentiment": "Detailed technical sentiment overview (4-6 sentences)",
  "futureImplications": "Future price movement implications (4-6 sentences)",
  "marketStructure": "Market structure & price action analysis (4-6 sentences)",
  "trend": "Uptrend or Downtrend or Sideways",
  "momentum": "Strengthening or Weakening or Neutral",
  "volume": "High or Average or Low",
  "keyObservations": ["Observation 1", "Observation 2"],
  "optimalEntry": true or false,
  "waitCondition": "If not optimal, what to wait for",
  "riskFactors": ["Risk 1", "Risk 2"],
  "entry": "$X,XXX.XX",
  "stopLoss": "$X,XXX.XX",
  "target": "$X,XXX.XX",
  "targetGain": "+X.XX%",
  "confidence": "XX%"
}`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please analyze this trading chart and provide actionable insights.",
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
    
    // Try to parse JSON from the response
    let analysisResult;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = aiMessage.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/) || 
                       aiMessage.match(/(\{[\s\S]*\})/);
      
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[1]);
      } else {
        // Fallback if no JSON found
        analysisResult = {
          pattern: "Analysis Complete",
          recommendation: "WAIT",
          reasoningShort: aiMessage.substring(0, 200),
          technicalSentiment: aiMessage,
          futureImplications: "",
          marketStructure: "",
          trend: "Unknown",
          momentum: "Unknown",
          volume: "Unknown",
          keyObservations: [],
          optimalEntry: false,
          waitCondition: "See detailed analysis",
          riskFactors: [],
          entry: "See analysis",
          stopLoss: "See analysis",
          target: "See analysis",
          targetGain: "N/A",
          confidence: "N/A"
        };
      }
    } catch (e) {
      console.error("JSON parse error:", e);
      analysisResult = {
        pattern: "Analysis Complete",
        recommendation: "WAIT",
        reasoningShort: aiMessage.substring(0, 200),
        technicalSentiment: aiMessage,
        futureImplications: "",
        marketStructure: "",
        trend: "Unknown",
        momentum: "Unknown",
        volume: "Unknown",
        keyObservations: [],
        optimalEntry: false,
        waitCondition: "See detailed analysis",
        riskFactors: [],
        entry: "See analysis",
        stopLoss: "See analysis",
        target: "See analysis",
        targetGain: "N/A",
        confidence: "N/A"
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
