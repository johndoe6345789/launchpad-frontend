import type { ReactElement } from 'react';
import { setRequestLocale, getTranslations }
  from 'next-intl/server';
import { Container, Typography } from '@shared/m3';
import HelpIndex from '@/components/organisms/help/HelpIndex';

/** Skip static prerendering — avoids manifest write races. */
export const dynamic = 'force-dynamic';

interface HelpPageProps {
  readonly params: Promise<{ locale: string }>;
}

/** Help landing page: all topics. Open to guests. */
export default async function HelpPage({
  params,
}: HelpPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('help');

  return (
    <Container maxWidth="md" component="main"
      data-testid="help-page" sx={{ py: 6 }}>
      <Typography variant="h4" component="h1" fontWeight={800}
        gutterBottom>
        {t('title')}
      </Typography>
      <Typography variant="body1" color="text.secondary"
        sx={{ mb: 4 }}>
        {t('subtitle')}
      </Typography>
      <HelpIndex />
    </Container>
  );
}
