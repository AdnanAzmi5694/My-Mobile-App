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