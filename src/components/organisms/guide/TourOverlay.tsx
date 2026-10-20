'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useAppDispatch } from '@/store/hooks';
import { useGuideSelector } from './useGuideSelector';
import { endTour, setTourStep } from '@/store/slices/guideSlice';
import { starterProgress } from './guidePath';
import { TOURS, onStepPage, resolveTarget } from './guideTours';

const POPOVER_W = 340;
const FIND_FOR_MS = 3000;

/** Box on screen that the walkthrough is pointing at. */
interface Spot { top: number; left: number; width: number; height: number }

/** Where to put the popover so it stays on screen. */
function place(spot: Spot | null): React.CSSProperties {
  const vw = window.innerWidth;
  const w = Math.min(POPOVER_W, vw - 24);
  if (!spot) {
    return { top: '50%', left: '50%', width: w,
      transform: 'translate(-50%, -50%)' };
  }
  const below = spot.top + spot.height + 16;
  const fitsBelow = below + 220 < window.innerHeight;
  const left = Math.min(Math.max(12, spot.left), vw - w - 12);
  return fitsBelow
    ? { top: below, left, width: w }
    : { top: Math.max(12, spot.top - 16), left, width: w,
      transform: 'translateY(-100%)' };
}

/**
 * The walkthrough: dims the page, rings the thing to use next and
 * explains it in a small card. The ringed element stays clickable.
 */
export const TourOverlay: React.FC = () => {
  const t = useTranslations('guide');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { activeTour, tourStep } = useGuideSelector((s) => s.guide);
  const completed = useGuideSelector((s) => s.planner.completedSteps);
  const steps = activeTour ? TOURS[activeTour] : undefined;
  const step = steps?.[tourStep];
  const here = step ? onStepPage(step, pathname) : false;
  const nextId = starterProgress(completed).next?.id ?? null;
  const selector = step && here ? resolveTarget(step, nextId) : null;
  const [spot, setSpot] = useState<Spot | null>(null);

  const measure = useCallback((): boolean => {
    const el = selector ? document.querySelector(selector) : null;
    if (!el) return false;
    const r = el.getBoundingClientRect();
    setSpot({ top: r.top - 6, left: r.left - 6,
      width: r.width + 12, height: r.height + 12 });
    return true;
  }, [selector]);

  useEffect(() => {
    setSpot(null);
    if (!selector) return undefined;
    const started = Date.now();
    let scrolled = false;
    const timer = setInterval(() => {
      const el = document.querySelector(selector);
      if (el && !scrolled) {
        scrolled = true;
        el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
      if (el) measure();
      else if (Date.now() - started > FIND_FOR_MS) clearInterval(timer);
    }, 250);
    return () => clearInterval(timer);
  }, [selector, measure]);

  const close = useCallback(() => dispatch(endTour()), [dispatch]);

  useEffect(() => {
    if (!activeTour) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeTour, close]);

  if (!activeTour || !steps || !step) return null;
  const last = tourStep >= steps.length - 1;
  const go = (n: number) => dispatch(setTourStep(n));

  return (
    <>
      {spot ? (
        <div data-testid="tour-spot" aria-hidden="true" style={{
          position: 'fixed', zIndex: 2400, pointerEvents: 'none',
          top: spot.top, left: spot.left,
          width: spot.width, height: spot.height, borderRadius: 10,
          border: '3px solid #8000ff',
          boxShadow: '0 0 0 9999px rgba(20,10,40,0.55)',
          transition: 'all 200ms ease',
        }} />
      ) : (
        <div aria-hidden="true" style={{
          position: 'fixed', inset: 0, zIndex: 2400,
          background: 'rgba(20,10,40,0.55)',
        }} />
      )}
      <div role="dialog" aria-live="polite"
        aria-label={t(`tours.${activeTour}.${step.id}.title`)}
        data-testid="tour-card"
        style={{
          position: 'fixed', zIndex: 2401, boxSizing: 'border-box',
          padding: 16, borderRadius: 12, background: '#fff',
          color: '#1d1b20', boxShadow: '0 8px 30px rgba(0,0,0,0.35)',
          ...place(spot),
        }}>
        <div style={{ fontSize: 12, color: '#6a1b9a', fontWeight: 700 }}>
          {t('tourProgress', { n: tourStep + 1, total: steps.length })}
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, margin: '4px 0 6px' }}>
          {t(`tours.${activeTour}.${step.id}.title`)}
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.5 }}>
          {t(`tours.${activeTour}.${step.id}.body`)}
        </div>
        {!here && (
          <button type="button" data-testid="tour-goto"
            onClick={() => router.push(step.path)}
            style={BTN_PRIMARY}>
            {t('tourGoThere')}
          </button>
        )}
        <div style={{ display: 'flex', gap: 8, marginTop: 14,
          flexWrap: 'wrap', alignItems: 'center' }}>
          {tourStep > 0 && (
            <button type="button" onClick={() => go(tourStep - 1)}
              style={BTN}>{t('tourBack')}</button>
          )}
          <button type="button" data-testid="tour-next"
            onClick={() => (last ? close() : go(tourStep + 1))}
            style={{ ...BTN_PRIMARY, marginTop: 0 }}>
            {last ? t('tourDone') : t('tourNext')}
          </button>
          {!last && (
            <button type="button" data-testid="tour-skip" onClick={close}
              style={{ ...BTN, marginLeft: 'auto' }}>
              {t('tourSkip')}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

const BTN: React.CSSProperties = {
  padding: '8px 14px', borderRadius: 999, border: '1px solid #8000ff',
  background: '#fff', color: '#6a1b9a', fontWeight: 600, cursor: 'pointer',
  fontSize: 14,
};
const BTN_PRIMARY: React.CSSProperties = {
  ...BTN, background: '#8000ff', color: '#fff', marginTop: 10,
};

export default TourOverlay;
