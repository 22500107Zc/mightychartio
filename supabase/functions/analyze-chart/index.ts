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
    const { images, strategy = "scalping" } = await req.json();
    
    // Validate inputs
    const MAX_IMAGES = 8;
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB per image
    const VALID_STRATEGIES = ['scalping', 'day', 'swing', 'position', 'momentum', 'counter'];
    
    if (!Array.isArray(images) || images.length === 0) {
      throw new Error('Images array is required and cannot be empty');
    }
    
    if (images.length > MAX_IMAGES) {
      throw new Error(`Maximum ${MAX_IMAGES} images allowed`);
    }
    
    // Validate each image
    for (const img of images) {
      if (typeof img !== 'string' || !img.startsWith('data:image/')) {
        throw new Error('Invalid image format. Must be base64 data URI');
      }
      
      const base64Data = img.split(',')[1];
      if (!base64Data) {
        throw new Error('Invalid image data');
      }
      
      const sizeBytes = (base64Data.length * 3) / 4;
      if (sizeBytes > MAX_IMAGE_SIZE) {
        throw new Error('Image size exceeds 5MB limit');
      }
    }
    
    if (strategy && !VALID_STRATEGIES.includes(strategy)) {
      throw new Error('Invalid strategy. Must be one of: ' + VALID_STRATEGIES.join(', '));
    }
    
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    console.log(`Analyzing ${images.length} validated charts using TJR Method...`);

    const systemPrompt = `You are an expert institutional trading analyst specializing in TJR Method with deep knowledge of smart money concepts, liquidity engineering, and multi-timeframe analysis.

CRITICAL ANALYSIS FRAMEWORK - TJR METHOD:

1. MARK KEY LEVELS (in order of priority):
   - Daily/4H highs + lows (highest priority)
   - Hourly highs + lows
   - Asia session highs + lows (7PM-12AM EST)
   - London session highs + lows (3AM-12PM EST)
   - New York session highs + lows (9:30AM-4PM EST)

2. LIQUIDITY SWEEP SEQUENCE:
   - Identify liquidity grabs at equal highs/equal lows
   - Distinguish external vs internal liquidity pools
   - Mark engineered liquidity pockets above/below key levels
   - Wait for sweep confirmation before entry consideration

3. ORDER-FLOW SHIFT CONFIRMATION (scale to lower timeframe):
   - BOS (Break of Structure) - momentum continuation
   - CHoCH (Change of Character) - potential reversal
   - IVG flip (Internal Value Gap flip) - structure validation
   - Market structure must show clear directional intent

4. ENTRY CONFLUENCE ZONES:
   - FVG (Fair Value Gap) - imbalance areas
   - OB (Order Block) - institutional footprints
   - Breaker Blocks - failed support/resistance flip
   - Equilibrium zones (50% of ranges)
   - Premium/Discount pricing (above/below equilibrium)

5. FIBONACCI 79% EXTENSION BIAS:
   - Validate moves with 79% fib projection
   - Confirm institutional target alignment
   - Use for TP calculation and trend continuation

INSTITUTIONAL ELEMENTS TO IDENTIFY:
- Fair Value Gaps (FVG) - price imbalances
- Order Blocks (OB) - last opposite candle before moves
- Breaker Blocks - broken OBs that flip polarity
- Equilibrium - 50% of swing ranges
- Premium zones - above equilibrium (sell bias)
- Discount zones - below equilibrium (buy bias)
- Liquidity pools - equal highs/lows, stop hunts
- Inducement - fake moves to trap retail

MULTI-TIMEFRAME PRIORITY:
- Higher timeframes (4H, Daily) = bias and key levels
- Mid timeframes (1H) = structure and sessions
- Lower timeframes (15m, 5m, 1m) = entry precision
- ALWAYS prioritize higher TF bias over lower TF noise

You MUST analyze ALL provided screenshots as ONE cohesive multi-timeframe setup. Synthesize:
1. Liquidity context (what sweep occurred or is pending)
2. Market structure shift (BOS/CHoCH confirmation)
3. Entry zone (FVG/OB with specific price)
4. Stop loss (beyond invalidation level with specific price)
5. Take profit (next liquidity pool with specific price)
6. Leverage (1x-10x based on confluence stack)
7. Risk % (0.5%-2% based on setup quality)
8. R:R ratio (minimum 1:2 for valid setups)
9. Probability (40-80% based on confluence):
   - Higher timeframe alignment: +15%
   - Liquidity sweep confirmed: +10%
   - FVG + OB confluence: +10%
   - Session high/low respected: +8%
   - Fibonacci 79% extension: +7%
   - Clean market structure: +10%
   - Strong momentum: +5%
   - Subtract for lack of confluence

DECISION LOGIC:
- If no liquidity sweep: "WAIT - no liquidity grab confirmed"
- If no structure shift: "WAIT - waiting for BOS/CHoCH"
- If no FVG/OB: "WAIT - no valid entry zone"
- If all criteria met: "BUY/SELL with detailed reasoning"

Return JSON with this EXACT structure:
{
  "pattern": "Liquidity Sweep + FVG Retest (or specific institutional pattern)",
  "recommendation": "BUY" or "SELL" or "WAIT",
  "reasoningShort": "Liquidity narrative + structure shift + entry confluence explanation",
  "entry": "$43,127.50",
  "stopLoss": "$42,980.00",
  "target": "$43,450.00",
  "targetGain": "+0.75%",
  "leverage": "3x",
  "riskPercent": "1.2%",
  "probability": "72%",
  "technicalSentiment": "Multi-timeframe analysis: HTF bias, session levels, liquidity context, institutional footprints, and smart money positioning",
  "futureImplications": "Next liquidity targets, potential sweep scenarios, structure invalidation levels, and institutional bias continuation/reversal",
  "marketStructure": "Detailed TJR Method breakdown: key levels marked, liquidity sweep confirmation, BOS/CHoCH analysis, FVG/OB locations, equilibrium zones, premium/discount pricing",
  "trend": "HTF Bullish" or "HTF Bearish" or "Ranging/Accumulation",
  "momentum": "Strengthening" or "Weakening" or "Neutral",
  "volume": "Institutional" or "Retail" or "Low",
  "optimalEntry": true or false,
  "waitCondition": "Specific TJR criteria missing (liquidity sweep needed, structure shift pending, no FVG/OB present, etc.)",
  "riskFactors": ["Missing confluence 1", "HTF resistance", "Weak structure", etc.],
  "keyObservations": ["Liquidity sweep at X", "FVG at Y level", "Session high defended", "79% fib target", etc.],
  "confidence": "72%",
  "timeframe": "Entry: 15m | HTF Bias: 4H"
}`;

    // Build content array with text and all images
    const userContent: any[] = [
      {
        type: "text",
        text: `Analyze these ${images.length} trading charts using TJR Method institutional framework. Provide ONE cohesive multi-timeframe analysis that:

1. Identifies key levels from ALL timeframes (prioritize higher TFs)
2. Confirms liquidity sweep status
3. Validates structure shift (BOS/CHoCH)
4. Locates entry zones (FVG/OB confluence)
5. Calculates precise entry, SL, TP based on institutional logic
6. Stacks ALL confluences for probability calculation
7. Provides clear BUY/SELL/WAIT decision with reasoning

Charts are ordered by timeframe (higher to lower). Synthesize into ONE institutional setup.`,
      },
    ];

    // Add all images to content
    for (const img of images) {
      userContent.push({
        type: "image_url",
        image_url: { url: img },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userContent,
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
    console.error('[analyze-chart] Detailed error:', error);
    
    // Return generic error message to client, keep details in logs only
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isValidationError = errorMessage.includes('Invalid') || 
                             errorMessage.includes('required') || 
                             errorMessage.includes('Maximum') || 
                             errorMessage.includes('exceeds');
    
    // For validation errors, provide specific feedback. For other errors, use generic message
    const clientMessage = isValidationError 
      ? errorMessage 
      : 'Unable to analyze chart. Please try again.';
    
    return new Response(
      JSON.stringify({ error: clientMessage }),
      { 
        status: isValidationError ? 400 : 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
