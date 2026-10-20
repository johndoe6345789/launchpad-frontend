'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Box, Button, Typography } from '@shared/m3';
import { Link } from '@/i18n/navigation';
import { useAppDispatch } from '@/store/hooks';
import { useGuideSelector } from './useGuideSelector';
import { startTour } from '@/store/slices/guideSlice';
import { usePlannerProgress } from '@/hooks';
import { starterProgress } from './guidePath';

/**
 * The one thing to do next, in plain words, with where to do it and
 * a button that ticks it off.
 */
export const NextStepCard: React.FC = () => {
  const t = useTranslations('guide');
  const tp = useTranslations('planner');
  const dispatch = useAppDispatch();
  const completed = useGuideSelector((s) => s.planner.completedSteps);
  const { toggle } = usePlannerProgress();
  const { next, done, total } = starterProgress(completed);
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <Box data-tour="next-step" data-testid="next-step-card" sx={{
      border: '2px solid', borderColor: 'primary.main', borderRadius: 3,
      p: 3, mb: 3,
    }}>
      <Typography variant="overline" color="primary" fontWeight={700}>
        {t('nextLabel')}
      </Typography>
      {next ? (
        <>
          <Typography variant="h5" component="h2" fontWeight={800}
            gutterBottom data-testid="next-step-title">
            {tp(`steps.${next.id}.title`)}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1.5, lineHeight: 1.6 }}>
            {t(`steps.${next.id}.how`)}
          </Typography>
          <Typography variant="body2" color="text.secondary"
            sx={{ mb: 2 }}>
            {t(`steps.${next.id}.cost`)}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Button component={Link} href={next.route}
              variant="contained" data-testid="next-step-go">
              {t('doThis')}
            </Button>
            <Button variant="outlined" data-testid="next-step-done"
              onClick={() => toggle(next.id)}>
              {t('markDone')}
            </Button>
            <Button variant="text"
              onClick={() => dispatch(startTour('roadmap'))}>
              {t('showMe')}
            </Button>
          </Box>
        </>
      ) : (
        <Typography variant="h6" component="h2" data-testid="next-step-all">
          {t('allDone')}
        </Typography>
      )}
      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          {t('starterProgress', { done, total })}
        </Typography>
        <Box sx={{ height: 8, borderRadius: 4, bgcolor: 'action.hover',
          mt: 0.5 }}>
          <Box sx={{ height: 8, borderRadius: 4, width: `${pct}%`,
            bgcolor: 'primary.main' }} />
        </Box>
      </Box>
    </Box>
  );
};

export default NextStepCard;
