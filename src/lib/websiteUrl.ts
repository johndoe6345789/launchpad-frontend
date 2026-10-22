/**
 * Opening addresses typed by people.
 * @module lib/websiteUrl
 */
/**
 * A safe address to open for a competitor's website, or null when none
 * was given. A bare "example.com" gets https:// so it is not read as a
 * path on this site.
 */
export function websiteUrl(website: string | undefined): string | null {
  const w = (website ?? '').trim();
  if (!w) return null;
  const full = /^[a-z][a-z0-9+.-]*:/i.test(w) ? w : `https://${w}`;
  try {
    const u = new URL(full);
    return u.protocol === 'http:' || u.protocol === 'https:'
      ? u.toString() : null;
  } catch {
    return null;
  }
}
