import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Subject } from '../shared/interfaces/subject.interface';
import { Student } from '../shared/interfaces/student.interface';

@Injectable({ providedIn: 'root' })
export class SubjectService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getInstructorSubjects(instructorId?: string): Observable<Subject[]> {
    if (!instructorId) {
      instructorId = localStorage.getItem('instructorId') || '';
    }
    // Always fetch latest subjects from backend
    return this.http.get<Subject[]>(`${this.apiUrl}/Instructors/${instructorId}/subjects`);
  }

  assignSubjectToInstructor(instructorId: string, subjectId: string): Observable<any> {
    // This assumes a PUT or POST endpoint exists for assignment
    return this.http.put(`${this.apiUrl}/Instructors/${instructorId}/subjects/${subjectId}`, {});
  }

  assignSubjectToAttendee(attendeeId: string, subjectId: string): Observable<any> {
    // This assumes a PUT or POST endpoint exists for assignment
    return this.http.put(`${this.apiUrl}/Attendees/${attendeeId}/subjects/${subjectId}`, {});
  }

  getSubjectById(subjectId: string): Observable<Subject> {
    return this.http.get<Subject>(`${this.apiUrl}/Subjects/${subjectId}`);
  }

  getSubjectStudents(subjectId: string): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/Instructors/subjects/${subjectId}/students`);
  }
} 