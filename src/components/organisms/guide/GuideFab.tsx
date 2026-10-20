'use client';

import React, { useEffect, useState } from 'react';
import { COOKIE, readCookie } from '@/lib/keycloakCookies';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { useAppDispatch } from '@/store/hooks';
import { useGuideSelector } from './useGuideSelector';
import { startTour } from '@/store/slices/guideSlice';
import { tourForPath } from './guideTours';

/** A "Help me" button on every page: replay the tour or get help. */
export const GuideFab: React.FC = () => {
  const t = useTranslations('guide');
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => { setSignedIn(!!readCookie(COOKIE.access)); }, [pathname]);
  const touring = useGuideSelector((s) => s.guide.activeTour !== null);
  const [open, setOpen] = useState(false);
  const [lift, setLift] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      const banner = document.querySelector(
        '[data-testid="cookie-consent-banner"]',
      ) as HTMLElement | null;
      setLift(banner ? banner.offsetHeight : 0);
    }, 500);
    return () => clearInterval(id);
  }, []);
  if (!signedIn || touring) return null;
  const pageTour = tourForPath(pathname);
  const run = (id: string) => { setOpen(false); dispatch(startTour(id)); };

  return (
    <div style={{ position: 'fixed', right: 16, bottom: 16 + lift, zIndex: 1300,
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
      gap: 8 }}>
      {open && (
        <div role="menu" data-testid="guide-menu" style={{
          background: '#fff', color: '#1d1b20', borderRadius: 12,
          boxShadow: '0 6px 24px rgba(0,0,0,0.3)', padding: 8,
          display: 'flex', flexDirection: 'column', minWidth: 220 }}>
          <button type="button" role="menuitem" style={ITEM}
            data-testid="guide-tour-welcome"
            onClick={() => run('welcome')}>{t('fabAround')}</button>
          {pageTour && (
            <button type="button" role="menuitem" style={ITEM}
              data-testid="guide-tour-page"
              onClick={() => run(pageTour)}>{t('fabPage')}</button>
          )}
          <Link href="/help" role="menuitem" style={ITEM}
            onClick={() => setOpen(false)}>{t('fabHelp')}</Link>
        </div>
      )}
      <button type="button" data-tour="guide-fab" data-testid="guide-fab"
        aria-expanded={open} aria-label={t('fabLabel')}
        onClick={() => setOpen((o) => !o)} style={{
          padding: '12px 18px', borderRadius: 999, border: 'none',
          background: '#8000ff', color: '#fff', fontWeight: 700,
          fontSize: 15, cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(0,0,0,0.35)' }}>
        ? {t('fabLabel')}
      </button>
    </div>
  );
};

const ITEM: React.CSSProperties = {
  textAlign: 'left', padding: '10px 12px', border: 'none',
  background: 'transparent', cursor: 'pointer', fontSize: 15,
  color: '#1d1b20', textDecoration: 'none', borderRadius: 8,
};

export default GuideFab;
