import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthRepository, LoginRequest, SignUpRequest, LoginResponse } from './repositories/auth.repository';

/**
 * AuthService
 * Business logic layer for authentication
 * Uses AuthRepository for data access
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';
  private readonly CLIENT_ID_KEY = 'client_id';
  private readonly COMPANY_NAME_KEY = 'company_name';

  constructor(private authRepository: AuthRepository) {}

  /**
   * Login user with credentials
   * Stores token and user info in localStorage after successful login
   */
  login(credentials: { Email: string; Password: string }): Observable<LoginResponse> {
    const loginRequest: LoginRequest = {
      email: credentials.Email,
      password: credentials.Password
    };

    return this.authRepository.login(loginRequest).pipe(
      tap((response) => this.storeAuthData(response))
    );
  }

  /**
   * Register new user account
   */
  register(userData: { 
    Username: string; 
    Email: string; 
    Password: string; 
    MobileNmbr?: string 
  }): Observable<any> {
    const signUpRequest: SignUpRequest = {
      email: userData.Email,
      password: userData.Password,
      username: userData.Username,
      confirmPassword: userData.Password
    };

    return this.authRepository.signUp(signUpRequest);
  }

  /**
   * Get user group ID from JWT token
   */
  getUserGroupId(): number | null {
    if (typeof window === 'undefined') return null;

    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.UserGroupId || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Get users by user group ID (async)
   * Note: This would need an endpoint on the backend
   */
  async getUsersByUserGroupId(): Promise<any[]> {
    const userGroupId = this.getUserGroupId();
    
    if (!userGroupId) {
      console.log('No UserGroupId found');
      return [];
    }

    try {
      // This would need to be added to the repository if backend supports it
      // const response = await this.authRepository.getUsersByGroupId(userGroupId).toPromise();
      // return response?.users || [];
      return [];
    } catch (error) {
      console.error('Error fetching users by group:', error);
      return [];
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    this.clearAuthData();
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    return !!this.getToken();
  }

  /**
   * Get access token
   */
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  /**
   * Get client ID
   */
  getClientId(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.CLIENT_ID_KEY);
    }
    return null;
  }

  /**
   * Get company name
   */
  getCompanyName(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.COMPANY_NAME_KEY);
    }
    return null;
  }

  /**
   * Store authentication data in localStorage
   */
  private storeAuthData(response: LoginResponse): void {
    if (typeof window === 'undefined') return;

    if (response.token) {
      localStorage.setItem(this.TOKEN_KEY, response.token);
    }
  }

  /**
   * Clear authentication data from localStorage
   */
  private clearAuthData(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.CLIENT_ID_KEY);
    localStorage.removeItem(this.COMPANY_NAME_KEY);
  }
}