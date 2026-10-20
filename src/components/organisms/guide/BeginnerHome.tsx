'use client';

import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Box, Typography } from '@shared/m3';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { startTour } from '@/store/slices/guideSlice';
import { NextStepCard } from './NextStepCard';
import { CompanyGateCard } from './CompanyGateCard';
import { LaunchGateCard } from './LaunchGateCard';
import { IdeaRiskCard } from './IdeaRiskCard';

const AUTO_START_DELAY_MS = 1200;

/**
 * The beginner home page: next step, the limited-company question and
 * the idea risk check. Starts the welcome walkthrough once.
 */
export const BeginnerHome: React.FC = () => {
  const t = useTranslations('guide');
  const dispatch = useAppDispatch();
  const rehydrated = useAppSelector(
    (s) => (s as { _persist?: { rehydrated?: boolean } })._persist
      ?.rehydrated ?? true,
  );
  const seen = useAppSelector((s) => s.guide.toursSeen.welcome);
  const advanced = useAppSelector((s) => s.guide.advanced);
  const touring = useAppSelector((s) => s.guide.activeTour !== null);

  useEffect(() => {
    if (!rehydrated || seen || advanced || touring) return undefined;
    const timer = setTimeout(
      () => dispatch(startTour('welcome')), AUTO_START_DELAY_MS);
    return () => clearTimeout(timer);
  }, [rehydrated, seen, advanced, touring, dispatch]);

  return (
    <Box data-testid="beginner-home" sx={{ maxWidth: 760, mx: 'auto' }}>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        {t('homeIntro')}
      </Typography>
      <NextStepCard />
      <LaunchGateCard />
      <CompanyGateCard />
      <IdeaRiskCard />
    </Box>
  );
};

export default BeginnerHome;
