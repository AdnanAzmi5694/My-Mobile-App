import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseRepository } from './base.repository';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  email: string;
  username: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  username: string;
  confirmPassword: string;
}

export interface SignUpResponse {
  success: boolean;
  message: string;
  userId?: number;
}

/**
 * AuthRepository
 * Handles all authentication-related API calls
 * Abstracts API communication from auth service logic
 */
@Injectable({
  providedIn: 'root'
})
export class AuthRepository extends BaseRepository {
  protected baseUrl = `${environment.apiUrl}Auth`;

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Login user with email and password
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.post<LoginResponse>('login', credentials);
  }

  /**
   * Register new user account
   */
  signUp(userData: SignUpRequest): Observable<SignUpResponse> {
    return this.post<SignUpResponse>('signup', userData);
  }

  /**
   * Refresh authentication token
   */
  refreshToken(token: string): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.post<LoginResponse>('refresh', {}, headers);
  }

  /**
   * Logout user (optional - may be client-side only)
   */
  logout(): Observable<any> {
    return this.post<any>('logout', {});
  }

  /**
   * Verify user token validity
   */
  verifyToken(token: string): Observable<boolean> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.get<boolean>('verify', headers);
  }
}
