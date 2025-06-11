import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule, DateAdapter, CalendarEvent } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

@Component({
  selector: 'app-calendar-demo',
  standalone: true,
  template: `
    <div style="background:#e5d3fc;padding:50px;min-height:100vh;display:flex;align-items:center;justify-content:center;">
      <div style="background:white;border-radius:18px;box-shadow:0 4px 22px #b993f773;padding:30px;">
        <h2 style="text-align:center;color:#6d4cb9;font-size:2em;margin-bottom:20px">Demo Calendar</h2>
        <mwl-calendar-month-view
          [viewDate]="viewDate"
          [events]="events"
          [activeDayIsOpen]="false">
        </mwl-calendar-month-view>
      </div>
    </div>
  `,
  imports: [
    CommonModule,
    CalendarModule
  ],
  providers: [
    { provide: DateAdapter, useFactory: adapterFactory }
  ]
})
export class CalendarDemoComponent {
  viewDate: Date = new Date();
  events: CalendarEvent[] = [
    { start: new Date(), title: 'Present', color: { primary: '#62d481', secondary: '#fff' } }
  ];
}
    