# Repository & Service Architecture - Quick Reference

## New Files Created

### Repository Layer
```
src/app/services/repositories/
├── base.repository.ts                 # Abstract base for all repositories
├── auth.repository.ts                 # Authentication data access
└── dashboard.repository.ts            # Dashboard data access
```

### Updated Service Layer
```
src/app/services/
├── auth.service.ts                    # REFACTORED: Now uses AuthRepository
└── dashboard.service.ts               # REFACTORED: Now uses DashboardRepository
```

---

## Quick API Reference

### BaseRepository (Abstract Methods)
```typescript
get<T>(endpoint: string, headers?: HttpHeaders): Observable<T>
getList<T>(endpoint: string, params?: any, headers?: HttpHeaders): Observable<T>
post<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T>
put<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T>
patch<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T>
delete<T>(endpoint: string, headers?: HttpHeaders): Observable<T>
```

### AuthRepository Methods
```typescript
login(credentials: LoginRequest): Observable<LoginResponse>
signUp(userData: SignUpRequest): Observable<SignUpResponse>
refreshToken(token: string): Observable<LoginResponse>
logout(): Observable<any>
verifyToken(token: string): Observable<boolean>
```

### DashboardRepository Methods
```typescript
fetchDashboardSummary(fromDate, toDate, clientId): Observable<DashboardSummary>
fetchTransactionDetails(transactionId): Observable<TransactionDetail>
fetchAllTransactions(params?): Observable<TransactionDetail[]>
fetchGroupUsers(clientId?, groupId?): Observable<any>
fetchCompanyInfo(companyId): Observable<any>
```

### AuthService Methods
```typescript
login(credentials: { Email, Password }): Observable<LoginResponse>
register(userData: { Username, Email, Password, MobileNmbr? }): Observable<any>
getUserGroupId(): number | null
getUsersByUserGroupId(): Promise<any[]>
logout(): void
isLoggedIn(): boolean
getToken(): string | null
getClientId(): string | null
getCompanyName(): string | null
```

### DashboardService Methods
```typescript
getDashboardSummary(fromDate, toDate, clientId): Observable<DashboardSummary>
getTransactionDetails(transactionId): Observable<TransactionDetail>
getAllTransactions(params?): Observable<TransactionDetail[]>
getGroupUsers(clientId?, groupId?): Observable<any>
getCompanyInfo(companyId): Observable<any>
testConnection(): Observable<any>
```

---

## Component Integration Examples

### Signin Component
```typescript
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html'
})
export class SigninComponent {
  constructor(private authService: AuthService) {}

  onSignIn(email: string, password: string) {
    this.authService.login({ Email: email, Password: password })
      .subscribe({
        next: (response) => console.log('Logged in:', response),
        error: (error) => console.error('Login failed:', error)
      });
  }
}
```

### Dashboard Component
```typescript
import { DashboardService } from '../services/dashboard.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const clientId = this.authService.getClientId();
    this.dashboardService.getDashboardSummary(fromDate, toDate, clientId)
      .subscribe({
        next: (summary) => this.processSummary(summary),
        error: (error) => this.handleError(error)
      });
  }
}
```

---

## Creating a New Repository

### Step 1: Create Repository
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseRepository } from './base.repository';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserRepository extends BaseRepository {
  protected baseUrl = `${environment.apiUrl}User`;

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  // Add your specific methods
  fetchUserProfile(userId: number): Observable<any> {
    return this.get<any>(`profile/${userId}`);
  }
}
```

### Step 2: Create Service
```typescript
import { Injectable } from '@angular/core';
import { UserRepository } from './repositories/user.repository';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private repository: UserRepository) {}

  getUserProfile(userId: number): Observable<any> {
    return this.repository.fetchUserProfile(userId);
  }
}
```

### Step 3: Use in Component
```typescript
import { UserService } from '../services/user.service';

export class ProfileComponent implements OnInit {
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUserProfile(userId).subscribe(profile => {
      this.profile = profile;
    });
  }
}
```

---

## Key Advantages

| Aspect | Without Pattern | With Repository Pattern |
|--------|---|---|
| **Testing** | Hard to test | Easy mock repository |
| **Code Reuse** | Scattered logic | Centralized services |
| **Maintenance** | API changes affect multiple files | Changes only in repository |
| **Readability** | Mixed concerns | Clear separation |
| **Scalability** | Difficult to extend | Easy to add features |
| **Testability** | Tightly coupled | Loosely coupled |

---

## Next Steps

1. ✅ Review the refactored code
2. ✅ Test all existing functionality
3. ⏳ Create unit tests for repositories and services
4. ⏳ Refactor any additional services
5. ⏳ Create repositories for new features
6. ⏳ Document API endpoints in repository files

---

## Questions or Issues?

Refer to the comprehensive guide in `REPOSITORY_PATTERN_GUIDE.md`
