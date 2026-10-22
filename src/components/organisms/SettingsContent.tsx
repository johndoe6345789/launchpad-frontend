'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks';
import { usePermission } from '@/hooks/usePermission';
import {
  SettingsCard, SettingsRow,
} from './SettingsCard';
import SettingsAdminCard from './SettingsAdminCard';
import SettingsPreferences from './SettingsPreferences';
import SettingsEmailPrefs from './SettingsEmailPrefs';
import SettingsLeaderboardPrefs from './SettingsLeaderboardPrefs';
import SettingsMentor from
  '@/components/molecules/SettingsMentor';

/**
 * Settings page with account, appearance,
 * language, and admin sections.
 */
const SettingsContent: React.FC = () => {
  const t = useTranslations('settings');
  const { user } = useAuth();
  const { isAdmin } = usePermission();

  return (
    <Box
      style={{ maxWidth: 600 }}
      data-testid="settings-content"
    >
      <SettingsCard testId="settings-account">
        <Typography
          variant="subtitle1" gutterBottom
          style={{ fontWeight: 600 }}
        >
          {t('account')}
        </Typography>
        <SettingsRow label={t('email')}>
          <Typography variant="body2">
            {user?.email ?? '—'}
          </Typography>
        </SettingsRow>
        <SettingsRow label={t('username')}>
          <Typography variant="body2">
            {user?.username ?? '—'}
          </Typography>
        </SettingsRow>
        <SettingsRow label={t('displayName')}>
          <Typography variant="body2">
            {user?.displayName ?? '—'}
          </Typography>
        </SettingsRow>
        <SettingsRow label={t('role')}>
          <Typography
            variant="body2"
            style={{
              textTransform: 'capitalize',
            }}
          >
            {user?.role ?? '—'}
          </Typography>
        </SettingsRow>
      </SettingsCard>

      <SettingsPreferences />
      <SettingsEmailPrefs />
      <SettingsLeaderboardPrefs />
      <SettingsMentor />
      {isAdmin && <SettingsAdminCard />}
    </Box>
  );
};

export default SettingsContent;
