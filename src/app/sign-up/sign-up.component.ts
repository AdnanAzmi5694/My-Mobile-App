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
  selector: 'app-sign-up',
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
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  signupForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      Username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(6)]],
      ConfirmPassword: ['', [Validators.required]],
      MobileNumber: ['', [Validators.pattern('^[0-9]{10,15}$')]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('Password');
    const confirmPassword = form.get('ConfirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    if (confirmPassword && confirmPassword.errors) {
      delete confirmPassword.errors['passwordMismatch'];
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null);
      }
    }
    
    return null;
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.isLoading = true;
      
      const signupData = {
        Username: this.signupForm.value.Username,
        Email: this.signupForm.value.Email,
        Password: this.signupForm.value.Password,
        MobileNumber: this.signupForm.value.MobileNumber || null
      };

      this.authService.register(signupData).subscribe({
        next: () => {
          this.snackBar.open('Registration successful! Please sign in.', 'Close', { 
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/signin']);
        },
        error: (err: any) => {
          const message = err.error?.error || err.error?.message || 'Registration failed. Please try again.';
          this.snackBar.open(message, 'Close', { 
            duration: 4000,
            panelClass: ['error-snackbar']
          });
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched() {
    Object.keys(this.signupForm.controls).forEach(key => {
      const control = this.signupForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.signupForm.get(controlName);
    
    if (control?.hasError('required')) {
      return `${controlName} is required`;
    }
    
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    
    if (control?.hasError('minlength')) {
      const requiredLength = control.getError('minlength').requiredLength;
      return `${controlName} must be at least ${requiredLength} characters`;
    }
    
    if (control?.hasError('maxlength')) {
      const requiredLength = control.getError('maxlength').requiredLength;
      return `${controlName} must not exceed ${requiredLength} characters`;
    }
    
    if (control?.hasError('pattern')) {
      return 'Please enter a valid mobile number';
    }
    
    if (control?.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    
    return '';
  }
}
