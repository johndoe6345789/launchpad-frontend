'use client';

/**
 * Business Model Canvas organism.
 * Nine text areas, auto-saved on blur.
 * @module components/organisms/BusinessModelCanvas
 */
import React from 'react';
import Box from '@shared/m3/Box';
import TextField from '@shared/m3/TextField';
import Grid from '@shared/m3/Grid';
import CircularProgress from
  '@mui/material/CircularProgress';
import { useTranslations } from 'next-intl';
import { useBusinessModelCanvas }
  from '@/hooks/useBusinessModelCanvas';
import type { BmcCanvas }
  from '@/types/marketResearch';

type BmcKey = keyof BmcCanvas;

const FIELDS: { key: BmcKey; lk: string;
  tid: string }[] = [
  { key: 'problem', lk: 'problem',
    tid: 'bmc-problem' },
  { key: 'solution', lk: 'solution',
    tid: 'bmc-solution' },
  { key: 'uvp', lk: 'uvp', tid: 'bmc-uvp' },
  { key: 'channels', lk: 'channels',
    tid: 'bmc-channels' },
  { key: 'customerSegments',
    lk: 'customerSegments',
    tid: 'bmc-customer-segments' },
  { key: 'costStructure', lk: 'costStructure',
    tid: 'bmc-cost-structure' },
  { key: 'revenueStreams', lk: 'revenueStreams',
    tid: 'bmc-revenue-streams' },
  { key: 'keyMetrics', lk: 'keyMetrics',
    tid: 'bmc-key-metrics' },
  { key: 'unfairAdvantage', lk: 'unfairAdvantage',
    tid: 'bmc-unfair-advantage' },
];

/**
 * Business Model Canvas organism.
 * @returns BusinessModelCanvas UI.
 */
export const BusinessModelCanvas: React.FC = () => {
  const t = useTranslations('marketResearch');
  const tc = useTranslations('common');
  const vm = useBusinessModelCanvas();

  if (vm.isLoading) {
    return (
      <Box sx={{ display: 'flex',
        justifyContent: 'center', mt: 4 }}>
        <CircularProgress
          aria-label={tc('loading')} />
      </Box>
    );
  }

  return (
    <Box data-testid="business-model-canvas"
      aria-label={t('canvas')}>
      <Grid container spacing={2}>
        {FIELDS.map((f) => (
          <Grid item xs={12} sm={6} md={4}
            key={f.key}>
            <TextField
              label={t(
                f.lk as Parameters<typeof t>[0])}
              multiline rows={4}
              value={vm.canvas[f.key]}
              onChange={(e) => {
                vm.handleChange(
                  f.key, e.target.value,
                );
                // Save as you type (debounced). The shared
                // multiline TextField does not pass onBlur
                // through, so a save-on-blur never ran and
                // typed text was lost on reload.
                vm.scheduleAutosave({
                  ...vm.canvas,
                  [f.key]: e.target.value,
                });
              }}
              onBlur={() => vm.flushAutosave?.()}
              inputProps={{
                'aria-label': t(
                  f.lk as Parameters<typeof t>[0]),
              }}
              data-testid={f.tid}
              fullWidth
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BusinessModelCanvas;
