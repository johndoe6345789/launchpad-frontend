/**
 * RTK Query endpoints for a person's businesses.
 * @module store/api/businessesApi
 */
import { baseApi } from './baseApi';

/** One business of the signed-in person. */
export interface Business {
  id: string;
  name: string;
  createdAt: string;
}

/** The signed-in person's name and e-mail as given at sign-up. */
export interface WhoAmI {
  displayName: string;
  email: string;
}

/** Businesses CRUD endpoints injected into baseApi. */
export const businessesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    whoAmI: build.query<WhoAmI, void>({
      query: () => ({ url: '/api/planner/whoami' }),
    }),
    listBusinesses: build.query<Business[], void>({
      query: () => ({ url: '/api/businesses' }),
      providesTags: ['Businesses'],
    }),
    createBusiness: build.mutation<Business, { name: string }>({
      query: (body) => ({
        url: '/api/businesses', method: 'POST', body,
      }),
      invalidatesTags: ['Businesses'],
    }),
    renameBusiness: build.mutation<
      Business, { id: string; name: string }
    >({
      query: ({ id, name }) => ({
        url: `/api/businesses/${encodeURIComponent(id)}`,
        method: 'PUT',
        body: { name },
      }),
      invalidatesTags: ['Businesses'],
    }),
    deleteBusiness: build.mutation<void, string>({
      query: (id) => ({
        url: `/api/businesses/${encodeURIComponent(id)}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Businesses'],
    }),
  }),
});

export const {
  useWhoAmIQuery,
  useListBusinessesQuery,
  useCreateBusinessMutation,
  useRenameBusinessMutation,
  useDeleteBusinessMutation,
} = businessesApi;
