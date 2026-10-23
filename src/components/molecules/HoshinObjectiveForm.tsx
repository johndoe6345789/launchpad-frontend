'use client';
/**
 * @file HoshinObjectiveForm.tsx
 * @brief Form to add an objective to the X-matrix.
 */
import React, { useState } from 'react';
import { Box, Button, TextField } from '@shared/m3';
import { useTranslations } from 'next-intl';
import type {
  CreateObjectiveInput, HoshinHorizon,
} from '@/types/hoshin';

const HORIZONS: HoshinHorizon[] = ['vision', 'breakthrough', 'annual'];

/** Props for HoshinObjectiveForm. */
export interface HoshinObjectiveFormProps {
  /** Save the objective; resolves true when it saved. */
  readonly onAdd: (input: CreateObjectiveInput) => Promise<boolean>;
}

/** Title, horizon, optional description and target date. */
export const HoshinObjectiveForm: React.FC<HoshinObjectiveFormProps> = (
  { onAdd },
) => {
  const t = useTranslations('hoshin');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [horizon, setHorizon] = useState<HoshinHorizon>('annual');
  const [date, setDate] = useState('');

  const submit = async () => {
    if (!title.trim()) return;
    const ok = await onAdd({
      title: title.trim(), description: description.trim(), horizon,
      ...(date ? { target_date: date } : {}),
    });
    if (ok) { setTitle(''); setDescription(''); setDate(''); }
  };

  return (
    <Box data-testid="hoshin-add-form" sx={{
      display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'flex-end',
      mb: 4, p: 2, border: '1px solid', borderColor: 'divider',
      borderRadius: 2,
    }}>
      <TextField size="small" label={t('titleLabel')} value={title}
        data-testid="hoshin-title-input"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setTitle(e.target.value)}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter') void submit();
        }} />
      <label style={{ display: 'flex', flexDirection: 'column', fontSize: 12 }}>
        {t('horizonLabel')}
        <select value={horizon} data-testid="hoshin-horizon-select"
          onChange={(e) => setHorizon(e.target.value as HoshinHorizon)}
          style={FIELD}>
          {HORIZONS.map((h) => (
            <option key={h} value={h}>{t(h)}</option>
          ))}
        </select>
      </label>
      <label style={{ display: 'flex', flexDirection: 'column', fontSize: 12 }}>
        {t('targetDateLabel')}
        <input type="date" value={date} data-testid="hoshin-date-input"
          onChange={(e) => setDate(e.target.value)} style={FIELD} />
      </label>
      <TextField size="small" label={t('descriptionLabel')}
        value={description} data-testid="hoshin-description-input"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setDescription(e.target.value)} />
      <Button variant="contained" disabled={!title.trim()}
        data-testid="hoshin-add-btn" onClick={() => void submit()}>
        {t('addObjective')}
      </Button>
    </Box>
  );
};

const FIELD: React.CSSProperties = {
  height: 36, padding: '0 8px', borderRadius: 4, marginTop: 2,
  border: '1px solid rgba(0,0,0,0.3)', background: 'transparent',
  color: 'inherit', font: 'inherit',
};

export default HoshinObjectiveForm;
