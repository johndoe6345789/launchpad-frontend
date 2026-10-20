import React from 'react';
import Image from 'next/image';
import { Box, Typography } from '@shared/m3';
import type { HelpFigureSpec } from './helpFigures';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '/app';

/** Props for one Help picture. */
export interface HelpFigureProps {
  readonly spec: HelpFigureSpec;
  readonly alt: string;
  readonly caption: string;
  /** Explains the numbered call-outs, in order. */
  readonly legend: readonly string[];
}

/**
 * A screenshot or diagram with its caption and, for annotated
 * screenshots, a numbered list that explains each call-out.
 */
export function HelpFigure(
  { spec, alt, caption, legend }: HelpFigureProps,
): React.ReactElement {
  return (
    <Box component="figure" data-testid={`help-figure-${spec.id}`}
      sx={{ m: 0, mb: 3 }}>
      <Image src={`${BASE_PATH}/help/${spec.src}`} alt={alt}
        width={spec.width} height={spec.height} unoptimized
        style={{
          width: '100%', height: 'auto', borderRadius: 8,
          border: '1px solid rgba(0,0,0,0.15)',
        }} />
      <Typography component="figcaption" variant="body2"
        color="text.secondary" sx={{ mt: 1 }}>
        {caption}
      </Typography>
      {legend.length > 0 && (
        <Box component="ol" sx={{
          mt: 1, mb: 0, pl: 3, listStyleType: 'decimal',
        }}>
          {legend.map((l) => (
            <li key={l}>
              <Typography variant="body2">{l}</Typography>
            </li>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default HelpFigure;
