import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { DashboardSummary, TransactionDetail } from '../models/dashboard.models';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  
  private dashboardBaseUrl = `${environment.apiUrl}Dashboard`;
  private jobberAlterationBaseUrl = `${environment.apiUrl}jobberalteration`;

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

  getDashboardSummary(fromDate: Date, toDate: Date, clientId: number): Observable<any> {
    // Create new date objects to avoid reference issues
    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);
    
    const formatDate = (date: Date) => {
      const d = new Date(date);
      // Format date in local timezone to avoid UTC conversion issues
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const formatted = `${year}-${month}-${day}`;
      console.log('Date formatting:', {
        original: date,
        newDate: d,
        formatted: formatted,
        time: d.getTime()
      });
      return formatted;
    };

    const params = {
      fromdate: formatDate(fromDateObj),
      toDate: formatDate(toDateObj),
      clientId: clientId.toString()
    };

    // Debug logging
    console.log('=== API CALL DEBUG ===');
    console.log('Original dates:', { fromDate, toDate });
    console.log('New date objects:', { fromDateObj, toDateObj });
    console.log('Date comparison:', {
      areSame: fromDateObj.getTime() === toDateObj.getTime(),
      fromDateTime: fromDateObj.getTime(),
      toDateTime: toDateObj.getTime()
    });
    console.log('API call params:', params);
    console.log('Full URL:', `${this.dashboardBaseUrl}/summary`, params);
    console.log('===================');

    return this.http.get(`${this.dashboardBaseUrl}/summary`, {
      headers: this.getHeaders(),
      params: params
    });
  }

  testConnection(): Observable<any> {
    return this.http.get(`${this.dashboardBaseUrl}/test`, {
      headers: this.getHeaders()
    });
  }

  getAlterationRecords(): Observable<any> {
    return this.http.get(`${this.dashboardBaseUrl}/alterations`, {
      headers: this.getHeaders()
    });
  }

  private buildAlterationParams(jobberName?: string, item?: string, category?: string, clientId?: number, page = 1, pageSize = 1000): any {
    const params: any = {
      page: page.toString(),
      pageSize: pageSize.toString()
    };

    if (jobberName) {
      params.jobberName = jobberName;
    }
    if (item) {
      params.item = item;
    }
    if (category) {
      params.category = category;
    }
    if (clientId && clientId > 0) {
      params.clientId = clientId.toString();
    }

    return params;
  }

  getPendingAlterations(jobberName?: string, item?: string, category?: string, clientId?: number, page = 1, pageSize = 1000): Observable<any> {
    const params = this.buildAlterationParams(jobberName, item, category, clientId, page, pageSize);
    return this.http.get(`${this.jobberAlterationBaseUrl}/pending`, {
      headers: this.getHeaders(),
      params
    });
  }

  getReceivedAlterations(jobberName?: string, item?: string, category?: string, clientId?: number, page = 1, pageSize = 1000): Observable<any> {
    const params = this.buildAlterationParams(jobberName, item, category, clientId, page, pageSize);
    return this.http.get(`${this.jobberAlterationBaseUrl}/received`, {
      headers: this.getHeaders(),
      params
    });
  }

  getDeliveredAlterations(jobberName?: string, item?: string, category?: string, clientId?: number, page = 1, pageSize = 1000): Observable<any> {
    const params = this.buildAlterationParams(jobberName, item, category, clientId, page, pageSize);
    return this.http.get(`${this.jobberAlterationBaseUrl}/delivered`, {
      headers: this.getHeaders(),
      params
    });
  }
} 