import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DataService } from '../../shared/data.service';

@Component({
  selector: 'app-student-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="calendar-bg">
      <div class="calendar-wrapper">
        <h2 class="calendar-title">My Attendance Calendar</h2>
        <full-calendar
          [plugins]="calendarPlugins"
          [initialView]="'dayGridMonth'"
          [events]="calendarEvents"
          [headerToolbar]="{
            left: 'prev today next',
            center: 'title',
            right: 'dayGridMonth'
          }"
          (eventClick)="handleEventClick($event)">
        </full-calendar>
        <div *ngIf="selectedEvent" class="event-details-modal">
          <h3>{{ selectedEvent.title }}</h3>
          <p><b>Date:</b> {{ selectedEvent.start | date:'fullDate' }}</p>
          <p><b>Time:</b> {{ selectedEvent.start | date:'shortTime' }}</p>
          <p><b>Details:</b> {{ selectedEvent.extendedProps?.details }}</p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./student-calendar.component.scss']
})
export class StudentCalendarComponent implements OnInit {
  calendarPlugins = [dayGridPlugin, interactionPlugin];
  calendarEvents: any[] = [];
  selectedEvent: any = null;

  constructor(
    private dataService: DataService,
  ) {}

  ngOnInit() {
    // استخراج studentId من التوكن
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
    this.dataService.getSubjectDatesForStudent(studentId).subscribe(events => {
      this.calendarEvents = (events || []).map(ev => ({
        title: ev.subjectName || 'Subject',
        // title: ev.subjectName || 'Subject',
        start: ev.date, // تأكد أن التاريخ بصيغة ISO
        color: ev.color || '#7c4dff',
        extendedProps: {
          details: ev.details || ev.description || '',
          room: ev.room || ''
        }
      }));
    });
  }

  handleEventClick(arg: any) {
    this.selectedEvent = arg.event;
  }

  dayClicked(event: any): void {
    // For month view
    if (event.day) {
      const date = event.day.date;
      const events = event.day.events;
      // Your logic here
      console.log(date, events);
    }
    // For week/day view, handle accordingly if needed
  }
}
