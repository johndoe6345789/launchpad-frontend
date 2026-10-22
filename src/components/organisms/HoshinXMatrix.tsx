'use client';
/**
 * @file HoshinXMatrix.tsx
 * @brief Hoshin X-matrix: add objectives, group them by horizon and
 *        link each to the companies it serves.
 */
import React from 'react';
import { Box, Typography, Divider } from '@shared/m3';
import { useTranslations } from 'next-intl';
import {
  useHoshinMatrix, type XMatrixRow,
} from '@/hooks/useHoshinMatrix';
import { useHoshinActions } from '@/hooks/useHoshinActions';
import HoshinObjectiveRow
  from '@/components/molecules/HoshinObjectiveRow';
import HoshinObjectiveForm
  from '@/components/molecules/HoshinObjectiveForm';
import type { Organisation } from '@/types/organisations';

interface SectionProps {
  label: string;
  rows: XMatrixRow[];
  emptyMsg: string;
  organisations: Organisation[];
  actions: ReturnType<typeof useHoshinActions>;
}

function Section(
  { label, rows, emptyMsg, organisations, actions }: SectionProps,
) {
  return (
    <Box sx={{ mb: 4 }} data-testid={`hoshin-section-${label}`}>
      <Typography variant="h6" fontWeight={700} gutterBottom
        aria-label={label}>
        {label}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {rows.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {emptyMsg}
        </Typography>
      ) : (
        rows.map((r) => (
          <HoshinObjectiveRow key={r.objective.id} row={r}
            organisations={organisations}
            onDelete={actions.removeObjective}
            onLink={actions.addLink}
            onUnlink={actions.removeLink} />
        ))
      )}
    </Box>
  );
}

/** The full Hoshin Kanri X-matrix. */
export default function HoshinXMatrix() {
  const t = useTranslations('hoshin');
  const { vision, breakthrough, annual, organisations, isLoading } =
    useHoshinMatrix();
  const actions = useHoshinActions();

  if (isLoading) return null;
  const empty = t('noObjectives');
  const orgs = organisations ?? [];

  return (
    <Box data-testid="hoshin-xmatrix" aria-label={t('pageTitle')}>
      <HoshinObjectiveForm onAdd={actions.addObjective} />
      {actions.error && (
        <Typography role="alert" color="error" sx={{ mb: 2 }}>
          {actions.error}
        </Typography>
      )}
      {orgs.length === 0 && (
        <Typography variant="body2" color="text.secondary"
          data-testid="hoshin-no-companies" sx={{ mb: 3 }}>
          {t('noCompanies')}
        </Typography>
      )}
      <Section label={t('vision')} rows={vision} emptyMsg={empty}
        organisations={orgs} actions={actions} />
      <Section label={t('breakthrough')} rows={breakthrough}
        emptyMsg={empty} organisations={orgs} actions={actions} />
      <Section label={t('annual')} rows={annual} emptyMsg={empty}
        organisations={orgs} actions={actions} />
    </Box>
  );
}
