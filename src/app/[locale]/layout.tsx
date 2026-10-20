import { ReactNode, type ReactElement } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { Box } from '@shared/m3';
import { IntlProvider } from
  '@/components/providers/IntlProvider';
import { AuthGate } from
  '@/components/providers/AuthGate';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { AdvancedOnly } from '@/components/organisms/guide/AdvancedOnly';
import { GuideLayer } from '@/components/organisms/guide/GuideLayer';
import { LinkAdapter } from
  '@/components/providers/LinkAdapter';
import { HtmlLang } from '@/components/atoms/HtmlLang';
import {
  AppShell, ShiftContent,
} from '@/components/organisms/AppShell';
import { DebugBar } from
  '@/components/molecules/DebugBar';
import { PwaRegister } from
  '@/components/atoms/PwaRegister';
import { DashboardShortcuts } from
  '@/components/organisms/DashboardShortcuts';
import { PwaHead } from './pwa-head';
import { loadMessages } from './loadMessages';
import ClientCookieBanner from
  '@/components/atoms/ClientCookieBanner';
import WelcomeBanner from
  '@/components/atoms/WelcomeBannerLazy';

/** All locale pages are dynamic. */
export const dynamic = 'force-dynamic';

/** Supported application locales. */
const LOCALES = [
  'en', 'es', 'fr', 'de',
  'ja', 'zh', 'nl', 'cy',
] as const;

/** Props for the locale layout. */
interface LocaleLayoutProps {
  readonly children: ReactNode;
  readonly params: Promise<{ locale: string }>;
}

/** @returns Static params for all locales. */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

/**
 * Locale-scoped layout wrapping children in providers.
 * @param props - Layout props with locale params.
 * @returns Locale-wrapped component tree.
 */
export default async function LocaleLayout({
  children, params,
}: LocaleLayoutProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await loadMessages(locale);

  return (
    <IntlProvider locale={locale} messages={messages}>
      <HtmlLang locale={locale} />
      <PwaHead />
      <PwaRegister />
      <LinkAdapter>
        <AppShell>
          <Navbar />
          <ShiftContent>
            <AuthGate>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1, minHeight: 0,
              }}>
                <DashboardShortcuts />
                <Box sx={{
                  flex: 1, p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 0, overflow: 'auto',
                }}>
                  <AdvancedOnly><WelcomeBanner /></AdvancedOnly>
                  {children}
                </Box>
              </Box>
            </AuthGate>
            <Footer />
          </ShiftContent>
        </AppShell>
        {process.env.NEXT_PUBLIC_DEBUG_BAR
          === '1' && <DebugBar />}
        <GuideLayer />
        <ClientCookieBanner />
      </LinkAdapter>
    </IntlProvider>
  );
}
