/**
 * RTK Query endpoints for what a person chose about the leaderboard and
 * emails (kept on the server, separate from display preferences).
 * @module store/api/accountPrefsApi
 */
import { baseApi } from './baseApi';

/** What the person has chosen. */
export interface AccountPrefs {
  /** Appear on the leaderboard. */
  leaderboardOptIn: boolean;
  /** Receive the welcome and re-engagement emails. */
  emailSequences: boolean;
}

/** Preferences endpoints injected into baseApi. */
export const accountPrefsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAccountPrefs: build.query<AccountPrefs, void>({
      query: () => ({ url: '/api/planner/preferences' }),
      providesTags: ['AccountPrefs'],
    }),
    setAccountPrefs: build.mutation<
      AccountPrefs, Partial<AccountPrefs>
    >({
      query: (body) => ({
        url: '/api/planner/preferences', method: 'PUT', body,
      }),
      invalidatesTags: ['AccountPrefs'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAccountPrefsQuery, useSetAccountPrefsMutation,
} = accountPrefsApi;
