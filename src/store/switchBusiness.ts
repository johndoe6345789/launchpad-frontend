/**
 * Opens another business: remembers the current business's stage choice,
 * loads the target's, points every request at it and throws away what was
 * cached for the previous one so nothing from it is shown.
 * @module store/switchBusiness
 */
import { baseApi } from './api/baseApi';
import { replaceSteps } from './slices/plannerSlice';
import {
  MAIN_KEY, setActiveBusiness, stashStartup,
} from './slices/businessSlice';
import {
  initialStartupState, replaceStartupState,
} from './slices/startupTypeSlice';
import type { AppDispatch, RootState } from './store';

/**
 * @param id - Business to open; null opens the oldest business.
 * @returns A thunk to dispatch.
 */
export const switchBusiness =
  (id: string | null) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    if ((state.business.activeId ?? null) === id) return;
    dispatch(stashStartup({
      key: state.business.activeId ?? MAIN_KEY,
      value: state.startupType,
    }));
    const next = id ?? MAIN_KEY;
    dispatch(replaceStartupState(
      state.business.startupByBusiness[next] ?? initialStartupState,
    ));
    dispatch(setActiveBusiness(id));
    dispatch(replaceSteps({}));
    dispatch(baseApi.util.resetApiState());
  };
