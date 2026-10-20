'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Box, Button, Typography } from '@shared/m3';
import { Link } from '@/i18n/navigation';
import { useAppDispatch } from '@/store/hooks';
import { useGuideSelector } from './useGuideSelector';
import { resetIdeaCheck, setIdeaAnswer } from '@/store/slices/guideSlice';
import { IDEA_QUESTIONS, ideaVerdict } from './guidePath';

/**
 * Six yes/no questions that catch the usual traps (open-ended work,
 * unpaid time, running costs) before time is spent on an idea.
 */
export const IdeaRiskCard: React.FC = () => {
  const t = useTranslations('guide');
  const dispatch = useAppDispatch();
  const answers = useGuideSelector((s) => s.guide.ideaAnswers);
  const verdict = ideaVerdict(answers);

  return (
    <Box data-tour="idea-check" data-testid="idea-check" sx={{
      border: '1px solid', borderColor: 'divider', borderRadius: 3,
      p: 3, mb: 3,
    }}>
      <Typography variant="h6" component="h2" fontWeight={700}
        gutterBottom>
        {t('ideaTitle')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        {t('ideaIntro')}
      </Typography>
      {IDEA_QUESTIONS.map((q) => (
        <Box key={q} sx={{ mb: 1.5 }}>
          <Typography variant="body1" fontWeight={600}>
            {t(`idea.${q}.q`)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t(`idea.${q}.why`)}
          </Typography>
          <Box role="group" aria-label={t(`idea.${q}.q`)}
            sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
            {[true, false].map((v) => (
              <Button key={String(v)} size="small"
                data-testid={`idea-${q}-${v ? 'yes' : 'no'}`}
                aria-pressed={answers[q] === v}
                variant={answers[q] === v ? 'contained' : 'outlined'}
                onClick={() => dispatch(
                  setIdeaAnswer({ id: q, value: v }))}>
                {v ? t('yes') : t('no')}
              </Button>
            ))}
          </Box>
        </Box>
      ))}
      {verdict.level !== 'unanswered' && (
        <Box role="status" data-testid="idea-verdict" sx={{ mt: 2 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            {t(`ideaVerdict.${verdict.level}`)}
          </Typography>
          {verdict.weak.map((w) => (
            <Typography key={w} variant="body2" sx={{ mt: 0.5 }}>
              {t(`idea.${w}.fix`)}
            </Typography>
          ))}
        </Box>
      )}
      <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Button variant="text" size="small"
          onClick={() => dispatch(resetIdeaCheck())}>
          {t('ideaReset')}
        </Button>
        <Link href="/help/low-risk-ideas">{t('ideaLearn')}</Link>
      </Box>
    </Box>
  );
};

export default IdeaRiskCard;
