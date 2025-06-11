import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AttendanceRecord {
  studentId: string;
  subjectId: string;
  attendanceTime: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  constructor(private http: HttpClient) {}

  recordAttendance(record: AttendanceRecord): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/Attendance/record`, record);
  }

  getAttendanceBySubject(subjectId: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/Attendance/subject/${subjectId}`);
  }

  getAttendanceByStudent(studentId: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/Attendance/student/${studentId}`);
  }
}
