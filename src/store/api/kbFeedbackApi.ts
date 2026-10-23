/**
 * KB article feedback RTK Query endpoints.
 * @module store/api/kbFeedbackApi
 */
import { baseApi } from './baseApi';

/** Args for submitting feedback on a KB article. */
export interface SubmitFeedbackArgs {
  /** KB article (page) ID. */
  id: number;
  /** True for helpful, false for unhelpful. */
  helpful: boolean;
}

/** Aggregate vote counts for a KB article. */
export interface FeedbackSummary {
  /** Number of helpful votes. */
  helpful: number;
  /** Number of unhelpful votes. */
  unhelpful: number;
}

/** KB feedback endpoints injected into baseApi. */
export const kbFeedbackApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Submit or update a helpful/unhelpful vote.
     *
     * @param args - Article ID and vote value.
     * @returns The recorded vote.
     */
    submitFeedback: build.mutation<
      { helpful: boolean },
      SubmitFeedbackArgs
    >({
      query: ({ id, helpful }) => ({
        url: `/api/wiki/kb/${id}/feedback`,
        method: 'POST',
        body: { helpful },
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'Knowledge', id },
      ],
    }),

    /**
     * Get aggregate vote counts for an article.
     *
     * @param id - KB article (page) ID.
     * @returns Helpful and unhelpful counts.
     */
    getFeedbackSummary: build.query<
      FeedbackSummary,
      number
    >({
      query: (id) => `/api/wiki/kb/${id}/feedback-summary`,
      providesTags: (_r, _e, id) => [
        { type: 'Knowledge', id },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useSubmitFeedbackMutation,
  useGetFeedbackSummaryQuery,
} = kbFeedbackApi;
