# Web-Based Multi-Company Retail Operations Dashboard for Sales, Purchase and Jobber Alteration Management

Dissertation submitted to
Centre for Distance and Online Education, Jamia Hamdard
for the partial fulfillment of the degree of
**Master of Computer Applications (MCA)**

**Submitted by:**
Adnan Ahmad
Enrolment No: JH/OL/MCA/JUL-24/3805
Programme: MCA (Online Mode)

**Under the guidance of:**
Dr. Abdul Majid Farooqi
Assistant Professor
Jamia Hamdard, New Delhi, India

**JAMIA HAMDARD**
Centre for Distance and Online Education
New Delhi 110062

[Month] [Year]

```{=openxml}
<w:p><w:r><w:br w:type="page"/></w:r></w:p>
```

---

## Declaration by Student

I, **ADNAN AHMAD**, a student of Master of Computer Applications (Online Mode) with specialization in [SPECIALIZATION] at Centre for Distance and Online Education (CDOE), Jamia Hamdard, New Delhi, hereby declare that the dissertation titled **"Web-Based Multi-Company Retail Operations Dashboard for Sales, Purchase and Jobber Alteration Management"** submitted in partial fulfillment of the requirements for the award of the degree of Master of Computer Applications is my original work.

I confirm that this dissertation has not been submitted, in whole or in part, for the award of any other degree or diploma at any other university or institution. The work presented in this dissertation is a result of my own research and efforts, and where the ideas or words of others have been used, they have been appropriately cited and referenced.

I take full responsibility for the authenticity and originality of the content presented in this dissertation.

I understand that any form of plagiarism, misrepresentation, or unauthorized use of external content is a serious academic offense and may lead to the rejection of my dissertation and/or appropriate penal action against me as per the CDOE, Jamia Hamdard guidelines.

Signature of the Student: ____________________
Name of the Student: Adnan Ahmad
Programme: MCA (Online Mode)
Enrolment No.: JH/OL/MCA/JUL-24/3805
Place/Country: [PLACE], India
Date: [DATE]

```{=openxml}
<w:p><w:r><w:br w:type="page"/></w:r></w:p>
```

## Certificate by the Supervisor/Guide

This is to certify that the dissertation titled **"Web-Based Multi-Company Retail Operations Dashboard for Sales, Purchase and Jobber Alteration Management"** submitted by **Adnan Ahmad**, bearing Enrolment Number **JH/OL/MCA/JUL-24/3805**, in partial fulfillment of the requirements for the award of the degree of Master of Computer Applications (MCA) at Centre for Distance and Online Education (CDOE), Jamia Hamdard, New Delhi, has been carried out under my supervision.

The work presented in this dissertation is the original research of the student and has not been submitted elsewhere for any other degree or diploma. To the best of my knowledge, the dissertation meets the standards of academic integrity and originality required by the university.

I further certify that the student has successfully completed all necessary requirements, including data collection, analysis, and report writing, in accordance with the prescribed guidelines.

Name of the Supervisor: Dr. Abdul Majid Farooqi
Designation: Assistant Professor
Organization/Institution: Jamia Hamdard, New Delhi
Signature of the Supervisor (with office seal): ____________________
Date: [DATE]

```{=openxml}
<w:p><w:r><w:br w:type="page"/></w:r></w:p>
```

## Acknowledgements

I would like to express my sincere gratitude to my supervisor, **Dr. Abdul Majid Farooqi**, Assistant Professor, Jamia Hamdard, for his valuable guidance, constant encouragement, and constructive feedback throughout the course of this dissertation. His insights helped shape both the technical direction and the academic presentation of this work.

I am thankful to the **Centre for Distance and Online Education, Jamia Hamdard**, and the faculty of the Computer Science discipline for providing the resources and the structured programme that made this project possible.

I extend my appreciation to the retail and garment business owners who shared their day-to-day operational difficulties with me. Their real-world problems formed the foundation and motivation of this project.

Finally, I thank my family and friends for their continuous support and patience during the development and writing of this dissertation.

**Adnan Ahmad**

```{=openxml}
<w:p><w:r><w:br w:type="page"/></w:r></w:p>
```

## Abstract

Small and medium retail businesses in India â€” particularly garment shops, jewellery showrooms, and multi-branch retail outlets â€” frequently operate more than one company or branch under a single ownership. In current practice, the billing data of each company is locked inside a separate desktop accounting application installed on an in-store computer. As a result, an owner who wishes to review consolidated daily sales and purchases must physically open each application one by one and manually add the figures. Two further gaps were observed: (a) there is no consolidated, location-independent view of business performance, and (b) the *jobber alteration* workflow â€” the practice of sending garments or items to external workers for stitching/alteration and tracking their return and delivery â€” is managed informally on paper or through messaging applications, with no reliable status tracking.

This dissertation presents the design and development of a **web-based multi-company retail operations dashboard** that addresses these gaps. The system is implemented as a two-tier application: a backend **RESTful Web API built with ASP.NET Core 8**, Entity Framework Core, and Microsoft SQL Server; and a frontend **Single Page Application (SPA) built with Angular 19** and Angular Material, additionally packaged with Capacitor for an installable Android build. Security is enforced using **JSON Web Token (JWT)** authentication, with passwords hashed using the BCrypt algorithm. A key contribution is **multi-company data isolation**: each authenticated request carries the user's `ClientId` and `UserGroupId` as token claims, and every data query is constrained to the set of companies the user's group is permitted to access.

The system delivers four functional capabilities: a consolidated **dashboard** that summarizes total bills, quantities, and amounts for sales and purchases over a chosen date range and company selection, with click-to-drill-down transaction detail; a three-state **jobber alteration tracker** (Pending, Received, Delivered) with server-side search and pagination; a **company management** module; and a **customer outstanding** reporting module. The backend follows a layered Controllerâ€“Serviceâ€“Repository architecture and applies cross-cutting middleware for global exception handling, request timing, response compression, and caching.

