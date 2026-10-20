/**
 * Pictures shown in Help articles. Alt text, captions and call-out
 * legends live in messages/en.json under `help.figures.<id>`.
 * @module components/organisms/help/helpFigures
 */
import figures from '@/constants/help-figures.json';

/** One picture and where it sits in an article. */
export interface HelpFigureSpec {
  readonly id: string;
  readonly slug: string;
  /** Zero-based index of the section the picture follows. */
  readonly afterSection: number;
  /** Path under /help in the public folder. */
  readonly src: string;
  readonly width: number;
  readonly height: number;
}

export const HELP_FIGURES: readonly HelpFigureSpec[] = figures;

/** Pictures for one section of one article. */
export function figuresFor(
  slug: string, section: number,
): readonly HelpFigureSpec[] {
  return HELP_FIGURES.filter(
    (f) => f.slug === slug && f.afterSection === section,
  );
}
