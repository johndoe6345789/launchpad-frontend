'use client';

import { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store/store';
import { guideInitialState } from '@/store/slices/guideSlice';

/** What the server renders: nothing saved yet. */
const SERVER_STATE = {
  guide: guideInitialState,
  planner: { completedSteps: {} },
} as unknown as RootState;

/**
 * Like `useAppSelector`, but returns the default (empty) value until
 * the component has mounted. Saved guide state lives in localStorage,
 * so reading it on the first render would not match the server HTML.
 */
export function useGuideSelector<T>(select: (s: RootState) => T): T {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const live = useAppSelector(select);
  return mounted ? live : select(SERVER_STATE);
}
