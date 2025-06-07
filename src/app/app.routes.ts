import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'student-calendar',
    loadComponent: () => import('./pages/student-calendar/student-calendar.component').then(m => m.StudentCalendarComponent)
  },
  {
    path: 'manage-account',
    loadComponent: () => import('./pages/manage-account/manage-account.component').then(m => m.ManageAccountComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/users/users.component').then(m => m.UsersComponent)
  },
  {
    path: 'face-attend',
    loadComponent: () => import('./pages/face-attend/face-attend.component').then(m => m.FaceAttendComponent)
  },
  {
    path: 'manage-attend',
    loadComponent: () => import('./pages/manage-attend/manage-attend.component').then(m => m.ManageAttendComponent)
  },
  {
    path: 'reports',
    loadComponent: () => import('./pages/reports/reports.component').then(m => m.ReportsComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent)
  },
  // آخر مسار لأي رابط غلط (صفحة Not Found لو حبيت تضيفها)
  // { path: '**', loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent) },
];
