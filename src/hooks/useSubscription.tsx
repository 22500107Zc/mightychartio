import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

const OWNER_EMAIL = "culpindustriesllc@gmail.com";

export interface SubscriptionStatus {
  subscribed: boolean;
  product_id?: string;
  subscription_end?: string;
  generations_limit: number;
  generations_used: number;
  generations_remaining: number;
}

export const SUBSCRIPTION_TIERS = {
  'prod_TLqylNH5iKw3C4': {
    name: 'Starter',
    price: 44,
    generations: 11,
    priceId: 'price_1SP9GjLs7KD65wZP1vT5W67z',
  },
  'prod_TLqyJvYY90VT8V': {
    name: 'Pro',
    price: 77,
    generations: 33,
    priceId: 'price_1SP9GwLs7KD65wZPiuSlXtBV',
  },
  'prod_TLqzRF5osRMCCg': {
    name: 'Premium',
    price: 144,
    generations: 77,
    priceId: 'price_1SP9HILs7KD65wZPRUZaiGj8',
  },
  'prod_TLqzip2WAay0tq': {
    name: 'Elite',
    price: 255,
    generations: 133,
    priceId: 'price_1SP9HdLs7KD65wZPt1FdSy9Q',
  },
};

export const SINGLE_GENERATION = {
  name: 'Single Generation',
  price: 8,
  priceId: 'price_1SP9I1Ls7KD65wZPiOdGKKDm',
};

export const useSubscription = () => {
  const { user, session } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    subscribed: false,
    generations_limit: 0,
    generations_used: 0,
    generations_remaining: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkSubscription = useCallback(async () => {
    if (!user || !session) {
      setSubscriptionStatus({
        subscribed: false,
        generations_limit: 0,
        generations_used: 0,
        generations_remaining: 0,
      });
      setLoading(false);
      return;
    }

    // Owner has unlimited access
    if (user.email === OWNER_EMAIL) {
      setSubscriptionStatus({
        subscribed: true,
        generations_limit: 999999,
        generations_used: 0,
        generations_remaining: 999999,
        product_id: 'owner',
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      setSubscriptionStatus(data);
      setError(null);
    } catch (err: any) {
      console.error('Error checking subscription:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, session]);

  useEffect(() => {
    checkSubscription();

    // Refresh subscription status every minute
    const interval = setInterval(checkSubscription, 60000);

    return () => clearInterval(interval);
  }, [checkSubscription]);

  const createCheckout = async (priceId: string) => {
    if (!session) {
      throw new Error('Must be logged in to subscribe');
    }

    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { priceId },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) throw error;

    return data.url;
  };

  const openCustomerPortal = async () => {
    if (!session) {
      throw new Error('Must be logged in to manage subscription');
    }

    const { data, error } = await supabase.functions.invoke('customer-portal', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) throw error;

    return data.url;
  };

  const incrementGenerationUsage = async () => {
    if (!user) return;

    // Don't increment for owner
    if (user.email === OWNER_EMAIL) {
      return;
    }

    const { error } = await supabase
      .from('subscriptions')
      .update({ 
        generations_used: subscriptionStatus.generations_used + 1 
      })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error incrementing generation usage:', error);
      throw error;
    }

    // Refresh subscription status
    await checkSubscription();
  };

  const canGenerate = (user?.email === OWNER_EMAIL) || 
    (subscriptionStatus.subscribed && subscriptionStatus.generations_remaining > 0);

  const currentTier = subscriptionStatus.product_id 
    ? SUBSCRIPTION_TIERS[subscriptionStatus.product_id as keyof typeof SUBSCRIPTION_TIERS]
    : null;

  return {
    subscriptionStatus,
    loading,
    error,
    checkSubscription,
    createCheckout,
    openCustomerPortal,
    incrementGenerationUsage,
    canGenerate,
    currentTier,
  };
};
