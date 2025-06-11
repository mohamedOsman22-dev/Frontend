import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-student-calendar',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule],
  template: `
    <div class="calendar-container">
      <h1>Student Calendar</h1>
      
      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="schedule">
            <ng-container matColumnDef="course">
              <th mat-header-cell *matHeaderCellDef>Course</th>
              <td mat-cell *matCellDef="let item">{{item.course}}</td>
            </ng-container>
            <ng-container matColumnDef="time">
              <th mat-header-cell *matHeaderCellDef>Time</th>
              <td mat-cell *matCellDef="let item">{{item.time}}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let item">{{item.status}}</td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="['course', 'time', 'status']"></tr>
            <tr mat-row *matRowDef="let row; columns: ['course', 'time', 'status'];"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .calendar-container {
      padding: 2rem;
    }
    table {
      width: 100%;
    }
  `]
})
export class StudentCalendarComponent implements OnInit {
  schedule = [
    { course: 'Course 1', time: '9:00 AM', status: 'Present' },
    { course: 'Course 2', time: '11:00 AM', status: 'Absent' },
    { course: 'Course 3', time: '2:00 PM', status: 'Present' }
  ];

  ngOnInit() {
    // Load schedule data from service
  }
}
