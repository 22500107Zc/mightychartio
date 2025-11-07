import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export interface SubscriptionStatus {
  subscribed: boolean;
  generations_limit: number;
  generations_used: number;
  generations_remaining: number;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscriptionStatus] = useState<SubscriptionStatus>({
    subscribed: true,
    generations_limit: 999999,
    generations_used: 0,
    generations_remaining: 999999,
  });
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const canGenerate = true;

  return {
    subscriptionStatus,
    loading,
    error,
    canGenerate,
    currentTier: null,
  };
};
