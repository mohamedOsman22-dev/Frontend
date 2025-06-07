// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _role = new BehaviorSubject<'student' | 'instructor' | 'guest'>('guest');
  role$ = this._role.asObservable();

  setRole(role: 'student' | 'instructor' | 'guest') {
    this._role.next(role);
  }

  get role() {
    return this._role.value;
  }
}
