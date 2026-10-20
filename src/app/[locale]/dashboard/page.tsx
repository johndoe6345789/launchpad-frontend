import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import { Box, Typography } from '@shared/m3';
import nextDynamic from 'next/dynamic';

// Defer DashboardGrid compilation: its client-component
// transitive graph (@dnd-kit, widget map, charts, etc) is
// too large for Turbopack dev to compile inside the RSC
// stream window — eagerly importing it leaves the page's
// Suspense boundary pending forever.
const DashboardGrid = nextDynamic(
  () => import('@/components/organisms/DashboardGrid'),
  { loading: () => <div data-testid="dashboard-loading" /> },
);

const OnboardingCta = nextDynamic(
  () => import('@/components/molecules/OnboardingCta'),
  { loading: () => null },
);

const BeginnerHome = nextDynamic(
  () => import('@/components/organisms/guide/BeginnerHome'),
  { loading: () => null },
);

const AdvancedOnly = nextDynamic(
  () => import('@/components/organisms/guide/AdvancedOnly'),
  { loading: () => null },
);

/** Skip static prerendering for this page. */
export const dynamic = 'force-dynamic';
/** Props for the dashboard home page. */
interface DashboardPageProps {
  /** Route params containing the locale. */
  readonly params: Promise<{ locale: string }>;
}

/**
 * Dashboard home page with draggable widget grid.
 *
 * @param props - Page props with locale params.
 * @returns Dashboard overview UI.
 */
export default async function DashboardPage({
  params,
}: DashboardPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('dashboard');

  return (
    <Box aria-label={t('title')}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
      >
        {t('title')}
      </Typography>
      <BeginnerHome />
      <AdvancedOnly>
        <OnboardingCta />
        <DashboardGrid />
      </AdvancedOnly>
    </Box>
  );
}
