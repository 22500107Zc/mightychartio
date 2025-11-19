import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image, contractTimeframe, chartTimeframe } = await req.json();

    if (!image) {
      throw new Error('No image provided');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are an expert event contract analyzer specializing in binary options (HIGHER/LOWER predictions) with NO INDICATORS.

Your task is to analyze price charts and provide a clear HIGHER or LOWER prediction for the specified contract timeframe.

CRITICAL RULES:
1. Give ONE clear answer: HIGHER or LOWER
2. Base your analysis ONLY on pure price action, candlestick patterns, and market structure
3. NO indicators are available - use only what you see on the chart
4. Consider the contract timeframe when making predictions
5. Provide confidence level (0-100%)
6. Explain your reasoning based on visible price patterns

ANALYSIS FRAMEWORK:
- Support/Resistance levels
- Candlestick patterns (engulfing, doji, hammers, etc.)
- Trend direction and momentum
- Price action patterns (breakouts, reversals, consolidation)
- Market structure (higher highs, lower lows, etc.)
- Volume patterns if visible

Return your analysis in this exact JSON format:
{
  "direction": "HIGHER" or "LOWER",
  "confidence": number between 0-100,
  "reasoning": "Clear explanation of why you chose this direction",
  "keyFactors": ["Factor 1", "Factor 2", "Factor 3"]
}`;

    const userPrompt = `Analyze this chart for an event contract with:
- Contract Timeframe: ${contractTimeframe}
- Chart Timeframe: ${chartTimeframe}

Give me a clear HIGHER or LOWER prediction. This is for a binary option - I need to know which direction to place my contract.`;

    console.log('Sending request to Lovable AI...');
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: userPrompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: image
                }
              }
            ]
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Received response from AI');
    
    let analysisResult;
    try {
      const content = data.choices[0].message.content;
      analysisResult = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      throw new Error('Failed to parse AI response');
    }

    // Ensure all required fields are present
    if (!analysisResult.direction || !analysisResult.confidence || !analysisResult.reasoning) {
      throw new Error('Invalid AI response format');
    }

    // Validate direction
    if (analysisResult.direction !== "HIGHER" && analysisResult.direction !== "LOWER") {
      analysisResult.direction = "HIGHER"; // Default fallback
    }

    return new Response(
      JSON.stringify(analysisResult),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in analyze-event-contract:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        direction: "HIGHER",
        confidence: 50,
        reasoning: "Analysis failed. Please try again with a clearer chart image."
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
