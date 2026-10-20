import type { ReactElement } from 'react';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Container } from '@shared/m3';
import HelpArticle from '@/components/organisms/help/HelpArticle';
import { findTopic } from '@/components/organisms/help/helpArticles';

/** Skip static prerendering — avoids manifest write races. */
export const dynamic = 'force-dynamic';

interface HelpArticlePageProps {
  readonly params: Promise<{ locale: string; slug: string }>;
}

/** One Help article. Unknown slugs are a 404. */
export default async function HelpArticlePage({
  params,
}: HelpArticlePageProps): Promise<ReactElement> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  if (!findTopic(slug)) notFound();

  return (
    <Container maxWidth="md" component="main" sx={{ py: 6 }}
      data-testid="help-article-page">
      <HelpArticle slug={slug} />
    </Container>
  );
}
