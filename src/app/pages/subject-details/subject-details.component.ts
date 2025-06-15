import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { SubjectAttendanceComponent } from './subject-attendance.component';
import { SubjectAttendanceReviewComponent } from './subject-attendance-review.component';
import { AttendanceStateService } from '../../services/attendance-state.service';

@Component({
  selector: 'app-subject-details',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    SubjectAttendanceComponent,
    SubjectAttendanceReviewComponent,
  ],
templateUrl: './subject-details.component.html', 
  styleUrls: ['./subject-attendance.component.scss']
})
export class SubjectDetailsComponent implements OnInit {
  subject: any = null;
  subjectId: string | null = null;
  students: { name: string, id: string }[] = [];
  selectedStudent: any = null;

  constructor(private attendanceState: AttendanceStateService) {}

  ngOnInit(): void {
    const stored = localStorage.getItem('selectedSubject');
    if (stored) {
      this.subject = JSON.parse(stored);
      this.subjectId = this.subject.id || this.subject.name; // fallback: use name if id doesn't exist
    } else {
      console.error('❌ لا يوجد بيانات مادة محفوظة');
    }

    this.students = [
      { name: 'Student 1', id: '1001' },
      { name: 'Student 2', id: '1002' },
    ];
  }

  sendToReview(): void {
    this.attendanceState.sendDraftToFinal();
  }

  downloadPDF(): void {
    alert('Download PDF feature coming soon.');
  }

  downloadCSV(): void {
    alert('Download CSV feature coming soon.');
  }

  onStudentSelect(student: any) {
    // logic if needed
  }
}
