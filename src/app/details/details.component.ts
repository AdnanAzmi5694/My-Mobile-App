import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { DashboardService } from '../services/dashboard.service';
import { CollectionService } from '../services/collection.service';
import { DetailsDialogData as DialogData } from '../models/dashboard.models';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit, OnDestroy {
  transactionDetails: any[] = [];
  isLoading = false;
  displayedColumns: string[] = ['docNo', 'docDate', 'quantity', 'amount'];
  collectionTotal = 0;
  collectionPageSize = 50;
  collectionPageIndex = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private dashboardService: DashboardService,
    private collectionService: CollectionService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    if (this.data.type === 'outstanding') {
      this.displayedColumns = ['customerId', 'customerName', 'customerMobile', 'netOutstanding', 'avgOutstandingDays'];
    } else if (this.data.type === 'collection') {
      this.displayedColumns = [
        'receiptDocNo',
        'receiptDocDate',
        'customerName',
        'customerMobileNo',
        'receiptPaymentSubTypeName',
        'receiptAmount',
        'purchaseDocNo',
        'purchaseDocDate',
        'receiptType',
        'receiptNotes'
      ];
    } else {
      this.displayedColumns = ['docNo', 'docDate', 'quantity', 'amount'];
    }
    this.loadTransactionDetails();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTransactionDetails(page = 1): void {
    this.isLoading = true;
    if (this.data.type === 'outstanding') {
      this.dashboardService.getOutstandingBalances(this.data.clientId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (outstandingData) => {
            this.transactionDetails = outstandingData.details;
            this.data.summary = {
              ...this.data.summary,
              totalNetOutstanding: outstandingData.totals.totalNetOutstanding,
              totalCustomers: outstandingData.totals.totalCustomers,
              averageOutstandingDays: outstandingData.totals.averageOutstandingDays
            };
            this.isLoading = false;
          },
          error: (err: any) => {
            const message = err.error?.error || 'Failed to load outstanding details';
            this.snackBar.open(message, 'Close', {
              duration: 4000,
              panelClass: ['error-snackbar']
            });
            this.isLoading = false;
          }
        });
      return;
    }

    if (this.data.type === 'collection') {
      this.collectionPageIndex = page - 1;
      this.collectionService.getDetails(this.data.clientId, '', page, this.collectionPageSize)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (collectionData) => {
            this.transactionDetails = collectionData.data;
            this.collectionTotal = collectionData.total;
            this.collectionPageSize = collectionData.pageSize;
            this.data.summary = {
              ...this.data.summary,
              totalTransactions: collectionData.total,
              totalCollectionAmount: this.data.summary.totalCollectionAmount
            };
            this.isLoading = false;
          },
          error: (err: any) => {
            const message = err.error?.error || 'Failed to load receipt details';
            this.snackBar.open(message, 'Close', {
              duration: 4000,
              panelClass: ['error-snackbar']
            });
            this.isLoading = false;
          }
        });
      return;
    }

    if (!this.data.fromDate || !this.data.toDate) {
      this.snackBar.open('Date range is required for transaction details', 'Close', {
        duration: 4000,
        panelClass: ['error-snackbar']
      });
      this.isLoading = false;
      return;
    }

    this.dashboardService.getDashboardSummary(
      this.data.fromDate,
      this.data.toDate,
      this.data.clientId
    ).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (dashboardData) => {
        this.transactionDetails = this.data.type === 'purchase'
          ? dashboardData.purchaseDetails
          : dashboardData.salesDetails;
        this.isLoading = false;
      },
      error: (err: any) => {
        const message = err.error?.error || 'Failed to load transaction details';
        this.snackBar.open(message, 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
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

  formatDate(date: Date | string | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-IN');
  }

  getToday(): Date {
    return new Date();
  }

  onCollectionPageChange(event: PageEvent): void {
    this.collectionPageSize = event.pageSize;
    this.loadTransactionDetails(event.pageIndex + 1);
  }

  isSnapshotType(): boolean {
    return this.data.type === 'outstanding' || this.data.type === 'collection';
  }

  getTypeTitle(): string {
    if (this.data.type === 'purchase') return 'Purchase';
    if (this.data.type === 'sales') return 'Sales';
    if (this.data.type === 'collection') return 'Receipt Collection';
    return 'Outstanding';
  }

  getTypeIcon(): string {
    if (this.data.type === 'purchase') return 'shopping_cart';
    if (this.data.type === 'sales') return 'point_of_sale';
    if (this.data.type === 'collection') return 'receipt_long';
    return 'account_balance_wallet';
  }

  getTypeColor(): string {
    if (this.data.type === 'purchase') return '#e74c3c';
    if (this.data.type === 'sales') return '#27ae60';
    if (this.data.type === 'collection') return '#1565c0';
    return '#ffb300';
  }
} 