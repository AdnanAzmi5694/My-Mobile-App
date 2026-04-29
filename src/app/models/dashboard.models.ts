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
  type: 'purchase' | 'sales';
  fromDate: Date;
  toDate: Date;
  clientId: number;
  summary: {
    totalBills: number;
    totalQuantity: number;
    totalAmount: number;
  };
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