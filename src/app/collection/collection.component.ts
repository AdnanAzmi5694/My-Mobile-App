import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CollectionService } from '../services/collection.service';
import { CollectionGroup, CollectionSummary } from '../models/dashboard.models';
import { CollectionDetailsComponent } from '../collection-details/collection-details.component';

interface CompanyOption {
  clientId: number;
  name: string;
}

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './collection.component.html',
  styleUrl: './collection.component.scss'
})
export class CollectionComponent implements OnInit, OnDestroy {
  summary: CollectionSummary | null = null;
  groups: CollectionGroup[] = [];
  companies: CompanyOption[] = [];
  selectedClientId = 0;
  companyName = '';
  isLoading = false;

  displayedColumns = ['paymentSubType', 'transactionCount', 'totalAmount', 'actions'];

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private collectionService: CollectionService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/signin']);
      return;
    }

    const queryClientId = Number(this.route.snapshot.queryParamMap.get('clientId'));
    if (!Number.isNaN(queryClientId)) {
      this.selectedClientId = queryClientId;
    }

    this.companyName = this.authService.getCompanyName() || '';
    this.loadCompanies();
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async loadCompanies(): Promise<void> {
    const userGroupId = this.authService.getUserGroupId();
    if (!userGroupId) {
      return;
    }

    try {
      const response: any = await this.authService.getUsersByUserGroupId();
      const companies = response?.companies ?? response?.Companies ?? [];
      this.companies = [{ clientId: 0, name: 'All Companies' }];

      if (Array.isArray(companies) && companies.length > 0) {
        companies.forEach((company: any) => {
          this.companies.push({
            clientId: Number(company.clientId ?? company.ClientId),
            name: company.companyName ?? company.name ?? company.Name ?? `Company ${company.clientId}`
          });
        });
      } else {
        const clientId = Number(this.authService.getClientId());
        if (clientId) {
          this.companies.push({
            clientId,
            name: this.authService.getCompanyName() || `Company ${clientId}`
          });
        }
      }
    } catch {
      const clientId = Number(this.authService.getClientId());
      if (clientId) {
        this.companies = [
          { clientId: 0, name: 'All Companies' },
          { clientId, name: this.authService.getCompanyName() || `Company ${clientId}` }
        ];
      }
    }
  }

  onCompanyChange(): void {
    const selected = this.companies.find((c) => c.clientId === this.selectedClientId);
    this.companyName = selected?.name || '';
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.summary = null;
    this.groups = [];

    this.collectionService.getSummary(this.selectedClientId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (summary) => {
          this.summary = summary;
        },
        error: (err) => {
          const message = err.error?.error || 'Failed to load collection summary';
          this.snackBar.open(message, 'Close', { duration: 4000 });
          this.isLoading = false;
        }
      });

    this.collectionService.getGroups(this.selectedClientId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (groups) => {
          this.groups = groups;
          this.isLoading = false;
        },
        error: (err) => {
          const message = err.error?.error || 'Failed to load collection groups';
          this.snackBar.open(message, 'Close', { duration: 4000 });
          this.isLoading = false;
        }
      });
  }

  openGroupDetails(group: CollectionGroup): void {
    this.dialog.open(CollectionDetailsComponent, {
      width: '950px',
      maxWidth: '95vw',
      data: {
        clientId: this.selectedClientId,
        paymentSubType: group.paymentSubType,
        companyName: this.getSelectedCompanyLabel(),
        group
      }
    });
  }

  getSelectedCompanyLabel(): string {
    return this.companies.find((c) => c.clientId === this.selectedClientId)?.name
      || this.companyName
      || (this.selectedClientId === 0 ? 'All Companies' : `Company ${this.selectedClientId}`);
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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/signin']);
  }
}
