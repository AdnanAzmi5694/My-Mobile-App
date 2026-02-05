import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {
  loginForm: FormGroup;
  hide = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', Validators.required]
    });
  }

 onSubmit() {
  if (this.loginForm.valid) {
    this.isLoading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.snackBar.open('Login successful! Loading dashboard with last 15 days data...', 'Close', { 
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        const message =
          err.error?.error || // custom error from server like { error: "Invalid credentials" }
          err.error?.message || // fallback to common 'message' field
          'Login Unsuccessful. Please try again.';

        this.snackBar.open(message, 'Close', { 
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
}
