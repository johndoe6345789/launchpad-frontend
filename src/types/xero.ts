/**
 * @file xero.ts
 * @brief TypeScript types for the Xero Accounting API.
 */

/** Connection status returned by GET /api/xero/status. */
export interface XeroStatus {
  readonly connected: boolean;
  readonly tenantName?: string;
  /** Whether this server has Xero set up at all. */
  readonly available?: boolean;
  /** True when the connection is the stand-in demo service. */
  readonly demo?: boolean;
}

/** A single Xero invoice. */
export interface XeroInvoice {
  readonly InvoiceID: string;
  readonly InvoiceNumber: string;
  readonly Contact: { readonly Name: string };
  readonly DateString: string;
  readonly DueDateString: string;
  readonly AmountDue: number;
  readonly AmountPaid: number;
  readonly Total: number;
  readonly Status: 'DRAFT' | 'SUBMITTED' | 'AUTHORISED'
    | 'PAID' | 'VOIDED';
  readonly CurrencyCode: string;
}

/** A single Xero bank transaction. */
export interface XeroBankTransaction {
  readonly BankTransactionID: string;
  readonly DateString: string;
  readonly BankAccount: { readonly Name: string };
  readonly Type: string;
  readonly Total: number;
  readonly Reference: string;
  readonly IsReconciled: boolean;
}

/** Condensed P&L / Balance Sheet / Cash row. */
export interface XeroReportRow {
  readonly rowType: string;
  readonly title?: string;
  readonly cells?: ReadonlyArray<{ readonly value: string }>;
}

/** Single Xero report object inside the Reports array. */
export interface XeroReport {
  readonly ReportID: string;
  readonly ReportName: string;
  readonly Rows: readonly XeroReportRow[];
}

/** Envelope returned by all Xero report endpoints. */
export interface XeroReportResponse {
  readonly Reports: readonly XeroReport[];
}