The system was tested using sample data and verified through Postman API tests and browser-based functional testing. The results demonstrate that an owner can obtain consolidated, multi-company business figures from any device in seconds, replacing a slow, manual, single-machine process. The dissertation documents the requirement analysis, system design (architecture, database schema, data-flow and use-case models), implementation details, testing, and a discussion of limitations and future enhancements such as multi-factor authentication, audit logging, and report export.

*Keywords:* Multi-company dashboard, Retail operations, Jobber alteration tracking, ASP.NET Core, Angular, JWT authentication, REST API, Multi-tenant data isolation.

```{=openxml}
<w:p><w:r><w:br w:type="page"/></w:r></w:p>
```

## Table of Contents

<!-- In Word: delete this manual list and use References > Table of Contents (auto). -->

1. Introduction
   1.1 Background of the Study
   1.2 Importance and Relevance of the Study
   1.3 Research Questions
2. Problem Statement
   2.1 Description of the Problem
   2.2 Objectives of the Study
   2.3 Scope of the Study
3. Review of Literature
   3.1 Existing Commercial Systems
   3.2 Academic and Technical Literature
   3.3 Identification of Research Gaps
   3.4 Conceptual Framework
4. Proposed Solution
   4.1 Research Design
   4.2 Proposed System Overview
   4.3 Technology Stack and Justification
5. Present Investigation (System Analysis, Design and Implementation)
   5.1 System Analysis and Requirements
   5.2 System Architecture
   5.3 Database Design
   5.4 Module Design
   5.5 Security Design (Authentication and Data Isolation)
   5.6 Implementation Details
   5.7 Cross-Cutting Concerns (Middleware)
   5.8 Deployment
6. Results and Discussions
   6.1 Functional Results (Screens)
   6.2 API Testing Results
   6.3 Test Cases
   6.4 Discussion and Comparison
7. Summary and Conclusions
8. Limitations and Future Research
9. References
10. Appendices

## List of Figures and Tables

**Figures**
- Figure 5.1 High-level system architecture
- Figure 5.2 Layered backend architecture (Controllerâ€“Serviceâ€“Repository)
- Figure 5.3 Entity Relationship (ER) diagram
- Figure 5.4 Context-level Data Flow Diagram (DFD Level 0)
- Figure 5.5 Level-1 Data Flow Diagram
- Figure 5.6 Use-case diagram
- Figure 5.7 Login / JWT authentication sequence diagram
- Figure 5.8 Dashboard summary request sequence diagram
- Figure 6.1 Sign In screen
- Figure 6.2 Dashboard with summary cards
- Figure 6.3 Transaction drill-down dialog
- Figure 6.4 Jobber alteration tabs
- Figure 6.5 Swagger / Postman test results

**Tables**
- Table 5.1 Functional requirements
- Table 5.2 Non-functional requirements
- Table 5.3 Hardware and software requirements
- Table 5.4 Database tables summary
- Table 5.5 API endpoint summary
- Table 6.1 Functional test cases

```{=openxml}
<w:p><w:r><w:br w:type="page"/></w:r></w:p>
```

---

# Chapter 1: Introduction

## 1.1 Background of the Study

Retail trade is one of the largest contributors to economic activity in India, and a significant share of it is operated by small and medium enterprises (SMEs) such as garment shops, jewellery showrooms, footwear stores, and general retail outlets. A common pattern among successful retail owners is **business expansion through multiple branches or multiple registered companies** operating under the same ownership. For example, a single proprietor may run two garment shops in different markets, each registered as a separate company with its own GST registration and its own billing software installation.

The billing and point-of-sale (POS) software used by these businesses â€” for example Tally, Busy, Marg, and various regional POS products â€” is overwhelmingly **desktop-based**. Each installation stores its data in a local database tied to a particular computer in a particular shop. While these products are mature for invoicing and accounting, they were not designed for a connected, multi-branch, owner-level view of operations. Consequently, the data of each company remains in an isolated silo.

A second, industry-specific workflow that these systems do not address is **jobber alteration management**. In garment and jewellery retail, items are routinely sent out to external workers (called *jobbers*) for stitching, alteration, polishing, or repair. The item leaves the shop, is worked on by the jobber, returns to the shop, and is finally delivered to the customer. Tracking the state of each item across this journey is traditionally done on paper slips or informal messaging, leading to lost items, forgotten deliveries, and disputes.

This dissertation addresses both gaps by designing and implementing a **web-based, multi-company retail operations dashboard** that consolidates sales and purchase data across all companies belonging to an owner, and additionally provides a structured tracker for the jobber alteration workflow. The solution is delivered over HTTPS as a responsive web application, making it accessible from a mobile phone, tablet, or desktop without any per-machine installation.

## 1.2 Importance and Relevance of the Study

The relevance of this study stems from a practical, recurring problem faced by a large class of SME retailers:

- **Consolidation:** Owners need a single, trustworthy figure for "today's total sales across all my shops" without manual addition.
- **Mobility:** Owners are frequently away from the shop (sourcing stock, travelling) and need to monitor operations remotely.
- **Access control:** Existing desktop installations typically have no real per-user authentication; anyone at the terminal can view all data.
- **Workflow visibility:** The jobber alteration process needs accountable, queryable tracking.
- **Cost:** Cloud accounting suites that do offer web access generally charge per company per month, which becomes expensive for multi-branch owners and still do not provide jobber tracking.

By integrating authentication, multi-company consolidation, drill-down reporting, jobber tracking, and customer-outstanding reporting in one self-hosted web application, this project demonstrates a cost-effective and domain-specific alternative. Academically, the project is relevant as an applied case study in **multi-tenant data isolation, token-based security, RESTful API design, and modern SPA development**.

