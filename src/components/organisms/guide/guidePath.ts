/**
 * Pure logic for the beginner path: the next roadmap step, which
 * menu links stay visible, and the idea risk score.
 * @module components/organisms/guide/guidePath
 */
import roadmap from '@/constants/startup-roadmap.json';
import path from '@/constants/beginner-path.json';

/** The step a beginner should do next. */
export interface NextStep {
  readonly id: string;
  readonly phaseId: string;
  /** Route of the page where the step is done. */
  readonly route: string;
}

/** Progress along the starter path. */
export interface StarterProgress {
  readonly next: NextStep | null;
  readonly done: number;
  readonly total: number;
}

const LATER: readonly string[] = path.laterPhases;
const ROUTES: Record<string, string> = path.stepRoutes;

/** Is this roadmap phase one that beginners can leave for later? */
export function isLaterPhase(phaseId: string): boolean {
  return LATER.includes(phaseId);
}

/** The roadmap steps a beginner sees, in order. */
export function starterSteps(): NextStep[] {
  return roadmap.phases
    .filter((p) => !isLaterPhase(p.id))
    .flatMap((p) => p.steps
      .filter((s) => !path.laterSteps.includes(s.id))
      .map((s) => ({
        id: s.id, phaseId: p.id, route: ROUTES[s.id] ?? '/planner',
      })));
}

/** Where the person is on the starter path. */
export function starterProgress(
  completed: Record<string, boolean>,
): StarterProgress {
  const steps = starterSteps();
  const next = steps.find((s) => !completed[s.id]) ?? null;
  return {
    next, total: steps.length,
    done: steps.filter((s) => completed[s.id]).length,
  };
}

/** Does the menu show this link to a beginner? */
export function isSimpleLink(href: string): boolean {
  return path.simpleNav.includes(href);
}

/** The idea risk questions, in order. */
export const IDEA_QUESTIONS: readonly string[] = path.ideaQuestions;

/** How an idea scored on the risk check. */
export interface IdeaVerdict {
  readonly level: 'unanswered' | 'risky' | 'mostly' | 'low';
  readonly yes: number;
  /** Questions answered "no", to fix first. */
  readonly weak: readonly string[];
}

/** Score the idea risk check. Every question must be answered. */
export function ideaVerdict(
  answers: Record<string, boolean>,
): IdeaVerdict {
  const answered = IDEA_QUESTIONS.filter((q) => q in answers);
  const yes = IDEA_QUESTIONS.filter((q) => answers[q]).length;
  const weak = IDEA_QUESTIONS.filter((q) => answers[q] === false);
  if (answered.length < IDEA_QUESTIONS.length) {
    return { level: 'unanswered', yes, weak };
  }
  const level = yes === IDEA_QUESTIONS.length ? 'low'
    : yes >= IDEA_QUESTIONS.length - 2 ? 'mostly' : 'risky';
  return { level, yes, weak };
}

/** Are all company-readiness items ticked? */
export function companyReady(ticks: Record<string, boolean>): boolean {
  return path.companyChecks.every((c) => ticks[c]);
}

export const COMPANY_CHECKS: readonly string[] = path.companyChecks;

/** Items to tick before taking the first customer. */
export const LAUNCH_CHECKS: readonly string[] = path.launchChecks;

/** Are all launch-readiness items ticked? */
export function launchReady(ticks: Record<string, boolean>): boolean {
  return path.launchChecks.every((c) => ticks[c]);
}
