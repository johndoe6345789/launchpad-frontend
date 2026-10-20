/**
 * @file useAccountingDashboard.ts
 * @brief Aggregates Xero + Zelt data for the accounting
 *        dashboard. Combines status, KPIs, and raw lists.
 */
'use client';

import { useMemo } from 'react';
import { useXeroStatusQuery, useXeroInvoicesQuery,
         useXeroProfitLossQuery, useXeroCashFlowQuery }
  from '@/store/api/xeroApi';
import { useZeltStatusQuery, useZeltPayrollQuery,
         useZeltEmployeesQuery }
  from '@/store/api/zeltApi';
import { extractReportRow }
  from '@/utils/xeroReportUtils';

/** @brief Dashboard summary returned by the hook. */
export interface AccountingKpis {
  totalRevenue:    number | null;
  cashOnHand:      number | null;
  monthlyPayroll:  number | null;
  headcount:       number | null;
  outstandingInv:  number | null;
  xeroConnected:   boolean;
  zeltConnected:   boolean;
  isLoading:       boolean;
}

/**
 * @brief Combines Xero P&L + Zelt payroll into a single
 *        KPI summary for the accounting dashboard.
 * @returns AccountingKpis with derived totals.
 */
export function useAccountingDashboard(): AccountingKpis {
  const { data: xStat, isLoading: xStatL } =
    useXeroStatusQuery();
  const { data: xInv,  isLoading: xInvL  } =
    useXeroInvoicesQuery(undefined,
      { skip: !xStat?.connected });
  const { data: xPL,   isLoading: xPLL   } =
    useXeroProfitLossQuery(undefined,
      { skip: !xStat?.connected });
  const { data: xCash, isLoading: xCashL } =
    useXeroCashFlowQuery(undefined,
      { skip: !xStat?.connected });
  const { data: zStat, isLoading: zStatL } =
    useZeltStatusQuery();
  const { data: zPay,  isLoading: zPayL  } =
    useZeltPayrollQuery(undefined,
      { skip: !zStat?.connected });
  const { data: zEmp,  isLoading: zEmpL  } =
    useZeltEmployeesQuery(undefined,
      { skip: !zStat?.connected });

  return useMemo((): AccountingKpis => {
    const outstandingInv = xInv
      ? xInv.Invoices
          .filter((i) => i.Status === 'AUTHORISED')
          .reduce((s, i) => s + i.AmountDue, 0)
      : null;

    const latestRun = zPay
      ? [...zPay].sort((a, b) =>
          b.period.localeCompare(a.period))[0]
      : null;

    return {
      totalRevenue:   extractReportRow(xPL, 'Total Income'),
      cashOnHand:     extractReportRow(xCash, 'Cash position'),
      monthlyPayroll: latestRun?.totalCost ?? null,
      headcount:      zEmp  ? zEmp.length  : null,
      outstandingInv,
      xeroConnected:  xStat?.connected  ?? false,
      zeltConnected:  zStat?.connected  ?? false,
      isLoading: xStatL || xInvL || xPLL || xCashL ||
                 zStatL || zPayL || zEmpL,
    };
  }, [xStat, xInv, xPL, xCash, zStat, zPay, zEmp,
      xStatL, xInvL, xPLL, xCashL, zStatL, zPayL, zEmpL]);
}
