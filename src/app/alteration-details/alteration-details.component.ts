import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { AlterationRecord, AlterationDetailsDialogData } from '../models/dashboard.models';

@Component({
  selector: 'app-alteration-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './alteration-details.component.html',
  styleUrl: './alteration-details.component.scss'
})
export class AlterationDetailsComponent {
  constructor(
    public dialogRef: MatDialogRef<AlterationDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AlterationDetailsDialogData
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  formatDate(date: string): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN');
  }

  getTypeDescription(type: number): string {
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

  getStatusDescription(): string {
    switch (this.data.type) {
      case 'pending':
        return 'Pending Alteration - Jobber assignment required';
      case 'received':
        return 'Received for Alteration - Awaiting delivery';
      case 'delivered':
        return 'Alteration Delivered - Process complete';
      default:
        return 'Unknown Status';
    }
  }

  getStatusColor(): string {
    switch (this.data.type) {
      case 'pending':
        return '#f44336'; // Red
      case 'received':
        return '#ff9800'; // Orange
      case 'delivered':
        return '#4caf50'; // Green
      default:
        return '#9e9e9e'; // Grey
    }
  }
}