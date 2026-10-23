/**
 * Public founder profile RTK Query endpoint.
 * @module store/api/publicProfileApi
 */
import { baseApi } from './baseApi';
import type { PublicProfile } from '@/types/publicProfile';

/** Public profile endpoints injected into baseApi. */
export const publicProfileApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Get a founder's public profile by username.
     * No authentication required.
     *
     * @param username - The founder's username slug.
     * @returns Public profile data.
     */
    getPublicProfile: build.query<
      PublicProfile,
      string
    >({
      query: (username) =>
        `/api/users/profile/${encodeURIComponent(username)}`,
      providesTags: (_r, _e, username) => [
        { type: 'User', id: username },
      ],
    }),
  }),
  overrideExisting: false,
});

export const { useGetPublicProfileQuery } =
  publicProfileApi;
