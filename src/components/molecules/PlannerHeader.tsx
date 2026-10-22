'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Typography from '@shared/m3/Typography';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useGetStartupTypeQuery }
  from '@/store/api/startupTypeApi';

/** Props for PlannerHeader. */
export interface PlannerHeaderProps {
  /** Selected startup type slug (null if none). */
  selectedSlug: string | null;
  /** Whether the user has completed onboarding. */
  onboardingComplete: boolean;
}

/**
 * Personalised heading for the planner page.
 * Shows a setup prompt when onboarding is incomplete,
 * or a type-specific chip when it is complete.
 *
 * @param props - Slug and onboarding completion flag.
 * @returns Alert CTA or personalised planner chip.
 */
export const PlannerHeader: React.FC<
  PlannerHeaderProps
> = ({ selectedSlug, onboardingComplete }) => {
  const t = useTranslations('planner');
  const { data } = useGetStartupTypeQuery(
    selectedSlug ?? '',
    { skip: !selectedSlug || !onboardingComplete },
  );

  if (!onboardingComplete) {
    return (
      <Alert
        severity="info"
        data-testid="planner-setup-alert"
        sx={{ mb: 3 }}
        action={
          <Button
            component={Link}
            href="/onboarding"
            color="inherit"
            size="small"
            aria-label={t('completeSetupCta')}
            data-testid="planner-setup-cta"
          >
            {t('completeSetupCta')}
          </Button>
        }
      >
        {t('completeSetup')}
      </Alert>
    );
  }

  if (!data) return null;

  return (
    <Box sx={{ mb: 3 }} data-testid="planner-type-header">
      <Typography variant="h6" component="div">
        <Chip
          label={t('personalised', { type: data.name })}
          color="primary"
          variant="outlined"
          aria-label={
            t('personalised', { type: data.name })
          }
        />
      </Typography>
    </Box>
  );
};

export default PlannerHeader;
