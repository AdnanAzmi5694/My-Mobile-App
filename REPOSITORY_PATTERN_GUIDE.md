# Repository and Service-Based Architecture - Implementation Guide

## Overview

Your Angular project has been restructured to follow the **Repository and Service-based architecture pattern**. This provides better **separation of concerns**, **testability**, and **maintainability**.

## Architecture Layers

```
┌─────────────────────────────────────────┐
│      Components (UI Layer)              │
│  (dashboard, signin, signup, etc.)      │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Services (Business Logic)          │
│  (AuthService, DashboardService)        │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│   Repositories (Data Access Layer)      │
│  (AuthRepository, DashboardRepository)  │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│  HttpClient (HTTP Communication)        │
└─────────────────────────────────────────┘
```

## Folder Structure

```
src/app/services/
├── repositories/
│   ├── base.repository.ts          (Abstract base class)
│   ├── auth.repository.ts          (Authentication API calls)
│   └── dashboard.repository.ts     (Dashboard API calls)
├── auth.service.ts                 (Auth business logic)
└── dashboard.service.ts            (Dashboard business logic)
```

## Key Components Explained

### 1. BaseRepository (Abstract Class)

**Location**: `src/app/services/repositories/base.repository.ts`

The `BaseRepository` provides **generic CRUD methods** that all repositories can extend:

- `get<T>(endpoint, headers?)` - GET single resource
- `getList<T>(endpoint, params, headers?)` - GET multiple resources
- `post<T>(endpoint, body, headers?)` - POST/Create
- `put<T>(endpoint, body, headers?)` - PUT/Update
- `patch<T>(endpoint, body, headers?)` - PATCH/Partial update
- `delete<T>(endpoint, headers?)` - DELETE
- `handleError()` - Centralized error handling

**Benefits**:
✅ DRY principle - no code duplication
✅ Consistent error handling across all repositories
✅ Easy to add common interceptors or logging

### 2. AuthRepository

**Location**: `src/app/services/repositories/auth.repository.ts`

Handles **all authentication-related API calls**:

```typescript
// Methods
login(credentials: LoginRequest): Observable<LoginResponse>
signUp(userData: SignUpRequest): Observable<SignUpResponse>
refreshToken(token: string): Observable<LoginResponse>
logout(): Observable<any>
verifyToken(token: string): Observable<boolean>
```

**Responsibility**: Only API communication, NO business logic

### 3. DashboardRepository

**Location**: `src/app/services/repositories/dashboard.repository.ts`

Handles **all dashboard-related API calls**:

```typescript
// Methods
fetchDashboardSummary(fromDate, toDate, clientId): Observable<DashboardSummary>
fetchTransactionDetails(transactionId): Observable<TransactionDetail>
fetchAllTransactions(params): Observable<TransactionDetail[]>
fetchGroupUsers(clientId?, groupId?): Observable<any>
fetchCompanyInfo(companyId): Observable<any>
```

**Responsibility**: Only API communication, URL building, parameter formatting

### 4. AuthService (Business Logic)

**Location**: `src/app/services/auth.service.ts`

Handles **authentication business logic**:

```typescript
// Methods
login(credentials): Observable<LoginResponse>
register(userData): Observable<any>
getUserGroupId(): number | null
getUsersByUserGroupId(): Promise<any[]>
logout(): void
isLoggedIn(): boolean
getToken(): string | null
getClientId(): string | null
getCompanyName(): string | null
```

**Responsibility**:
- Calls repository methods for data
- Manages localStorage (token storage)
- JWT decoding
- Authentication state management

### 5. DashboardService (Business Logic)

**Location**: `src/app/services/dashboard.service.ts`

Handles **dashboard business logic**:

```typescript
// Methods
getDashboardSummary(fromDate, toDate, clientId): Observable<DashboardSummary>
getTransactionDetails(transactionId): Observable<TransactionDetail>
getAllTransactions(params?): Observable<TransactionDetail[]>
getGroupUsers(clientId?, groupId?): Observable<any>
getCompanyInfo(companyId): Observable<any>
testConnection(): Observable<any>
```

**Responsibility**:
- Calls repository methods for data access
- Business logic and data transformation
- Calculations and rule processing

## Usage Examples

### Example 1: Login Flow

**Before (Without Repository Pattern):**
```typescript
// auth.service.ts
login(credentials): Observable<any> {
  return this.http.post(`${this.baseUrl}/login`, body)
    .pipe(tap(res => localStorage.setItem('access_token', res.token)));
}

// In component
this.authService.login({ Email: 'user@email.com', Password: 'pass' });
```

**After (With Repository Pattern):**
```typescript
// auth.repository.ts (Data Access)
login(credentials: LoginRequest): Observable<LoginResponse> {
  return this.post<LoginResponse>('login', credentials);
}

// auth.service.ts (Business Logic)
login(credentials: { Email: string; Password: string }): Observable<LoginResponse> {
  return this.authRepository.login(loginRequest).pipe(
    tap((response) => this.storeAuthData(response))
  );
}

// In component
this.authService.login({ Email: 'user@email.com', Password: 'pass' });
```

