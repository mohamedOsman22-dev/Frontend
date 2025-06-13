import { Injectable } from '@angular/core';
import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  Router
} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RoleGuard {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const allowedRoles = route.data['roles'] as string[];
    // دالة لفك تشفير التوكن
    function getRoleFromToken(): string | null {
      const token = localStorage.getItem('token');
      if (!token) return null;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role ? payload.role : null;
      } catch {
        return null;
      }
    }

    const userRole = getRoleFromToken();

    // لو الدور مش مسموح
    if (!userRole || !allowedRoles.includes(userRole)) {
      // ✅ لو الصفحة اللي بيحاول يدخلها login أو signup أو home نسمحله
      const publicPages = ['login', 'signup', ''];
      const currentPath = route.routeConfig?.path ?? '';

      if (!publicPages.includes(currentPath)) {
        // نوجهه لـ login
        setTimeout(() => {
          window.location.href = '/login';
        }, 0);
      }

      return false;
    }

    return true;
  }
}