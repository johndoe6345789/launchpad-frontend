'use client';

import React from 'react';
import Card from '@shared/m3/Card';
import CardContent from '@shared/m3/CardContent';
import Typography from '@shared/m3/Typography';
import Button from '@shared/m3/Button';
import Box from '@shared/m3/Box';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useAppSelector } from '@/store/hooks';

/**
 * Onboarding call-to-action card shown on the dashboard
 * when the user has not yet completed setup.
 *
 * @returns Card with a link to /onboarding, or null when
 *   setup is already complete.
 */
export const OnboardingCta: React.FC = () => {
  const t = useTranslations('dashboard');
  const onboardingComplete = useAppSelector(
    (s) => s.startupType.onboardingComplete,
  );

  if (onboardingComplete) return null;

  return (
    <Card
      data-testid="onboarding-cta"
      variant="outlined"
      sx={{ mb: 3 }}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <Box>
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
            >
              {t('onboardingCtaTitle')}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {t('onboardingCtaDesc')}
            </Typography>
          </Box>
          <Button
            component={Link}
            href="/onboarding"
            variant="contained"
            aria-label={t('onboardingCtaCta')}
            data-testid="onboarding-cta-btn"
          >
            {t('onboardingCtaCta')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OnboardingCta;
