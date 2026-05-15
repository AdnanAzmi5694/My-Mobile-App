import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}User`;
  
  constructor(private http: HttpClient) {}

  login(credentials: { Email: string; Password: string }): Observable<any> {
    const body = {
      Email: credentials.Email,
      Password: credentials.Password
    };

    return this.http.post(`${this.baseUrl}/login`, body).pipe(
      tap((res: any) => {
        if (typeof window !== 'undefined' && res.token) {
          localStorage.setItem('access_token', res.token);
        }
        
        const clientId = res.clientId ?? res.ClientId;
        if (typeof window !== 'undefined' && clientId !== undefined && clientId !== null) {
          localStorage.setItem('client_id', clientId.toString());
        }
        
        if (typeof window !== 'undefined' && res.companyName) {
          localStorage.setItem('company_name', res.companyName);
        }

        const userGroupId = res.userGroupId ?? res.UserGroupId;
        if (typeof window !== 'undefined' && userGroupId !== undefined && userGroupId !== null) {
          localStorage.setItem('user_group_id', userGroupId.toString());
        }
      })
    );
  }

  register(userData: { Username: string; Email: string; Password: string; MobileNumber?: string | null }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData);
  }

  getUserGroupId(): number | null {
    if (typeof window !== 'undefined') {
      const storedGroupId = localStorage.getItem('user_group_id');
      if (storedGroupId) {
        return Number(storedGroupId);
      }
      
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          console.log('JWT Payload:', payload); // Debug log
          return payload.UserGroupId || payload.userGroupId || null;
        } catch (error) {
          console.error('Error decoding token:', error);
          return null;
        }
      }
    }
    return null;
  }

  async getUsersByUserGroupId(): Promise<any[]> {
    const userGroupId = this.getUserGroupId();
    console.log('=== getUsersByUserGroupId ===');
    console.log('UserGroupId:', userGroupId);
    console.log('Base URL:', this.baseUrl);
    console.log('Full URL:', `${this.baseUrl}/group/${userGroupId}`);
    console.log('Environment API URL:', environment.apiUrl);
    
    if (!userGroupId) {
      console.log('No UserGroupId found, returning empty array');
      return [];
    }

    try {
      console.log('Making HTTP GET call...');
      const fullUrl = `${this.baseUrl}/group/${userGroupId}`;
      console.log('Full API URL being called:', fullUrl);
      
      const token = this.getToken();
      console.log('Token being used:', token ? 'Present' : 'Missing');
      
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      const response = await this.http.get(fullUrl, { headers }).toPromise();
      console.log('API Response:', response);
      
      if (!response) {
        console.log('No response received from API');
        return [];
      }
      
      const data = response as any;
      console.log('Data extracted:', data);
      console.log('Users array:', data.users);
      console.log('Users array length:', data.users?.length || 0);
      return data.users || [];
    } catch (error: any) {
      console.error('Error fetching users by group:', error);
      console.error('Error details:', {
        status: error?.status,
        statusText: error?.statusText,
        url: error?.url,
        message: error?.message
      });
      return [];
    }
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('client_id');
      localStorage.removeItem('company_name');
      localStorage.removeItem('user_group_id');
    }
  }

  isLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('access_token');
    }
    return false;
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  getClientId(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('client_id');
    }
    return null;
  }

  getCompanyName(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('company_name');
    }
    return null;
  }
}