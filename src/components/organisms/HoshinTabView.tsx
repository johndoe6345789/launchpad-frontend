'use client';

import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@shared/m3';
import { useTranslations } from 'next-intl';
import HoshinXMatrix
  from '@/components/organisms/HoshinXMatrix';
import BowlingChartTab
  from '@/components/organisms/BowlingChartTab';

/**
 * Client wrapper rendering the two Hoshin tabs:
 * X-Matrix and Bowling Chart.
 *
 * @returns Tabbed hoshin view.
 */
const HoshinTabView: React.FC = () => {
  const t = useTranslations('hoshin.tabs');
  const [tab, setTab] = useState(0);

  return (
    <Box data-testid="hoshin-tab-view">
      <Tabs value={tab}
        onChange={(_, v) => setTab(v as number)}
        aria-label="Hoshin Kanri tabs"
        style={{ marginBottom: 24 }}>
        <Tab value={0} label={t('xMatrix')}
          aria-label={t('xMatrix')}
          data-testid="hoshin-tab-xmatrix" />
        <Tab value={1} label={t('bowling')}
          aria-label={t('bowling')}
          data-testid="hoshin-tab-bowling" />
      </Tabs>
      {tab === 0 && <HoshinXMatrix />}
      {tab === 1 && <BowlingChartTab />}
    </Box>
  );
};

export default HoshinTabView;
