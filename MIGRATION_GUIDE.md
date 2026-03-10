# Step-by-Step Migration Guide

## Phase 1: Core Services (✅ COMPLETED)

### What Was Done:
- ✅ Created `BaseRepository` abstract class
- ✅ Created `AuthRepository` extending BaseRepository
- ✅ Created `DashboardRepository` extending BaseRepository  
- ✅ Refactored `AuthService` to use AuthRepository
- ✅ Refactored `DashboardService` to use DashboardRepository

### Files Modified/Created:
```
✨ NEW: src/app/services/repositories/base.repository.ts
✨ NEW: src/app/services/repositories/auth.repository.ts
✨ NEW: src/app/services/repositories/dashboard.repository.ts
🔄 REFACTORED: src/app/services/auth.service.ts
🔄 REFACTORED: src/app/services/dashboard.service.ts
```

---

## Phase 2: Component Updates (⏳ TO DO)

### Overview
Your components stay relatively the same. Only minor updates needed for method names/signatures.

### Components to Review:
1. **Signin Component** - `src/app/signin/signin.component.ts`
2. **Sign-up Component** - `src/app/sign-up/sign-up.component.ts`
3. **Dashboard Component** - `src/app/dashboard/dashboard.component.ts`
4. **Details Component** - `src/app/details/details.component.ts`

### Example: Signin Component Update

**Current Code:**
```typescript
import { AuthService } from '../services/auth.service';

export class SigninComponent {
  constructor(private authService: AuthService) {}

  onSubmit(form: NgForm) {
    const { email, password } = form.value;
    this.authService.login({ Email: email, Password: password })
      .subscribe(
        response => { /* handle response */ },
        error => { /* handle error */ }
      );
  }
}
```

**After Update (Modern RxJS):**
```typescript
import { AuthService } from '../services/auth.service';

export class SigninComponent {
  constructor(private authService: AuthService) {}

  onSubmit(form: NgForm) {
    const { email, password } = form.value;
    this.authService.login({ Email: email, Password: password })
      .subscribe({
        next: (response) => {
          console.log('Login successful');
          // Navigate to dashboard
        },
        error: (error) => {
          console.error('Login failed:', error);
          // Show error message
        },
        complete: () => console.log('Login process completed')
      });
  }
}
```

### Checklist for Component Review:
- [ ] Review Signin component for any direct HTTP calls
- [ ] Review Sign-up component for any direct HTTP calls
- [ ] Review Dashboard component for any direct HTTP calls
- [ ] Review Details component for any direct HTTP calls
- [ ] Update all `.subscribe()` patterns to modern syntax
- [ ] Ensure all error handling is proper
- [ ] Test all components work with refactored services

---

## Phase 3: Create New Repositories (As Needed)

### Use Case: Creating a User Repository

#### Step 1: Create Repository
File: `src/app/services/repositories/user.repository.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseRepository } from './base.repository';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';

export interface User {
  id: number;
  username: string;
  email: string;
  clientId: number;
}

export interface UserProfile extends User {
  companyName: string;
  role: string;
  createdAt: Date;
}

@Injectable({ providedIn: 'root' })
export class UserRepository extends BaseRepository {
  protected baseUrl = `${environment.apiUrl}User`;

  constructor(
    httpClient: HttpClient,
    private authService: AuthService
  ) {
    super(httpClient);
  }

  private getProtectedHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Fetch single user profile
  fetchUserProfile(userId: number): Observable<UserProfile> {
    return this.get<UserProfile>(
      `profile/${userId}`,
      this.getProtectedHeaders()
    );
  }

  // Fetch all users
  fetchAllUsers(params?: any): Observable<User[]> {
    return this.getList<User[]>(
      'all',
      params,
      this.getProtectedHeaders()
    );
  }

  // Update user profile
  updateUserProfile(userId: number, data: Partial<User>): Observable<UserProfile> {
    return this.put<UserProfile>(
      `profile/${userId}`,
      data,
      this.getProtectedHeaders()
    );
  }

  // Delete user
  deleteUser(userId: number): Observable<any> {
    return this.delete<any>(
      userId.toString(),
      this.getProtectedHeaders()
    );
  }
}
```

