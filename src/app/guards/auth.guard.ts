import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

 canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    const user = localStorage.getItem('user');
    // كمل لوجيك الجارد عادي هنا
  }
  // ممكن ترجع false لو مش في متصفح أو مش لاقي user
  return false;
}
}