**Benefits**:
- Repository is testable independently
- Service logic is isolated from HTTP calls
- Easy to mock repository in tests
- Clear separation of concerns

### Example 2: Dashboard Data

**Before (Without Repository Pattern):**
```typescript
// dashboard.service.ts
getDashboardSummary(fromDate, toDate, clientId): Observable<any> {
  const params = { fromdate: formatDate(fromDate), toDate: formatDate(toDate), clientId };
  return this.http.get(`${this.baseUrl}/summary`, { headers, params });
}

// Component
this.dashboardService.getDashboardSummary(from, to, clientId)
  .subscribe(data => this.summary = data);
```

**After (With Repository Pattern):**
```typescript
// dashboard.repository.ts (Data Access)
fetchDashboardSummary(fromDate, toDate, clientId): Observable<DashboardSummary> {
  const params = this.buildDateParams(fromDate, toDate, clientId);
  return this.getList<DashboardSummary>('summary', params, headers);
}

// dashboard.service.ts (Business Logic)
getDashboardSummary(fromDate, toDate, clientId): Observable<DashboardSummary> {
  return this.dashboardRepository.fetchDashboardSummary(fromDate, toDate, clientId);
}

// Component
this.dashboardService.getDashboardSummary(from, to, clientId)
  .subscribe(data => this.summary = data);
```

## Component Usage

Your components **remain mostly unchanged**. Update only the service injections and method calls:

```typescript
import { DashboardService } from '../services/dashboard.service';
import { AuthService } from '../services/auth.service';

export class DashboardComponent implements OnInit {
  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const clientId = this.authService.getClientId();
    this.dashboardService.getDashboardSummary(this.fromDate, this.toDate, clientId)
      .subscribe(
        (data) => this.summary = data,
        (error) => console.error('Error:', error)
      );
  }
}
```

## Testing Benefits

### Repository Testing (Unit Test)
```typescript
describe('DashboardRepository', () => {
  it('should fetch dashboard summary', () => {
    const mockData = { /* mock data */ };
    spyOn(httpClient, 'get').and.returnValue(of(mockData));
    
    repository.fetchDashboardSummary(from, to, clientId).subscribe(data => {
      expect(data).toEqual(mockData);
    });
  });
});
```

### Service Testing (Unit Test)
```typescript
describe('DashboardService', () => {
  it('should call repository and return data', () => {
    spyOn(repository, 'fetchDashboardSummary').and.returnValue(of(mockData));
    
    service.getDashboardSummary(from, to, clientId).subscribe(data => {
      expect(data).toEqual(mockData);
      expect(repository.fetchDashboardSummary).toHaveBeenCalled();
    });
  });
});
```

## Adding New Features

### Step 1: Add method to Repository
```typescript
// user.repository.ts
fetchUserProfile(userId: number): Observable<UserProfile> {
  return this.get<UserProfile>(`user/${userId}`, this.getProtectedHeaders());
}
```

### Step 2: Add method to Service
```typescript
// user.service.ts
getUserProfile(userId: number): Observable<UserProfile> {
  return this.userRepository.fetchUserProfile(userId);
}
```

### Step 3: Use in Component
```typescript
// user.component.ts
this.userService.getUserProfile(userId).subscribe(profile => {
  this.userProfile = profile;
});
```

## Migration Checklist

- [x] Created `BaseRepository` abstract class
- [x] Created `AuthRepository` extending BaseRepository
- [x] Created `DashboardRepository` extending BaseRepository
- [x] Refactored `AuthService` to use AuthRepository
- [x] Refactored `DashboardService` to use DashboardRepository
- [ ] Update all components to use new service structure
- [ ] Create unit tests for repositories
- [ ] Create unit tests for services
- [ ] Update any other services (if present)
- [ ] Create new repositories for additional features

## Best Practices

1. **Repository Responsibility**: ONLY handle HTTP communication and data formatting
   - ✅ API calls
   - ✅ Query parameter building
   - ✅ Date formatting for API
   - ❌ Business logic
   - ❌ State management

2. **Service Responsibility**: Handle business logic and orchestration
   - ✅ Business rules
   - ✅ Data transformation
   - ✅ Calculations
   - ✅ State management (localStorage, etc.)
   - ❌ Direct HTTP calls (use repository)

3. **Component Responsibility**: UI logic only
   - ✅ User interactions
   - ✅ View updates
   - ✅ Call services
   - ❌ Direct HTTP calls
   - ❌ Business logic

4. **Error Handling**: Handle at repository level, propagate to service/component
5. **Reusability**: Write repositories and services to be reusable across components
6. **Type Safety**: Use strong typing (interfaces/classes) for all API responses

## Summary

✅ **Clear separation of concerns** - Each layer has a single responsibility
✅ **Better testability** - Mock repositories in service tests, mock services in component tests
✅ **Code reusability** - Services can be used by multiple components
✅ **Maintainability** - Changes to API structure only affect repositories
✅ **Scalability** - Easy to add new features following the same pattern
✅ **Flexibility** - Can swap repository implementation (e.g., REST to GraphQL)

Your project is now ready for production-grade Angular development!