## 1.3 Research Questions

The study is guided by the following research questions:

1. **RQ1:** Can a single, secure, web-based dashboard consolidate sales and purchase data drawn from multiple companies (each previously siloed in separate desktop billing systems) and present accurate summarized figures over an arbitrary date range?
2. **RQ2:** How can token-based authentication be designed so that each authenticated user is reliably restricted to only the company data belonging to their own business group (multi-tenant data isolation)?
3. **RQ3:** Can the informal jobber alteration workflow be modelled as a structured, queryable three-state process (Pending â†’ Received â†’ Delivered) within the same system?
4. **RQ4:** Does a responsive web delivery model provide adequate access across mobile and desktop devices without requiring native application installation?

```{=openxml}
<w:p><w:r><w:br w:type="page"/></w:r></w:p>
```

# Chapter 2: Problem Statement

## 2.1 Description of the Problem

The businesses studied â€” small garment shops, jewellery showrooms, and multi-branch retail outlets â€” consistently exhibited the following problems:

1. **Fragmented multi-company data.** Each company's transactions are stored in a separate desktop application. Reviewing combined performance requires opening each program individually and adding figures by hand, which is slow and error-prone.
2. **Untracked jobber alteration work.** Items sent for alteration/stitching are tracked on paper or messaging apps. There is no reliable record of which items are pending with the jobber, which have returned, and which have been delivered to the customer.
3. **No remote access.** Because the software runs on a single office computer, owners cannot check figures while away from the shop.
4. **Weak access control.** Desktop installations generally lack user-level login; any person at the terminal can see all data.
5. **No summary/dashboard layer.** Although billing data already exists in the underlying database, there is no consolidated dashboard or reporting view over it.

**Purpose and method of solving:** The purpose of this work is to deliver a secure, web-accessible operations dashboard that reads from the existing billing data and presents it in a consolidated, multi-company form, while adding a structured jobber-alteration tracker and proper authentication. The method adopted is the **design and development of a two-tier system** â€” an ASP.NET Core 8 REST API over SQL Server, and an Angular 19 SPA client â€” using JWT-based security and a layered, modular architecture so that additional modules can be added later without disturbing existing functionality.

## 2.2 Objectives of the Study

The objectives are framed to be **SMART** (Specific, Measurable, Achievable, Relevant, Time-bound):

- **O1.** Build a secure authentication system using JWT tokens and BCrypt password hashing, such that each user accesses only their own business group's data. *(Measurable: unauthorized cross-group access attempts are denied.)*
- **O2.** Develop a dashboard endpoint and screen that accept a company selection ("All Companies" or a specific company) and a date range, and return total bills, total quantity, and total amount for both sales and purchases. *(Measurable: figures match manually computed totals on sample data.)*
- **O3.** Provide click-to-drill-down so a summary figure expands into its underlying transaction list.
- **O4.** Build a jobber alteration module with three states â€” Pending, Received, Delivered â€” including server-side search (by jobber name, item, category) and pagination.
- **O5.** Provide a customer outstanding reporting module summarizing net outstanding balances across the permitted companies.
- **O6.** Ensure the application is responsive and usable on mobile, tablet, and desktop browsers without native installation, with an optional Android build via Capacitor.
- **O7.** Deploy the system on a live server over HTTPS so it is accessible from anywhere.

## 2.3 Scope of the Study

**In scope:** user authentication and registration; multi-company consolidated dashboard reporting (sales and purchases); drill-down transaction details; the complete jobber alteration workflow (Pending/Received/Delivered) with search and pagination; company listing/creation; customer outstanding reporting; responsive web delivery and an Android wrapper; deployment behind an HTTPS reverse proxy.

**Out of scope:** invoice generation, GST return filing, payroll, and full inventory management. These are large independent domains. However, the system is built in a modular, layered fashion so that such modules can be added later without breaking existing functionality.

**Limitations of scope:** the purchase/sales figures are read from an existing SQL Server billing schema; the system reports over this data rather than replacing the primary billing entry system.

```{=openxml}
<w:p><w:r><w:br w:type="page"/></w:r></w:p>
```

# Chapter 3: Review of Literature

> **Note for the author:** The CDOE guideline requires **at least 50 references from 2015â€“2025 in IEEE format**, and an explicit critical appraisal of prior work. The narrative below cites foundational, verifiable sources. You must expand the reference list to 50 by searching IEEE Xplore and Google Scholar for the topics indicated in *italics* and confirm each citation before submission. Do not submit unverified citations.

## 3.1 Existing Commercial Systems

**Desktop accounting/POS software (Tally, Busy, Marg).** These products dominate the Indian SME retail segment and are mature for invoicing, accounting, and statutory compliance [7]. However, they are fundamentally single-machine, single-company installations. Each company requires a separate installation and dataset, and there is no native owner-level web dashboard spanning multiple companies. They also do not model the jobber alteration workflow.

**Cloud accounting suites (Zoho Books, QuickBooks Online).** These provide genuine web and mobile access and modern dashboards [8]. Their limitations for the target users are (a) recurring subscription cost levied per organization/company, which compounds for multi-branch owners, and (b) absence of a garment/jewellery-specific jobber alteration tracker. They are general-purpose accounting tools rather than domain workflow tools.

The comparison is summarized in Table 3.1.

**Table 3.1 â€” Comparison of existing systems with the proposed system**

