/**
 * The Help topics, in the order they are listed. Their text lives in
 * messages/en.json under `help.articles.<slug>`.
 * @module components/organisms/help/helpArticles
 */
import articles from '@/constants/help-articles.json';

/** One help topic's place in the list. */
export interface HelpTopic {
  readonly slug: string;
  /** Slugs of topics worth reading next. */
  readonly related: readonly string[];
}

export const HELP_TOPICS: readonly HelpTopic[] = articles;

/** The topic for a slug, or undefined when there is none. */
export function findTopic(slug: string): HelpTopic | undefined {
  return HELP_TOPICS.find((t) => t.slug === slug);
}

/** One section of an article as stored in the messages. */
export interface HelpSection {
  readonly heading: string;
  readonly body: readonly string[];
}

/** Id for a section heading, used for the "on this page" links. */
export function sectionId(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
