'use client';

/**
 * @brief ViewModel for the BusinessModelCanvas organism.
 * @module hooks/useBusinessModelCanvas
 */
import { useState, useEffect } from 'react';
import { useGetBmcQuery }
  from '@/store/api/marketResearchBmcApi';
import { useBmcAutosave }
  from '@/hooks/useBmcAutosave';
import type { BmcCanvas } from '@/types/marketResearch';

const EMPTY: BmcCanvas = {
  problem: '', solution: '', uvp: '',
  channels: '', customerSegments: '',
  costStructure: '', revenueStreams: '',
  keyMetrics: '', unfairAdvantage: '',
};

type BmcKey = keyof BmcCanvas;

/**
 * Loads BMC data, owns local canvas state, and
 * delegates saves to the useBmcAutosave hook.
 *
 * @returns Canvas state and change/autosave handlers.
 */
export function useBusinessModelCanvas() {
  const { data, isLoading } = useGetBmcQuery(
    undefined, { refetchOnMountOrArgChange: true },
  );
  const { scheduleAutosave, flush } = useBmcAutosave();
  const [canvas, setCanvas] =
    useState<BmcCanvas>(EMPTY);

  useEffect(() => {
    if (data) setCanvas(data);
  }, [data]);

  const handleChange = (k: BmcKey, v: string) =>
    setCanvas((p) => ({ ...p, [k]: v }));

  return { canvas, isLoading, handleChange,
    scheduleAutosave, flushAutosave: flush };
}