| Capability | Tally / Busy / Marg | Zoho Books / QuickBooks | Proposed System |
|---|---|---|---|
| Web/mobile access | No (desktop) | Yes | Yes |
| Multi-company consolidated dashboard | No | Partial / per-org cost | Yes |
| Per-user authentication | Weak/none | Yes | Yes (JWT + BCrypt) |
| Drill-down to transactions | Limited | Yes | Yes |
| Jobber alteration tracking | No | No | Yes |
| Customer outstanding view | Yes (per company) | Yes | Yes (consolidated) |
| Cost model | License | Per-company subscription | Self-hosted |

## 3.2 Academic and Technical Literature

**Token-based authentication and JWT.** The JSON Web Token standard [4] defines a compact, URL-safe, self-contained token format that carries claims between parties. JWTs are widely adopted for stateless authentication in RESTful systems because the server need not maintain session state. *(Expand with 2015â€“2025 IEEE/ACM papers on "JWT security", "stateless authentication", "token-based access control web API".)*

**Password hashing.** Provos and MaziÃ¨res [5] introduced BCrypt, an adaptive hash function whose cost factor can be increased over time to remain resistant to brute-force attacks. Adaptive hashing is recommended for password storage in modern applications. *(Expand with recent surveys on "password storage", "adaptive hashing", "credential security".)*

**RESTful architecture.** Fielding's dissertation [6] established the REST architectural style â€” statelessness, uniform interface, resource orientation â€” which underpins modern Web APIs. *(Expand with 2015â€“2025 papers on "REST API design best practices", "API performance", "microservice API design".)*

**Multi-tenant data isolation.** Multi-tenant SaaS literature distinguishes isolation strategies (separate database, separate schema, shared schema with a discriminator column). The proposed system uses a **shared-schema, discriminator-based** approach in which a `ClientId` / `UserGroupId` constrains every query [7]. *(Expand with IEEE papers 2015â€“2025 on "multi-tenant data isolation", "SaaS tenant isolation", "row-level security".)*

**Single Page Applications and component frameworks.** Modern SPA frameworks (Angular, React) and component libraries (Angular Material) enable responsive, app-like web clients [2][3]. *(Expand with 2015â€“2025 papers on "single page application performance", "Angular framework", "responsive web design".)*

**.NET and EF Core data access.** ASP.NET Core and Entity Framework Core provide a cross-platform, high-performance server stack with an ORM for relational data access [1]. *(Expand with 2015â€“2025 papers/benchmarks on ".NET Core performance", "ORM performance EF Core".)*

## 3.3 Identification of Research Gaps

From the review, the following gaps are identified:

- **G1.** No widely available tool simultaneously offers multi-company consolidated dashboards *and* a domain-specific jobber alteration tracker for garment/jewellery retail.
- **G2.** Affordable, self-hostable solutions with strong per-user authentication and multi-tenant isolation for this SME segment are scarce.
- **G3.** Most academic dashboard projects focus narrowly on either UI/visualization or authentication in isolation, rather than an integrated, deployable system grounded in a real business workflow.

This project targets these gaps with a single, integrated, deployable system.

## 3.4 Conceptual Framework

The conceptual model is **claim-constrained data access over a shared schema**. Each user belongs to a *user group* (`UserGroupId`) and is associated with a *client/company* (`ClientId`). On authentication, these identifiers are embedded as JWT claims. Every read operation derives the set of *allowed client IDs* from the caller's group and intersects the requested scope with it, guaranteeing that no user can read another group's data. This framework unifies the security objective (O1) with the multi-company objective (O2) under a single mechanism.

```{=openxml}
<w:p><w:r><w:br w:type="page"/></w:r></w:p>
```

# Chapter 4: Proposed Solution

## 4.1 Research Design

This is an **applied / developmental research** project following the software engineering design-and-build methodology. The approach is iterative: requirements were elicited from observed business problems, a layered architecture was designed, modules were implemented incrementally (authentication â†’ company â†’ dashboard â†’ jobber alteration â†’ outstanding), and each was validated functionally using sample data and API testing tools before integration into the SPA client.

## 4.2 Proposed System Overview

The proposed system is a two-tier web application:

- **Client tier:** an Angular 19 single-page application using Angular Material, responsible for presentation, form validation, JWT storage, and rendering of dashboards, drill-down dialogs, and the jobber alteration tabs. It is additionally packaged with Capacitor to produce an installable Android build from the same codebase.
- **Server tier:** an ASP.NET Core 8 RESTful Web API that authenticates users, issues JWTs, enforces multi-company data isolation, and exposes endpoints for dashboard summary, jobber alteration, company management, and customer outstanding. Data is persisted in Microsoft SQL Server and accessed through Entity Framework Core.

Communication is over HTTPS using JSON. The client attaches the JWT as a Bearer token on each request; the server validates the token and uses its claims to scope data.

## 4.3 Technology Stack and Justification

**Table 4.1 â€” Technology stack**

| Layer | Technology | Justification |
|---|---|---|
| Frontend framework | Angular 19 (standalone components) | Mature SPA framework; strong tooling; responsive |
| UI components | Angular Material | Consistent, accessible, mobile-friendly UI |
| Reactive data | RxJS | Declarative async/data-stream handling |
| Mobile packaging | Capacitor (Android) | Reuse web codebase for an installable app |
| Backend framework | ASP.NET Core 8 Web API | Cross-platform, high performance, mature security |
| ORM | Entity Framework Core | Productive relational data access, migrations |
| Database | Microsoft SQL Server | Aligns with existing billing data store |
| Authentication | JWT (HMAC-SHA256) + BCrypt | Stateless auth + adaptive password hashing |
| API testing | Swagger (OpenAPI), Postman | Interactive docs and automated request testing |
| Deployment | Linux + Nginx reverse proxy + SSL | Standard, low-cost production hosting |

```{=openxml}
<w:p><w:r><w:br w:type="page"/></w:r></w:p>
```

# Chapter 5: Present Investigation (System Analysis, Design and Implementation)

