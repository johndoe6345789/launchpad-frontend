'use client';

/**
 * @file SettingsEmailPrefs.tsx
 * @brief Email preferences section: a switch for the welcome and
 *        re-engagement emails, saved on the server.
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
 * Email preferences card shown in Settings. The switch shows what
 * is saved and can be turned back on as well as off.
 *
 * @returns Email preferences settings card.
 */
const SettingsEmailPrefs: React.FC = () => {
  const t = useTranslations('settings');
  const { data } = useGetAccountPrefsQuery();
  const [save, { isLoading }] = useSetAccountPrefsMutation();
  const [failed, setFailed] = useState(false);
  const subscribed = data?.emailSequences ?? true;

  const handleToggle = () => {
    setFailed(false);
    save({ emailSequences: !subscribed }).unwrap()
      .catch(() => setFailed(true));
  };

  return (
    <SettingsCard testId="settings-email-prefs">
      <Typography
        variant="subtitle1" gutterBottom
        style={{ fontWeight: 600 }}
      >
        {t('emailPrefsTitle')}
      </Typography>
      <SettingsRow label={t('emailDripLabel')}>
        <Switch
          checked={subscribed}
          disabled={!data || isLoading}
          onChange={handleToggle}
          aria-label={t('emailDripLabel')}
          data-testid="email-drip-toggle"
        />
      </SettingsRow>
      {failed && (
        <Typography role="alert" variant="body2" color="error">
          {t('prefsSaveFailed')}
        </Typography>
      )}
    </SettingsCard>
  );
};

export default SettingsEmailPrefs;
