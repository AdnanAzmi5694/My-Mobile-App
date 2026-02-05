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
  
  private baseUrl = `${environment.apiUrl}Dashboard`;

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
    console.log('Full URL:', `${this.baseUrl}/summary`, params);
    console.log('===================');

    return this.http.get(`${this.baseUrl}/summary`, {
      headers: this.getHeaders(),
      params: params
    });
  }

  testConnection(): Observable<any> {
    return this.http.get(`${this.baseUrl}/test`, {
      headers: this.getHeaders()
    });
  }
} 