import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardRepository } from './repositories/dashboard.repository';
import { DashboardSummary, TransactionDetail } from '../models/dashboard.models';

/**
 * DashboardService
 * Business logic layer for dashboard operations
 * Uses DashboardRepository for data access
 * Handles any transformations, calculations, or business rules
 */
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private dashboardRepository: DashboardRepository) {}

  /**
   * Get dashboard summary for the specified date range
   * @param fromDate - Start date for the summary
   * @param toDate - End date for the summary
   * @param clientId - Client/Company ID
   * @returns Observable of dashboard summary data
   */
  getDashboardSummary(fromDate: Date, toDate: Date, clientId: number): Observable<DashboardSummary> {
    return this.dashboardRepository.fetchDashboardSummary(fromDate, toDate, clientId);
  }

  /**
   * Get detailed transaction information
   * @param transactionId - ID of the transaction to fetch
   * @returns Observable of transaction details
   */
  getTransactionDetails(transactionId: number): Observable<TransactionDetail> {
    return this.dashboardRepository.fetchTransactionDetails(transactionId);
  }

  /**
   * Get all transactions for the dashboard
   * @param params - Optional query parameters for filtering
   * @returns Observable of transaction list
   */
  getAllTransactions(params?: any): Observable<TransactionDetail[]> {
    return this.dashboardRepository.fetchAllTransactions(params);
  }

  /**
   * Get group/company users
   * @param clientId - Optional client ID filter
   * @param groupId - Optional group ID filter
   * @returns Observable of group users data
   */
  getGroupUsers(clientId?: number, groupId?: number): Observable<any> {
    return this.dashboardRepository.fetchGroupUsers(clientId, groupId);
  }

  /**
   * Get company information
   * @param companyId - ID of the company
   * @returns Observable of company data
   */
  getCompanyInfo(companyId: number): Observable<any> {
    return this.dashboardRepository.fetchCompanyInfo(companyId);
  }

  /**
   * Test API connection
   */
  testConnection(): Observable<any> {
    // You can add a test method to the repository if needed
    return new Observable(observer => {
      observer.next({ status: 'Connection test not implemented' });
      observer.complete();
    });
  }
}