import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-subject-attendance-review',
  standalone: true,
  imports: [MatIconModule, FormsModule],
  templateUrl: './subject-attendance-review.component.html',
  styleUrls: ['./subject-attendance-review.component.scss']
})
export class SubjectAttendanceReviewComponent {
  @Input() subjectId!: string;
  attendanceList: { name: string; id: string }[] = [
    // بيانات تجريبية، لاحقًا تربطها بالحضور الفعلي
    { name: 'Student 1', id: '1001' },
    { name: 'Student 2', id: '1002' }
  ];
  editIndex: number | null = null;
  editName = '';
  editId = '';
  submitted = false;

  startEdit(i: number) {
    this.editIndex = i;
    this.editName = this.attendanceList[i].name;
    this.editId = this.attendanceList[i].id;
  }
  saveEdit() {
    if (this.editIndex !== null) {
      this.attendanceList[this.editIndex] = { name: this.editName, id: this.editId };
      this.editIndex = null;
      this.editName = '';
      this.editId = '';
    }
  }
  remove(i: number) {
    this.attendanceList.splice(i, 1);
  }
  submitAttendance() {
    this.submitted = true;
    // هنا منطق إرسال الحضور للـ backend
  }
  downloadCSV() {
    // منطق تصدير CSV
  }
  downloadPDF() {
    // منطق تصدير PDF
  }
} 