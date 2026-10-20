'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Box, Typography } from '@shared/m3';
import { Link } from '@/i18n/navigation';
import { useAppDispatch } from '@/store/hooks';
import { useGuideSelector } from './useGuideSelector';
import { setCompanyReady } from '@/store/slices/guideSlice';
import { COMPANY_CHECKS, companyReady } from './guidePath';

/**
 * "Do I need a limited company?" Says not yet, and gives three things
 * that should all be true before looking into it.
 */
export const CompanyGateCard: React.FC = () => {
  const t = useTranslations('guide');
  const dispatch = useAppDispatch();
  const ticks = useGuideSelector((s) => s.guide.companyReady);
  const ready = companyReady(ticks);

  return (
    <Box data-tour="company-gate" data-testid="company-gate" sx={{
      border: '1px solid', borderColor: 'divider', borderRadius: 3,
      p: 3, mb: 3,
    }}>
      <Typography variant="h6" component="h2" fontWeight={700}
        gutterBottom>
        {t('companyTitle')}
      </Typography>
      <Typography variant="body1" sx={{ mb: 1.5, lineHeight: 1.6 }}>
        {t('companyBody')}
      </Typography>
      <Typography variant="subtitle2" fontWeight={700}>
        {t('companyChecksTitle')}
      </Typography>
      <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mb: 1.5 }}>
        {COMPANY_CHECKS.map((c) => (
          <li key={c}>
            <label style={{ display: 'flex', gap: 8, padding: '4px 0',
              cursor: 'pointer', alignItems: 'flex-start' }}>
              <input type="checkbox" checked={!!ticks[c]}
                data-testid={`company-check-${c}`}
                onChange={(e) => dispatch(setCompanyReady(
                  { id: c, value: e.target.checked }))}
                style={{ width: 18, height: 18, marginTop: 2,
                  accentColor: '#8000ff' }} />
              <span>{t(`companyChecks.${c}`)}</span>
            </label>
          </li>
        ))}
      </Box>
      <Typography role="status" variant="body2" fontWeight={600}
        data-testid="company-verdict"
        color={ready ? 'success.main' : 'text.secondary'}>
        {ready ? t('companyReady') : t('companyNotYet')}
      </Typography>
      <Link href="/help/sole-trader">{t('companyLearn')}</Link>
    </Box>
  );
};

export default CompanyGateCard;
