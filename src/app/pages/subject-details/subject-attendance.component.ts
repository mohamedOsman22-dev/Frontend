import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-subject-attendance',
  standalone: true,
  imports: [MatIconModule, FormsModule],
  templateUrl: './subject-attendance.component.html',
  styleUrls: ['./subject-attendance.component.scss']
})
export class SubjectAttendanceComponent {
  @Input() subjectId!: string;
  attendanceList: { name: string; id: string }[] = [];
  manualName = '';
  manualId = '';
  cameraActive = false;

  startCamera() {
    this.cameraActive = true;
    // هنا منطق الكاميرا لاحقًا
  }

  addManualAttendance() {
    if (this.manualName && this.manualId) {
      this.attendanceList.push({ name: this.manualName, id: this.manualId });
      this.manualName = '';
      this.manualId = '';
    }
  }

  removeFromAttendance(index: number) {
    this.attendanceList.splice(index, 1);
  }
} 