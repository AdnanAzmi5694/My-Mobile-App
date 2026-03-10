# Backend API Implementation Prompt

## 🎯 Objective
Implement backend changes to support company group filtering with user details in dropdown

## 📋 Database Context
**Important:** Your database name is `rmagic`, so use `_rmagicContext` instead of `_context` in all database operations.

## 📋 Required Changes

### 1. Update JWT Token Generation
**File:** `AuthController.cs` or `TokenService.cs`

```csharp
// Add UserGroupId to JWT claims
var claims = new[]
{
    new Claim(ClaimTypes.NameIdentifier, user.ClientId.ToString()),
    new Claim(ClaimTypes.Email, user.Email),
    new Claim(ClaimTypes.Name, user.Username),
    new Claim("UserGroupId", user.UserGroupId.ToString()), // <-- ADD THIS
    new Claim("CompanyName", company?.Name ?? "")
};

var token = new JwtSecurityToken(
    issuer: _issuer,
    audience: _audience,
    claims: claims,
    expires: DateTime.Now.AddMinutes(60),
    signingCredentials: credentials);
```

### 2. Add Get Users by UserGroupId Endpoint
**File:** `UserController.cs`

```csharp
[HttpGet("group/{userGroupId}")]
[Authorize]
public async Task<IActionResult> GetUsersByUserGroupId(int userGroupId)
{
    try
    {
        if (userGroupId <= 0)
        {
            return BadRequest(new { error = "Valid UserGroupId is required" });
        }

        // Get current user's ClientId from token
        var currentClientIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(currentClientIdClaim, out int currentClientId))
        {
            return Unauthorized(new { error = "Invalid user information in token" });
        }

        // Get users from same UserGroupId with company details
        var users = await _rmagicContext.Users
            .Where(u => u.UserGroupId == userGroupId && u.IsActive == true)
            .Join(_rmagicContext.Companies, 
                user => user.ClientId, 
                company => company.ClientId, 
                (user, company) => new { user, company })
            .Select(x => new 
            {
                UserId = x.user.UserId,
                Username = x.user.Username,
                Email = x.user.Email,
                ClientId = x.user.ClientId,
                CompanyName = x.company.Name,
                UserGroupId = x.user.UserGroupId,
                IsActive = x.user.IsActive,
                CreatedAt = x.user.CreatedAt
            })
            .OrderBy(u => u.Username)
            .ToListAsync();

        // Get unique companies from these users
        var companies = users
            .GroupBy(u => u.ClientId)
            .Select(g => new 
            {
                ClientId = g.Key,
                CompanyName = g.First().CompanyName,
                UserGroupId = userGroupId,
                Users = g.ToList()
            })
            .OrderBy(c => c.CompanyName)
            .ToList();

        _logger.LogInformation("Retrieved {Count} users and {CompanyCount} companies for UserGroupId {UserGroupId}", 
            users.Count, companies.Count, userGroupId);

        return Ok(new { 
            users = users,
            companies = companies,
            currentUserClientId = currentClientId,
            userGroupId = userGroupId,
            totalCount = users.Count
        });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error occurred while retrieving users for UserGroupId {UserGroupId}", userGroupId);
        return StatusCode(500, new { 
            error = "An internal error occurred while retrieving users",
            details = ex.Message 
        });
    }
}
```

### 3. Update Dashboard API to Support Company Filtering
**File:** `DashboardController.cs`

