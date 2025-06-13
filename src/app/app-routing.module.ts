import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';
import { FaceAttendComponent } from './pages/face-attend/face-attend.component';
import { HomeComponent } from './pages/home/home.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { StudentCalendarComponent } from './pages/student-calendar/student-calendar.component';
import { InstructorDashboardComponent } from './pages/instructor-dashboard/instructor-dashboard.component';
import { InstructorCoursesComponent } from './pages/instructor-courses/instructor-courses.component';
import { InstructorSubjectsComponent } from './pages/instructor-subjects/instructor-subjects.component';
import { SubjectDetailsComponent } from './pages/subject-details/subject-details.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'face-attend', component: FaceAttendComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'student-calendar', component: StudentCalendarComponent },
  { path: 'instructor-dashboard', component: InstructorDashboardComponent },
  { path: 'instructor/courses', component: InstructorCoursesComponent },
  { path: 'subjects', component: InstructorSubjectsComponent },
  { path: 'subjects/:subjectId', component: SubjectDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 