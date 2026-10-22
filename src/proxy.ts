import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { isProtectedPath } from './lib/protectedPaths';

const handleI18n = createMiddleware(routing);

/**
 * Next.js 16 proxy (replaces the deprecated middleware
 * convention). Runs the auth gate first, then delegates
 * to next-intl's locale detection and rewriting.
 *
 * Auth gate: redirects guests to /sso/login when they
 * hit a protected path. Cookie validity is verified by
 * the backend on first API call; the proxy only checks
 * presence to avoid a per-request round trip.
 *
 * @param request - The incoming server request.
 * @returns A response (redirect or i18n-rewritten).
 */
export function proxy(request: NextRequest) {
  const needsAuth = isProtectedPath(request.nextUrl.pathname);
  if (needsAuth && !request.cookies.has('businessplanner_sso')) {
    const next = encodeURIComponent(request.nextUrl.pathname);
    const base = request.nextUrl.basePath;
    return NextResponse.redirect(
      new URL(`${base}/en/login?next=${next}`, request.url),
    );
  }
  return handleI18n(request);
}

/** Routes the proxy should intercept. */
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api       (API routes)
     * - _next     (Next.js internals)
     * - _vercel   (Vercel internals)
     * - .*\\..*   (files with extensions e.g. favicon.ico)
     */
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