```csharp
[HttpGet("summary")]
[Authorize]
public async Task<IActionResult> GetDashboardSummary(
    [FromQuery] DateTime fromdate, 
    [FromQuery] DateTime toDate, 
    [FromQuery] int clientId = 0)
{
    try
    {
        // Get current user's info from token
        var currentClientIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userGroupIdClaim = User.FindFirst("UserGroupId")?.Value;
        
        if (!int.TryParse(currentClientIdClaim, out int currentClientId))
        {
            return Unauthorized(new { error = "Invalid user information" });
        }

        if (!int.TryParse(userGroupIdClaim, out int currentUserGroupId))
        {
            return Unauthorized(new { error = "User group information not found" });
        }

        IQueryable<User> query = _rmagicContext.Users
            .Where(u => u.IsActive == true);

        // Apply company filtering
        if (clientId == 0)
        {
            // "All Companies" - get users from same UserGroupId only
            query = query.Where(u => u.UserGroupId == currentUserGroupId);
        }
        else
        {
            // Specific company - verify user has access
            query = query.Where(u => u.ClientId == clientId && 
                                   (u.UserGroupId == currentUserGroupId || clientId == currentClientId));
        }

        // Apply date filtering
        var fromDateOnly = fromdate.Date;
        var toDateOnly = toDate.Date;

        var users = await _rmagicContext.Users
            .Where(u => u.CreatedAt.Date >= fromDateOnly && u.CreatedAt.Date <= toDateOnly)
            .ToListAsync();

        // Calculate summary statistics
        var summary = new
        {
            totalUsers = users.Count,
            activeUsers = users.Count(u => u.IsActive),
            companies = users
                .GroupBy(u => u.ClientId)
                .Select(g => new 
                {
                    clientId = g.Key,
                    companyName = g.First().ClientId, // You'll need to join with Companies table
                    userCount = g.Count()
                })
                .ToList(),
            dateRange = new
            {
                fromDate = fromDateOnly.ToString("yyyy-MM-dd"),
                toDate = toDateOnly.ToString("yyyy-MM-dd"),
                days = (toDateOnly - fromDateOnly).Days + 1
            },
            filteredBy = clientId == 0 ? "All Companies (Same Group)" : $"Company {clientId}",
            userGroupId = currentUserGroupId,
            generatedAt = DateTime.UtcNow
        };

        _logger.LogInformation("Dashboard summary generated for ClientId {ClientId}, UserGroupId {UserGroupId}, DateRange {FromDate} to {ToDate}", 
            clientId, currentUserGroupId, fromDateOnly, toDateOnly);

        return Ok(summary);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error generating dashboard summary for ClientId {ClientId}, UserGroupId {UserGroupId}", 
            clientId, currentUserGroupId);
        return StatusCode(500, new { 
            error = "An internal error occurred while generating dashboard summary",
            details = ex.Message 
        });
    }
}
```

### 4. Database Model Updates (if needed)
**File:** `User.cs` Model

```csharp
public class User
{
    public int UserId { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public string MobileNumber { get; set; }
    public bool IsActive { get; set; }
    public bool IsOnHold { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public int ClientId { get; set; }
    public string Password { get; set; } // Keep for compatibility
    public int? UserGroupId { get; set; } // <-- ADD THIS if not exists
    
    // Navigation properties
    public virtual Company Company { get; set; }
    public virtual ICollection<User> GroupMembers { get; set; }
}
```

### 5. Company Model (if not exists)
**File:** `Company.cs` Model

```csharp
public class Company
{
    public int ClientId { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
    public string? Address { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Navigation properties
    public virtual ICollection<User> Users { get; set; }
}
```

## 🔧 Implementation Steps

1. **Update JWT Generation** to include UserGroupId claim
2. **Add GetUsersByUserGroupId** endpoint in UserController
3. **Update Dashboard API** to support company filtering
4. **Update Database Models** if UserGroupId doesn't exist
5. **Test with Postman/curl** before frontend integration

## 🧪 Testing Commands

### Test JWT Token:
```bash
curl -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"Password123"}'
```

### Test Users by Group:
```bash
curl -X GET "http://localhost:5000/api/user/group/1000006" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test Dashboard Summary:
```bash
curl -X GET "http://localhost:5000/api/dashboard/summary?fromdate=2026-01-11&toDate=2026-01-18&clientId=0" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📋 Expected API Responses

### Users by Group Response:
```json
{
  "users": [
    {
      "userId": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "clientId": 1000001,
      "companyName": "Company A",
      "userGroupId": 1000006
    }
  ],
  "companies": [
    {
      "clientId": 1000001,
      "companyName": "Company A",
      "userGroupId": 1000006,
      "users": [...]
    }
  ],
  "currentUserClientId": 1000001,
  "userGroupId": 1000006,
  "totalCount": 3
}
```

### Dashboard Summary Response:
```json
{
  "totalUsers": 3,
  "activeUsers": 3,
  "companies": [...],
  "dateRange": {
    "fromDate": "2026-01-11",
    "toDate": "2026-01-18",
    "days": 8
  },
  "filteredBy": "All Companies (Same Group)",
  "userGroupId": 1000006,
  "generatedAt": "2026-01-18T08:30:00Z"
}
```

