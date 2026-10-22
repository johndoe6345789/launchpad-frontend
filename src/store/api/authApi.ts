/**
 * Auth API endpoints injected into baseApi.
 * @module store/api/authApi
 */
import { baseApi } from './baseApi';
import type {
  LoginRequest,
  LoginResponse,
  TotpChallengeResponse,
  RegisterRequest,
  User,
  TokenPair,
} from '../../types/auth';

/** Answer to a successful registration. */
export interface RegisterResponse {
  success: boolean;
  message: string;
  loginUrl: string;
}

/** Auth endpoints: login, register, logout, etc. */
export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** Log in with email and password. */
    login: build.mutation<
      LoginResponse | TotpChallengeResponse,
      LoginRequest
    >({
      query: (body) => ({
        url: '/api/auth/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),

    /** Register a new account. */
    register: build.mutation<RegisterResponse, RegisterRequest>({
      query: (body) => ({
        url: '/api/auth/register',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),

    /** Log out and invalidate the refresh token. */
    logout: build.mutation<void, void>({
      query: () => ({
        url: '/api/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),

    /** Refresh the token pair. */
    refresh: build.mutation<
      { user: User; tokens: TokenPair },
      { refreshToken: string }
    >({
      query: (body) => ({
        url: '/api/auth/refresh',
        method: 'POST',
        body,
      }),
    }),

    /** Fetch the currently authenticated user. */
    getMe: build.query<User, void>({
      query: () => '/api/auth/me',
      providesTags: ['Auth'],
    }),

    /** Request a password-reset email. */
    forgotPassword: build.mutation<
      { message: string },
      { email: string }
    >({
      query: (body) => ({
        url: '/api/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshMutation,
  useGetMeQuery,
  useForgotPasswordMutation,
} = authApi;
