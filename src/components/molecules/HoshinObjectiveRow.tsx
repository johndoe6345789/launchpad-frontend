'use client';
/**
 * @file HoshinObjectiveRow.tsx
 * @brief One row in the Hoshin X-matrix: an objective, its linked
 *        companies as strength chips, and controls to link or delete.
 */
import React, { useState } from 'react';
import { Box, Button, Typography } from '@shared/m3';
import { useTranslations } from 'next-intl';
import type { XMatrixRow } from '@/hooks/useHoshinMatrix';
import type { HoshinStrength } from '@/types/hoshin';
import type { Organisation } from '@/types/organisations';

const STRENGTHS: HoshinStrength[] = ['strong', 'medium', 'weak'];
const CHIP_COLOUR: Record<HoshinStrength, string> = {
  strong: '#c8f0d2', medium: '#ffe9b5', weak: '#e4e0ea',
};

/** Props for HoshinObjectiveRow. */
export interface HoshinObjectiveRowProps {
  /** A single objective row with linked organisations. */
  readonly row: XMatrixRow;
  /** Companies that can still be linked. */
  readonly organisations?: readonly Organisation[];
  readonly onDelete?: (id: string) => void;
  readonly onLink?: (
    objectiveId: string, organisationId: string, s: HoshinStrength,
  ) => void;
  readonly onUnlink?: (linkId: string) => void;
}

/** Renders one Hoshin objective with its company links. */
export default function HoshinObjectiveRow({
  row, organisations = [], onDelete, onLink, onUnlink,
}: HoshinObjectiveRowProps) {
  const t = useTranslations('hoshin');
  const { objective: obj, links } = row;
  const free = organisations.filter(
    (o) => !links.some((l) => l.org.id === o.id));
  const [org, setOrg] = useState('');
  const [strength, setStrength] = useState<HoshinStrength>('strong');

  return (
    <Box data-testid={`hoshin-row-${obj.id}`} sx={{
      p: 2, mb: 1, border: '1px solid', borderColor: 'divider',
      borderRadius: 2,
    }}>
      <Box sx={{
        display: 'flex', justifyContent: 'space-between', gap: 1,
      }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {obj.title}
        </Typography>
        {onDelete && (
          <Button size="small" color="error"
            data-testid={`hoshin-delete-${obj.id}`}
            aria-label={`${t('delete')}: ${obj.title}`}
            onClick={() => onDelete(obj.id)}>
            {t('delete')}
          </Button>
        )}
      </Box>
      {obj.description && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {obj.description}
        </Typography>
      )}
      {obj.target_date && (
        <Typography variant="caption" color="text.secondary"
          sx={{ display: 'block' }}>
          {t('target')}: {obj.target_date}
        </Typography>
      )}
      <Box aria-label={t('linkedStartups')} sx={{
        display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1,
      }}>
        {links.length === 0 && (
          <Typography variant="caption" color="text.secondary">
            {t('noLinks')}
          </Typography>
        )}
        {links.map(({ link, org: o }) => (
          <span key={link.id} data-testid={`link-chip-${link.id}`}
            aria-label={`${o.name} — ${t(`strength.${link.strength}`)}`}
            style={{
              background: CHIP_COLOUR[link.strength], borderRadius: 12,
              padding: '2px 4px 2px 10px', fontSize: 13, color: '#1d1b20',
            }}>
            {o.name}
            {onUnlink && (
              <button type="button" aria-label={t('unlink', { name: o.name })}
                data-testid={`link-remove-${link.id}`}
                onClick={() => onUnlink(link.id)}
                style={{ border: 'none', background: 'none', cursor: 'pointer',
                  marginLeft: 2, color: 'inherit' }}>
                ✕
              </button>
            )}
          </span>
        ))}
      </Box>
      {onLink && free.length > 0 && (
        <Box sx={{ display: 'flex', gap: 1, mt: 1.5, alignItems: 'center',
          flexWrap: 'wrap' }}>
          <select aria-label={t('companyLabel')} value={org}
            data-testid={`hoshin-link-org-${obj.id}`}
            onChange={(e) => setOrg(e.target.value)}
            style={SELECT}>
            <option value="">{t('pickCompany')}</option>
            {free.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
          <select aria-label={t('strengthLabel')} value={strength}
            data-testid={`hoshin-link-strength-${obj.id}`}
            onChange={(e) => setStrength(e.target.value as HoshinStrength)}
            style={SELECT}>
            {STRENGTHS.map((s) => (
              <option key={s} value={s}>{t(`strength.${s}`)}</option>
            ))}
          </select>
          <Button size="small" variant="outlined" disabled={!org}
            data-testid={`hoshin-link-add-${obj.id}`}
            onClick={() => { onLink(obj.id, org, strength); setOrg(''); }}>
            {t('link')}
          </Button>
        </Box>
      )}
    </Box>
  );
}

const SELECT: React.CSSProperties = {
  height: 32, padding: '0 8px', borderRadius: 4, font: 'inherit',
  border: '1px solid rgba(0,0,0,0.3)', background: 'transparent',
  color: 'inherit',
};
