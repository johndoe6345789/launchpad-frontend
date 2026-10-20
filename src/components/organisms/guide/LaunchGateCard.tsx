'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Box, Typography } from '@shared/m3';
import { Link } from '@/i18n/navigation';
import { useAppDispatch } from '@/store/hooks';
import { useGuideSelector } from './useGuideSelector';
import { setLaunchReady } from '@/store/slices/guideSlice';
import { LAUNCH_CHECKS, launchReady } from './guidePath';

/**
 * "Do I need a limited company?" Says not yet, and gives three things
 * that should all be true before looking into it.
 */
export const LaunchGateCard: React.FC = () => {
  const t = useTranslations('guide');
  const dispatch = useAppDispatch();
  const ticks = useGuideSelector((s) => s.guide.launchReady);
  const ready = launchReady(ticks);

  return (
    <Box data-tour="launch-gate" data-testid="launch-gate" sx={{
      border: '1px solid', borderColor: 'divider', borderRadius: 3,
      p: 3, mb: 3,
    }}>
      <Typography variant="h6" component="h2" fontWeight={700}
        gutterBottom>
        {t('launchTitle')}
      </Typography>
      <Typography variant="body1" sx={{ mb: 1.5, lineHeight: 1.6 }}>
        {t('launchBody')}
      </Typography>
      <Typography variant="subtitle2" fontWeight={700}>
        {t('launchChecksTitle')}
      </Typography>
      <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mb: 1.5 }}>
        {LAUNCH_CHECKS.map((c) => (
          <li key={c}>
            <label style={{ display: 'flex', gap: 8, padding: '4px 0',
              cursor: 'pointer', alignItems: 'flex-start' }}>
              <input type="checkbox" checked={!!ticks[c]}
                data-testid={`launch-check-${c}`}
                onChange={(e) => dispatch(setLaunchReady(
                  { id: c, value: e.target.checked }))}
                style={{ width: 18, height: 18, marginTop: 2,
                  accentColor: '#8000ff' }} />
              <span>{t(`launchChecks.${c}`)}</span>
            </label>
          </li>
        ))}
      </Box>
      <Typography role="status" variant="body2" fontWeight={600}
        data-testid="launch-verdict"
        color={ready ? 'success.main' : 'text.secondary'}>
        {ready ? t('launchReady') : t('launchNotYet')}
      </Typography>
      <Link href="/help/low-risk-ideas">{t('launchLearn')}</Link>
    </Box>
  );
};

export default LaunchGateCard;
