import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/data.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-student-calendar',
  templateUrl: './student-calendar.component.html',
  styleUrls: ['./student-calendar.component.scss'],
  imports: [CommonModule, RouterModule],
  standalone: true,
})
export class StudentCalendarComponent implements OnInit {
  calendarEvents: any[] = [];
  selectedEvent: any = null;
  message: string = '';

  constructor(private dataService: DataService) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    let studentId = '';
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        studentId = decoded.id || decoded.userId || decoded.sub || '';
      } catch (e) {
        studentId = '';
      }
    }

    this.dataService.getStudentCalendar(studentId).subscribe({
      next: (events: any) => {
        if (events && events.length > 0) {
          this.calendarEvents = events;
        } else {
          this.message = "No subjects found for this student.";
        }
      },
      error: (err) => {
        console.error("Error:", err);
        this.message = "Failed to load data.";
      }
    });
  }

  // دالة لتحويل رقم اليوم إلى اسم اليوم
  getDayOfWeek(dayOfWeek: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
  }

  // لعرض تفاصيل المادة عند النقر
  showDetails(event: any) {
    this.selectedEvent = event;
  }
}
