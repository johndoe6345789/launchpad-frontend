'use client';
/**
 * @file ZeltConnectionCard.tsx
 * @brief Zelt API key connection card with inline form.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardActions,
         Typography, Button, Chip,
         TextField } from '@shared/m3';
import { useTranslations } from 'next-intl';
import { useZeltStatusQuery, useZeltConnectMutation,
         useZeltDisconnectMutation }
  from '@/store/api/zeltApi';

/**
 * @brief Shows Zelt connection status and provides
 *        an API-key form to connect or disconnect.
 */
export default function ZeltConnectionCard() {
  const t = useTranslations('accounting');
  const [apiKey, setApiKey] = useState('');
  const { data, isLoading } = useZeltStatusQuery();
  const [connect, { isLoading: saving, error }] =
    useZeltConnectMutation();
  const [disconnect] = useZeltDisconnectMutation();
  const connected = data?.connected ?? false;

  return (
    <Card variant="outlined"
      data-testid="zelt-connection-card"
      aria-label={t('zelt.cardLabel')}>
      <CardContent>
        <Typography variant="h6" fontWeight={700}
          gutterBottom>
          {t('zelt.title')}
        </Typography>
        <Chip
          label={connected
            ? t('zelt.connected')
            : t('zelt.notConnected')}
          color={connected ? 'success' : 'default'}
          size="small"
          data-testid="zelt-status-chip"
        />
        {data?.demo && (
          <Typography variant="body2" sx={{ mt: 1 }}
            data-testid="zelt-demo-note">
            {t('demoNote')} {t('zelt.demoKey', { key: data.demoKey ?? '' })}
          </Typography>
        )}
        {error && (
          <Typography variant="body2" color="error"
            role="alert" sx={{ mt: 1 }}>
            {t('zelt.connectFailed')}
          </Typography>
        )}
        {!connected && (
          <TextField
            label={t('zelt.apiKeyLabel')}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            size="small" fullWidth sx={{ mt: 2 }}
            type="password"
            data-testid="zelt-api-key-input"
            aria-label={t('zelt.apiKeyLabel')}
          />
        )}
      </CardContent>
      <CardActions>
        {connected ? (
          <Button size="small" color="error"
            data-testid="zelt-disconnect-btn"
            onClick={() => disconnect()}>
            {t('zelt.disconnect')}
          </Button>
        ) : (
          <Button size="small" variant="contained"
            disabled={!apiKey || saving}
            data-testid="zelt-connect-btn"
            onClick={() => connect({ api_key: apiKey })}>
            {t('zelt.connect')}
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
