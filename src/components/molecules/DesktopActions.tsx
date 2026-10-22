'use client';

import React, { useEffect, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { LocaleSwitcher } from './LocaleSwitcher';
import { SearchBar } from './SearchBar';
import s from '@shared/scss/modules/DesktopActions.module.scss';

/** Below this width the search box leaves the bar (it is in the menu). */
const SEARCH_MIN_WIDTH = 900;

/** A search box that keeps a sensible size and never crowds the bar. */
const SEARCH_STYLE: React.CSSProperties = {
  width: 'clamp(120px, 11vw, 170px)', minWidth: 0, flexShrink: 1,
};

/** True when the window is at least `px` wide (true before it is known). */
function useMinWidth(px: number): boolean {
  const [wide, setWide] = useState(true);
  useEffect(() => {
    const q = window.matchMedia(`(min-width: ${px}px)`);
    const update = () => setWide(q.matches);
    update();
    q.addEventListener('change', update);
    return () => q.removeEventListener('change', update);
  }, [px]);
  return wide;
}

/**
 * Desktop toolbar: search, theme toggle and
 * locale switcher. On mid-sized windows the search box is left out so
 * the business button keeps its room.
 */
export const DesktopActions: React.FC = () => {
  const showSearch = useMinWidth(SEARCH_MIN_WIDTH);
  return (
  <div
    className={s.root}
    data-testid="navbar-desktop-actions"
  >
    {showSearch && (
      <div className={s.search} style={SEARCH_STYLE}>
        <SearchBar />
      </div>
    )}
    <ThemeToggle />
    <div
      className={s.locale}
      data-testid="locale-pill"
    >
      <LocaleSwitcher />
    </div>
  </div>
  );
};

export default DesktopActions;
