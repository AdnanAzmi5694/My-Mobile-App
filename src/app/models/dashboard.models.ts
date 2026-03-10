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
  Id: number;
  PurtPurId: number;
  BarcodeDesc: string;
  ProductCode: string;
  ProductDesc: string;
  CategoryDescription: string;
  DeptDescription: string;
  ClientId: number;
  PurtRate: number;
  PurtMrp: number;
  PurtSelPrice: number;
  PurtDebitQty: number;
  PurtCreditQty: number;
  Amount: number;
  DiscountAmount: number;
  PurtType: number;
  JobberName: string;
  PurtDelivered: boolean;
  PurtAlteration: boolean;
  PurtDeliveredDate: string;
  PurtReceivedDate: string;
  PurtReceived: boolean;
  PurtId: number;
}

export interface AlterationDetailsDialogData {
  record: AlterationRecord;
  type: 'pending' | 'received' | 'delivered';
} 