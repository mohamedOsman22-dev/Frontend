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
import { jwtDecode } from 'jwt-decode';
import { MatIconModule } from '@angular/material/icon';

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
    RouterModule,
    MatIconModule
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMsg = '';
  successMsg = '';
  hidePassword = true;
  bubbles = Array(6);
  showAnimatedMsg = false;
  loginSuccess = false;
  email = '';
  password = '';

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/)
      ]]
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
    alert('login called');
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';
    this.showAnimatedMsg = false;
    const { email, password } = this.loginForm.value;
    this.loginService.login(email, password).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.loginSuccess = true;
        this.showAnimatedMsg = true;
        localStorage.setItem('token', response.token);
        setTimeout(() => { this.showAnimatedMsg = false; }, 2500);
        let decoded: any;
        try {
          decoded = jwtDecode(response.token);
        } catch (e) {
          this.errorMsg = 'خطأ في التوكن.';
          this.loginSuccess = false;
          return;
        }
        console.log('Decoded token:', decoded);
        const role = (decoded.role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.userType || decoded.user_type || '').toLowerCase();
        console.log('Extracted role:', role);
        if (role === 'instructor') {
          localStorage.setItem('instructorId', decoded.id || decoded.instructorId || decoded.sub || decoded.userId || '');
        } else if (role === 'admin') {
          localStorage.setItem('instructorId', decoded.id || decoded.instructorId || decoded.sub || decoded.userId || '');
        } else if (role === 'attendee') {
          localStorage.setItem('instructorId', decoded.id || decoded.instructorId || decoded.sub || decoded.userId || '');
        }
        setTimeout(() => {
          if (role === 'admin') {
            this.router.navigate(['/dashboard']);
          } else if (role === 'student' || role === 'attendee') {
            this.router.navigate(['/student-calendar']);
          } else if (role === 'instructor') {
            this.router.navigate(['/subjects']);
          } else {
            this.errorMsg = `لم يتم التعرف على نوع المستخدم أو ليس لديك صلاحية الدخول هنا. الدور المستخرج: [${role}]`;
            this.loginSuccess = false;
            this.showAnimatedMsg = true;
            setTimeout(() => { this.showAnimatedMsg = false; }, 3500);
            console.error('Unknown or unauthorized user role:', role, decoded);
          }
        }, 1200);
      },
      error: (error: string) => {
        this.loading = false;
        this.loginSuccess = false;
        this.showAnimatedMsg = true;
        setTimeout(() => { this.showAnimatedMsg = false; }, 2500);
      }
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onLogin() {
    this.loginService.login(this.email, this.password).subscribe(result => {
      if (result.userType === 'instructor') {
        this.router.navigate(['/instructor-subject']);
      } else if (result.userType === 'attendee') {
        this.router.navigate(['/calendar']);
      } else if (result.userType === 'admin') {
        this.router.navigate(['/dashboard']);
      } else {
        // معالجة حالة غير معروفة
        alert('نوع مستخدم غير معروف');
      }
    }, error => {
      alert('خطأ في تسجيل الدخول');
    });
  }
}
