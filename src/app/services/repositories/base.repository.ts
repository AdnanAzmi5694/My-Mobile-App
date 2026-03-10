import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Base Repository class for common CRUD operations
 * Provides generic methods for API interactions
 */
export abstract class BaseRepository {
  protected abstract baseUrl: string;

  constructor(protected httpClient: HttpClient) {}

  /**
   * GET request - retrieve a single resource
   */
  get<T>(endpoint: string, headers?: HttpHeaders): Observable<T> {
    return this.httpClient.get<T>(
      `${this.baseUrl}/${endpoint}`,
      { headers }
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * GET request - retrieve multiple resources
   */
  getList<T>(endpoint: string, params?: any, headers?: HttpHeaders): Observable<T> {
    return this.httpClient.get<T>(
      `${this.baseUrl}/${endpoint}`,
      { params, headers }
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * POST request - create a new resource
   */
  post<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.httpClient.post<T>(
      `${this.baseUrl}/${endpoint}`,
      body,
      { headers }
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * PUT request - update an entire resource
   */
  put<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.httpClient.put<T>(
      `${this.baseUrl}/${endpoint}`,
      body,
      { headers }
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * PATCH request - partial update
   */
  patch<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.httpClient.patch<T>(
      `${this.baseUrl}/${endpoint}`,
      body,
      { headers }
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * DELETE request - remove a resource
   */
  delete<T>(endpoint: string, headers?: HttpHeaders): Observable<T> {
    return this.httpClient.delete<T>(
      `${this.baseUrl}/${endpoint}`,
      { headers }
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Error handling method
   */
  protected handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
