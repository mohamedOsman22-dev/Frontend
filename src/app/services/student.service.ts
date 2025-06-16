import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// 🧠 يمثل جدول الحصص لطالب معين
export interface ScheduleItem {
  subjectName: string;
  dayOfWeek: number;
  startTime: string | Date;
  endTime: string | Date;
}

// 👤 يمثل طالب
export interface Student {
  id: string;
  fullName?: string;
  email?: string;
  number?: string;
  password?: string;
  assignedSubjects?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private baseUrl = 'http://aps.tryasp.net';

  constructor(private http: HttpClient) {}

  getStudentSchedule(): Observable<ScheduleItem[]> {
    return this.http.get<ScheduleItem[]>(`${this.baseUrl}/Attendees/calendar`);
  }

  getStudentsBySubject(subjectId: string): Observable<Student[]> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<Student[]>(
      `${this.baseUrl}/Subjects/${subjectId}/attendees`,
      { headers }
    );
  }

  getStudentById(studentId: string): Observable<Student> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<Student>(`${this.baseUrl}/Attendees/${studentId}`, { headers });
  }

  addStudent(student: Student): Observable<any> {
    return this.http.post(`${this.baseUrl}/Attendees`, student);
  }

  editStudent(student: Student): Observable<any> {
    return this.http.put(`${this.baseUrl}/Attendees/${student.id}`, student);
  }

  deleteStudent(studentId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/Attendees/${studentId}`);
  }

  deleteAllAttendees(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/Attendees`);
  }

  autoRegisterUser(studentId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/Account/auto-register/${studentId}`, {});
  }

  assignSubjectToAttendee(studentId: string, subjectId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/Subjects/${subjectId}/assign/${studentId}`, {});
  }

  removeSubjectFromAttendee(studentId: string, subjectId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/Subjects/${subjectId}/remove/${studentId}`);
  }

  getSubjectsByAttendeeId(studentId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/Attendees/${studentId}/subjects`);
  }

  uploadAttendeeImage(studentId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/Attendees/${studentId}/upload-image`, formData);
  }

  uploadImagesForTraining(studentId: string, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return this.http.post(`${this.baseUrl}/Training/${studentId}`, formData);
  }

  getInstructorName(instructorId: string): string {
    // اختياري: يمكن ربطها بالـ service المسؤول عن المحاضرين
    return `Instructor ${instructorId}`;
  }
}
