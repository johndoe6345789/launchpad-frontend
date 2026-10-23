import { isProtectedPath, stripLocale } from '../protectedPaths';

describe('protected paths', () => {
  it('strips the locale', () => {
    expect(stripLocale('/en/pivots')).toBe('/pivots');
    expect(stripLocale('/en-GB/kpi')).toBe('/kpi');
    expect(stripLocale('/en')).toBe('/');
  });

  it.each([
    '/en/pivots', '/en/kpi', '/en/okr', '/en/hoshin', '/en/planner',
    '/en/dashboard', '/en/risk-assessment', '/en/market-research/canvas',
    '/en/financials/burn', '/en/accounting', '/en/settings',
    '/en/profile', '/en/admin/moderation', '/pivots',
  ])('%s needs a signed-in person', (p) => {
    expect(isProtectedPath(p)).toBe(true);
  });

  it.each([
    '/en', '/en/login', '/en/register', '/en/forgot-password',
    '/en/about', '/en/contact', '/en/privacy', '/en/terms',
    '/en/help', '/en/help/getting-started', '/en/offline',
  ])('%s is open to guests', (p) => {
    expect(isProtectedPath(p)).toBe(false);
  });

  it('does not catch look-alike names', () => {
    expect(isProtectedPath('/en/pivotsx')).toBe(false);
    expect(isProtectedPath('/en/kpis')).toBe(false);
  });
});
