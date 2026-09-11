import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { CollectionService } from '../services/collection.service';
import { CollectionDetail, CollectionDetailsDialogData } from '../models/dashboard.models';

@Component({
  selector: 'app-collection-details',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './collection-details.component.html',
  styleUrl: './collection-details.component.scss'
})
export class CollectionDetailsComponent implements OnInit, OnDestroy {
  rows: CollectionDetail[] = [];
  isLoading = false;
  total = 0;
  pageSize = 25;
  pageIndex = 0;

  displayedColumns: string[] = [
    'receiptDocNo',
    'receiptDocDate',
    'customerName',
    'customerMobileNo',
    'receiptAmount',
    'purchaseDocNo',
    'purchaseDocDate',
    'receiptType',
    'receiptNotes'
  ];

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  private destroy$ = new Subject<void>();

  constructor(
    private collectionService: CollectionService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CollectionDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CollectionDetailsDialogData
  ) {}

  ngOnInit(): void {
    this.loadPage(1);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.loadPage(event.pageIndex + 1);
  }

  loadPage(page: number): void {
    this.isLoading = true;
    this.pageIndex = page - 1;

    this.collectionService
      .getDetails(this.data.clientId, this.data.paymentSubType, page, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.rows = result.data;
          this.total = result.total;
          this.pageSize = result.pageSize;
          this.isLoading = false;
        },
        error: (err) => {
          const message = err.error?.error || 'Failed to load receipt details';
          this.snackBar.open(message, 'Close', { duration: 4000 });
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

  formatDate(date: Date | string | null | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-IN');
  }
}
