<!--
============================================================================
DISSERTATION DIAGRAMS (Mermaid)
============================================================================
HOW TO TURN THESE INTO IMAGES FOR YOUR WORD DOCUMENT:

Option A (easiest): Open https://mermaid.live , paste one diagram's code
   (everything between ```mermaid and ```), then use Actions > PNG/SVG to
   download. Paste the image into Word at the matching [INSERT FIGURE ...].

Option B (in editor): Install a "Markdown Preview Mermaid" extension in
   VS Code / Cursor, open this file's preview, right-click the rendered
   diagram to copy/save as image.

Option C (command line, needs Node): 
   npx -p @mermaid-js/mermaid-cli mmdc -i Diagrams.md -o diagrams.pdf
   (renders all diagrams to a PDF you can screenshot, or use -o out.png per file)

Figure numbers match the placeholders in Dissertation_RMagic.md.
============================================================================
-->

# Dissertation Diagrams

## Figure 5.1 — High-Level System Architecture

```mermaid
flowchart LR
    subgraph Client["Client Tier"]
        B["Web Browser<br/>(Angular 19 SPA)"]
        A["Android App<br/>(Capacitor wrapper)"]
    end

    subgraph Edge["Server Edge"]
        N["Nginx Reverse Proxy<br/>(SSL / HTTPS 443)"]
    end

    subgraph Server["Application Tier"]
        K["ASP.NET Core 8 Web API<br/>(Kestrel : 5050)"]
        E["Entity Framework Core"]
    end

    DB[("Microsoft SQL Server")]

    B -- "HTTPS / JSON + JWT" --> N
    A -- "HTTPS / JSON + JWT" --> N
    N --> K
    K --> E
    E --> DB
```

## Figure 5.2 — Layered Backend Architecture (Controller → Service → Repository)

```mermaid
flowchart TD
    C["Controllers<br/>User, Company, Dashboard,<br/>JobberAlteration, Outstanding"]
    S["Services (Business Logic)<br/>UserService, CompanyService,<br/>DashboardService, JobberAlterationService,<br/>OutstandingService"]
    R["Repositories (Data Access)<br/>Users, Companies, Purchases,<br/>JobberAlterations, Outstanding"]
    X["Cross-Cutting<br/>JwtService, CurrentUserService,<br/>ServiceResult"]
    DBC["AppDbContext (EF Core)"]
    DB[("SQL Server")]

    C --> S
    S --> R
    R --> DBC
    DBC --> DB
    X -.used by.- C
    X -.used by.- S
```

## Figure 5.3 — Entity Relationship (ER) Diagram

```mermaid
erDiagram
    COMPANY ||--o{ USER : "has (ClientId)"
    COMPANY ||--o{ PURCHASE : "has (PurClientId)"
    COMPANY ||--o{ PURCHASETRNSUMMARY : "has (ClientId)"
    COMPANY ||--o{ CLOUDCUSTOMEROUTSTANDING : "has (ClientId)"

    COMPANY {
        int CompanyId PK
        long ClientId AK "unique alternate key"
        string Name
        string GstNumber
        string City
        string State
        bool IsActive
    }
    USER {
        int UserId PK
        string Username
        string Email
        string PasswordHash
        long ClientId FK
        long UserGroupId
        bool IsActive
        bool IsOnHold
    }
    PURCHASE {
        long Id PK
        long PurDocNo
        datetime PurDocDate
        decimal PurGrossAmount
        decimal PurTotalQty
        int PurType "2=purchase,6=sales"
        long PurClientId FK
    }
    PURCHASETRNSUMMARY {
        long Id PK
        string JobberName
        string ProductDesc
        string CategoryDescription
        bool PurtReceived
        bool PurtDelivered
        long ClientId
    }
    CLOUDCUSTOMEROUTSTANDING {
        long Id PK
        long ClientId
        long CustomerId
        string CustomerName
        decimal NetOutstanding
        int AvgOutstandingDays
    }
```

## Figure 5.4 — Context-Level Data Flow Diagram (DFD Level 0)

```mermaid
flowchart LR
    Owner(("Business Owner /<br/>User"))
    Admin(("Administrator"))
    System["RMagic Multi-Company<br/>Operations Dashboard"]
    Billing[("Existing Billing<br/>Data (SQL Server)")]

    Owner -- "login, date range,<br/>company selection, filters" --> System
    System -- "JWT, summaries, drill-down,<br/>jobber lists, outstanding" --> Owner
    Admin -- "activate user accounts" --> System
    Billing -- "purchase/sales,<br/>item, outstanding rows" --> System
```

## Figure 5.5 — Level-1 Data Flow Diagram

