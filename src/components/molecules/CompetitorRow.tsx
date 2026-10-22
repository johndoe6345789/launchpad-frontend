'use client';

/**
 * Table row displaying a single competitor entry.
 * @module components/molecules/CompetitorRow
 */
import React from 'react';
import TableRow from '@shared/m3/TableRow';
import TableCell from '@shared/m3/TableCell';
import Chip from '@shared/m3/Chip';
import MuiIconButton from '@shared/m3/IconButton';
import { useTranslations } from 'next-intl';
import { websiteUrl } from '@/lib/websiteUrl';
import type { Competitor } from '@/types/marketResearch';

/** Props for CompetitorRow. */
export interface CompetitorRowProps {
  /** The competitor data to display. */
  readonly competitor: Competitor;
  /** Callback when the user clicks Edit. */
  readonly onEdit: (c: Competitor) => void;
  /** Callback when the user clicks Delete. */
  readonly onDelete: (id: string) => void;
}

/**
 * Single row in the competitor tracker table.
 *
 * @param props - CompetitorRowProps.
 * @returns A MUI TableRow for one competitor.
 */
export const CompetitorRow: React.FC<
  CompetitorRowProps
> = ({ competitor, onEdit, onDelete }) => {
  const t = useTranslations('marketResearch');
  const tc = useTranslations('common');
  const { id, name, website, stage,
    strengths, weaknesses } = competitor;
  const link = websiteUrl(website);

  return (
    <TableRow data-testid={`competitor-row-${id}`}>
      <TableCell>
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${name} website`}
            data-testid={`competitor-link-${id}`}
          >
            {name}
          </a>
        ) : (
          <span data-testid={`competitor-name-${id}`}>{name}</span>
        )}
      </TableCell>
      <TableCell>
        <Chip label={stage} size="small"
          data-testid={`competitor-stage-${id}`} />
      </TableCell>
      <TableCell>{strengths.length}</TableCell>
      <TableCell>{weaknesses.length}</TableCell>
      <TableCell>
        <MuiIconButton
          aria-label={t('editCompetitor')}
          data-testid={`competitor-edit-${id}`}
          onClick={() => onEdit(competitor)}
          size="small"
        >
          {tc('edit')}
        </MuiIconButton>
        <MuiIconButton
          aria-label={t('deleteCompetitor')}
          data-testid={`competitor-delete-${id}`}
          onClick={() => onDelete(id)}
          size="small"
        >
          {tc('delete')}
        </MuiIconButton>
      </TableCell>
    </TableRow>
  );
};

export default CompetitorRow;
