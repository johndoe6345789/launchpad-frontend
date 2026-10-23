/**
 * Base RTK Query API definition.
 *
 * Layered base query:
 *   rawBaseQuery → reauth (401 refresh) → retry (5xx
 *   and network errors with exponential backoff).
 * The retry layer absorbs the brief container-rebuild
 * windows so pages don't render empty when the backend
 * is mid-restart.
 *
 * @module store/api/baseApi
 */
import { createApi } from
  '@reduxjs/toolkit/query/react';
import {
  baseQueryWithRetry,
} from './baseQueryRetry';

/** Root RTK Query API -- inject endpoints elsewhere. */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithRetry,
  tagTypes: [
    'Businesses', 'XeroStatus', 'ZeltStatus',
    'Auth', 'User', 'Notification',
    'Gamification', 'Chat',
    'Dashboard', 'Features', 'Comments',
    'Translation', 'Preferences', 'AccountPrefs',
    'ApiKeys', 'SystemKeys', 'Admin',
    'Social',
    'Analytics', 'AdminAnalytics', 'Flags',
    'ShopProducts', 'Cart', 'Orders',
    'ForumBoards', 'Wiki', 'Gallery',
    'StartupTypes', 'Knowledge',
    'MarketResearch', 'PlannerProgress',
    'Financials', 'FinancialHypotheses',
    'WeeklyReview',
    'Decisions',
    'Scoping',
    'Forum',
    'Follows',
    'Pivots',
    'RiskAssessment',
    'Hoshin', 'Bowling',
    'Xero', 'Zelt',
    'Kpi', 'Pdca', 'Okr',
    'Accelerators',
    'Organisations',
    'ChatStepLinks',
    'KbFeedback',
    'PublicProfile',
  ],
  endpoints: () => ({}),
});
