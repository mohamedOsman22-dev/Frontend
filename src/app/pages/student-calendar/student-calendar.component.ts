import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarEvent, CalendarView, CalendarMonthViewDay, CalendarModule } from 'angular-calendar';

@Component({
  selector: 'app-student-calendar',
  standalone: true,
  imports: [
    CommonModule,
    CalendarModule // فقط هنا!!
  ],
  templateUrl: './student-calendar.component.html',
  styleUrls: ['./student-calendar.component.scss'],
})
export class StudentCalendarComponent {
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  attendance: CalendarEvent[] = [
    { start: new Date(2025, 5, 1), title: 'Present', color: { primary: '#32d282', secondary: '#e3fceb' } },
    { start: new Date(2025, 5, 2), title: 'Absent', color: { primary: '#ff4d4d', secondary: '#fbe8e6' } },
    { start: new Date(2025, 5, 3), title: 'Lecture', color: { primary: '#b993f7', secondary: '#e3e3fa' } },
  ];
  CalendarView = CalendarView;

  selectedDay: Date | null = null;
  selectedDayTitle: string = '';
  selectedDayContent: string = '';

  dayClicked(day: CalendarMonthViewDay<CalendarEvent>) {
    this.selectedDay = day.date;
    if (day.events.length > 0) {
      const event = day.events[0];
      if (event.title === 'Present') {
        this.selectedDayTitle = 'Attendance';
        this.selectedDayContent = 'You were present this day ✅';
      } else if (event.title === 'Absent') {
        this.selectedDayTitle = 'Attendance';
        this.selectedDayContent = 'You were absent this day ❌';
      } else {
        this.selectedDayTitle = 'Lecture';
        this.selectedDayContent = 'You have a lecture on this day 📚';
      }
    } else {
      this.selectedDayTitle = 'No Events';
      this.selectedDayContent = 'No lectures or attendance required for this day.';
    }
  }
}
