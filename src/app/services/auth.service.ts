// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface LoginResponse {
  token: string;
  user: { role: string; [key: string]: any };
  userType?: string;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _role = new BehaviorSubject<'Attendee' | 'Instructor' | 'Admin' | 'guest'>('guest');
  role$ = this._role.asObservable();
  private API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user && user.userType) this._role.next(user.userType as 'Attendee' | 'Instructor' | 'Admin');
  }

  login(email: string, password: string): Observable<LoginResponse | { error: string }> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, { email, password }).pipe(
      tap(res => {
        if (res && res.token && (res.userType || res.user?.role)) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res));
          const role = (res.userType || res.user?.role) as 'Attendee' | 'Instructor' | 'Admin' | 'guest';
          this._role.next(role);
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return of({ error: 'Login failed. Please check your credentials.' });
      })
    );
  }

  logout() {
    localStorage.clear();
    this._role.next('guest');
  }

  get role() {
    return this._role.value;
  }

  get token() {
    return localStorage.getItem('token');
  }

  get user() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  getCurrentUserId(): string {
    const user = this.user;
    return user && user.id ? user.id : '';
  }
}

