import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
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
export class JobberAlterationComponent implements OnInit, AfterViewInit {
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

  pendingDataSource = new MatTableDataSource<AlterationRecord>([]);
  receivedDataSource = new MatTableDataSource<AlterationRecord>([]);
  deliveredDataSource = new MatTableDataSource<AlterationRecord>([]);

  @ViewChild('pendingPag') private pendingPag?: MatPaginator;
  @ViewChild('pendingSort') private pendingSort?: MatSort;
  @ViewChild('receivedPag') private receivedPag?: MatPaginator;
  @ViewChild('receivedSort') private receivedSort?: MatSort;
  @ViewChild('deliveredPag') private deliveredPag?: MatPaginator;
  @ViewChild('deliveredSort') private deliveredSort?: MatSort;

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
    this.configureSortAccessor(this.pendingDataSource);
    this.configureSortAccessor(this.receivedDataSource);
    this.configureSortAccessor(this.deliveredDataSource);
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      // Handle not logged in
      return;
    }

    this.loadAlterationData();
    this.setupSearchFilters();
  }

  ngAfterViewInit(): void {
    this.connectTableWidgets();
  }

  onAlterationTabChange(index: number): void {
    setTimeout(() => this.connectTableWidgets(index));
  }

  private configureSortAccessor(ds: MatTableDataSource<AlterationRecord>): void {
    ds.sortingDataAccessor = (row: AlterationRecord, columnId: string) => {
      switch (columnId) {
        case 'docNo':
          return this.getDocNo(row);
        case 'customerName':
          return this.getCustomerName(row);
        case 'docDate':
          return row.docDate ? new Date(row.docDate).getTime() : 0;
        case 'amount':
          return Number(row.amount) || 0;
        default: {
          const v = (row as any)[columnId];
          return v == null ? '' : v;
        }
      }
    };
  }

  private connectTableWidgets(activeTabIndex?: number): void {
    if (this.pendingPag && this.pendingSort && (activeTabIndex === undefined || activeTabIndex === 0)) {
      this.pendingDataSource.paginator = this.pendingPag;
      this.pendingDataSource.sort = this.pendingSort;
    }
    if (this.receivedPag && this.receivedSort && (activeTabIndex === undefined || activeTabIndex === 1)) {
      this.receivedDataSource.paginator = this.receivedPag;
      this.receivedDataSource.sort = this.receivedSort;
    }
    if (this.deliveredPag && this.deliveredSort && (activeTabIndex === undefined || activeTabIndex === 2)) {
      this.deliveredDataSource.paginator = this.deliveredPag;
      this.deliveredDataSource.sort = this.deliveredSort;
    }
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

    this.pendingDataSource.data = this.filteredPending;
    this.receivedDataSource.data = this.filteredReceived;
    this.deliveredDataSource.data = this.filteredDelivered;

    this.pendingPag?.firstPage();
    this.receivedPag?.firstPage();
    this.deliveredPag?.firstPage();
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

      const [pendingRows, receivedRows, deliveredRows] = await Promise.all([
        this.dashboardService.loadAllAlterationPages((p, ps) =>
          this.dashboardService.getPendingAlterations(undefined, undefined, undefined, clientId, p, ps)),
        this.dashboardService.loadAllAlterationPages((p, ps) =>
          this.dashboardService.getReceivedAlterations(undefined, undefined, undefined, clientId, p, ps)),
        this.dashboardService.loadAllAlterationPages((p, ps) =>
          this.dashboardService.getDeliveredAlterations(undefined, undefined, undefined, clientId, p, ps))
      ]);

      this.pendingAlterations = pendingRows;
      this.receivedAlterations = receivedRows;
      this.deliveredAlterations = deliveredRows;

      this.applyFilters();
      setTimeout(() => this.connectTableWidgets());

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