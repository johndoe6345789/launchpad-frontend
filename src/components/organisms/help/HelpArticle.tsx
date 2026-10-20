import React from 'react';
import { Box, Typography } from '@shared/m3';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import {
  findTopic, sectionId, type HelpSection,
} from './helpArticles';
import { figuresFor } from './helpFigures';
import { HelpFigure } from './HelpFigure';

/** Props for one Help article. */
export interface HelpArticleProps {
  readonly slug: string;
}

/**
 * One Help article: title, summary, a contents list, the sections and
 * links to related topics. Text comes from messages `help.articles`.
 */
export async function HelpArticle(
  { slug }: HelpArticleProps,
): Promise<React.ReactElement | null> {
  const topic = findTopic(slug);
  if (!topic) return null;
  const t = await getTranslations('help');
  const sections = t.raw(
    `articles.${slug}.sections`,
  ) as HelpSection[];

  return (
    <Box component="article" data-testid={`help-article-${slug}`}>
      <Link href="/help" data-testid="help-back">
        {t('back')}
      </Link>
      <Typography variant="h4" component="h1" fontWeight={800}
        sx={{ mt: 2 }} gutterBottom>
        {t(`articles.${slug}.title`)}
      </Typography>
      <Typography variant="body1" color="text.secondary"
        sx={{ mb: 3 }}>
        {t(`articles.${slug}.summary`)}
      </Typography>
      <Box component="nav" aria-label={t('onThisPage')}
        sx={{ mb: 4 }}>
        <Typography variant="subtitle2" fontWeight={700}>
          {t('onThisPage')}
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3 }}>
          {sections.map((s) => (
            <li key={s.heading}>
              <a href={`#${sectionId(s.heading)}`}>{s.heading}</a>
            </li>
          ))}
        </Box>
      </Box>
      {sections.map((s, i) => (
        <Box component="section" key={s.heading} sx={{ mb: 4 }}>
          <Typography variant="h6" component="h2" fontWeight={700}
            id={sectionId(s.heading)} gutterBottom>
            {s.heading}
          </Typography>
          {s.body.map((p) => (
            <Typography key={p} variant="body1"
              sx={{ mb: 1.5, lineHeight: 1.7 }}>
              {p}
            </Typography>
          ))}
          {figuresFor(slug, i).map((f) => (
            <HelpFigure key={f.id} spec={f}
              alt={t(`figures.${f.id}.alt`)}
              caption={t(`figures.${f.id}.caption`)}
              legend={t.raw(`figures.${f.id}.legend`) as string[]} />
          ))}
        </Box>
      ))}
      {topic.related.length > 0 && (
        <Box component="aside" sx={{ mt: 6 }}>
          <Typography variant="h6" component="h2" fontWeight={700}
            gutterBottom>
            {t('related')}
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 3 }}>
            {topic.related.map((r) => (
              <li key={r}>
                <Link href={`/help/${r}`}>
                  {t(`articles.${r}.title`)}
                </Link>
              </li>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default HelpArticle;