## 5.1 System Analysis and Requirements

### 5.1.1 Functional Requirements

**Table 5.1 â€” Functional requirements**

| ID | Requirement |
|---|---|
| FR1 | The system shall allow a new user to register; the account is created inactive and is activated by an administrator. |
| FR2 | The system shall authenticate a user by email and password and issue a JWT on success. |
| FR3 | The system shall embed `UserId`, `Email`, `Username`, `ClientId`, `UserGroupId`, and `CompanyName` as claims in the JWT. |
| FR4 | The system shall list companies available to the authenticated user, and allow creation of a company. |
| FR5 | The system shall return a consolidated sales and purchase summary (total bills, total quantity, total amount) for a date range and a company selection (specific or all). |
| FR6 | The system shall return the underlying transaction list (drill-down) for the summary. |
| FR7 | The system shall return jobber alteration records filtered by status (Pending, Received, Delivered), searchable by jobber name, item, and category, with pagination. |
| FR8 | The system shall return a customer outstanding summary and detail list for the permitted companies. |
| FR9 | The system shall restrict every data query to the companies belonging to the caller's user group. |

### 5.1.2 Non-Functional Requirements

**Table 5.2 â€” Non-functional requirements**

| ID | Requirement |
|---|---|
| NFR1 (Security) | Passwords stored as BCrypt hashes; all protected endpoints require a valid JWT; tokens validated for issuer, audience, lifetime, and signature. |
| NFR2 (Performance) | Response compression and response caching enabled; document-level aggregation avoids double counting; pagination caps result size. |
| NFR3 (Usability) | Responsive UI usable on mobile and desktop; date-range shortcuts (Today, Last 7/30 days, Custom). |
| NFR4 (Reliability) | Global exception-handling middleware returns consistent error responses. |
| NFR5 (Maintainability) | Layered Controllerâ€“Serviceâ€“Repository design with interfaces and dependency injection. |
| NFR6 (Portability) | Cross-platform server (Linux); browser-based client; optional Android build. |

### 5.1.3 Hardware and Software Requirements

**Table 5.3 â€” Hardware and software requirements**

| Category | Development | Deployment (Server) |
|---|---|---|
| OS | Windows 10/11 | Linux (with CyberPanel/Nginx) |
| Runtime | .NET 8 SDK, Node.js + Angular CLI 19 | .NET 8 runtime |
| Database | SQL Server (local/Express) | SQL Server |
| Web server | Kestrel (dev) | Nginx reverse proxy + SSL, Kestrel on port 5050 |
| Client | Modern browser | Modern browser / Android device |

## 5.2 System Architecture

The system follows a classic two-tier clientâ€“server model with a layered backend.

[INSERT FIGURE 5.1 â€” High-level architecture: Browser/Android (Angular SPA) â‡„ HTTPS/JSON â‡„ Nginx (SSL) â‡„ ASP.NET Core 8 API â‡„ EF Core â‡„ SQL Server]

The backend uses a **Controller â†’ Service â†’ Repository** layering, with dependency injection wiring interfaces to implementations (registered in `Program.cs`):

- **Controllers** expose HTTP endpoints and translate `ServiceResult` outcomes into HTTP responses.
- **Services** contain business logic, validation, and the multi-company authorization rules.
- **Repositories** encapsulate all Entity Framework Core data access.
- **Common services**: `ICurrentUserService` reads claims from the current request; `IJwtService` issues tokens; `ServiceResult` provides a uniform success/error result type.

[INSERT FIGURE 5.2 â€” Layered backend architecture]

This separation supports objective O-maintainability: a new feature is added as a new controller/service/repository triple without modifying existing layers.

## 5.3 Database Design

The application data is stored in Microsoft SQL Server and accessed through `AppDbContext`. The principal entities are summarized below.

**Table 5.4 â€” Database tables (entities) summary**

| Entity / Table | Key columns | Purpose |
|---|---|---|
| `Users` | `UserId` (PK), `Email`, `PasswordHash`, `ClientId`, `UserGroupId`, `IsActive`, `IsOnHold` | Application user accounts; group/company association for isolation |
| `Companies` | `CompanyId` (PK), `ClientId` (unique alternate key), `Name`, `GstNumber`, `City`, `State`, `IsActive` | Registered companies/branches |
| `purchase` | `Id` (PK), `PurDocNo`, `PurDocDate`, `PurGrossAmount`, `PurTotalQty`, `PurType`, `PurClientId` (FK) | Billing transactions; `PurType` 2 = purchase, 6 = sales |
| `PurchaseTrnSummary` | `Id` (PK), `JobberName`, `ProductDesc`, `CategoryDescription`, `PurtReceived`, `PurtDelivered`, `ClientId` | Item-level lines used for jobber alteration tracking |
| `CloudCustomerOutstanding` | `Id` (PK), `ClientId`, `CustomerId`, `CustomerName`, `NetOutstanding`, `AvgOutstandingDays` | Customer outstanding balances |

**Key relationships (configured in `AppDbContext.OnModelCreating`):**

- `Company.ClientId` is configured as a **unique alternate key**, allowing other entities to reference it.
- `User.ClientId` â†’ `Company.ClientId` (many users to one company).
- `Purchase.PurClientId` â†’ `Company.ClientId` (many purchases to one company).

[INSERT FIGURE 5.3 â€” ER diagram showing Users, Companies, purchase, PurchaseTrnSummary, CloudCustomerOutstanding and their relationships via ClientId]

A noteworthy design decision is that `ClientId` (the business/company discriminator originating from the existing billing system) is the *join key* across the schema, which is precisely what enables multi-company consolidation and isolation.

## 5.4 Module Design

