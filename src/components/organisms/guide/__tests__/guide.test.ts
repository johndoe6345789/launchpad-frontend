import messages from '@/messages/en.json';
import roadmap from '@/constants/startup-roadmap.json';
import reducer, {
  guideInitialState, setAdvanced, startTour, setTourStep, endTour,
  setLaunchReady, setIdeaAnswer, resetIdeaCheck,
} from '@/store/slices/guideSlice';
import {
  starterSteps, starterProgress, isSimpleLink, isLaterPhase,
  ideaVerdict, IDEA_QUESTIONS, companyReady, COMPANY_CHECKS,
  launchReady, LAUNCH_CHECKS,
} from '../guidePath';
import {
  TOURS, tourForPath, onStepPage, resolveTarget,
} from '../guideTours';

type Text = Record<string, Record<string, Record<string, string>>>;
const guide = messages.guide as unknown as Text & {
  tours: Record<string, Record<string, { title: string; body: string }>>;
};
const planner = messages.planner as unknown as {
  steps: Record<string, { title: string }>;
};

describe('starter path', () => {
  it('leaves out company, tax and accounting phases', () => {
    const phases = new Set(starterSteps().map((s) => s.phaseId));
    expect(phases.has('legal')).toBe(false);
    expect(phases.has('finance')).toBe(false);
    expect(isLaterPhase('legal')).toBe(true);
    expect(isLaterPhase('validate')).toBe(false);
  });

  it('never puts registering a company on the path', () => {
    const ids = starterSteps().map((s) => s.id);
    for (const id of ['registerCompany', 'chooseStructure', 'firstHire']) {
      expect(ids).not.toContain(id);
    }
  });

  it('starts at the first roadmap step', () => {
    const p = starterProgress({});
    expect(p.next?.id).toBe(roadmap.phases[0].steps[0].id);
    expect(p.done).toBe(0);
  });

  it('moves on when a step is done and ignores later steps', () => {
    const p = starterProgress({
      defineProblem: true, registerCompany: true,
    });
    expect(p.next?.id).toBe('interviewCustomers');
    expect(p.done).toBe(1);
  });

  it('has no next step once everything is done', () => {
    const all = Object.fromEntries(starterSteps().map((s) => [s.id, true]));
    const p = starterProgress(all);
    expect(p.next).toBeNull();
    expect(p.done).toBe(p.total);
  });

  it('builds before taking customers', () => {
    const ids = starterSteps().map((s) => s.id);
    expect(ids.indexOf('mvpScope'))
      .toBeLessThan(ids.indexOf('firstTenCustomers'));
  });

  it('explains every starter step', () => {
    for (const s of starterSteps()) {
      expect(guide.steps[s.id]?.how).toBeTruthy();
      expect(guide.steps[s.id]?.cost).toBeTruthy();
      expect(planner.steps[s.id]?.title).toBeTruthy();
    }
  });
});

describe('menu', () => {
  it('keeps a short list for beginners', () => {
    expect(isSimpleLink('/planner')).toBe(true);
    expect(isSimpleLink('/hoshin')).toBe(false);
    expect(isSimpleLink('/accounting')).toBe(false);
  });
});

describe('idea risk check', () => {
  const all = (v: boolean) =>
    Object.fromEntries(IDEA_QUESTIONS.map((q) => [q, v]));

  it('waits until every question is answered', () => {
    expect(ideaVerdict({}).level).toBe('unanswered');
    expect(ideaVerdict({ fixedScope: true }).level).toBe('unanswered');
  });

  it('scores low, mostly and risky', () => {
    expect(ideaVerdict(all(true)).level).toBe('low');
    expect(ideaVerdict({ ...all(true), sayNo: false }).level)
      .toBe('mostly');
    expect(ideaVerdict(all(false)).level).toBe('risky');
  });

  it('lists the weak points', () => {
    const v = ideaVerdict({ ...all(true), upfront: false });
    expect(v.weak).toEqual(['upfront']);
  });

  it('has text for every question and verdict', () => {
    for (const q of IDEA_QUESTIONS) {
      expect(guide.idea[q].q && guide.idea[q].why && guide.idea[q].fix)
        .toBeTruthy();
    }
    for (const l of ['low', 'mostly', 'risky']) {
      expect(guide.ideaVerdict[l]).toBeTruthy();
    }
  });
});

describe('readiness checklists', () => {
  it('need every item', () => {
    expect(companyReady({})).toBe(false);
    expect(companyReady(
      Object.fromEntries(COMPANY_CHECKS.map((c) => [c, true])))).toBe(true);
    expect(launchReady({})).toBe(false);
    expect(launchReady(
      Object.fromEntries(LAUNCH_CHECKS.map((c) => [c, true])))).toBe(true);
  });

  it('have text', () => {
    for (const c of COMPANY_CHECKS) expect(guide.companyChecks[c]).toBeTruthy();
    for (const c of LAUNCH_CHECKS) expect(guide.launchChecks[c]).toBeTruthy();
  });
});

describe('walkthroughs', () => {
  it('have a title and body for every step', () => {
    for (const [id, steps] of Object.entries(TOURS)) {
      for (const s of steps) {
        expect(guide.tours[id][s.id].title).toBeTruthy();
        expect(guide.tours[id][s.id].body).toBeTruthy();
      }
    }
  });

  it('are found by page', () => {
    expect(tourForPath('/dashboard')).toBe('welcome');
    expect(tourForPath('/planner')).toBe('roadmap');
    expect(tourForPath('/kpi')).toBeNull();
  });

  it('knows whether a step is on this page', () => {
    const step = TOURS.roadmap[0];
    expect(onStepPage(step, '/planner')).toBe(true);
    expect(onStepPage(step, '/dashboard')).toBe(false);
  });

  it('fills in the next step in a selector', () => {
    const step = TOURS.roadmap.find((s) => s.id === 'step')!;
    expect(resolveTarget(step, 'defineProblem')).toBe('#step-defineProblem');
    expect(resolveTarget(step, null)).toBeNull();
    expect(resolveTarget(TOURS.welcome[0], null)).toBeNull();
  });
});

describe('guide slice', () => {
  it('starts simple', () => {
    expect(reducer(undefined, { type: 'x' }).advanced).toBe(false);
  });

  it('toggles advanced tools', () => {
    expect(reducer(guideInitialState, setAdvanced(true)).advanced).toBe(true);
  });

  it('runs and remembers a walkthrough', () => {
    let s = reducer(guideInitialState, startTour('welcome'));
    expect(s.activeTour).toBe('welcome');
    s = reducer(s, setTourStep(2));
    expect(s.tourStep).toBe(2);
    s = reducer(s, endTour());
    expect(s.activeTour).toBeNull();
    expect(s.toursSeen.welcome).toBe(true);
  });

  it('records answers and clears them', () => {
    let s = reducer(guideInitialState,
      setIdeaAnswer({ id: 'upfront', value: true }));
    s = reducer(s, setLaunchReady({ id: 'costsCapped', value: true }));
    expect(s.ideaAnswers.upfront).toBe(true);
    expect(s.launchReady.costsCapped).toBe(true);
    expect(reducer(s, resetIdeaCheck()).ideaAnswers).toEqual({});
  });
});
