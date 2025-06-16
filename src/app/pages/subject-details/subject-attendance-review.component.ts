import { Component, Input } from '@angular/core';
import { AttendanceService } from '../../services/attendance.service';
import { AttendanceStateService } from '../../services/attendance-state.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-subject-attendance-review',
  templateUrl: './subject-attendance-review.component.html',
  styleUrls: ['./subject-attendance-review.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RouterModule]
})
export class SubjectAttendanceReviewComponent {
  @Input() subjectId!: string;
  @Input() subject!: any;

  editIndex: number | null = null;
  editName = '';
  editId = '';
  reportReady = false;

  constructor(
    public attendanceService: AttendanceService,
    public attendanceState: AttendanceStateService,
    private http: HttpClient
  ) {}

  get attendanceList() {
    return this.attendanceState.getReviewList();
  }

  startEdit(i: number) {
    this.editIndex = i;
    this.editName = this.attendanceList[i].name;
    this.editId = this.attendanceList[i].id;
  }

  saveEdit() {
    if (this.editIndex !== null) {
      this.attendanceList[this.editIndex] = {
        name: this.editName,
        id: this.editId
      };
      this.editIndex = null;
      this.editName = '';
      this.editId = '';
    }
  }

  remove(i: number) {
    this.attendanceState.removeFromReview(i);
  }

 submitAttendance() {
  const studentIds = this.attendanceList
    .map(s => s.id)
    .filter(id => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id));

  if (!studentIds.length) {
    alert('🚫 لا يوجد طلاب بصيغة UUID صحيحة للإرسال.');
    return;
  }

  const token = localStorage.getItem('token') || '';
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

  this.http.post(
    `http://aps.tryasp.net/Attendances/subjects/${this.subjectId}/attendees`,
    studentIds, // ✅ لاحظ إنها مصفوفة مباشرة
    { headers }
  ).subscribe({
    next: () => {
      alert('✅ Attendance submitted successfully!');
      this.reportReady = true;
      this.attendanceState.clearReviewList();
    },
    error: (err) => {
      console.error('❌ Submit failed:', err);
      alert('❌ Failed to submit attendance. يرجى التأكد من الصلاحيات أو صيغة البيانات.');
    }
  });
}


  downloadPDF() {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get(`http://aps.tryasp.net/Attendances/report/${this.subjectId}`, {
      headers,
      responseType: 'blob'
    }).subscribe({
      next: (res) => {
        const blob = new Blob([res], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance-report-${this.subjectId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        alert('❌ Failed to download report.');
      }
    });
  }

  downloadCSV() {
    alert('📄 CSV download coming soon.');
  }
}
