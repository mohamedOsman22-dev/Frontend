import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { NavbarInstructorComponent } from "../../components/navbar/navbar-instructor.component";

@Component({
  selector: 'app-instructor-courses',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    NavbarInstructorComponent
],
  templateUrl: './instructor-courses.component.html',
  styleUrls: ['./instructor-courses.component.scss']
})
export class InstructorCoursesComponent {
  subjects = [
    {
      id: 1,
      name: 'Object Oriented Programming',
      instructor: 'Mohamed Mabrouk',
      schedule: 'Tuesday 4:00 PM'
    },
    {
      id: 2,
      name: 'Design Pattern',
      instructor: 'Mohamed Mabrouk',
      schedule: 'Thursday 11:00 AM'
    }
  ];

  constructor(private router: Router) {}

  openSubject(subject: any) {
    this.router.navigate(['/instructor-subject', subject.id]);
  }
}
