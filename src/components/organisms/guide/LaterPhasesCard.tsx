'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Box, Button, Typography } from '@shared/m3';

/** Props for LaterPhasesCard. */
export interface LaterPhasesCardProps {
  /** Reveal the hidden phases. */
  readonly onShow: () => void;
}

/** Stands in for the phases a beginner does not need yet. */
export const LaterPhasesCard: React.FC<LaterPhasesCardProps> = (
  { onShow },
) => {
  const t = useTranslations('guide');
  return (
    <Box data-tour="later-phases" data-testid="later-phases" sx={{
      border: '1px dashed', borderColor: 'divider', borderRadius: 2,
      p: 2.5, mb: 2,
    }}>
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>
        {t('laterTitle')}
      </Typography>
      <Typography variant="body2" sx={{ mb: 1.5 }}>
        {t('laterBody')}
      </Typography>
      <Button variant="outlined" size="small" onClick={onShow}
        data-testid="later-show">
        {t('laterShow')}
      </Button>
    </Box>
  );
};

export default LaterPhasesCard;