## 🚀 Ready for Frontend Integration

Once these backend changes are implemented, the Angular frontend will automatically:
- Load users from same UserGroupId
- Display companies with user details in dropdown
- Support "All Companies" cross-group access
- Filter dashboard data by selected company
- Show proper user counts and information

## 📋 Jobber Alteration Backend Requirements

### 6. Add Jobber Alteration API Endpoint
**File:** `DashboardController.cs` or new `AlterationController.cs`

```csharp
[HttpGet("alterations")]
[Authorize]
public async Task<IActionResult> GetAlterationRecords()
{
    try
    {
        // Get current user's ClientId from token
        var currentClientIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(currentClientIdClaim, out int currentClientId))
        {
            return Unauthorized(new { error = "Invalid user information" });
        }

        // Get all alteration records (assuming table name is PurchaseTransactions or similar)
        var alterationRecords = await _rmagicContext.PurchaseTransactions
            .Where(pt => pt.ClientId == currentClientId) // Filter by user's company
            .Select(pt => new 
            {
                Id = pt.Id,
                PurtPurId = pt.PurtPurId,
                BarcodeDesc = pt.BarcodeDesc,
                ProductCode = pt.ProductCode,
                ProductDesc = pt.ProductDesc,
                CategoryDescription = pt.CategoryDescription,
                DeptDescription = pt.DeptDescription,
                ClientId = pt.ClientId,
                PurtRate = pt.PurtRate,
                PurtMrp = pt.PurtMrp,
                PurtSelPrice = pt.PurtSelPrice,
                PurtDebitQty = pt.PurtDebitQty,
                PurtCreditQty = pt.PurtCreditQty,
                Amount = pt.Amount,
                DiscountAmount = pt.DiscountAmount,
                PurtType = pt.PurtType,
                JobberName = pt.JobberName,
                PurtDelivered = pt.PurtDelivered,
                PurtAlteration = pt.PurtAlteration,
                PurtDeliveredDate = pt.PurtDeliveredDate,
                PurtReceivedDate = pt.PurtReceivedDate,
                PurtReceived = pt.PurtReceived,
                PurtId = pt.PurtId
            })
            .OrderByDescending(pt => pt.Id)
            .ToListAsync();

        _logger.LogInformation("Retrieved {Count} alteration records for ClientId {ClientId}", 
            alterationRecords.Count, currentClientId);

        return Ok(alterationRecords);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error retrieving alteration records for ClientId {ClientId}", currentClientId);
        return StatusCode(500, new { 
            error = "An internal error occurred while retrieving alteration records",
            details = ex.Message 
        });
    }
}
```

### 7. Database Model for Purchase Transactions
**File:** `PurchaseTransaction.cs` Model

```csharp
public class PurchaseTransaction
{
    public int Id { get; set; }
    public int PurtPurId { get; set; }
    public string BarcodeDesc { get; set; }
    public string ProductCode { get; set; }
    public string ProductDesc { get; set; }
    public string CategoryDescription { get; set; }
    public string DeptDescription { get; set; }
    public int ClientId { get; set; }
    public decimal PurtRate { get; set; }
    public decimal PurtMrp { get; set; }
    public decimal PurtSelPrice { get; set; }
    public decimal PurtDebitQty { get; set; }
    public decimal PurtCreditQty { get; set; }
    public decimal Amount { get; set; }
    public decimal DiscountAmount { get; set; }
    public int PurtType { get; set; }
    public string JobberName { get; set; }
    public bool PurtDelivered { get; set; }
    public bool PurtAlteration { get; set; }
    public DateTime? PurtDeliveredDate { get; set; }
    public DateTime? PurtReceivedDate { get; set; }
    public bool PurtReceived { get; set; }
    public int PurtId { get; set; }
    
    // Navigation properties
    public virtual Company Company { get; set; }
}
```

### 8. Update DbContext
**File:** `RMagicContext.cs`

```csharp
public class RMagicContext : DbContext
{
    // ... existing DbSets
    
    public DbSet<PurchaseTransaction> PurchaseTransactions { get; set; }
    
    // ... rest of the context
}
```

The frontend is already complete - just implement these backend changes!
