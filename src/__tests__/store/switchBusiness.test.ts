import { makeStore } from '@/store/store';
import { switchBusiness } from '@/store/switchBusiness';
import { setStartupType } from '@/store/slices/startupTypeSlice';
import { toggleStep } from '@/store/slices/plannerSlice';

const fresh = () => makeStore().store;

describe('switchBusiness', () => {
  it('points requests at the business and clears local roadmap ticks', () => {
    const store = fresh();
    store.dispatch(toggleStep('defineProblem'));
    store.dispatch(switchBusiness('biz-2'));
    expect(store.getState().business.activeId).toBe('biz-2');
    expect(store.getState().planner.completedSteps).toEqual({});
  });

  it("remembers each business's stage choice and restores it", () => {
    const store = fresh();
    store.dispatch(setStartupType('saas'));
    store.dispatch(switchBusiness('biz-2'));
    expect(store.getState().startupType.selectedSlug).toBeNull();
    store.dispatch(setStartupType('shop'));
    store.dispatch(switchBusiness(null));
    expect(store.getState().startupType.selectedSlug).toBe('saas');
    store.dispatch(switchBusiness('biz-2'));
    expect(store.getState().startupType.selectedSlug).toBe('shop');
  });

  it('does nothing when the business is already open', () => {
    const store = fresh();
    store.dispatch(setStartupType('saas'));
    store.dispatch(switchBusiness(null));
    expect(store.getState().startupType.selectedSlug).toBe('saas');
  });
});
