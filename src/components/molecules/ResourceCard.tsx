'use client';

import React from 'react';
import Card from '@shared/m3/Card';
import CardContent from '@shared/m3/CardContent';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Chip from '@shared/m3/Chip';
import { useTranslations } from 'next-intl';

/** A resource entry from resource-library.json. */
export interface ResourceEntry {
  id: string;
  category: string;
  title: string;
  desc: string;
  /** File format label e.g. DOCX, XLSX, PDF. */
  format: string;
  downloadUrl: string;
  tags: string[];
}

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '/app';

/** Props for ResourceCard. */
export interface ResourceCardProps {
  resource: ResourceEntry;
}

/**
 * MUI Card with title, description, category chip,
 * format label, and a download button.
 * @param props - Component props.
 * @returns Resource card element.
 */
export const ResourceCard: React.FC<
  ResourceCardProps
> = ({ resource }) => {
  const t = useTranslations('resources');
  return (
    <Card
      data-testid={`resource-card-${resource.id}`}
      aria-label={resource.title}
      sx={{ height: '100%', display: 'flex',
        flexDirection: 'column' }}
    >
      <CardContent sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start', mb: 1 }}>
          <Chip
            label={resource.category}
            size="small"
            color="primary"
            variant="outlined"
            aria-label={`Category: ${resource.category}`}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 600 }}
          >
            {resource.format}
          </Typography>
        </Box>
        <Typography
          variant="subtitle2"
          fontWeight={700}
          gutterBottom
        >
          {resource.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          {resource.desc}
        </Typography>
        <a
          href={`${BASE_PATH}${resource.downloadUrl}`}
          download
          aria-label={`${t('download')} ${resource.title}`}
          data-testid={`resource-download-${resource.id}`}
          style={{
            display: 'block', width: '100%',
            textAlign: 'center', padding: '6px 16px',
            border: '1px solid currentColor',
            borderRadius: 4, textDecoration: 'none',
            fontSize: '0.875rem', boxSizing: 'border-box',
          }}
        >
          {t('download')}
        </a>
      </CardContent>
    </Card>
  );
};

export default ResourceCard;
