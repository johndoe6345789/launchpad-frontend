/**
 * Walkthrough definitions. Text lives in messages `guide.tours`.
 * @module components/organisms/guide/guideTours
 */
import tours from '@/constants/guide-tours.json';

/** One step of a walkthrough. */
export interface TourStep {
  readonly id: string;
  /** Page the step belongs to (without locale). */
  readonly path: string;
  /** CSS selector to highlight; `{nextStep}` is the next roadmap step. */
  readonly target?: string;
}

export const TOURS: Record<string, readonly TourStep[]> = tours;

/** The walkthrough that explains a page, if there is one. */
export function tourForPath(pathname: string): string | null {
  for (const [id, steps] of Object.entries(TOURS)) {
    if (steps[0].path === pathname) return id;
  }
  return null;
}

/** Does the pathname belong to the step's page? */
export function onStepPage(step: TourStep, pathname: string): boolean {
  return pathname === step.path || pathname.startsWith(`${step.path}/`);
}

/** The selector for a step with `{nextStep}` filled in. */
export function resolveTarget(
  step: TourStep, nextStepId: string | null,
): string | null {
  if (!step.target) return null;
  if (step.target.includes('{nextStep}') && !nextStepId) return null;
  return step.target.replace('{nextStep}', nextStepId ?? '');
}
