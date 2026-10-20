/**
 * AI RTK Query endpoints.
 * @module store/api/aiApi
 */
import { baseApi } from './baseApi';
import apiConstants from '@/constants/api.json';
import type {
  StepSuggestionBody,
  StepSuggestionResponse,
  RiskReportBody,
  RiskReportResponse,
  DraftDocumentBody,
  DraftDocumentResponse,
} from './aiTypes';

export type {
  StepSuggestionBody,
  StepSuggestionResponse,
  RiskReportBody,
  RiskReportResponse,
  DraftDocumentBody,
  DraftDocumentResponse,
} from './aiTypes';
export type { DocumentType } from './aiTypes';

/** A model running on the server's CPU can take a minute or two. */
const AI_TIMEOUT_MS = 180_000;

/** AI API endpoints injected into baseApi. */
export const aiApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Fetch an AI tip for a single planner step.
     * @returns Contextual suggestion text.
     */
    getAiStepSuggestion: build.mutation<
      StepSuggestionResponse,
      StepSuggestionBody
    >({
      query: (body) => ({
        url: apiConstants.ai.stepSuggestion,
        method: 'POST',
        body,
        timeout: AI_TIMEOUT_MS,
      }),
    }),

    /**
     * Generate a risk report for the founder's plan.
     * @returns Numbered list of blind spots/risks.
     */
    getRiskReport: build.mutation<
      RiskReportResponse,
      RiskReportBody
    >({
      query: (body) => ({
        url: apiConstants.ai.riskReport,
        method: 'POST',
        body,
        timeout: AI_TIMEOUT_MS,
      }),
    }),

    /**
     * Generate a document draft via AI.
     * @returns Generated content string.
     */
    draftDocument: build.mutation<
      DraftDocumentResponse,
      DraftDocumentBody
    >({
      query: (body) => ({
        url: apiConstants.ai.draftDocument,
        method: 'POST',
        body,
        timeout: AI_TIMEOUT_MS,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAiStepSuggestionMutation,
  useGetRiskReportMutation,
  useDraftDocumentMutation,
} = aiApi;
