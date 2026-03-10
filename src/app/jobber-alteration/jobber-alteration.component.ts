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
    'Id', 'ProductCode', 'ProductDesc', 'CategoryDescription',
    'JobberName', 'PurtDebitQty', 'PurtCreditQty', 'Amount', 'PurtType'
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
        record.JobberName?.toLowerCase().includes(filters.jobberName.toLowerCase());

      const productMatch = !filters.productCode ||
        record.ProductCode?.toLowerCase().includes(filters.productCode.toLowerCase()) ||
        record.ProductDesc?.toLowerCase().includes(filters.productCode.toLowerCase());

      const categoryMatch = !filters.category ||
        record.CategoryDescription?.toLowerCase().includes(filters.category.toLowerCase());

      return jobberMatch && productMatch && categoryMatch;
    });
  }

  private async loadAlterationData(): Promise<void> {
    this.isLoading = true;
    try {
      // TODO: Replace with actual API calls
      // For now, using mock data structure

      // Mock API calls - replace with actual service methods
      const allRecords = await this.getAllAlterationRecords();

      // Filter records based on criteria
      this.pendingAlterations = allRecords.filter(r =>
        r.PurtAlteration === true && (!r.JobberName || r.JobberName.trim() === '')
      );

      this.receivedAlterations = allRecords.filter(r =>
        r.PurtReceived === true && r.PurtDelivered === false
      );

      this.deliveredAlterations = allRecords.filter(r =>
        r.PurtDelivered === true
      );

      this.applyFilters();

    } catch (error) {
      console.error('Error loading alteration data:', error);
      this.snackBar.open('Error loading alteration data', 'Close', { duration: 3000 });
    } finally {
      this.isLoading = false;
    }
  }

  private async getAllAlterationRecords(): Promise<AlterationRecord[]> {
    try {
      const response = await this.dashboardService.getAlterationRecords().toPromise();
      return response || [];
    } catch (error) {
      console.error('Error fetching alteration records:', error);
      // Return empty array on error
      return [];
    }
  }

  clearFilters(): void {
    this.searchForm.reset();
  }

  getPurtTypeDescription(type: number): string {
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
    return types[type] || `Type ${type}`;
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