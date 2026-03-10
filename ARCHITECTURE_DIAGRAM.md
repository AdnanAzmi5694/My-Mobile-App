# Architecture Visualization

## Layered Architecture Diagram

```
╔════════════════════════════════════════════════════════════════════╗
║                     USER INTERFACE (Components)                     ║
║  ┌──────────────────────────────────────────────────────────────┐  ║
║  │ SigninComponent │ SignupComponent │ DashboardComponent │ etc  │  ║
║  └──────────────────────┬───────────────────────────────────────┘  ║
╚════════════════════════╪════════════════════════════════════════════╝
                         │
                         │ Inject & Call
                         │
╔════════════════════════▼════════════════════════════════════════════╗
║                  BUSINESS LOGIC LAYER (Services)                    ║
║  ┌────────────────────────────────────────────────────────────┐   ║
║  │              AuthService                                    │   ║
║  │  ├─ login()                                                │   ║
║  │  ├─ register()                                             │   ║
║  │  ├─ logout()                                               │   ║
║  │  ├─ isLoggedIn()                                           │   ║
║  │  └─ getUserGroupId()                                       │   ║
║  └────────────────┬─────────────────────────────────────────┘   ║
║                   │                                                ║
║  ┌────────────────▼─────────────────────────────────────────┐   ║
║  │              DashboardService                              │   ║
║  │  ├─ getDashboardSummary()                                 │   ║
║  │  ├─ getTransactionDetails()                               │   ║
║  │  ├─ getGroupUsers()                                       │   ║
║  │  └─ getCompanyInfo()                                      │   ║
║  └────────────────┬─────────────────────────────────────────┘   ║
╚════════════════════╪═══════════════════════════════════════════════╝
                     │
                     │ Delegate to Repository
                     │
╔════════════════════▼═══════════════════════════════════════════════╗
║             DATA ACCESS LAYER (Repositories)                       ║
║  ┌────────────────────────────────────────────────────────────┐  ║
║  │                  BaseRepository (Abstract)                 │  ║
║  │  ├─ get<T>()                                               │  ║
║  │  ├─ getList<T>()                                           │  ║
║  │  ├─ post<T>()                                              │  ║
║  │  ├─ put<T>()                                               │  ║
║  │  ├─ patch<T>()                                             │  ║
║  │  ├─ delete<T>()                                            │  ║
║  │  └─ handleError()                                          │  ║
║  └────────────────────────────────────────────────────────────┘  ║
║                           ▲                                        ║
║         ┌─────────────────┴─────────────────┐                    ║
║         │                                     │                    ║
║  ┌──────▼──────────────┐  ┌────────────────▼──────┐             ║
║  │ AuthRepository      │  │ DashboardRepository   │             ║
║  │  ├─ login()         │  │  ├─ fetchDashboard()  │             ║
║  │  ├─ signUp()        │  │  ├─ fetchTransactions │             ║
║  │  ├─ refreshToken()  │  │  ├─ fetchGroupUsers() │             ║
║  │  └─ verifyToken()   │  │  └─ fetchCompanyInfo()│             ║
║  └─────────────────────┘  └──────────────────────┘             ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
                         │
                         │ Use HttpClient
                         │
╔════════════════════════▼═════════════════════════════════════════╗
║              HTTP COMMUNICATION LAYER                            ║
║         Angular HttpClient + RxJS Observables                   ║
╚════════════════════════┬═════════════════════════════════════════╝
                         │
╔════════════════════════▼═════════════════════════════════════════╗
║                  REST API (Backend)                              ║
║  https://api.example.com/{Auth,Dashboard,User}/...             ║
╚═══════════════════════════════════════════════════════════════════╝
```

## Data Flow Example: Login Process

