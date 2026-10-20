'use client';

import React, { useMemo, useState } from 'react';
import { Box, Card, CardContent, Typography, TextField }
  from '@shared/m3';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { HELP_TOPICS } from './helpArticles';

/** The Help landing page: every topic as a card, with a search box. */
export const HelpIndex: React.FC = () => {
  const t = useTranslations('help');
  const [query, setQuery] = useState('');

  const topics = useMemo(() => {
    const q = query.trim().toLowerCase();
    return HELP_TOPICS.map((topic) => ({
      slug: topic.slug,
      title: t(`articles.${topic.slug}.title`),
      summary: t(`articles.${topic.slug}.summary`),
    })).filter((x) => !q
      || `${x.title} ${x.summary}`.toLowerCase().includes(q));
  }, [query, t]);

  return (
    <Box data-testid="help-index">
      <TextField
        fullWidth size="small" value={query}
        label={t('searchLabel')}
        placeholder={t('searchPlaceholder')}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setQuery(e.target.value)}
        sx={{ mb: 3 }}
        data-testid="help-search"
      />
      {topics.length === 0 && (
        <Typography role="status" color="text.secondary">
          {t('noResults')}
        </Typography>
      )}
      <Box sx={{
        display: 'grid', gap: 2,
        gridTemplateColumns: {
          xs: '1fr', sm: 'repeat(2, 1fr)',
        },
      }}>
        {topics.map((x) => (
          <Link key={x.slug} href={`/help/${x.slug}`}
            style={{ textDecoration: 'none' }}
            data-testid={`help-card-${x.slug}`}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" component="h2"
                  fontWeight={700} gutterBottom>
                  {x.title}
                </Typography>
                <Typography variant="body2"
                  color="text.secondary">
                  {x.summary}
                </Typography>
              </CardContent>
            </Card>
          </Link>
        ))}
      </Box>
    </Box>
  );
};

export default HelpIndex;
