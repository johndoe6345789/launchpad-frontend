/**
 * Auto-save hook for the Business Model Canvas.
 * Saves 1 second after the last edit, and straight away when the
 * person leaves: another page, a blur, a hidden tab, a reload or
 * a closed tab. Typed text is never dropped by a pending timer.
 * @module hooks/useBmcAutosave
 */
import {
  useCallback, useContext, useEffect, useRef,
} from 'react';
import { ReactReduxContext } from 'react-redux';
import { useSaveBmcMutation }
  from '@/store/api/marketResearchBmcApi';
import apiConstants from '@/constants/api.json';
import { COOKIE, readCookie } from '@/lib/keycloakCookies';
import type { BmcCanvas } from '@/types/marketResearch';

/** Return type of useBmcAutosave. */
export interface BmcAutosaveResult {
  /** Schedules a save 1 second after the last call. */
  scheduleAutosave: (canvas: BmcCanvas) => void;
  /** Saves any pending edit now. Call on blur. */
  flush: () => void;
  /** True while a save request is in flight. */
  isSaving: boolean;
}

/**
 * Debounced auto-save for BmcCanvas with save-on-leave.
 *
 * @returns Object containing scheduleAutosave, flush and
 *   isSaving.
 */
export function useBmcAutosave(): BmcAutosaveResult {
  const [saveBmc, { isLoading: isSaving }] =
    useSaveBmcMutation();
  const store = useContext(ReactReduxContext)?.store;
  const timerRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const pendingRef = useRef<BmcCanvas | null>(null);

  const take = useCallback((): BmcCanvas | null => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const canvas = pendingRef.current;
    pendingRef.current = null;
    return canvas;
  }, []);

  const flush = useCallback(() => {
    const canvas = take();
    if (canvas) void saveBmc(canvas);
  }, [take, saveBmc]);

  const scheduleAutosave = useCallback(
    (canvas: BmcCanvas) => {
      pendingRef.current = canvas;
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(flush, 1000);
    },
    [flush],
  );

  // The page is going away (reload, closed tab, hidden tab): a
  // normal request could be cancelled, so send it as keepalive.
  const sendOnExit = useCallback(() => {
    const canvas = take();
    if (!canvas) return;
    const state = store?.getState() as {
      auth?: { accessToken?: string | null };
      business?: { activeId?: string | null };
    } | undefined;
    const token = readCookie(COOKIE.access)
      ?? state?.auth?.accessToken;
    const business = state?.business?.activeId;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) headers.Authorization = `Bearer ${token}`;
    if (business) headers['X-Business-Id'] = business;
    void fetch(apiConstants.marketResearch.bmc, {
      method: 'PUT',
      keepalive: true,
      headers,
      body: JSON.stringify(canvas),
    }).catch(() => undefined);
  }, [take, store]);

  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === 'hidden') sendOnExit();
    };
    window.addEventListener('pagehide', sendOnExit);
    document.addEventListener('visibilitychange', onHide);
    return () => {
      window.removeEventListener('pagehide', sendOnExit);
      document.removeEventListener('visibilitychange', onHide);
      flush();                    // leaving this page inside the app
    };
  }, [sendOnExit, flush]);

  return { scheduleAutosave, flush, isSaving };
}