#### Step 2: Create Service
File: `src/app/services/user.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRepository, User, UserProfile } from './repositories/user.repository';

/**
 * UserService
 * Business logic for user operations
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private userRepository: UserRepository) {}

  /**
   * Get user profile by ID
   */
  getUserProfile(userId: number): Observable<UserProfile> {
    return this.userRepository.fetchUserProfile(userId);
  }

  /**
   * Get all users with optional filters
   */
  getAllUsers(params?: any): Observable<User[]> {
    return this.userRepository.fetchAllUsers(params);
  }

  /**
   * Update user information
   */
  updateUser(userId: number, userData: Partial<User>): Observable<UserProfile> {
    return this.userRepository.updateUserProfile(userId, userData);
  }

  /**
   * Delete user
   */
  deleteUser(userId: number): Observable<any> {
    return this.userRepository.deleteUser(userId);
  }
}
```

#### Step 3: Use in Component
```typescript
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html'
})
export class UserProfileComponent implements OnInit {
  userProfile: any;
  loading = true;
  error: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit() {
    const userId = 123; // From route params or elsewhere
    this.userService.getUserProfile(userId).subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load user profile';
        this.loading = false;
      }
    });
  }

  updateProfile() {
    const updates = { /* modified data */ };
    this.userService.updateUser(this.userProfile.id, updates).subscribe({
      next: (updated) => {
        this.userProfile = updated;
        console.log('Profile updated successfully');
      },
      error: (err) => this.error = 'Update failed'
    });
  }
}
```

---

## Phase 4: Testing Setup

### Unit Test for Repository

File: `src/app/services/repositories/dashboard.repository.spec.ts`

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DashboardRepository } from './dashboard.repository';
import { AuthService } from '../auth.service';

describe('DashboardRepository', () => {
  let repository: DashboardRepository;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DashboardRepository,
        { provide: AuthService, useValue: authSpy }
      ]
    });

    repository = TestBed.inject(DashboardRepository);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch dashboard summary', () => {
    const mockData = { totalRevenue: 10000 };
    authService.getToken.and.returnValue('mock-token');

    repository.fetchDashboardSummary(
      new Date('2024-01-01'),
      new Date('2024-01-31'),
      1
    ).subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(req => req.url.includes('summary'));
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    req.flush(mockData);
  });
});
```

### Unit Test for Service

File: `src/app/services/dashboard.service.spec.ts`

```typescript
import { TestBed } from '@angular/core/testing';
import { DashboardService } from './dashboard.service';
import { DashboardRepository } from './repositories/dashboard.repository';
import { of } from 'rxjs';

describe('DashboardService', () => {
  let service: DashboardService;
  let repository: jasmine.SpyObj<DashboardRepository>;

  beforeEach(() => {
    const repositorySpy = jasmine.createSpyObj('DashboardRepository', [
      'fetchDashboardSummary',
      'fetchTransactionDetails'
    ]);

    TestBed.configureTestingModule({
      providers: [
        DashboardService,
        { provide: DashboardRepository, useValue: repositorySpy }
      ]
    });

    service = TestBed.inject(DashboardService);
    repository = TestBed.inject(DashboardRepository) as jasmine.SpyObj<DashboardRepository>;
  });

  it('should call repository getDashboardSummary', () => {
    const mockData = { totalRevenue: 10000 };
    repository.fetchDashboardSummary.and.returnValue(of(mockData));

    service.getDashboardSummary(
      new Date('2024-01-01'),
      new Date('2024-01-31'),
      1
    ).subscribe(data => {
      expect(data).toEqual(mockData);
    });

    expect(repository.fetchDashboardSummary).toHaveBeenCalled();
  });
});
```

---

## Best Practices Going Forward

### 1. Always Use Typed Responses
```typescript
// ❌ BAD
fetchData(): Observable<any> {
  return this.get('endpoint');
}

