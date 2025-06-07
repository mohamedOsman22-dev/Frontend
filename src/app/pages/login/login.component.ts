import { Component, AfterViewInit, HostListener, Renderer2, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements AfterViewInit {
  email = '';
  password = '';
  loading = false;
  showPassword = false;

  errorMsg = '';
  successMsg = '';

  // Role logic (للبانر بعد الدخول فقط)
  userRole: 'student' | 'instructor' | null = null;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private router: Router,
    private auth: AuthService
  ) {}

  login(form?: NgForm) {
    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';
    setTimeout(() => {
      if (this.email.endsWith('@student.com') && this.password === 'student123') {
        this.auth.setRole('student');
        this.userRole = 'student';
        this.router.navigate(['/student-calendar']);
        return;
      } else if (this.email.endsWith('@instructor.com') && this.password === 'instructor123') {
        this.auth.setRole('instructor');
        this.userRole = 'instructor';
        this.router.navigate(['/dashboard']);
      } else {
        this.auth.setRole('guest');
        this.errorMsg = 'Email or password is incorrect!';
      }
      this.loading = false;
    }, 1300);
  }

  @HostListener('window:scroll', [])
  onScroll() {
    const elements = this.el.nativeElement.querySelectorAll('.fade-up-on-scroll');
    elements.forEach((el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 50) {
        this.renderer.addClass(el, 'revealed');
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const elements = this.el.nativeElement.querySelectorAll('.fade-up-on-scroll');
      elements.forEach((el: HTMLElement) => {
        this.renderer.addClass(el, 'revealed');
      });
    }, 500);
  }

  logout() {
    this.auth.setRole('guest');
    this.router.navigate(['/login']);
  }
}
