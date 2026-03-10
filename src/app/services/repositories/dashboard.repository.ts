import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseRepository } from './base.repository';
import { DashboardSummary, TransactionDetail } from '../../models/dashboard.models';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';

/**
 * DashboardRepository
 * Handles all API calls related to dashboard data
 * Abstracts the HTTP communication layer from business logic
 */
@Injectable({
  providedIn: 'root'
})
export class DashboardRepository extends BaseRepository {
  protected baseUrl = `${environment.apiUrl}Dashboard`;

  constructor(
    httpClient: HttpClient,
    private authService: AuthService
  ) {
    super(httpClient);
  }

  /**
   * Get protected headers with authorization token
   */
  private getProtectedHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Fetch dashboard summary for a specific date range and client
   */
  fetchDashboardSummary(
    fromDate: Date,
    toDate: Date,
    clientId: number
  ): Observable<DashboardSummary> {
    const params = this.buildDateParams(fromDate, toDate, clientId);
    return this.getList<DashboardSummary>(
      'summary',
      params,
      this.getProtectedHeaders()
    );
  }

  /**
   * Fetch transaction details by ID
   */
  fetchTransactionDetails(transactionId: number): Observable<TransactionDetail> {
    return this.get<TransactionDetail>(
      `transaction/${transactionId}`,
      this.getProtectedHeaders()
    );
  }

  /**
   * Fetch all transactions for dashboard
   */
  fetchAllTransactions(params?: any): Observable<TransactionDetail[]> {
    return this.getList<TransactionDetail[]>(
      'transactions',
      params,
      this.getProtectedHeaders()
    );
  }

  /**
   * Fetch company/group users
   */
  fetchGroupUsers(clientId?: number, groupId?: number): Observable<any> {
    const params: any = {};
    if (clientId) params.clientId = clientId;
    if (groupId) params.groupId = groupId;

    return this.getList<any>(
      'users/group',
      params,
      this.getProtectedHeaders()
    );
  }

  /**
   * Fetch company information
   */
  fetchCompanyInfo(companyId: number): Observable<any> {
    return this.get<any>(
      `company/${companyId}`,
      this.getProtectedHeaders()
    );
  }

  /**
   * Helper method to format and build date parameters
   */
  private buildDateParams(fromDate: Date, toDate: Date, clientId: number): any {
    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    return {
      fromDate: formatDate(fromDate),
      toDate: formatDate(toDate),
      clientId: clientId
    };
  }
}
