'use client';

/**
 * @file SettingsLeaderboardPrefs.tsx
 * @brief Choose whether you appear on the public leaderboard.
 */
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Switch } from '@shared/m3';
import Typography from '@shared/m3/Typography';
import { SettingsCard, SettingsRow } from './SettingsCard';
import {
  useGetAccountPrefsQuery, useSetAccountPrefsMutation,
} from '@/store/api/accountPrefsApi';

/**
 * Leaderboard card shown in Settings. Turning it off removes you
 * from the ranked list; your points and badges are kept.
 *
 * @returns Leaderboard settings card.
 */
const SettingsLeaderboardPrefs: React.FC = () => {
  const t = useTranslations('settings');
  const { data } = useGetAccountPrefsQuery();
  const [save, { isLoading }] = useSetAccountPrefsMutation();
  const [failed, setFailed] = useState(false);
  const optedIn = data?.leaderboardOptIn ?? true;

  const handleToggle = () => {
    setFailed(false);
    save({ leaderboardOptIn: !optedIn }).unwrap()
      .catch(() => setFailed(true));
  };

  return (
    <SettingsCard testId="settings-leaderboard-prefs">
      <Typography
        variant="subtitle1" gutterBottom
        style={{ fontWeight: 600 }}
      >
        {t('leaderboardTitle')}
      </Typography>
      <SettingsRow label={t('leaderboardLabel')}>
        <Switch
          checked={optedIn}
          disabled={!data || isLoading}
          onChange={handleToggle}
          aria-label={t('leaderboardLabel')}
          data-testid="leaderboard-opt-in-toggle"
        />
      </SettingsRow>
      <Typography variant="body2" color="text.secondary">
        {t('leaderboardHint')}
      </Typography>
      {failed && (
        <Typography role="alert" variant="body2" color="error">
          {t('prefsSaveFailed')}
        </Typography>
      )}
    </SettingsCard>
  );
};

export default SettingsLeaderboardPrefs;
