import fs from 'fs';
import path from 'path';

/**
 * Every request goes out exactly as written (the base URL is empty), so
 * a path without the /api/ prefix hits the site's 404 page. This once
 * left locale, preference, dashboard and user calls dead.
 */
const dir = path.join(process.cwd(), 'src', 'store', 'api');
const files = fs.readdirSync(dir).filter(
  (f) => f.endsWith('.ts') && !f.endsWith('.d.ts'),
);
const LITERAL = /(['"`])(\/[a-zA-Z][^'"`\s]*)\1/g;

describe('API paths', () => {
  it.each(files)('%s only calls /api/ paths', (file) => {
    const text = fs.readFileSync(path.join(dir, file), 'utf8');
    const bad: string[] = [];
    for (const line of text.split('\n')) {
      const t = line.trim();
      if (t.startsWith('*') || t.startsWith('//') || t.startsWith('import')) {
        continue;
      }
      for (const m of line.matchAll(LITERAL)) {
        if (!m[2].startsWith('/api/')) bad.push(m[2]);
      }
    }
    expect(bad).toEqual([]);
  });
});
