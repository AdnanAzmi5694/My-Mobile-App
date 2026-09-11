import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatNativeDateModule,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatDateFormats
} from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/** Datepicker display: dd/MM/yyyy (en-GB day-first). */
const DASHBOARD_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: null
  },
  display: {
    dateInput: { day: '2-digit', month: '2-digit', year: 'numeric' },
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';
import { DashboardService } from '../services/dashboard.service';
import { CollectionService } from '../services/collection.service';
import { DetailsDialogData, OutstandingResponse, CollectionSummary } from '../models/dashboard.models';
import { DetailsComponent } from '../details/details.component';
import { Subject, takeUntil } from 'rxjs';

interface Company {
  clientId: number;
  name: string;
  companyName?: string;
  userGroupId: number;
  users?: any[];
}

interface User {
  userId: number;
  username: string;
  email: string;
  clientId: number;
  companyName?: string;
  userGroupId: number;
}

interface GroupUsersResponse {
  users?: User[];
  companies?: Company[];
  currentUserClientId?: number;
  userGroupId?: number;
  totalCount?: number;
  companyCount?: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_DATE_FORMATS, useValue: DASHBOARD_DATE_FORMATS }
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  dashboardForm: FormGroup;
  dashboardData: any = null;
  outstandingData: OutstandingResponse | null = null;
  collectionData: CollectionSummary | null = null;
  outstandingAsOnDate: Date = new Date();
  collectionAsOnDate: Date = new Date();
  isLoading = false;
  isLoadingOutstanding = false;
  isLoadingCollection = false;
  showDateRange = false;
  private destroy$ = new Subject<void>();
  companyName: string = '';
  
  showDebugInfo = false;

  selectedFromDate: Date | null = null;
  selectedToDate: Date | null = null;

  companies: Company[] = [];
  selectedCompanyId: number | null = null;
  currentUserGroupId: number | null = null;
  groupUsers: User[] = [];

  constructor(
    private fb: FormBuilder,
    private dashboardService: DashboardService,
    private collectionService: CollectionService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {
    const today = new Date();
    this.dashboardForm = this.fb.group({
      fromDate: [today, [Validators.required]],
      toDate: [today, [Validators.required]],
      clientId: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadCompanies();
    
    const storedCompanyName = this.authService.getCompanyName();
    if (storedCompanyName) {
      this.companyName = storedCompanyName;
    }
    
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/signin']);
      return;
    }
    
    this.testApiConnection();
  }

  private testApiConnection(): void {
    console.log('=== TESTING API CONNECTION ===');
    
    const userGroupId = this.authService.getUserGroupId();
    if (!userGroupId) {
      console.warn('No UserGroupId found for API test');
      return;
    }
    
    const testUrl = `${environment.apiUrl}User/group/${userGroupId}`;
    console.log('Testing API URL:', testUrl);
    
    fetch(testUrl, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    })
    .then(response => {
      console.log('API Response Status:', response.status);
      console.log('API Response Headers:', response.headers);
      return response.json();
    })
    .then(data => {
      console.log('API Response Data:', data);
    })
    .catch(error => {
      console.error('API Connection Error:', error);
    });
  }

  private async loadCompanies(): Promise<void> {
    try {
      console.log('=== LOADING GROUP COMPANIES ===');
      
      const currentUserGroupId = this.authService.getUserGroupId();
      const currentClientId = this.authService.getClientId();
      const currentCompanyName = this.authService.getCompanyName();
      
      console.log('Current User Info:');
      console.log('  UserGroupId:', currentUserGroupId);
      console.log('  ClientId:', currentClientId);
      console.log('  CompanyName:', currentCompanyName);
      
      if (currentUserGroupId !== null && currentUserGroupId !== undefined) {
        this.currentUserGroupId = currentUserGroupId;
        
        try {
          console.log('Fetching users for UserGroupId:', currentUserGroupId);
          const apiResponse = await this.authService.getUsersByUserGroupId();
          console.log('API Response:', apiResponse);
          
          const response = apiResponse as GroupUsersResponse;
          console.log('=== DETAILED API RESPONSE ANALYSIS ===');
          console.log('Raw API Response:', JSON.stringify(apiResponse, null, 2));
          console.log('Response analysis:', {
            isObject: typeof response === 'object',
            isNotNull: response !== null,
            hasCompanies: 'companies' in response,
            companiesValue: response.companies,
            companiesType: typeof response.companies,
            companiesIsArray: Array.isArray(response.companies),
            companiesLength: response.companies?.length,
            usersValue: response.users,
            usersType: typeof response.users,
            usersIsArray: Array.isArray(response.users)
          });
          
          if (response && 
              typeof response === 'object' && 
              response !== null && 
              response.companies && 
              Array.isArray(response.companies) && 
              response.companies.length > 0) {
            console.log('✅ Using companies from API response structure');
            this.companies = [];
            
            this.companies.push({
              clientId: 0,
              name: 'All Companies',
              userGroupId: currentUserGroupId,
              users: response.users || []
            });
            console.log('Added "All Companies" option');
            
            response.companies.forEach((company: Company, index: number) => {
              const companyName = company.companyName || company.name || `Company ${company.clientId}`;
              console.log(`Processing company ${index + 1}:`, {
                original: company,
                resolvedName: companyName,
                clientId: company.clientId,
                userGroupId: company.userGroupId,
                usersCount: company.users?.length || 0
              });
              
              const newCompany = {
                clientId: company.clientId,
                name: companyName,
                userGroupId: company.userGroupId || currentUserGroupId,
                users: company.users || []
              };
              
              this.companies.push(newCompany);
              console.log(`✅ Added company: ${companyName} (ClientId: ${company.clientId})`);
              console.log(`Companies array length after adding: ${this.companies.length}`);
            });
            
            console.log('Companies array after processing:', this.companies.length);
            console.log('Final companies array:', this.companies.map(c => ({ id: c.clientId, name: c.name })));
            
            this.companies.sort((a, b) => {
              if (a.clientId === 0) return -1;
              if (b.clientId === 0) return 1;
              return a.name.localeCompare(b.name);
            });
            
          } else if (apiResponse && Array.isArray(apiResponse) && apiResponse.length > 0) {
            console.log('⚠️ Using fallback structure (direct users array)');
            this.groupUsers = apiResponse;
            
            const groupClientIds = [...new Set(this.groupUsers
              .filter(user => user.clientId && user.clientId > 0)
              .map(user => user.clientId))];
            
            console.log('Unique ClientIds in group:', groupClientIds);
            
            this.companies = [];
            
            this.companies.push({
              clientId: 0,
              name: 'All Companies',
              userGroupId: currentUserGroupId,
              users: this.groupUsers
            });
            
            const uniqueCompanies = new Map<number, Company>();
            this.groupUsers.forEach(user => {
              if (user.clientId && user.clientId > 0 && user.companyName) {
                if (!uniqueCompanies.has(user.clientId)) {
                  uniqueCompanies.set(user.clientId, {
                    clientId: user.clientId,
                    name: user.companyName,
                    userGroupId: currentUserGroupId,
                    users: this.groupUsers.filter(u => u.clientId === user.clientId)
                  });
                  console.log(`Added company: ${user.companyName} (ClientId: ${user.clientId})`);
                }
              }
            });
            
            uniqueCompanies.forEach(company => {
              this.companies.push(company);
            });
            
            this.companies.sort((a, b) => {
              if (a.clientId === 0) return -1;
              if (b.clientId === 0) return 1;
              return a.name.localeCompare(b.name);
            });
            
            console.log('Final companies array:', this.companies);
            
          } else {
            console.warn('No valid data found in API response, using fallback');
            if (currentClientId && currentCompanyName) {
              this.companies = [{
                clientId: Number(currentClientId),
                name: currentCompanyName,
                userGroupId: currentUserGroupId,
                users: [{ 
                  userId: 0, 
                  username: 'Current User', 
                  email: '', 
                  clientId: Number(currentClientId), 
                  userGroupId: currentUserGroupId 
                }]
              }];
              console.log('Fallback: Added current company only');
            }
          }
        } catch (apiError) {
          console.error('API call failed, using fallback:', apiError);
          this.snackBar.open('Using offline mode - limited company data available', 'Close', {
            duration: 3000
          });
          
          if (currentClientId && currentCompanyName) {
            this.companies = [{
              clientId: Number(currentClientId),
              name: currentCompanyName,
              userGroupId: currentUserGroupId,
              users: [{ 
                userId: 0, 
                username: 'Current User', 
                email: '', 
                clientId: Number(currentClientId), 
                userGroupId: currentUserGroupId 
              }]
            }];
            console.log('API Error Fallback: Added current company only');
          }
        }
        
        const hasAllCompaniesOption = this.companies.some(c => c.clientId === 0);
        this.selectedCompanyId = hasAllCompaniesOption
          ? 0
          : (currentClientId ? Number(currentClientId) : 0);
        
        console.log('Company Selection:');
        console.log('  Available companies:', this.companies.map(c => ({ id: c.clientId, name: c.name })));
        console.log('  Current ClientId from token:', currentClientId);
        console.log('  Selected Company ID:', this.selectedCompanyId);
        
        const selectedCompany = this.companies.find(c => c.clientId === this.selectedCompanyId);
        if (selectedCompany) {
          console.log('Selected Company Details:', {
            name: selectedCompany.name,
            clientId: selectedCompany.clientId,
            userCount: selectedCompany.users?.length || 0
          });
        } else {
          console.warn('Selected company not found in array!');
          console.warn('Looking for ClientId:', this.selectedCompanyId);
          console.warn('Available ClientIds:', this.companies.map(c => c.clientId));
        }
        
        this.dashboardForm.patchValue({
          clientId: this.selectedCompanyId
        });
        
        this.loadTodaysData();
        this.loadOutstandingData(this.selectedCompanyId || 0);
        this.loadCollectionData(this.selectedCompanyId || 0);
        
      } else {
        console.warn('UserGroupId not found in token');
        this.snackBar.open('User information not available', 'Close', {
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Error loading companies:', error);
      this.snackBar.open('Failed to load company information', 'Close', {
        duration: 3000
      });
    }
  }

  getSelectedCompanyName(): string {
    const company = this.companies.find(c => c.clientId === this.selectedCompanyId);
    if (company) {
      console.log('Found company for selectedCompanyId:', company);
      return company.name;
    }
    const fallbackName = this.authService.getCompanyName();
    console.log('Company not found in array, using fallback:', fallbackName);
    return fallbackName || (this.selectedCompanyId !== null && this.selectedCompanyId !== undefined ? `Company ID ${this.selectedCompanyId}` : '');
  }

  hasSelectedCompany(): boolean {
    return this.selectedCompanyId !== null && this.selectedCompanyId !== undefined;
  }

  getSelectedCompanyUserCount(): number {
    if (!this.selectedCompanyId) return 0;
    
    const company = this.companies.find(c => c.clientId === this.selectedCompanyId);
    return company?.users?.length || 0;
  }

  onCompanyChange(): void {
    const selectedCompanyId = this.dashboardForm.get('clientId')?.value;
    this.selectedCompanyId = selectedCompanyId;
    
    const selectedCompany = this.companies.find(c => c.clientId === selectedCompanyId);
    
    console.log('=== COMPANY SELECTION CHANGED ===');
    console.log('New Selected Company ID:', selectedCompanyId);
    console.log('Selected Company Details:', selectedCompany);
    
    if (selectedCompany) {
      console.log('Company Selection Info:');
      console.log('  Company Name:', selectedCompany.name);
      console.log('  Company ID (ClientId):', selectedCompany.clientId);
      console.log('  User Count:', selectedCompany.users?.length || 0);
      console.log('  Is All Companies:', selectedCompany.clientId === 0);
      
      if (selectedCompany.clientId === 0) {
        console.log('  → Will send clientId = 0 to API (All Companies)');
      } else {
        console.log('  → Will send clientId =', selectedCompany.clientId, 'to API');
      }
    } else {
      console.warn('Selected company not found!');
    }
    
    this.loadSelectedData();
    this.loadOutstandingData(this.selectedCompanyId || 0);
    this.loadCollectionData(this.selectedCompanyId || 0);
  }

  loadSelectedData(): void {
    if (!this.selectedFromDate || !this.selectedToDate) {
      console.warn('Dates not selected');
      return;
    }

    console.log('=== LOADING COMPANY DATA ===');
    console.log('Company ID:', this.selectedCompanyId);
    console.log('Is All Companies:', this.selectedCompanyId === 0);
    // Format dates in local timezone to avoid UTC conversion issues
    const fromDateStr = this.formatDateForAPI(this.selectedFromDate);
    const toDateStr = this.formatDateForAPI(this.selectedToDate);
    
    console.log('Date Range:', {
      from: fromDateStr,
      to: toDateStr
    });
    console.log('API Call Parameters:', {
      fromdate: fromDateStr,
      toDate: toDateStr,
      clientId: this.selectedCompanyId || 0
    });

    this.isLoading = true;
    this.dashboardService.getDashboardSummary(this.selectedFromDate, this.selectedToDate, this.selectedCompanyId || 0)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log('✅ Dashboard data loaded successfully:', data);
          console.log('Data Type:', typeof data);
          console.log('Data Keys:', Object.keys(data || {}));
          console.log('Purchase Data:', data?.purchase);
          console.log('Sales Data:', data?.sales);
          console.log('Purchase Details:', {
            totalBills: data?.purchase?.totalBills,
            totalQuantity: data?.purchase?.totalQuantity,
            totalAmount: data?.purchase?.totalAmount
          });
          console.log('Sales Details:', {
            totalBills: data?.sales?.totalBills,
            totalQuantity: data?.sales?.totalQuantity,
            totalAmount: data?.sales?.totalAmount
          });
          
          this.dashboardData = {
            purchase: data?.purchase || { totalBills: 0, totalQuantity: 0, totalAmount: 0 },
            sales: data?.sales || { totalBills: 0, totalQuantity: 0, totalAmount: 0 },
            purchaseDetails: data?.purchaseDetails || [],
            salesDetails: data?.salesDetails || []
          };
          this.isLoading = false;
          
          setTimeout(() => {
            console.log('Dashboard data after timeout:', this.dashboardData);
          }, 100);
        },
        error: (error) => {
          console.error('❌ Error loading dashboard data:', error);
          console.error('Error Details:', {
            status: error?.status,
            statusText: error?.statusText,
            message: error?.message
          });
          this.snackBar.open('Failed to load dashboard data', 'Close', {
            duration: 3000
          });
          this.isLoading = false;
        }
      });
  }

  loadOutstandingData(clientId?: number): void {
    const resolvedClientId = clientId !== null && clientId !== undefined ? clientId : (this.selectedCompanyId ?? 0);
    this.isLoadingOutstanding = true;
    this.outstandingData = null;

    this.dashboardService.getOutstandingBalances(resolvedClientId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log('✅ Outstanding balances loaded successfully:', data);

          if (resolvedClientId > 0 && data.details.length === 0 && this.currentUserGroupId) {
            this.dashboardService.getOutstandingBalances(0)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (groupData) => {
                  if (groupData.details.length > 0) {
                    this.outstandingData = groupData;
                    this.snackBar.open(
                      'No outstanding for selected company — showing all companies in your group',
                      'Close',
                      { duration: 4000 }
                    );
                  } else {
                    this.outstandingData = data;
                  }
                  this.outstandingAsOnDate = new Date();
                  this.isLoadingOutstanding = false;
                },
                error: () => {
                  this.outstandingData = data;
                  this.outstandingAsOnDate = new Date();
                  this.isLoadingOutstanding = false;
                }
              });
            return;
          }

          this.outstandingData = data;
          this.outstandingAsOnDate = new Date();
          this.isLoadingOutstanding = false;
        },
        error: (error) => {
          console.error('❌ Error loading outstanding balances:', error);
          const message = error.error?.error
            || (error.status === 404 ? 'Outstanding API not found on server — deploy latest API' : 'Failed to load outstanding balances');
          this.snackBar.open(message, 'Close', { duration: 4000 });
          this.isLoadingOutstanding = false;
        }
      });
  }

  loadCollectionData(clientId?: number): void {
    const resolvedClientId = clientId !== null && clientId !== undefined ? clientId : (this.selectedCompanyId ?? 0);
    this.isLoadingCollection = true;
    this.collectionData = null;

    this.collectionService.getSummary(resolvedClientId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.collectionData = data;
          this.collectionAsOnDate = new Date();
          this.isLoadingCollection = false;
        },
        error: (error) => {
          console.error('Error loading collection summary:', error);
          const message = error.error?.error
            || (error.status === 404 ? 'Collection API not found on server — deploy latest API' : 'Failed to load collection summary');
          this.snackBar.open(message, 'Close', { duration: 4000 });
          this.isLoadingCollection = false;
        }
      });
  }

  openCollectionPage(): void {
    this.openDetailsDialog('collection');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTodaysData(): void {
    const today = new Date();
    this.selectedFromDate = today;
    this.selectedToDate = today;
    
    this.dashboardForm.patchValue({
      fromDate: today,
      toDate: today
    });
    
    console.log('=== LOADING TODAY\'S DATA ===');
    console.log('Today\'s date:', this.formatDateForAPI(today));
    console.log('Selected Company ID:', this.selectedCompanyId);
    console.log('Date range set:', {
      from: this.selectedFromDate ? this.formatDateForAPI(this.selectedFromDate) : null,
      to: this.selectedToDate ? this.formatDateForAPI(this.selectedToDate) : null,
      clientId: this.selectedCompanyId
    });
    
    this.loadSelectedData();
  }

  toggleDateRange(): void {
    this.showDateRange = !this.showDateRange;
    if (!this.showDateRange) {
      this.loadTodaysData();
    }
  }

  onFromDateChange(event: any): void {
    console.log('From date change event:', event);
    const dateValue = event.value ? new Date(event.value) : null;
    this.selectedFromDate = dateValue;
    
    if (dateValue) {
      this.dashboardForm.get('fromDate')?.setValue(dateValue);
    }
    
    console.log('From date selected:', this.selectedFromDate);
    console.log('Form value:', this.dashboardForm.value);
  }

  onToDateChange(event: any): void {
    console.log('To date change event:', event);
    const dateValue = event.value ? new Date(event.value) : null;
    this.selectedToDate = dateValue;
    
    if (dateValue) {
      this.dashboardForm.get('toDate')?.setValue(dateValue);
    }
    
    console.log('To date selected:', this.selectedToDate);
    console.log('Form value:', this.dashboardForm.value);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('en-IN').format(num);
  }

  formatDateForAPI(date: Date): string {
    // Format date in local timezone to avoid UTC conversion issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  openDetailsDialog(type: 'purchase' | 'sales' | 'outstanding' | 'collection'): void {
    if (type !== 'outstanding' && type !== 'collection' && !this.dashboardData) return;

    console.log('Opening details dialog for:', type);
    
    const dialogData: DetailsDialogData = {
      type: type,
      clientId: this.selectedCompanyId || 0,
      companyName: this.getSelectedCompanyName(),
      summary: type === 'outstanding'
        ? {
            totalNetOutstanding: this.outstandingData?.totals.totalNetOutstanding,
            totalCustomers: this.outstandingData?.totals.totalCustomers,
            averageOutstandingDays: this.outstandingData?.totals.averageOutstandingDays
          }
        : type === 'collection'
          ? {
              totalTransactions: this.collectionData?.totalTransactions,
              totalCollectionAmount: this.collectionData?.totalAmount
            }
        : type === 'purchase'
          ? this.dashboardData.purchase
          : this.dashboardData.sales
    };

    if (type === 'outstanding') {
      dialogData.asOnDate = this.outstandingAsOnDate;
    } else if (type === 'collection') {
      dialogData.asOnDate = this.collectionAsOnDate;
    } else {
      dialogData.fromDate = this.selectedFromDate!;
      dialogData.toDate = this.selectedToDate!;
    }

    console.log('Dialog data:', dialogData);

    const dialogRef = this.dialog.open(DetailsComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: dialogData,
      panelClass: 'details-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Details dialog closed:', result);
    });
  }

  setLast7Days(): void {
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(toDate.getDate() - 7);
    
    this.selectedFromDate = fromDate;
    this.selectedToDate = toDate;
    
    this.dashboardForm.patchValue({
      fromDate: fromDate,
      toDate: toDate
    });
    
    console.log('=== LOADING LAST 7 DAYS DATA ===');
    console.log('Date range:', {
      from: this.formatDateForAPI(fromDate),
      to: this.formatDateForAPI(toDate)
    });
    
    this.loadSelectedData();
  }

  setLast30Days(): void {
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(toDate.getDate() - 30);
    
    this.selectedFromDate = fromDate;
    this.selectedToDate = toDate;
    
    this.dashboardForm.patchValue({
      fromDate: fromDate,
      toDate: toDate
    });
    
    console.log('=== LOADING LAST 30 DAYS DATA ===');
    console.log('Date range:', {
      from: this.formatDateForAPI(fromDate),
      to: this.formatDateForAPI(toDate)
    });
    
    this.loadSelectedData();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/signin']);
  }
}