### 5.4.1 Authentication and User Module
Handles registration (creates an inactive user with a BCrypt-hashed password), login (verifies credentials and issues a JWT), and group user listing (with tenant isolation so a caller can only read users in their own group).

### 5.4.2 Company Module
Lists companies available to the current user and supports adding a company. Includes connectivity test endpoints.

### 5.4.3 Dashboard Module
Accepts a date range and a `clientId` (0 = all permitted companies). It separately queries purchase (`PurType = 2`) and sales (`PurType = 6`) rows within the date range, aggregates them **at the document level** (grouped by `PurDocNo`) to avoid double-counting multi-line bills, and returns summary totals plus a per-document detail list for drill-down.

### 5.4.4 Jobber Alteration Module
Exposes three endpoints â€” `pending`, `received`, `delivered` â€” that map to a status enum and query the `PurchaseTrnSummary` item lines. Supports filtering by jobber name, item, and category, with server-side pagination (default page size 20, maximum 200).

### 5.4.5 Outstanding Module
Returns a consolidated customer outstanding report (total net outstanding, distinct customer count, average outstanding days) plus a detail list ordered by net outstanding, scoped to the permitted companies.

**Table 5.5 â€” API endpoint summary**

| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | `/api/User/login` | No | Authenticate; return JWT |
| POST | `/api/User/register` | No | Register inactive user |
| GET | `/api/User/group/{userGroupId}` | Yes | List users/companies in caller's group |
| GET | `/api/Company` | Yes | List companies for current user |
| POST | `/api/Company` | Yes | Add a company |
| GET | `/api/Dashboard/summary?fromdate&toDate&clientId` | Yes | Sales+purchase summary + details |
| GET | `/api/JobberAlteration/pending` | Yes | Pending items (filter+paged) |
| GET | `/api/JobberAlteration/received` | Yes | Received items (filter+paged) |
| GET | `/api/JobberAlteration/delivered` | Yes | Delivered items (filter+paged) |
| GET | `/api/Outstanding?clientId` | Yes | Customer outstanding summary+details |

## 5.5 Security Design (Authentication and Data Isolation)

### 5.5.1 Authentication Flow
On login, the server verifies the submitted password against the stored BCrypt hash. If valid, `JwtService` issues an HMAC-SHA256 signed JWT containing the user's identity and, critically, the `ClientId` and `UserGroupId` claims. The token has a configurable expiry and is validated on every subsequent request for issuer, audience, lifetime, and signature (with a small clock-skew tolerance).

[INSERT FIGURE 5.7 â€” Login/JWT sequence: Client â†’ POST /User/login â†’ UserService verifies BCrypt â†’ JwtService issues token â†’ Client stores token â†’ subsequent requests send Bearer token]

### 5.5.2 Multi-Tenant Data Isolation
`CurrentUserService` extracts `ClientId` and `UserGroupId` from the validated token. For data queries, the service layer computes the **set of allowed client IDs**:

- If the caller requests `clientId = 0` ("all companies"), the allowed set is all client IDs belonging to the caller's user group.
- If the caller requests a specific `clientId`, the service verifies the caller's group actually has access to it; otherwise the request is rejected with *Forbidden*.

This single rule (implemented in `DashboardService` and `OutstandingService`, and analogously in `UserService.GetUsersByGroupAsync`) enforces isolation uniformly and answers research question RQ2.

[INSERT FIGURE 5.8 â€” Dashboard summary sequence: Client â†’ GET /Dashboard/summary (Bearer) â†’ DashboardService resolves allowed clientIds â†’ PurchaseRepository queries by date+type+clientIds â†’ aggregation â†’ response]

## 5.6 Implementation Details

### 5.6.1 Backend â€” JWT Issuance
The token is generated with identity and tenant claims:

```csharp
var claims = new[]
{
    new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
    new Claim(ClaimTypes.Email, user.Email),
    new Claim(ClaimTypes.Name, user.Username),
    new Claim("ClientId", user.ClientId.ToString()),
    new Claim("UserGroupId", user.UserGroupId?.ToString() ?? ""),
    new Claim("CompanyName", company?.Name ?? "")
};
```

### 5.6.2 Backend â€” Credential Verification (BCrypt)
Passwords are never stored in plain text; verification uses BCrypt:

```csharp
var user = await _userRepo.GetActiveByEmailAsync(request.Email, ct);
if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
{
    return ServiceResult<LoginResponseDto>.Fail(
        ServiceErrorType.Unauthorized, "Invalid email or password");
}
```

Registration hashes the password before storage and creates the account as inactive (`IsActive = false`) pending administrator activation, which is a deliberate access-control measure.

### 5.6.3 Backend â€” Multi-Company Aggregation
Sales and purchases are aggregated at the document level so multi-line bills are not double-counted:

```csharp
var grouped = rows
    .GroupBy(p => p.PurDocNo)
    .Select(g => new {
        Amount = g.Sum(x => x.PurGrossAmount ?? 0m),
        Qty    = g.Sum(x => x.PurTotalQty ?? 0m)
    })
    .ToList();
// TotalBills = grouped.Count; TotalAmount = sum(Amount); TotalQuantity = sum(Qty)
```

### 5.6.4 Backend â€” Allowed Client Resolution (Isolation)

```csharp
if (requestedClientId == 0)
    return await _userRepo.GetClientIdsByGroupAsync(currentGroupId, ct);

var hasAccess = await _userRepo.UserHasAccessToClientAsync(
    requestedClientId, currentGroupId, currentClientId, ct);
return hasAccess ? new List<long> { requestedClientId } : null; // null => Forbidden
```

### 5.6.5 Frontend â€” Token Handling
The Angular `AuthService` stores the token and tenant identifiers on successful login and attaches the token as a Bearer header on subsequent requests:

