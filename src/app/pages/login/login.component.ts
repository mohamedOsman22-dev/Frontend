import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../../app/services/login.service';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    userType: string;
  };
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    RouterModule
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMsg = '';
  successMsg = '';

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // دالة لفك تشفير JWT Token
  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      return null;
    }
  }

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    const { email, password } = this.loginForm.value;

    this.loginService.login(email, password).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.successMsg = 'Login successful! Redirecting...';
        localStorage.setItem('token', response.token);

        // استخرج الدور من التوكن
        const decoded = this.decodeToken(response.token);
        if (decoded && decoded.role && decoded.role.toLowerCase() === 'admin') {
          this.router.navigate(['/dashboard']);
        } else {
          // يمكنك هنا توجيه المستخدم لصفحة أخرى أو عدم التوجيه
        }
      },
      error: (error: string) => {
        this.loading = false;
        this.errorMsg = error;
      }
    });
  }
}
