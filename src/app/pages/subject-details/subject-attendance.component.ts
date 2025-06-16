import { Component, Input, ViewChild, ElementRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { AttendanceStateService } from '../../services/attendance-state.service';
import { AttendanceService } from '../../services/attendance.service';
import { StudentService } from '../../services/student.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-subject-attendance',
  standalone: true,
  templateUrl: './subject-attendance.component.html',
  styleUrls: ['./subject-attendance.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule
  ],
})
export class SubjectAttendanceComponent implements OnInit, OnChanges {
  @Input() subjectId!: string;
  @Input() subject!: any;

  manualName = '';
  manualId = '';
  cameraActive = false;
  stream: MediaStream | null = null;
  capturedImage: string = '';
  instructorId: string = '';
  subjectName: string = '';

  students: { name: string; id: string }[] = [];
  presentStudents: { name: string; id: string }[] = []; // ✅

  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    private attendanceState: AttendanceStateService,
    private http: HttpClient,
    private attendanceService: AttendanceService,
    private studentService: StudentService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['subject'] && this.subject) {
      this.subjectId = this.subject.id;
    }
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.instructorId = decoded.sub;
    }

    if (this.instructorId && this.subjectId) {
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

      // تحميل اسم المادة
      this.http.get<any>(
        `http://aps.tryasp.net/Instructors/${this.instructorId}/subjects/${this.subjectId}`,
        { headers }
      ).subscribe({
        next: (res) => {
          this.subjectName = res.name || 'Unnamed Subject';
        },
        error: (err) => {
          console.error('❌ Failed to load subject:', err);
        }
      });

      // تحميل الطلاب المسجلين بالمادة
      this.studentService.getStudentsBySubject(this.subjectId).subscribe({
        next: (res) => {
          this.students = res.map((student: any) => ({
            name: student.name,
            id: student.id
          }));
        },
        error: (err) => {
          console.error('❌ Failed to load students:', err);
        }
      });

      // ✅ تحميل الطلاب اللي تم تسجيل حضورهم مسبقًا
      this.loadPresentStudents(headers);
    }
  }

  get attendanceList() {
    return this.attendanceState.getDraftList();
  }

  startCamera(): void {
    this.cameraActive = true;

    setTimeout(() => {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        this.stream = stream;
        const videoEl = this.video?.nativeElement;
        if (videoEl) {
          videoEl.srcObject = stream;
          videoEl.play();
        }
      }).catch(err => {
        console.error('Camera access error:', err);
        this.cameraActive = false;
      });
    }, 100);
  }

  captureImage(): void {
    const canvasEl = this.canvas?.nativeElement;
    const videoEl = this.video?.nativeElement;
    if (!canvasEl || !videoEl) return;

    const context = canvasEl.getContext('2d');
    context?.drawImage(videoEl, 0, 0, 320, 240);
    this.capturedImage = canvasEl.toDataURL('image/jpeg');

    this.stopCamera();
    this.sendImageToApi();
  }

  stopCamera(): void {
    this.stream?.getTracks().forEach(track => track.stop());
    this.stream = null;
    this.cameraActive = false;
  }

  addManualAttendance(): void {
    if (!this.manualId || !this.subjectId) return;

    this.manualName = this.students.find(s => s.id === this.manualId)?.name || '';

    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get(
      `http://aps.tryasp.net/Attendees/${this.manualId}/subjects/${this.subjectId}`,
      { headers }
    ).subscribe({
      next: () => {
        const added = this.attendanceState.addToDraft({
          name: this.manualName,
          id: this.manualId
        });

        if (added) {
          this.manualName = '';
          this.manualId = '';
        }
      },
      error: () => {
        alert('❌ هذا الطالب غير مسجل في هذه المادة!');
      }
    });
  }

  removeFromAttendance(index: number): void {
    this.attendanceState.removeFromDraft(index);
  }

  sendToReview(): void {
    this.attendanceState.sendDraftToFinal();
  }

  private sendImageToApi(): void {
    if (!this.subjectId || !this.capturedImage) {
      console.warn('⚠️ No subject ID or image to send');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`
    });

    this.attendanceService.faceCheckIn(this.subjectId, this.capturedImage).subscribe({
      next: (res: any) => {
        const studentName = res.name || 'Student (from face)';
        const studentId = res.id || 'Unknown';

        this.verifyAndAddStudent(studentName, studentId, headers);

        // ✅ تحديث قائمة الحضور المؤكد بعد التقاط الصورة
        this.loadPresentStudents(headers);
      },
      error: (err) => {
        console.error('❌ Face check-in failed:', err);
        alert('تم اخذ الحضور');
      }
    });
  }

  private verifyAndAddStudent(name: string, id: string, headers: HttpHeaders): void {
    const isValidUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
    if (!isValidUUID) {
      alert(`⚠️ المعرف ${id} غير صالح كـ UUID. لم يتم إضافة الطالب.`);
      return;
    }

    this.http.get(
      `http://aps.tryasp.net/Attendees/${id}/subjects/${this.subjectId}`,
      { headers }
    ).subscribe({
      next: () => {
        const added = this.attendanceState.addToDraft({ name, id });
        if (!added) {
          alert('الطالب موجود بالفعل.');
        }
      },
      error: () => {
        alert(`🚫 الطالب ${name} غير مسجل في هذه المادة.`);
      }
    });
  }

  private loadPresentStudents(headers: HttpHeaders): void {
    this.http.get<{ id: string; name: string }[]>(
      `http://aps.tryasp.net/Attendances/names/${this.subjectId}`,
      { headers }
    ).subscribe({
      next: (res) => {
        this.presentStudents = res;
      },
      error: (err) => {
        console.error('❌ Failed to load present students:', err);
      }
    });
  }

  private dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  }
}
