import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DashboardService } from '../services/dashboard.service';
import { AlterationRecord, AlterationDetailsDialogData } from '../models/dashboard.models';
import { AlterationDetailsComponent } from '../alteration-details/alteration-details.component';

@Component({
  selector: 'app-jobber-alteration',
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
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    RouterModule
  ],
  templateUrl: './jobber-alteration.component.html',
  styleUrls: ['./jobber-alteration.component.scss']
})
export class JobberAlterationComponent implements OnInit {
  searchForm: FormGroup;
  isLoading = false;

  // Data arrays
  pendingAlterations: AlterationRecord[] = [];
  receivedAlterations: AlterationRecord[] = [];
  deliveredAlterations: AlterationRecord[] = [];

  // Filtered data for display
  filteredPending: AlterationRecord[] = [];
  filteredReceived: AlterationRecord[] = [];
  filteredDelivered: AlterationRecord[] = [];

  // Table columns
  displayedColumns: string[] = [
    'docNo', 'docDate', 'customerName', 'productCode', 'productDesc', 'categoryDescription',
    'jobberName', 'purtDebitQty', 'purtCreditQty', 'amount', 'purtType'
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dashboardService: DashboardService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.searchForm = this.fb.group({
      jobberName: [''],
      productCode: [''],
      category: ['']
    });
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      // Handle not logged in
      return;
    }

    this.loadAlterationData();
    this.setupSearchFilters();
  }

  private setupSearchFilters(): void {
    this.searchForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  private applyFilters(): void {
    const filters = this.searchForm.value;

    this.filteredPending = this.filterRecords(this.pendingAlterations, filters);
    this.filteredReceived = this.filterRecords(this.receivedAlterations, filters);
    this.filteredDelivered = this.filterRecords(this.deliveredAlterations, filters);
  }

  private filterRecords(records: AlterationRecord[], filters: any): AlterationRecord[] {
    return records.filter(record => {
      const jobberMatch = !filters.jobberName ||
        record.jobberName?.toLowerCase().includes(filters.jobberName.toLowerCase());

      const productMatch = !filters.productCode ||
        record.productCode?.toLowerCase().includes(filters.productCode.toLowerCase()) ||
        record.productDesc?.toLowerCase().includes(filters.productCode.toLowerCase());

      const categoryMatch = !filters.category ||
        record.categoryDescription?.toLowerCase().includes(filters.category.toLowerCase());

      return jobberMatch && productMatch && categoryMatch;
    });
  }

  async loadAlterationData(): Promise<void> {
    this.isLoading = true;
    try {
      const clientId = Number(this.authService.getClientId() || 0);

      const [pendingResponse, receivedResponse, deliveredResponse] = await Promise.all([
        this.dashboardService.getPendingAlterations(undefined, undefined, undefined, clientId, 1, 1000).toPromise(),
        this.dashboardService.getReceivedAlterations(undefined, undefined, undefined, clientId, 1, 1000).toPromise(),
        this.dashboardService.getDeliveredAlterations(undefined, undefined, undefined, clientId, 1, 1000).toPromise()
      ]);

      this.pendingAlterations = pendingResponse?.data || [];
      this.receivedAlterations = receivedResponse?.data || [];
      this.deliveredAlterations = deliveredResponse?.data || [];

      this.applyFilters();

    } catch (error) {
      console.error('Error loading alteration data:', error);
      this.snackBar.open('Error loading alteration data', 'Close', { duration: 3000 });
    } finally {
      this.isLoading = false;
    }
  }

  clearFilters(): void {
    this.searchForm.reset();
  }

  formatDate(date: string | Date | null | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN');
  }

  getPurtTypeDescription(type: string | number): string {
    const typeNumber = typeof type === 'string' ? Number(type) : type;
    const types: { [key: number]: string } = {
      2: 'Purchase',
      3: 'Purchase Return',
      4: 'Purchase Approval',
      5: 'Purchase Return Approval',
      6: 'Sales',
      7: 'Sales Approval',
      8: 'Sales Return',
      9: 'Sales Return Approval'
    };
    return types[typeNumber] || `Type ${type}`;
  }

  getDocNo(record: AlterationRecord): string {
    const anyRecord = record as any;
    return (
      record.docNo ??
      anyRecord?.DocNo ??
      anyRecord?.docno ??
      anyRecord?.docNumber ??
      anyRecord?.DocNumber ??
      ''
    );
  }

  getCustomerName(record: AlterationRecord): string {
    const anyRecord = record as any;
    return (
      record.customerName ??
      anyRecord?.CustomerName ??
      anyRecord?.customer ??
      anyRecord?.customer_name ??
      ''
    );
  }

  openDetailsDialog(record: AlterationRecord, type: 'pending' | 'received' | 'delivered'): void {
    const dialogData: AlterationDetailsDialogData = {
      record: record,
      type: type
    };

    this.dialog.open(AlterationDetailsComponent, {
      data: dialogData,
      width: '90vw',
      maxWidth: '800px',
      maxHeight: '90vh'
    });
  }
}