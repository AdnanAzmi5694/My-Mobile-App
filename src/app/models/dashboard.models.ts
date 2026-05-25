export interface DashboardSummary {
  purchase: {
    totalBills: number;
    totalQuantity: number;
    totalAmount: number;
  };
  sales: {
    totalBills: number;
    totalQuantity: number;
    totalAmount: number;
  };
  purchaseDetails: TransactionDetail[];
  salesDetails: TransactionDetail[];
}

export interface TransactionDetail {
  docNo: string;
  docDate: Date;
  quantity: number;
  amount: number;
}

export interface DetailsDialogData {
  type: 'purchase' | 'sales' | 'outstanding';
  fromDate?: Date;
  toDate?: Date;
  /** Outstanding balances are a snapshot as on this date (not a from–to range). */
  asOnDate?: Date;
  clientId: number;
  companyName?: string;
  summary: {
    totalBills?: number;
    totalQuantity?: number;
    totalAmount?: number;
    totalNetOutstanding?: number;
    totalCustomers?: number;
    averageOutstandingDays?: number;
  };
}

export interface OutstandingTotals {
  totalNetOutstanding: number;
  totalCustomers: number;
  averageOutstandingDays: number;
}

export interface OutstandingDetail {
  customerId: number;
  customerName: string;
  customerMobile: string | null;
  netOutstanding: number;
  avgOutstandingDays: number;
}

export interface OutstandingResponse {
  totals: OutstandingTotals;
  details: OutstandingDetail[];
}

export interface AlterationRecord {
  id: number;
  docNo?: number | string;
  docDate?: string | null;
  customerName?: string;
  purtPurId: number;
  barcodeDesc: string;
  productCode: string;
  productDesc: string;
  categoryDescription: string;
  deptDescription: string;
  clientId: number;
  purtRate: number;
  purtMrp: number;
  purtSelPrice: number;
  purtDebitQty: number;
  purtCreditQty: number;
  amount: number;
  discountAmount: number;
  purtType: string;
  jobberName: string;
  purtDelivered: boolean;
  purtAlteration: boolean;
  purtDeliveredDate: string | null;
  purtReceivedDate: string | null;
  purtReceived: boolean;
  purtId: number;
}

export interface AlterationDetailsDialogData {
  record: AlterationRecord;
  type: 'pending' | 'received' | 'delivered';
}