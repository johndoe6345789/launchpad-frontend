/**
 * @file rawBaseQuery.ts
 * @brief Bare fetchBaseQuery with Authorization
 *        header injection from Redux auth state.
 */
import { fetchBaseQuery } from
  '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';
import {
  COOKIE, readCookie,
} from '@/lib/keycloakCookies';

// All api.json constants carry the full /api/... path,
// so baseUrl must be '' to avoid doubling the prefix.
// fetchBaseQuery joins baseUrl + url with a slash, turning
// baseUrl='/api' + url='/api/foo' into /api/api/foo.
const API_BASE = '';

/** Hard cap on any single API request. Beyond this
 *  the user almost certainly wants to retry rather
 *  than keep waiting on a wedged response — better
 *  to surface an error than spin forever. */
const REQUEST_TIMEOUT_MS = 30_000;

/**
 * Raw fetchBaseQuery that attaches the access token
 * from Redux state as a Bearer Authorization header
 * and aborts requests that exceed the timeout.
 */
export const rawBaseQuery = fetchBaseQuery({
  baseUrl:
    process.env.NEXT_PUBLIC_API_URL ?? API_BASE,
  timeout: REQUEST_TIMEOUT_MS,
  prepareHeaders: (headers, { getState }) => {
    // Keycloak access token (businessplanner_sso cookie) is the
    // primary auth source. Fall back to the legacy Redux
    // access token only when the Keycloak cookie is
    // absent — the in-house auth path remains a viable
    // fallback per template policy.
    const token =
      readCookie(COOKIE.access)
      ?? (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set(
        'Authorization', `Bearer ${token}`,
      );
    }
    // Which business the planning tools are working on (none = the
    // main one). Other services ignore the header.
    const business =
      (getState() as RootState).business?.activeId;
    if (business) headers.set('X-Business-Id', business);
    return headers;
  },
});
