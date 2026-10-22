/**
 * Which of the person's businesses is open. Every planning request carries
 * it (X-Business-Id); `null` means the oldest business. The startup-stage
 * choice (a per-device setting) is remembered per business here so that
 * switching back finds it again.
 * @module store/slices/businessSlice
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { StartupTypeState } from './startupTypeSlice.types';

export interface BusinessState {
  /** Open business id, or null for the oldest business. */
  activeId: string | null;
  /** Saved startup-stage state of businesses not currently open. */
  startupByBusiness: Record<string, StartupTypeState>;
}

const initialState: BusinessState = {
  activeId: null,
  startupByBusiness: {},
};

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    setActiveBusiness(state, action: PayloadAction<string | null>) {
      state.activeId = action.payload;
    },
    stashStartup(
      state,
      action: PayloadAction<{ key: string; value: StartupTypeState }>,
    ) {
      state.startupByBusiness[action.payload.key] = action.payload.value;
    },
  },
});

export const { setActiveBusiness, stashStartup } = businessSlice.actions;
export default businessSlice.reducer;

/** Key under which the stage state of the id-less (oldest) business is stashed. */
export const MAIN_KEY = 'main';
