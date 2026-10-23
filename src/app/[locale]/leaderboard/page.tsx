import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import { Box, Typography } from '@shared/m3';
import nextDynamic from 'next/dynamic';

/** Skip static prerendering — data is live. */
export const dynamic = 'force-dynamic';

const LeaderboardTable = nextDynamic(
  () => import(
    '@/components/organisms/LeaderboardTable'
  ),
  {
    loading: () => (
      <div data-testid="leaderboard-loading" />
    ),
  },
);

/** Props for the leaderboard page. */
interface LeaderboardPageProps {
  /** Route params containing the locale. */
  readonly params: Promise<{ locale: string }>;
}

/**
 * Leaderboard page — ranked player table with
 * period filter tabs.
 *
 * @param props - Page props with locale params.
 * @returns Leaderboard UI.
 */
export default async function LeaderboardPage({
  params,
}: LeaderboardPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('gamification');

  return (
    <Box aria-label={t('leaderboard')}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
      >
        {t('leaderboard')}
      </Typography>
      <LeaderboardTable />
    </Box>
  );
}
