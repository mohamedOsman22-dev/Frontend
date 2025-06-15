import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private apiUrl = 'http://aps.tryasp.net';

  constructor(private http: HttpClient) {}

  getStudentsBySubject(subjectId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Students/BySubject/${subjectId}`);
  }
 getStudentCalendar(studentId: string) {
   const token = localStorage.getItem('token');
   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
   return this.http.get(`http://aps.tryasp.net/Attendances/calendar`, { headers });
}
}