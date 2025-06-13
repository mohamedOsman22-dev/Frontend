import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private apiUrl = 'http://aps.tryasp.net/api';

  constructor(private http: HttpClient) {}

  getStudentsBySubject(subjectId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Students/BySubject/${subjectId}`);
  }
}