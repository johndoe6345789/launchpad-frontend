import { renderHook } from '@testing-library/react';

const xStat = jest.fn(), xInv = jest.fn(),
      xPL   = jest.fn(), zStat = jest.fn(),
      zPay  = jest.fn(), zEmp  = jest.fn(),
      xCash = jest.fn();

const skip = { isLoading: false };

jest.mock('@/store/api/xeroApi', () => ({
  useXeroStatusQuery:     () => xStat(),
  useXeroInvoicesQuery:   (_: unknown, o: {skip?:boolean}) =>
    o?.skip ? skip : xInv(),
  useXeroProfitLossQuery: (_: unknown, o: {skip?:boolean}) =>
    o?.skip ? skip : xPL(),
  useXeroCashFlowQuery:   (_: unknown, o: {skip?:boolean}) =>
    o?.skip ? skip : xCash(),
}));
jest.mock('@/store/api/zeltApi', () => ({
  useZeltStatusQuery:    () => zStat(),
  useZeltPayrollQuery:   (_: unknown, o: {skip?:boolean}) =>
    o?.skip ? skip : zPay(),
  useZeltEmployeesQuery: (_: unknown, o: {skip?:boolean}) =>
    o?.skip ? skip : zEmp(),
}));

import { useAccountingDashboard } from '../useAccountingDashboard';

const nc = () => ({ data: { connected: false }, isLoading: false });
const cn = () => ({ data: { connected: true  }, isLoading: false });

describe('useAccountingDashboard', () => {
  beforeEach(() => {
    xStat.mockReturnValue(nc());
    zStat.mockReturnValue(nc());
  });

  it('returns nulls when neither service connected', () => {
    const { result } =
      renderHook(() => useAccountingDashboard());
    const k = result.current;
    expect(k.totalRevenue).toBeNull();
    expect(k.outstandingInv).toBeNull();
    expect(k.xeroConnected).toBe(false);
  });

  it('reads cash on hand from the summary report', () => {
    xStat.mockReturnValue(cn());
    xInv.mockReturnValue({ isLoading: false, data: { Invoices: [] } });
    xPL.mockReturnValue({ isLoading: false, data: undefined });
    xCash.mockReturnValue({ isLoading: false, data: { Reports: [{
      ReportID: 'x', ReportName: 'Executive Summary', Rows: [
        { rowType: 'SummaryRow',
          cells: [{ value: 'Cash position' }, { value: '1234.50' }] },
      ] }] } });
    const { result } =
      renderHook(() => useAccountingDashboard());
    expect(result.current.cashOnHand).toBe(1234.5);
  });

  it('sums only AUTHORISED outstanding invoices', () => {
    xStat.mockReturnValue(cn());
    xInv.mockReturnValue({ isLoading: false, data: {
      Invoices: [
        { Status: 'AUTHORISED', AmountDue: 1000 },
        { Status: 'AUTHORISED', AmountDue: 500  },
        { Status: 'PAID',       AmountDue: 0    },
      ] } });
    xPL.mockReturnValue({ isLoading: false, data: undefined });
    const { result } =
      renderHook(() => useAccountingDashboard());
    expect(result.current.outstandingInv).toBe(1500);
  });

  it('picks latest payroll run by period', () => {
    zStat.mockReturnValue(cn());
    zPay.mockReturnValue({ isLoading: false, data: [
      { period: '2025-01', totalCost: 80000 },
      { period: '2025-03', totalCost: 95000 },
      { period: '2025-02', totalCost: 88000 },
    ]});
    zEmp.mockReturnValue({ isLoading: false, data: [] });
    const { result } =
      renderHook(() => useAccountingDashboard());
    expect(result.current.monthlyPayroll).toBe(95000);
  });

  it('sets headcount to employee list length', () => {
    zStat.mockReturnValue(cn());
    zPay.mockReturnValue({ isLoading: false, data: [] });
    zEmp.mockReturnValue({ isLoading: false,
      data: [{ id: '1' }, { id: '2' }, { id: '3' }] });
    const { result } =
      renderHook(() => useAccountingDashboard());
    expect(result.current.headcount).toBe(3);
  });
});