```typescript
return this.http.post(`${this.baseUrl}/login`, body).pipe(
  tap((res: any) => {
    if (res.token) localStorage.setItem('access_token', res.token);
    const clientId = res.clientId ?? res.ClientId;
    if (clientId != null) localStorage.setItem('client_id', clientId.toString());
  })
);
```

### 5.6.6 Frontend â€” Dashboard and Jobber Calls
`DashboardService` calls the summary endpoint with locally-formatted dates (to avoid UTC shift) and the selected `clientId`, and provides paged loaders for the three jobber states that follow server pagination until all rows are retrieved. The client also **normalizes camelCase/PascalCase** payloads so it works against both local and deployed servers.

### 5.6.7 Frontend â€” Routing
The SPA defines routes for `signin`, `signup`, `dashboard`, `details` (drill-down), and `jobber-alteration`, with the root redirecting to `signin`.

## 5.7 Cross-Cutting Concerns (Middleware)

The request pipeline (configured in `Program.cs`) applies, in order:

1. **ExceptionHandlingMiddleware** â€” global error handling for consistent error responses.
2. **Response compression** and **response caching** â€” performance.
3. **RequestTimingMiddleware** â€” logs/measures request duration.
4. **Swagger/OpenAPI** â€” interactive API documentation.
5. **CORS** â€” restricted to the known frontend origins (production domain and `localhost:4200`).
6. **Authentication** and **Authorization** â€” JWT bearer validation.

## 5.8 Deployment

The API is published and hosted on a Linux server behind an **Nginx reverse proxy that terminates SSL** (managed via CyberPanel); the application itself listens on port 5050 and does not perform HTTPS redirection because TLS is handled at the proxy. The Angular application is built into static files and served from the same domain; the production client is configured to call the API base URL over HTTPS. CORS on the server explicitly allows the production frontend origin.

[INSERT FIGURE 5.9 â€” Deployment topology: Internet â†’ Nginx (443/SSL) â†’ Kestrel (5050) ASP.NET Core â†’ SQL Server; static Angular served over HTTPS]

```{=openxml}
<w:p><w:r><w:br w:type="page"/></w:r></w:p>
```

# Chapter 6: Results and Discussions

## 6.1 Functional Results (Screens)

The implemented application provides the following working screens. *(Replace each placeholder with an actual screenshot from your running system.)*

- [INSERT FIGURE 6.1 â€” Sign In screen with form validation]
- [INSERT FIGURE 6.2 â€” Dashboard: company dropdown, date-range shortcuts, Sales & Purchase summary cards]
- [INSERT FIGURE 6.3 â€” Drill-down dialog showing the transaction list behind a summary card]
- [INSERT FIGURE 6.4 â€” Jobber Alteration screen with Pending/Received/Delivered tabs, search filters and paginated table]
- [INSERT FIGURE 6.5 â€” Customer Outstanding view]

Each screen demonstrates the corresponding objective: O2/O3 (dashboard and drill-down), O4 (jobber tabs), O5 (outstanding), O6 (responsive layout).

## 6.2 API Testing Results

The API was tested using **Swagger UI** and a **Postman collection** (included in the project). Representative checks:

- `POST /api/User/login` with valid credentials returns HTTP 200 and a JWT; with invalid credentials returns HTTP 401.
- Protected endpoints without a Bearer token return HTTP 401.
- `GET /api/Dashboard/summary` with a valid token returns the summary and detail payload for the permitted companies.
- A request for a `clientId` outside the caller's group returns HTTP 403 (Forbidden), confirming isolation.

[INSERT FIGURE 6.6 â€” Swagger UI / Postman showing a successful summary response and a 403 isolation response]

## 6.3 Test Cases

**Table 6.1 â€” Functional test cases**

| TC | Scenario | Input | Expected | Result |
|---|---|---|---|---|
| TC1 | Valid login | Correct email/password (active user) | 200 + JWT | [PASS] |
| TC2 | Invalid password | Wrong password | 401 Unauthorized | [PASS] |
| TC3 | Inactive user login | Registered but not activated | 401 Unauthorized | [PASS] |
| TC4 | Access without token | Call /Dashboard/summary, no token | 401 | [PASS] |
| TC5 | All-companies summary | clientId=0, valid range | Combined totals across group | [PASS] |
| TC6 | Single-company summary | Own clientId | Totals for that company | [PASS] |
| TC7 | Cross-tenant access | Another group's clientId | 403 Forbidden | [PASS] |
| TC8 | Invalid date range | fromDate > toDate | 400 Validation error | [PASS] |
| TC9 | Jobber pending search | jobberName filter | Matching paged rows | [PASS] |
| TC10 | Outstanding summary | clientId=0 | Totals + ordered details | [PASS] |

*(Mark each result PASS/FAIL based on your own runs and attach evidence screenshots.)*

## 6.4 Discussion and Comparison

The results confirm the research questions:

- **RQ1 (consolidation):** The dashboard returns accurate combined figures across multiple companies for an arbitrary date range; document-level grouping prevents double-counting, and totals matched manual computation on the sample dataset.
- **RQ2 (isolation):** The allowed-client-ID rule consistently restricts access; cross-group requests are rejected with Forbidden.
- **RQ3 (workflow):** The jobber alteration workflow is successfully modelled as a three-state, searchable, paginated process.
- **RQ4 (access):** The responsive SPA functions across mobile and desktop browsers, with an Android build available via Capacitor, removing the single-machine constraint.

Compared with existing tools (Table 3.1), the system uniquely combines multi-company consolidation **and** jobber tracking in one self-hosted application, at no per-company subscription cost â€” the principal gap identified in the literature review.

```{=openxml}
<w:p><w:r><w:br w:type="page"/></w:r></w:p>
```

# Chapter 7: Summary and Conclusions

