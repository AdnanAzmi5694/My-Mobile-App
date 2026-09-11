import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuthService } from './auth.service';
import {
  CollectionDetail,
  CollectionGroup,
  CollectionPagedResult,
  CollectionSummary
} from '../models/dashboard.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  private baseUrl = `${environment.apiUrl}Collection`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getSummary(clientId: number = 0): Observable<CollectionSummary> {
    return this.http.get<any>(`${this.baseUrl}/summary`, {
      headers: this.getHeaders(),
      params: { clientId: clientId.toString() }
    }).pipe(map((response) => this.normalizeSummary(response)));
  }

  getGroups(clientId: number = 0): Observable<CollectionGroup[]> {
    return this.http.get<any>(`${this.baseUrl}/groups`, {
      headers: this.getHeaders(),
      params: { clientId: clientId.toString() }
    }).pipe(map((response) => this.normalizeGroups(response)));
  }

  getDetails(
    clientId: number,
    paymentSubType: string,
    page = 1,
    pageSize = 50
  ): Observable<CollectionPagedResult> {
    return this.http.get<any>(`${this.baseUrl}/details`, {
      headers: this.getHeaders(),
      params: {
        clientId: clientId.toString(),
        paymentSubType,
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }).pipe(map((response) => this.normalizePagedDetails(response)));
  }

  private normalizeSummary(response: any): CollectionSummary {
    if (response == null) {
      return { totalTransactions: 0, totalAmount: 0 };
    }
    return {
      totalTransactions: Number(response.totalTransactions ?? response.TotalTransactions ?? 0),
      totalAmount: Number(response.totalAmount ?? response.TotalAmount ?? 0)
    };
  }

  private normalizeGroups(response: any): CollectionGroup[] {
    const rows = Array.isArray(response) ? response : (response?.data ?? response?.Data ?? []);
    return rows.map((row: any) => ({
      paymentSubType: row.paymentSubType ?? row.PaymentSubType ?? 'Unknown',
      transactionCount: Number(row.transactionCount ?? row.TransactionCount ?? 0),
      totalAmount: Number(row.totalAmount ?? row.TotalAmount ?? 0)
    }));
  }

  private normalizePagedDetails(response: any): CollectionPagedResult {
    const dataRaw = response?.data ?? response?.Data ?? [];
    const data: CollectionDetail[] = (Array.isArray(dataRaw) ? dataRaw : []).map((row: any) => ({
      receiptDocNo: row.receiptDocNo ?? row.ReceiptDocNo ?? null,
      receiptDocDate: row.receiptDocDate ?? row.ReceiptDocDate ?? null,
      receiptAmount: Number(row.receiptAmount ?? row.ReceiptAmount ?? 0),
      receiptRefPurID: row.receiptRefPurID ?? row.ReceiptRefPurID ?? null,
      purchaseDocNo: row.purchaseDocNo ?? row.PurchaseDocNo ?? null,
      purchaseDocDate: row.purchaseDocDate ?? row.PurchaseDocDate ?? null,
      receiptCustomerId: row.receiptCustomerId ?? row.ReceiptCustomerId ?? null,
      customerName: row.customerName ?? row.CustomerName ?? null,
      customerMobileNo: row.customerMobileNo ?? row.CustomerMobileNo ?? null,
      receiptType: row.receiptType ?? row.ReceiptType ?? null,
      receiptNotes: row.receiptNotes ?? row.ReceiptNotes ?? null,
      receiptPaymentSubTypeName: row.receiptPaymentSubTypeName ?? row.ReceiptPaymentSubTypeName ?? null
    }));

    return {
      total: Number(response?.total ?? response?.Total ?? data.length),
      page: Number(response?.page ?? response?.Page ?? 1),
      pageSize: Number(response?.pageSize ?? response?.PageSize ?? data.length),
      data
    };
  }
}
