import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SubjectService } from '../../services/subject.service';
import { StudentService } from '../../services/student.service';
import { AttendanceService } from '../../services/attendance.service';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-instructor-subjects',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './instructor-subjects.component.html',
  styleUrls: ['./instructor-subjects.component.scss']
})
export class InstructorSubjectsComponent implements OnInit {
  subjectId!: string;
  subject: any;
  students: any[] = [];
  attendanceList: any[] = [];
  manualName = '';
  manualId = '';
  pdfReady = false;
  subjects: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private subjectService: SubjectService,
    private studentService: StudentService,
    private attendanceService: AttendanceService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const instructorId = this.authService.getCurrentUserId();
    this.subjectService.getInstructorSubjects(instructorId).subscribe(subjects => this.subjects = subjects);
    this.subjectId = this.route.snapshot.paramMap.get('id')!;
    this.subjectService.getSubjectById(this.subjectId).subscribe(subject => this.subject = subject);
    this.studentService.getStudentsBySubject(this.subjectId).subscribe(students => this.students = students);
  }

  // إضافة طالب يدويًا
  addManualAttendance() {
    if (this.manualName && this.manualId) {
      this.attendanceList.push({ name: this.manualName, id: this.manualId });
      this.manualName = '';
      this.manualId = '';
    }
  }

  // حذف طالب من قائمة الحضور
  removeFromAttendance(index: number) {
    this.attendanceList.splice(index, 1);
  }

  // إرسال الحضور
  submitAttendance() {
    this.attendanceService.submitAttendance(this.subjectId, this.attendanceList).subscribe(() => {
      this.pdfReady = true;
      alert('تم إرسال الحضور بنجاح!');
    });
  }

  // تحميل تقرير PDF
  downloadPDF() {
    // يمكنك استخدام مكتبة jspdf هنا لتوليد التقرير
  }
}