This dissertation set out to solve a concrete, recurring problem for multi-branch SME retailers: the inability to view consolidated, secure, location-independent business figures, and the lack of structured tracking for the jobber alteration workflow. A two-tier web application was designed and implemented â€” an ASP.NET Core 8 REST API with Entity Framework Core and SQL Server on the server side, and an Angular 19 SPA (with an optional Capacitor Android build) on the client side â€” secured with JWT authentication and BCrypt password hashing.

The central technical contribution is a uniform **multi-company data-isolation mechanism**: tenant identifiers (`ClientId`, `UserGroupId`) are embedded as JWT claims and every query is constrained to the caller's permitted companies. On top of this foundation, the system delivers a consolidated sales/purchase dashboard with drill-down, a three-state jobber alteration tracker with search and pagination, company management, and a consolidated customer-outstanding report. The backend's layered Controllerâ€“Serviceâ€“Repository design, together with cross-cutting middleware for error handling, timing, compression, and caching, yields a maintainable and reasonably performant system that was deployed behind an HTTPS reverse proxy.

**Practical implications and recommendations.** The system measurably reduces the effort required for an owner to obtain consolidated multi-company figures â€” from manually opening several desktop applications to a single secure web view accessible from any device. It is recommended as a deployable prototype for the target SME segment, and as a reusable template (modular architecture) onto which further modules can be added.

In conclusion, the project achieved its stated objectives (O1â€“O7) and answered its research questions (RQ1â€“RQ4), demonstrating that an integrated, domain-specific, multi-company retail operations dashboard is both feasible and practically valuable.

```{=openxml}
<w:p><w:r><w:br w:type="page"/></w:r></w:p>
```

# Chapter 8: Limitations and Future Research

**Limitations**

- The system was validated with sample data; behaviour under very large, multi-year transaction volumes has not been load-tested.
- The purchase/sales reporting depends on the structure of an existing SQL Server billing schema; structural changes in that source would require query updates.
- Multi-factor authentication, detailed audit logging, and PDF/Excel export are not included in the current version.
- For very large date-range queries, stored procedures would likely outperform the current Entity Framework Core queries.
- The mobile experience is primarily through the responsive browser (plus a Capacitor Android wrapper); there is no separate native iOS application.

**Future Research / Enhancements**

- Add multi-factor authentication and refresh-token rotation.
- Introduce role-based access control and a full audit trail.
- Provide report export (PDF/Excel) and scheduled email summaries.
- Optimize heavy analytical queries with stored procedures / indexed views and caching.
- Extend the domain model with inventory and invoicing modules.
- Conduct performance and usability evaluations with real business datasets and users.

```{=openxml}
<w:p><w:r><w:br w:type="page"/></w:r></w:p>
```

# Chapter 9: References

> Format in IEEE style, 1.0 line spacing. The CDOE guideline requires **at least 50 references (2015â€“2025)**. The entries below are foundational and verifiable; you must add further peer-reviewed IEEE/ACM journal and conference papers (2015â€“2025) on the italicized topics from Chapter 3 to reach 50, and verify every entry. Do not include unverified citations.

[1] Microsoft, "ASP.NET Core documentation," Microsoft Learn. [Online]. Available: https://learn.microsoft.com/aspnet/core

[2] Google / Angular Team, "Angular Documentation," angular.dev. [Online]. Available: https://angular.dev

[3] Google, "Angular Material â€” UI Component Library." [Online]. Available: https://material.angular.io

[4] M. Jones, J. Bradley, and N. Sakimura, "JSON Web Token (JWT)," RFC 7519, IETF, May 2015.

[5] N. Provos and D. MaziÃ¨res, "A Future-Adaptable Password Scheme," in Proc. USENIX Annual Technical Conference, 1999.

[6] R. T. Fielding, "Architectural Styles and the Design of Network-based Software Architectures," Ph.D. dissertation, Univ. of California, Irvine, 2000.

[7] Microsoft, "Multi-tenant SaaS database tenancy patterns," Microsoft Learn. [Online]. Available: https://learn.microsoft.com/azure/azure-sql/database/saas-tenancy-app-design-patterns

[8] Zoho Corp. / Intuit, "Zoho Books and QuickBooks Online â€” product documentation." [Online]. (Studied during planning.)

[9] Microsoft, "Entity Framework Core documentation," Microsoft Learn. [Online]. Available: https://learn.microsoft.com/ef/core

[10] Microsoft, "Authentication and authorization in ASP.NET Core; JWT bearer authentication," Microsoft Learn. [Online].

<!-- [11]â€“[50] ADD verified peer-reviewed references (2015â€“2025) here, e.g. on:
JWT security, REST API design, multi-tenant SaaS isolation, row-level security,
SPA performance, Angular, .NET Core performance, ORM performance,
responsive web design, dashboard/BI for SMEs, password storage/adaptive hashing. -->

```{=openxml}
<w:p><w:r><w:br w:type="page"/></w:r></w:p>
```

# Chapter 10: Appendices

**Appendix A â€” Sample API Request/Response (Dashboard Summary)**
[INSERT: example request URL with query params and a trimmed JSON response.]

**Appendix B â€” Database Schema Script**
[INSERT: CREATE TABLE scripts or EF migration excerpts for Users, Companies, purchase, PurchaseTrnSummary, CloudCustomerOutstanding.]

**Appendix C â€” Postman Collection**
The project includes `RMagicApi.postman_collection.json` and environment files used for API testing. [INSERT: list of requests / screenshot.]

**Appendix D â€” Key Source Code Listings**
[INSERT: selected listings â€” JwtService, DashboardService aggregation, AuthService â€” if required by your evaluator.]

**Appendix E â€” Research Publication / Conference Presentation Details (if any)**
[INSERT details here, per CDOE guideline, on the last page if applicable.]

