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
  type: 'purchase' | 'sales' | 'outstanding' | 'collection';
  fromDate?: Date;
  toDate?: Date;
  /** Outstanding and collection balances are a snapshot as on this date (not a from–to range). */
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
    totalTransactions?: number;
    totalCollectionAmount?: number;
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

export interface CollectionSummary {
  totalTransactions: number;
  totalAmount: number;
}

export interface CollectionGroup {
  paymentSubType: string;
  transactionCount: number;
  totalAmount: number;
}

export interface CollectionDetail {
  receiptDocNo: string | null;
  receiptDocDate: string | Date | null;
  receiptAmount: number;
  receiptRefPurID: number | null;
  purchaseDocNo: string | null;
  purchaseDocDate: string | Date | null;
  receiptCustomerId: number | null;
  customerName: string | null;
  customerMobileNo: string | null;
  receiptType: string | null;
  receiptNotes: string | null;
  receiptPaymentSubTypeName: string | null;
}

export interface CollectionPagedResult {
  total: number;
  page: number;
  pageSize: number;
  data: CollectionDetail[];
}

export interface CollectionDetailsDialogData {
  clientId: number;
  paymentSubType: string;
  companyName?: string;
  group: CollectionGroup;
}