/**
 * Which pages need a signed-in person. Guests who open one are sent to
 * the login page and returned afterwards (see proxy.ts).
 * @module lib/protectedPaths
 */

/** Top-level sections (after the locale) that are private. */
const PRIVATE_SECTIONS = [
  'admin', 'profile', 'settings', 'notifications', 'messages',
  'dashboard', 'planner', 'onboarding', 'milestones', 'review', 'launch',
  'market-research', 'decisions', 'scoping', 'financials', 'accounting',
  'hoshin', 'okr', 'kpi', 'pdca', 'risk-assessment', 'risk-report',
  'pivots', 'startup-compare', 'companies', 'accelerators',
];

const PROTECTED: RegExp[] = [
  ...PRIVATE_SECTIONS.map((s) => new RegExp(`^/${s}(/|$)`)),
  /^\/shop\/checkout(\/|$)/,
];

/** Strip the leading /xx or /xx-XX locale segment. */
export function stripLocale(p: string): string {
  return p.replace(/^\/[a-z]{2}(?:-[A-Z]{2})?(?=\/|$)/, '') || '/';
}

/**
 * Does this path (with or without a locale prefix) need a signed-in
 * person?
 */
export function isProtectedPath(pathname: string): boolean {
  const path = stripLocale(pathname);
  return PROTECTED.some((re) => re.test(path));
}
