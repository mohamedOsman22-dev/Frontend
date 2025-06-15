import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { AttendanceStateService } from '../../services/attendance-state.service';
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
export class SubjectAttendanceComponent implements OnInit {
  @Input() subjectId!: string;
  @Input() subject!: any;

  manualId = '';
  cameraActive = false;
  stream: MediaStream | null = null;
  capturedImage: string = '';
  instructorId: string = '';
  students: { name: string; id: string }[] = [];

  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    private attendanceState: AttendanceStateService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.instructorId = decoded.sub;

      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

      console.log('🆔 instructorId:', this.instructorId);
      console.log('📚 subjectId:', this.subjectId);

      // ✅ تحميل الطلاب
      this.http.get<any>('http://aps.tryasp.net/Attendees', { headers })
        .subscribe({
          next: (res) => {
            console.log('✅ Attendees:', res);
            this.students = res || [];
          },
          error: (err) => {
            console.error('❌ Failed to load attendees:', err);
            this.students = [
              { id: '1001', name: 'Student 1' },
              { id: '1002', name: 'Student 2' }
            ];
          }
        });
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
        alert('⚠️ لا يمكن تشغيل الكاميرا. تأكد من الإعدادات!');
        this.cameraActive = false;
      });
    }, 100);
  }

  captureImage(): void {
    console.log('📸 Capturing image...');
    const canvas = this.canvas?.nativeElement;
    const video = this.video?.nativeElement;

    if (!canvas || !video) {
      console.warn('⚠️ canvas or video element not found!');
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      console.error('❌ Failed to get canvas context');
      return;
    }

    context.drawImage(video, 0, 0, 320, 240);
    this.capturedImage = canvas.toDataURL('image/jpeg');
    console.log('✅ Image captured, length:', this.capturedImage.length);

    this.stopCamera();
    this.sendImageToApi();
  }

  stopCamera(): void {
    this.stream?.getTracks().forEach(track => track.stop());
    this.stream = null;
    this.cameraActive = false;
  }

  addManualAttendance(): void {
    const selected = this.students.find(s => s.id === this.manualId);
    if (!selected || !this.subjectId) return;

    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get(
      `http://aps.tryasp.net/Attendees/${selected.id}/subjects/${this.subjectId}`,
      { headers }
    ).subscribe({
      next: () => {
        const added = this.attendanceState.addToDraft({
          name: selected.name,
          id: selected.id
        });

        if (added) this.manualId = '';
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
    if (!this.subjectId || !this.capturedImage) return;

    const blob = this.dataURItoBlob(this.capturedImage);
    const formData = new FormData();
    formData.append('file', blob, `face-${Date.now()}.jpg`);

    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.post(
      `http://aps.tryasp.net/Attendances/face-checkin?subjectId=${this.subjectId}`,
      formData,
      { headers }
    ).subscribe({
      next: (res: any) => {
        const name = res.name || 'Student (from face)';
        const id = res.id || 'Unknown';
        console.log('✅ Face API returned:', res);
        this.verifyAndAddStudent(name, id, headers);
      },
      error: (err) => {
        console.error('❌ Face check-in failed:', err);
        alert('❌ فشل في التعرف على الوجه.');
      }
    });
  }

private verifyAndAddStudent(name: string, id: string, headers: HttpHeaders): void {
  console.log('🔍 Verifying student:', name, id, this.subjectId);

  this.http.get(
    `http://aps.tryasp.net/Attendees/${id}/subjects/${this.subjectId}`,
    { headers }
  ).subscribe({
    next: () => {
      const added = this.attendanceState.addToDraft({ name, id });
      if (!added) alert('⚠️ الطالب موجود بالفعل.');
    },
    error: () => {
      alert(`🚫 الطالب ${name} غير مسجل في هذه المادة.`);
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