```
┌─────────────────────┐
│  Signin Component   │
│  (User enters email │
│   & password)       │
└──────────┬──────────┘
           │
           │ Calls: authService.login(credentials)
           │
           ▼
┌──────────────────────────────┐
│      AuthService             │
│  ┌────────────────────────┐  │
│  │ Receives credentials   │  │
│  │ Delegates to           │  │
│  │ authRepository         │  │
│  └──────────┬─────────────┘  │
└─────────────┼──────────────────┘
              │
              │ Calls: authRepository.login(loginRequest)
              │
              ▼
┌──────────────────────────────┐
│    AuthRepository            │
│  ┌────────────────────────┐  │
│  │ Formats request        │  │
│  │ Sets headers           │  │
│  │ Calls HttpClient.post()│  │
│  └──────────┬─────────────┘  │
└─────────────┼──────────────────┘
              │
              │ http.post('Auth/login', credentials)
              │
              ▼
┌──────────────────────────────┐
│      REST API Backend        │
│  https://api.../Auth/login   │
│                              │
│  Returns: { token, userId }  │
└──────────┬───────────────────┘
           │
           │ Response Observable
           │
           ▼
┌──────────────────────────────┐
│      AuthRepository          │
│  Receives response           │
│  Passes through .tap()       │
└──────────┬───────────────────┘
           │
           │ Response propagates up
           │
           ▼
┌──────────────────────────────┐
│      AuthService             │
│  .tap() stores token         │
│  in localStorage             │
└──────────┬──────────────────┘
           │
           │ Observable emits response
           │
           ▼
┌──────────────────────────────┐
│   Signin Component           │
│  .subscribe() handles        │
│  response or error           │
│  Updates UI accordingly      │
└──────────────────────────────┘
```

## File Structure

```
d:\jyoti\my-mobile-app\
│
├── src\
│   └── app\
│       ├── dashboard\
│       │   ├── dashboard.component.ts
│       │   ├── dashboard.component.html
│       │   └── dashboard.component.scss
│       │
│       ├── signin\
│       │   ├── signin.component.ts
│       │   ├── signin.component.html
│       │   └── signin.component.scss
│       │
│       ├── sign-up\
│       │   ├── sign-up.component.ts
│       │   ├── sign-up.component.html
│       │   └── sign-up.component.scss
│       │
│       ├── services\
│       │   ├── repositories\
│       │   │   ├── base.repository.ts          ✨ NEW
│       │   │   ├── auth.repository.ts          ✨ NEW
│       │   │   └── dashboard.repository.ts     ✨ NEW
│       │   │
│       │   ├── auth.service.ts                 🔄 REFACTORED
│       │   └── dashboard.service.ts            🔄 REFACTORED
│       │
│       ├── models\
│       │   └── dashboard.models.ts
│       │
│       └── app.routes.ts
│
├── REPOSITORY_PATTERN_GUIDE.md                 ✨ NEW
├── REPOSITORY_PATTERN_QUICK_REFERENCE.md       ✨ NEW
├── ARCHITECTURE_DIAGRAM.md                     ✨ NEW
├── package.json
└── angular.json
```

## Component → Service → Repository Flow

```
DashboardComponent
    │
    ├─────────────────────────────────────────────┐
    │                                             │
    ▼                                             ▼
AuthService                              DashboardService
    │                                             │
    ├─ login()                       ┌─ getDashboardSummary()
    ├─ register()                    ├─ getTransactionDetails()
    ├─ logout()                      ├─ getGroupUsers()
    ├─ getToken()                    └─ getCompanyInfo()
    └─ isLoggedIn()
            │                                     │
            ▼                                     ▼
     AuthRepository                      DashboardRepository
            │                                     │
            ├─ login()                  ├─ fetchDashboardSummary()
            ├─ signUp()                 ├─ fetchTransactionDetails()
            └─ refreshToken()           ├─ fetchGroupUsers()
            │                           └─ fetchCompanyInfo()
            │                                     │
            └─────────────────┬────────────────────┘
                              │
                              ▼
                        HttpClient API
                              │
                              ▼
                        REST Backend API
```

## Dependency Injection Chain

```
@Injectable({ providedIn: 'root' })
class BaseRepository {
    constructor(protected httpClient: HttpClient) {}
}

@Injectable({ providedIn: 'root' })
class AuthRepository extends BaseRepository {
    constructor(httpClient: HttpClient) { super(httpClient); }
}

@Injectable({ providedIn: 'root' })
class AuthService {
    constructor(private authRepository: AuthRepository) {}
}

Component {
    constructor(private authService: AuthService) {}
}
```

## Interceptor Integration Point

If you need to add HTTP interceptors (for logging, auth headers, etc.):

```
HttpClient
    │
    ▼
[HttpInterceptor]  ← Add here for:
    │                 - Auth token injection
    │                 - Request/Response logging
    │                 - Error handling
    ▼
Repository.post/get/put/delete()
```

---

This architecture ensures:
✅ Single Responsibility Principle
✅ Easy Testing & Mocking
✅ Code Reusability
✅ Clear Data Flow
✅ Maintainable Codebase
