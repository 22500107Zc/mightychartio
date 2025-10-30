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
            content: `You are an expert trading analyst. Analyze the trading chart image and provide:
1. A clear signal (e.g., "Buy Signal Detected", "Sell Signal Detected", "Neutral")
2. Detailed analysis of patterns, support/resistance levels, and market structure
3. Specific entry point, stop loss, and target prices (use format like "$425.50")
4. Confidence percentage (e.g., "87%")

Return your analysis in JSON format:
{
  "signal": "signal name",
  "analysis": "detailed analysis text",
  "entry": "entry price with $",
  "stopLoss": "stop loss with $", 
  "target": "target price with $",
  "confidence": "percentage with %"
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
          signal: "Analysis Complete",
          analysis: aiMessage,
          entry: "See analysis",
          stopLoss: "See analysis",
          target: "See analysis",
          confidence: "N/A"
        };
      }
    } catch (e) {
      console.error("JSON parse error:", e);
      analysisResult = {
        signal: "Analysis Complete",
        analysis: aiMessage,
        entry: "See analysis",
        stopLoss: "See analysis", 
        target: "See analysis",
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
