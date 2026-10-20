/**
 * Redux slice for the user's selected startup type.
 * Persisted so the choice survives page refresh.
 * @module store/slices/startupTypeSlice
 */
import {
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type {
  CoFounderStatus,
  OnboardingDataPayload,
  StartupTypeState,
} from './startupTypeSlice.types';

export type {
  CoFounderStatus,
  OnboardingDataPayload,
} from './startupTypeSlice.types';

const initialState: StartupTypeState = {
  selectedSlug: null,
  onboardingComplete: false,
  startupName: null,
  selectedStage: null,
  coFounderStatus: null,
  biggestChallenge: null,
};

/** The state a business starts with. */
export const initialStartupState = initialState;

const startupTypeSlice = createSlice({
  name: 'startupType',
  initialState,
  reducers: {
    /** Swap in another business's stage state wholesale. */
    replaceStartupState(_state, action: PayloadAction<StartupTypeState>) {
      return action.payload;
    },

    /**
     * Set the user's chosen startup archetype.
     * @param state - Current startupType state.
     * @param action - Slug of the selected type.
     */
    setStartupType(
      state,
      action: PayloadAction<string>,
    ) {
      state.selectedSlug = action.payload;
    },

    /**
     * Mark whether onboarding has been completed.
     * @param state - Current startupType state.
     * @param action - True when onboarding is done.
     */
    setOnboardingComplete(
      state,
      action: PayloadAction<boolean>,
    ) {
      state.onboardingComplete = action.payload;
    },

    /**
     * Persist all four supplementary onboarding fields
     * in a single dispatch to avoid multiple re-renders.
     * @param state - Current startupType state.
     * @param action - Combined onboarding data payload.
     */
    setOnboardingData(
      state,
      action: PayloadAction<OnboardingDataPayload>,
    ) {
      const {
        startupName,
        selectedStage,
        coFounderStatus,
        biggestChallenge,
      } = action.payload;
      state.startupName = startupName;
      state.selectedStage = selectedStage;
      state.coFounderStatus = coFounderStatus;
      state.biggestChallenge = biggestChallenge;
    },

    /** Clear the selected type and all onboarding data. */
    clearStartupType(state) {
      state.selectedSlug = null;
      state.onboardingComplete = false;
      state.startupName = null;
      state.selectedStage = null;
      state.coFounderStatus = null;
      state.biggestChallenge = null;
    },
  },
});

export const {
  setStartupType,
  setOnboardingComplete,
  setOnboardingData,
  clearStartupType,
  replaceStartupState,
} = startupTypeSlice.actions;

export default startupTypeSlice.reducer;
