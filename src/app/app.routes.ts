import { Routes } from '@angular/router';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'signup', loadComponent: () => import('./pages/signup/signup.component').then(m => m.SignupComponent) },

  {
    path: 'student-calendar',
    loadComponent: () => import('./pages/student-calendar/student-calendar.component')
      .then(m => m.StudentCalendarComponent),
    canActivate: [RoleGuard],
    data: { roles: ['student'] }
  },
  {
    path: 'take-attendance',
    loadComponent: () => import('./pages/face-attend/face-attend.component')
      .then(m => m.FaceAttendComponent),
    canActivate: [RoleGuard],
    data: { roles: ['instructor'] }
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component')
      .then(m => m.DashboardComponent),
    canActivate: [RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'instructor-subject/:id',
    loadComponent: () => import('./pages/face-attend/face-attend.component')
      .then(m => m.FaceAttendComponent),
    canActivate: [RoleGuard],
    data: { roles: ['instructor'] }
  },
  {
    path: 'courses',
    loadComponent: () => import('./pages/instructor/instructor-courses.component')
      .then(m => m.InstructorCoursesComponent),
    canActivate: [RoleGuard],
    data: { roles: ['instructor'] }
  },
  { path: '**', redirectTo: '' }
];