```mermaid
flowchart TD
    U(("User"))
    P1["1.0 Authentication<br/>(login / register)"]
    P2["2.0 Dashboard Summary"]
    P3["3.0 Jobber Alteration"]
    P4["4.0 Outstanding"]
    P5["5.0 Company Mgmt"]

    DUsers[("Users")]
    DPurch[("purchase")]
    DTrn[("PurchaseTrnSummary")]
    DOut[("CloudCustomerOutstanding")]
    DComp[("Companies")]

    U --> P1
    P1 <--> DUsers
    P1 -- "JWT (ClientId, UserGroupId)" --> U

    U --> P2
    P2 -- "allowed ClientIds" --> DUsers
    P2 <--> DPurch
    P2 -- "totals + details" --> U

    U --> P3
    P3 <--> DTrn
    P3 -- "paged pending/received/delivered" --> U

    U --> P4
    P4 <--> DOut
    P4 -- "totals + details" --> U

    U --> P5
    P5 <--> DComp
```

## Figure 5.6 — Use-Case Diagram

```mermaid
flowchart LR
    Owner(("Business Owner"))
    Admin(("Administrator"))

    UC1(["Register"])
    UC2(["Login (JWT)"])
    UC3(["View Consolidated Dashboard"])
    UC4(["Drill-down Transactions"])
    UC5(["Track Jobber Alterations"])
    UC6(["View Outstanding"])
    UC7(["Manage Companies"])
    UC8(["Activate User"])

    Owner --- UC1
    Owner --- UC2
    Owner --- UC3
    Owner --- UC4
    Owner --- UC5
    Owner --- UC6
    Owner --- UC7
    Admin --- UC8

    UC3 -. includes .-> UC2
    UC4 -. extends .-> UC3
```

## Figure 5.7 — Login / JWT Authentication Sequence

```mermaid
sequenceDiagram
    actor U as User
    participant SPA as Angular SPA
    participant API as UserController
    participant SVC as UserService
    participant DB as SQL Server
    participant JWT as JwtService

    U->>SPA: enter email + password
    SPA->>API: POST /api/User/login
    API->>SVC: LoginAsync(request)
    SVC->>DB: GetActiveByEmailAsync(email)
    DB-->>SVC: user (with PasswordHash)
    SVC->>SVC: BCrypt.Verify(password, hash)
    alt valid credentials
        SVC->>JWT: GenerateToken(user, company)
        JWT-->>SVC: signed JWT (ClientId, UserGroupId, ...)
        SVC-->>API: Success(token, companyName)
        API-->>SPA: 200 OK + JWT
        SPA->>SPA: store token in localStorage
    else invalid
        SVC-->>API: Fail(Unauthorized)
        API-->>SPA: 401 Unauthorized
    end
```

## Figure 5.8 — Dashboard Summary Request Sequence (with Isolation)

```mermaid
sequenceDiagram
    actor U as User
    participant SPA as Angular SPA
    participant API as DashboardController
    participant SVC as DashboardService
    participant CUR as CurrentUserService
    participant REP as PurchaseRepository
    participant DB as SQL Server

    U->>SPA: pick company + date range
    SPA->>API: GET /Dashboard/summary (Bearer JWT)
    API->>SVC: GetSummaryAsync(request)
    SVC->>CUR: read ClientId, UserGroupId (claims)
    CUR-->>SVC: tenant identifiers
    SVC->>SVC: resolve allowed ClientIds
    alt requested company not allowed
        SVC-->>API: Fail(Forbidden)
        API-->>SPA: 403 Forbidden
    else allowed
        SVC->>REP: query purchases (type=2) by date+clientIds
        SVC->>REP: query sales (type=6) by date+clientIds
        REP->>DB: SELECT ...
        DB-->>REP: rows
        REP-->>SVC: purchase + sales rows
        SVC->>SVC: group by PurDocNo, aggregate
        SVC-->>API: Success(summary + details)
        API-->>SPA: 200 OK + JSON
        SPA->>U: render cards + drill-down
    end
```

## Figure 5.9 — Deployment Topology

```mermaid
flowchart TD
    Internet(("Internet / Devices"))
    subgraph Linux["Linux Server (CyberPanel)"]
        Nginx["Nginx<br/>SSL Termination (443)"]
        Static["Static Angular Build"]
        Kestrel["ASP.NET Core 8 (Kestrel :5050)"]
    end
    SQL[("SQL Server")]

    Internet -- HTTPS --> Nginx
    Nginx -- "/ (static files)" --> Static
    Nginx -- "/api reverse proxy" --> Kestrel
    Kestrel --> SQL
```
