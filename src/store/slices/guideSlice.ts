/**
 * Beginner guide state: whether advanced tools are shown, the active
 * walkthrough, and the small checklists on the home page.
 * @module store/slices/guideSlice
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/** Shape of the guide state. */
export interface GuideState {
  /** Show every tool and the full dashboard. Off for beginners. */
  advanced: boolean;
  /** Id of the walkthrough being shown, or null. */
  activeTour: string | null;
  /** Zero-based step of the active walkthrough. */
  tourStep: number;
  /** Walkthroughs the person has finished or skipped. */
  toursSeen: Record<string, boolean>;
  /** "Ready for a limited company?" ticks. */
  companyReady: Record<string, boolean>;
  /** "Ready for the first customer?" ticks. */
  launchReady: Record<string, boolean>;
  /** Idea risk check answers (true means yes). */
  ideaAnswers: Record<string, boolean>;
}

export const guideInitialState: GuideState = {
  advanced: false,
  activeTour: null,
  tourStep: 0,
  toursSeen: {},
  companyReady: {},
  launchReady: {},
  ideaAnswers: {},
};

const guideSlice = createSlice({
  name: 'guide',
  initialState: guideInitialState,
  reducers: {
    /** Show or hide the advanced tools. */
    setAdvanced(state, action: PayloadAction<boolean>) {
      state.advanced = action.payload;
    },
    /** Start a walkthrough from its first step. */
    startTour(state, action: PayloadAction<string>) {
      state.activeTour = action.payload;
      state.tourStep = 0;
    },
    /** Move to a step of the active walkthrough. */
    setTourStep(state, action: PayloadAction<number>) {
      state.tourStep = Math.max(0, action.payload);
    },
    /** End the active walkthrough and remember it was seen. */
    endTour(state) {
      if (state.activeTour) state.toursSeen[state.activeTour] = true;
      state.activeTour = null;
      state.tourStep = 0;
    },
    /** Tick or untick a company-readiness item. */
    setCompanyReady(
      state, action: PayloadAction<{ id: string; value: boolean }>,
    ) {
      state.companyReady[action.payload.id] = action.payload.value;
    },
    /** Tick or untick a launch-readiness item. */
    setLaunchReady(
      state, action: PayloadAction<{ id: string; value: boolean }>,
    ) {
      state.launchReady[action.payload.id] = action.payload.value;
    },
    /** Answer an idea risk check question. */
    setIdeaAnswer(
      state, action: PayloadAction<{ id: string; value: boolean }>,
    ) {
      state.ideaAnswers[action.payload.id] = action.payload.value;
    },
    /** Clear the idea risk check. */
    resetIdeaCheck(state) {
      state.ideaAnswers = {};
    },
  },
});

export const {
  setAdvanced, startTour, setTourStep, endTour,
  setCompanyReady, setLaunchReady, setIdeaAnswer, resetIdeaCheck,
} = guideSlice.actions;
export default guideSlice.reducer;
