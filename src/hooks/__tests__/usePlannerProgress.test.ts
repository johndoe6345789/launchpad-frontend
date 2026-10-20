import { getPhaseStatus } from '../usePlannerProgress';

// getPhaseStatus thresholds: caution=50 (from planner.json)
// 0 done → todo, all done → complete
// pct >= 50 → in-progress, else → started

describe('getPhaseStatus', () => {
  it('returns todo when done is 0', () => {
    expect(getPhaseStatus(0, 10)).toBe('todo');
  });

  it('returns complete when all steps done', () => {
    expect(getPhaseStatus(5, 5)).toBe('complete');
  });

  it('returns complete when done exceeds total', () => {
    expect(getPhaseStatus(6, 5)).toBe('complete');
  });

  it('returns in-progress when pct >= 50', () => {
    // 5/8 = 62.5% → in-progress
    expect(getPhaseStatus(5, 8)).toBe('in-progress');
  });

  it('returns started when 0 < pct < 50', () => {
    // 2/10 = 20% → started
    expect(getPhaseStatus(2, 10)).toBe('started');
  });

  it('returns started at exactly one step done (non-zero, < 50%)', () => {
    expect(getPhaseStatus(1, 10)).toBe('started');
  });

  it('returns in-progress at exactly 50%', () => {
    expect(getPhaseStatus(5, 10)).toBe('in-progress');
  });

  it('handles single-step phases correctly', () => {
    expect(getPhaseStatus(0, 1)).toBe('todo');
    expect(getPhaseStatus(1, 1)).toBe('complete');
  });
});

import { renderHook, act } from '@testing-library/react';

const saveStep = jest.fn();
const resetServer = jest.fn();
const dispatch = jest.fn();
let serverData: { steps: Record<string, boolean> } | undefined;
let local: Record<string, boolean> = {};
let business: string | null = null;

jest.mock('@/store/hooks', () => ({
  useAppDispatch: () => dispatch,
  useAppSelector: (fn: (s: unknown) => unknown) =>
    fn({
      planner: { completedSteps: local },
      business: { activeId: business },
    }),
}));
jest.mock('@/store/api/gamificationApi', () => ({
  useCompleteStepMutation: () => [jest.fn()],
}));
jest.mock('@/store/api/plannerProgressApi', () => ({
  useGetPlannerProgressQuery: () => ({ data: serverData }),
  useSetPlannerStepMutation: () => [saveStep],
  useResetPlannerProgressMutation: () => [resetServer],
}));

describe('usePlannerProgress server sync', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    business = null;
    saveStep.mockReturnValue({
      unwrap: () => Promise.resolve({ completed: true, first_time: false }),
    });
  });

  it('adopts the server copy when it has ticks', () => {
    serverData = { steps: { a: true } };
    local = {};
    renderHook(() =>
      require('../usePlannerProgress').usePlannerProgress());
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ payload: { a: true } }));
  });

  it('migrates local ticks up when the server is empty', () => {
    serverData = { steps: {} };
    local = { b: true, c: false };
    renderHook(() =>
      require('../usePlannerProgress').usePlannerProgress());
    expect(saveStep).toHaveBeenCalledTimes(1);
    expect(saveStep).toHaveBeenCalledWith({ id: 'b', completed: true });
  });

  it('saves each toggle and reset to the server', () => {
    serverData = { steps: { a: true } };
    local = { a: true };
    const { result } = renderHook(() =>
      require('../usePlannerProgress').usePlannerProgress());
    act(() => result.current.toggle('a'));
    expect(saveStep).toHaveBeenCalledWith({ id: 'a', completed: false });
    act(() => result.current.reset());
    expect(resetServer).toHaveBeenCalled();
  });
});

describe('usePlannerProgress across businesses', () => {
  beforeEach(() => jest.clearAllMocks());

  it('adopts the server copy again after another business is opened', () => {
    business = null; local = {}; serverData = { steps: { a: true } };
    const { rerender } = renderHook(() =>
      require('../usePlannerProgress').usePlannerProgress());
    expect(dispatch).toHaveBeenCalledTimes(1);
    business = 'biz-2'; serverData = { steps: { z: true } };
    rerender();
    expect(dispatch).toHaveBeenLastCalledWith(
      expect.objectContaining({ payload: { z: true } }));
  });
});
