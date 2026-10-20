'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  toggleStep,
  replaceSteps,
  resetPlan,
} from '@/store/slices/plannerSlice';
import {
  useGetPlannerProgressQuery,
  useSetPlannerStepMutation,
  useResetPlannerProgressMutation,
} from '@/store/api/plannerProgressApi';
import { useCompleteStepMutation } from '@/store/api/gamificationApi';
import roadmap from '@/constants/startup-roadmap.json';
import plannerConfig from '@/constants/planner.json';

/** Completion status of a roadmap phase. */
export type PhaseStatus =
  | 'todo'
  | 'started'
  | 'in-progress'
  | 'complete';

/** Per-phase progress summary. */
export interface PhaseProgress {
  id: string;
  done: number;
  total: number;
  /** Percentage 0–100. */
  pct: number;
  status: PhaseStatus;
}

/**
 * Determine the display status of a phase.
 * @param done - Completed step count.
 * @param total - Total steps in the phase.
 * @returns Phase display status.
 */
export function getPhaseStatus(done: number, total: number): PhaseStatus {
  if (done === 0) return 'todo';
  if (done >= total) return 'complete';
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const { caution } = plannerConfig.progressThresholds;
  return pct >= caution ? 'in-progress' : 'started';
}

/**
 * Hook providing planner progress state and actions.
 * When a step transitions from incomplete to complete the
 * gamification step-complete event is fired as a side effect;
 * the optimistic UI toggle is not blocked.
 *
 * @returns Completed steps, per-phase progress,
 *   overall percentage, toggle, and reset actions.
 */
export function usePlannerProgress() {
  const dispatch = useAppDispatch();
  const completedSteps = useAppSelector(
    (s) => s.planner.completedSteps,
  );
  const [completeStep] = useCompleteStepMutation();
  const { data: server } = useGetPlannerProgressQuery();
  const [saveStep] = useSetPlannerStepMutation();
  const [resetServer] = useResetPlannerProgressMutation();
  const businessKey = useAppSelector(
    (s) => s.business?.activeId ?? 'main',
  );
  const adoptedFor = useRef<string | null>(null);

  // Adopt the server's copy once per mount and per business. A user
  // whose server copy is empty but who has local ticks (from before
  // progress was stored server-side) migrates them up instead.
  useEffect(() => {
    if (!server || adoptedFor.current === businessKey) return;
    adoptedFor.current = businessKey;
    const remote = server.steps ?? {};
    if (Object.keys(remote).length === 0) {
      Object.keys(completedSteps)
        .filter((id) => completedSteps[id])
        .forEach((id) => {
          void saveStep({ id, completed: true });
        });
      return;
    }
    dispatch(replaceSteps(remote));
  }, [server, businessKey, completedSteps, dispatch, saveStep]);

  const toggle = useCallback(
    (stepId: string) => {
      const wasComplete = Boolean(completedSteps[stepId]);
      dispatch(toggleStep(stepId));
      void saveStep({ id: stepId, completed: !wasComplete })
        .unwrap()
        .then((r) => {
          if (r.completed && r.first_time) {
            void completeStep(stepId);
          }
        })
        .catch(() => undefined);
    },
    [dispatch, completedSteps, completeStep, saveStep],
  );

  const reset = useCallback(
    () => {
      dispatch(resetPlan());
      void resetServer();
    },
    [dispatch, resetServer],
  );

  const phases: PhaseProgress[] = roadmap.phases.map((phase) => {
    const done = phase.steps.filter(
      (s) => completedSteps[s.id],
    ).length;
    const total = phase.steps.length;
    return {
      id: phase.id,
      done,
      total,
      pct: total > 0 ? Math.round((done / total) * 100) : 0,
      status: getPhaseStatus(done, total),
    };
  });

  const totalDone = phases.reduce((s, p) => s + p.done, 0);
  const totalSteps = phases.reduce((s, p) => s + p.total, 0);

  const overallPct = totalSteps > 0
    ? Math.round((totalDone / totalSteps) * 100) : 0;
  return {
    completedSteps, phases, toggle, reset,
    overallPct, totalDone, totalSteps,
  };
}