// ✅ GOOD
fetchData(): Observable<DashboardSummary> {
  return this.get<DashboardSummary>('endpoint');
}
```

### 2. Create Interfaces for API Responses
```typescript
// ✅ DO THIS
export interface LoginResponse {
  token: string;
  userId: number;
  email: string;
}

// IN REPOSITORY
login(credentials: LoginRequest): Observable<LoginResponse> {
  return this.post<LoginResponse>('login', credentials);
}
```

### 3. Handle Errors Properly
```typescript
// ✅ DO THIS - in Service
return this.repository.login(credentials).pipe(
  catchError(error => {
    console.error('Login failed:', error);
    return throwError(() => new Error('Invalid credentials'));
  })
);
```

### 4. Centralize Environment Configuration
```typescript
// environment.ts
export const environment = {
  apiUrl: 'https://api.example.com/',
  production: false,
  timeout: 30000
};

// IN REPOSITORY
protected baseUrl = `${environment.apiUrl}Dashboard`;
```

### 5. Use Observables in Components (Don't Subscribe Too Much)
```typescript
// ❌ AVOID multiple subscriptions
this.service.getData().subscribe(...);
this.service.getData().subscribe(...);

// ✅ USE async pipe or combine observables
data$ = this.service.getData();

// In template:
<div>{{ data$ | async }}</div>
```

### 6. Keep Services Focused
```typescript
// ❌ Service doing too much
class DashboardService {
  getDashboard() { }
  formatData() { }
  validateData() { }
  calculateMetrics() { }
  storeInDatabase() { }
}

// ✅ Separated concerns
class DashboardService {
  // Only orchestration and business logic
  getDashboard() { }
}

class DataFormatter {
  // Only data formatting
  format() { }
}
```

---

## Checklist Before Deployment

### Code Quality
- [ ] All TypeScript compilation errors resolved
- [ ] No `any` types used unnecessarily
- [ ] All API endpoints properly typed
- [ ] Error handling implemented
- [ ] Proper error messages

### Testing
- [ ] Unit tests written for repositories
- [ ] Unit tests written for services
- [ ] All tests passing
- [ ] Code coverage > 80%

### Documentation
- [ ] API endpoints documented in repositories
- [ ] Complex business logic commented
- [ ] README updated with new architecture

### Functionality
- [ ] All existing features working
- [ ] No breaking changes
- [ ] Tested on actual backend
- [ ] Error messages user-friendly

### Performance
- [ ] No unnecessary API calls
- [ ] Proper unsubscription from observables
- [ ] Memory leaks addressed

---

## Common Issues & Solutions

### Issue: Service still making HTTP calls

**Solution**: Move HTTP calls to repository
```typescript
// ❌ WRONG - In Service
this.http.get('/api/data').subscribe(...)

// ✅ CORRECT - In Repository
this.http.get('/api/data')

// In Service
this.repository.fetchData().subscribe(...)
```

### Issue: Components directly importing Repository

**Solution**: Always go through service
```typescript
// ❌ WRONG
import { UserRepository } from './repositories/user.repository';

// ✅ CORRECT
import { UserService } from './services/user.service';
```

### Issue: Duplicate code in multiple repositories

**Solution**: Use BaseRepository methods
```typescript
// ❌ WRONG - Duplicating get logic
class UserRepository {
  getUser() { return this.http.get(...); }
}

// ✅ CORRECT
class UserRepository extends BaseRepository {
  getUser() { return this.get<User>('endpoint'); }
}
```

---

## Next Steps

1. ✅ Review refactored auth & dashboard services
2. ⏳ Test all components work with new services
3. ⏳ Update component subscribers to modern syntax (next, error, complete)
4. ⏳ Create unit tests for repositories and services
5. ⏳ Add new repositories as needed for other features
6. ⏳ Add HTTP interceptors for logging/auth if needed
7. ⏳ Update project documentation

---

Questions? Refer to `REPOSITORY_PATTERN_GUIDE.md` for detailed explanations.
