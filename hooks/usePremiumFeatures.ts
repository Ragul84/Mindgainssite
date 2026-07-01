import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { RewardService, type SubscriptionTier } from '@/services/rewardService';

type PremiumFeature = 'topic_completion' | 'story_learn' | 'ai_generation' | string;

export interface FeatureAccessResult {
  can_access: boolean;
  tier: SubscriptionTier;
  remaining?: number;
  total?: number;
  reason?: string;
}

export function usePremiumFeatures() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [showPremiumGate, setShowPremiumGate] = useState(false);
  const [premiumGateFeature, setPremiumGateFeature] = useState<PremiumFeature | null>(null);

  const refreshTier = useCallback(async () => {
    if (!user?.id) {
      setTier('free');
      return;
    }

    try {
      const stats = await RewardService.getUserStats();
      setTier(stats?.subscription_tier || 'free');
    } catch (error) {
      console.warn('Failed to refresh subscription tier:', error);
      setTier('free');
    }
  }, [user?.id]);

  useEffect(() => {
    void refreshTier();
  }, [refreshTier]);

  const closePremiumGate = useCallback(() => {
    setShowPremiumGate(false);
    setPremiumGateFeature(null);
  }, []);

  const useFeature = useCallback(async (feature: PremiumFeature): Promise<FeatureAccessResult> => {
    setIsLoading(true);
    try {
      const stats = await RewardService.getUserStats();
      const resolvedTier = stats?.subscription_tier || 'free';
      setTier(resolvedTier);

      if (feature === 'topic_completion') {
        const lessonAccess = await RewardService.canUnlockLesson();
        const result: FeatureAccessResult = {
          can_access: lessonAccess.allowed,
          tier: resolvedTier,
          remaining: lessonAccess.remaining,
          total: lessonAccess.total,
          reason: lessonAccess.allowed ? undefined : 'daily_limit_reached',
        };

        if (!result.can_access) {
          setPremiumGateFeature(feature);
          setShowPremiumGate(true);
        }

        return result;
      }

      // Story/AI features are currently enabled for all tiers in this app build.
      return {
        can_access: true,
        tier: resolvedTier,
      };
    } catch (error) {
      console.error('Feature check failed:', error);
      setPremiumGateFeature(feature);
      setShowPremiumGate(true);
      return {
        can_access: false,
        tier: 'free',
        reason: 'check_failed',
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkPremiumFeature = useCallback((feature: PremiumFeature) => useFeature(feature), [useFeature]);
  const hidePremiumGate = closePremiumGate;

  const isPremium = useMemo(() => tier === 'pro' || tier === 'premium', [tier]);

  return {
    useFeature,
    checkPremiumFeature,
    isLoading,
    showPremiumGate,
    closePremiumGate,
    hidePremiumGate,
    premiumGateFeature,
    isPremium,
    tier,
  };
}