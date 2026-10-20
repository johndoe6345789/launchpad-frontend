/**
 * @file zelt.ts
 * @brief TypeScript types for the Zelt HR/Payroll API.
 */

/** Connection status returned by GET /api/zelt/status. */
export interface ZeltStatus {
  readonly connected: boolean;
  /** True when the connection is the stand-in demo service. */
  readonly demo?: boolean;
  /** The API key that works with the demo service. */
  readonly demoKey?: string;
}

/** One payroll run period. */
export interface ZeltPayrollRun {
  readonly id: string;
  readonly period: string;
  readonly totalGross: number;
  readonly totalEmployerNi: number;
  readonly totalPension: number;
  readonly totalCost: number;
  readonly employeeCount: number;
}

/** One employee with monthly cost. */
export interface ZeltEmployee {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly department: string;
  readonly monthlyCostGbp: number;
  readonly startDate: string;
}

/** One leave request. */
export interface ZeltLeaveRequest {
  readonly id: string;
  readonly employeeName: string;
  readonly type: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly status: 'PENDING' | 'APPROVED' | 'DECLINED';
  readonly days: number;
}

/** One expense claim. */
export interface ZeltExpense {
  readonly id: string;
  readonly employeeName: string;
  readonly category: string;
  readonly amount: number;
  readonly currency: string;
  readonly date: string;
  readonly status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

/** POST body for /api/zelt/connect. */
export interface ZeltConnectInput {
  readonly api_key: string;
  readonly base_url?: string;
}
