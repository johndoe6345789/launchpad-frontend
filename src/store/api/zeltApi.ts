/**
 * RTK Query endpoints for the Zelt HR/payroll domain.
 * @module store/api/zeltApi
 */
import { baseApi } from './baseApi';
import type {
  ZeltStatus, ZeltPayrollRun, ZeltEmployee,
  ZeltLeaveRequest, ZeltExpense, ZeltConnectInput,
} from '@/types/zelt';
import api from '@/constants/api.json';

const Z = api.zelt;

/** Zelt read-only API: status, payroll, employees. */
export const zeltApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** Connection status for the current user. */
    zeltStatus: build.query<ZeltStatus, void>({
      query: () => Z.status,
      providesTags: ['ZeltStatus'],
    }),

    /** List payroll runs. */
    zeltPayroll: build.query<ZeltPayrollRun[], void>({
      query: () => Z.payroll,
      providesTags: ['Zelt'],
    }),

    /** List employees with monthly costs. */
    zeltEmployees: build.query<ZeltEmployee[], void>({
      query: () => Z.employees,
      providesTags: ['Zelt'],
    }),

    /** List leave requests. */
    zeltLeave: build.query<ZeltLeaveRequest[], void>({
      query: () => Z.leave,
      providesTags: ['Zelt'],
    }),

    /** List expense claims. */
    zeltExpenses: build.query<ZeltExpense[], void>({
      query: () => Z.expenses,
      providesTags: ['Zelt'],
    }),

    /** Save Zelt API key (POST). */
    zeltConnect: build.mutation<void, ZeltConnectInput>({
      query: (body) => ({
        url: Z.connect, method: 'POST', body,
      }),
      invalidatesTags: ['ZeltStatus'],
    }),

    /** Remove Zelt connection (DELETE). */
    zeltDisconnect: build.mutation<void, void>({
      query: () => ({ url: Z.disconnect, method: 'DELETE' }),
      invalidatesTags: ['ZeltStatus'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useZeltStatusQuery,
  useZeltPayrollQuery,
  useZeltEmployeesQuery,
  useZeltLeaveQuery,
  useZeltExpensesQuery,
  useZeltConnectMutation,
  useZeltDisconnectMutation,
} = zeltApi;
