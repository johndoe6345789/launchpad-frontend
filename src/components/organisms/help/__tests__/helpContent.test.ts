import fs from 'fs';
import path from 'path';
import messages from '@/messages/en.json';
import { HELP_TOPICS, findTopic, sectionId } from '../helpArticles';
import { HELP_FIGURES, figuresFor } from '../helpFigures';

const help = messages.help as unknown as {
  articles: Record<string, {
    title: string; summary: string;
    sections: { heading: string; body: string[] }[];
  }>;
  figures: Record<string, {
    alt: string; caption: string; legend: string[];
  }>;
};
const publicDir = path.join(process.cwd(), 'public', 'help');

describe('help articles', () => {
  it.each(HELP_TOPICS.map((t) => t.slug))('%s has its text', (slug) => {
    const a = help.articles[slug];
    expect(a.title).toBeTruthy();
    expect(a.summary).toBeTruthy();
    expect(a.sections.length).toBeGreaterThan(0);
    for (const s of a.sections) {
      expect(s.heading).toBeTruthy();
      expect(s.body.length).toBeGreaterThan(0);
    }
  });

  it('has no text without a topic', () => {
    expect(Object.keys(help.articles).sort())
      .toEqual(HELP_TOPICS.map((t) => t.slug).sort());
  });

  it('only relates to topics that exist', () => {
    for (const t of HELP_TOPICS) {
      for (const r of t.related) expect(findTopic(r)).toBeDefined();
    }
  });

  it('gives each section heading a distinct anchor', () => {
    for (const a of Object.values(help.articles)) {
      const ids = a.sections.map((s) => sectionId(s.heading));
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});

describe('help figures', () => {
  it('has unique ids', () => {
    const ids = HELP_FIGURES.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(HELP_FIGURES.map((f) => [f.id, f] as const))(
    '%s points at a real section, file and caption', (id, f) => {
      const article = help.articles[f.slug];
      expect(article).toBeDefined();
      expect(f.afterSection).toBeLessThan(article.sections.length);
      expect(fs.existsSync(path.join(publicDir, f.src))).toBe(true);
      const text = help.figures[id];
      expect(text.alt).toBeTruthy();
      expect(text.caption).toBeTruthy();
    },
  );

  it('has no caption without a picture', () => {
    expect(Object.keys(help.figures).sort())
      .toEqual(HELP_FIGURES.map((f) => f.id).sort());
  });

  it('finds figures by article section', () => {
    expect(figuresFor('roadmap', 0).map((f) => f.id))
      .toEqual(['roadmap-phases']);
    expect(figuresFor('faq', 0)).toEqual([]);
  });
});
