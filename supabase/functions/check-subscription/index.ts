import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

// Map product IDs to generation limits
const TIER_LIMITS: Record<string, number> = {
  "prod_TLqylNH5iKw3C4": 11,   // Starter
  "prod_TLqyJvYY90VT8V": 33,   // Pro
  "prod_TLqzRF5osRMCCg": 77,   // Premium
  "prod_TLqzip2WAay0tq": 133,  // Elite
  "prod_TLr0Ultimate123": 244, // Ultimate
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    
    // Check for existing subscription in our database
    const { data: existingSub, error: subError } = await supabaseClient
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (subError && subError.code !== 'PGRST116') {
      logStep("Error fetching subscription", { error: subError });
    }

    // Check Stripe for customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found");
      return new Response(JSON.stringify({ 
        subscribed: false,
        generations_used: existingSub?.generations_used || 0,
        generations_limit: 0
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    // Check for active subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    const hasActiveSub = subscriptions.data.length > 0;
    
    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      const productId = subscription.items.data[0].price.product as string;
      const priceId = subscription.items.data[0].price.id;
      const subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      const generationsLimit = TIER_LIMITS[productId] || 0;
      
      logStep("Active subscription found", { 
        subscriptionId: subscription.id, 
        productId,
        generationsLimit,
        endDate: subscriptionEnd 
      });

      // Check if we need to reset generations (new billing period)
      let generationsUsed = existingSub?.generations_used || 0;
      const needsReset = existingSub && new Date(existingSub.subscription_end) < new Date();
      
      if (needsReset) {
        logStep("Resetting generations for new billing period");
        generationsUsed = 0;
      }

      // Upsert subscription data
      const { error: upsertError } = await supabaseClient
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscription.id,
          product_id: productId,
          price_id: priceId,
          generations_limit: generationsLimit,
          generations_used: generationsUsed,
          subscription_end: subscriptionEnd,
        }, {
          onConflict: 'user_id'
        });

      if (upsertError) {
        logStep("Error upserting subscription", { error: upsertError });
      }

      return new Response(JSON.stringify({
        subscribed: true,
        product_id: productId,
        subscription_end: subscriptionEnd,
        generations_limit: generationsLimit,
        generations_used: generationsUsed,
        generations_remaining: generationsLimit - generationsUsed
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      logStep("No active subscription found");
      return new Response(JSON.stringify({
        subscribed: false,
        generations_used: existingSub?.generations_used || 0,
        generations_limit: 0,
        generations_remaining: 0
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: 'Failed to check subscription status. Please try again.'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
