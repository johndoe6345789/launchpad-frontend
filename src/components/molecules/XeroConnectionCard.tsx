'use client';
/**
 * @file XeroConnectionCard.tsx
 * @brief Xero OAuth connection status card with
 *        connect/disconnect actions.
 */

import React from 'react';
import { Card, CardContent, CardActions,
         Typography, Button, Chip } from '@shared/m3';
import { useTranslations } from 'next-intl';
import { useXeroStatusQuery,
         useXeroConnectMutation,
         useXeroDisconnectMutation }
  from '@/store/api/xeroApi';

/**
 * @brief Shows Xero connection status and
 *        provides connect (OAuth redirect) / disconnect.
 */
export default function XeroConnectionCard() {
  const t = useTranslations('accounting');
  const { data, isLoading } = useXeroStatusQuery();
  const [disconnect] = useXeroDisconnectMutation();
  const [connectXero, { isLoading: starting, error }] =
    useXeroConnectMutation();
  const connected = data?.connected ?? false;

  // The sign-in is a full-page trip to Xero and back, started by an
  // authenticated request (a plain link cannot carry the login).
  const start = async () => {
    try {
      const { url } = await connectXero().unwrap();
      window.location.assign(url);
    } catch { /* shown below */ }
  };

  return (
    <Card variant="outlined"
      data-testid="xero-connection-card"
      aria-label={t('xero.cardLabel')}>
      <CardContent>
        <Typography variant="h6" fontWeight={700}
          gutterBottom>
          {t('xero.title')}
        </Typography>
        <Chip
          label={connected
            ? (data?.tenantName ?? t('xero.connected'))
            : t('xero.notConnected')}
          color={connected ? 'success' : 'default'}
          size="small"
          data-testid="xero-status-chip"
        />
        <Typography variant="body2"
          color="text.secondary" sx={{ mt: 1 }}>
          {t('xero.description')}
        </Typography>
        {data?.demo && (
          <Typography variant="body2" sx={{ mt: 1 }}
            data-testid="xero-demo-note">
            {t('demoNote')}
          </Typography>
        )}
        {data?.available === false && (
          <Typography variant="body2" color="error"
            sx={{ mt: 1 }}>
            {t('xero.unavailable')}
          </Typography>
        )}
        {error && (
          <Typography variant="body2" color="error"
            role="alert" sx={{ mt: 1 }}>
            {t('xero.connectFailed')}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        {connected ? (
          <Button size="small" color="error"
            data-testid="xero-disconnect-btn"
            onClick={() => disconnect()}>
            {t('xero.disconnect')}
          </Button>
        ) : (
          <Button size="small" variant="contained"
            data-testid="xero-connect-btn"
            disabled={starting || data?.available === false}
            onClick={() => void start()}>
            {t('xero.connect')}
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
