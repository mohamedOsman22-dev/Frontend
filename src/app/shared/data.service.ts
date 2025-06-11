import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// === Interfaces ===
export interface Subject {
  id: string;
  name: string;
  instructorIds: string[];   // ربط المدرسين بالمواد
  dates: {
    day: string;
    from: string;
    to: string;
  }[]; // جدول الحصص/المواعيد
}

export interface Instructor {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  number?: string;
  subjects: string[]; 
  password?: string;// ids of subjects
}

export interface Student {  
  id: string;
  name: string;
  email: string;
  avatar?: string;
  number?: string;
  assignedSubjects: string[];
  password?: string; // ids of subjects
}

// =============== Service ===============
@Injectable({ providedIn: 'root' })
export class DataService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  getSubjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Subjects`, this.getAuthHeaders());
  }
  getInstructors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Instructors`, this.getAuthHeaders());
  }
  getStudents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Attendees`, this.getAuthHeaders());
  }

  // ربط التسجيل بالـ API
  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Auth/register`, data);
  }

  // --- Add/Edit/Delete Subjects ---
  addSubject(subj: Subject) {
    subj.id = subj.id || this.randomId('s');
    subj.instructorIds = subj.instructorIds || [];
    subj.dates = subj.dates || []; // <-- مهم جداً
    this.http.post(`${this.apiUrl}/Subjects`, subj, this.getAuthHeaders()).subscribe();
  }
  editSubject(subj: Subject) {
    this.http.put(`${this.apiUrl}/Subjects/${subj.id}`, subj, this.getAuthHeaders()).subscribe();
  }
  deleteSubject(subjId: string) {
    this.http.delete(`${this.apiUrl}/Subjects/${subjId}`, this.getAuthHeaders()).subscribe();
  }

  // --- Add/Edit/Delete Instructor ---
  addInstructor(ins: Instructor) {
    ins.id = ins.id || this.randomId('i');
    ins.subjects = ins.subjects || [];
    this.http.post(`${this.apiUrl}/Instructors`, ins, this.getAuthHeaders()).subscribe();
  }
  editInstructor(ins: Instructor) {
    this.http.put(`${this.apiUrl}/Instructors/${ins.id}`, ins, this.getAuthHeaders()).subscribe();
  }
  deleteInstructor(insId: string) {
    this.http.delete(`${this.apiUrl}/Instructors/${insId}`, this.getAuthHeaders()).subscribe();
  }

  // --- Add/Edit/Delete Student ---
  addStudent(st: Student) {
    st.id = st.id || this.randomId('st');
    st.assignedSubjects = st.assignedSubjects || [];
    this.http.post(`${this.apiUrl}/Attendees`, st, this.getAuthHeaders()).subscribe();
  }
  editStudent(st: Student) {
    this.http.put(`${this.apiUrl}/Attendees/${st.id}`, st, this.getAuthHeaders()).subscribe();
  }
  deleteStudent(stId: string) {
    this.http.delete(`${this.apiUrl}/Attendees/${stId}`, this.getAuthHeaders()).subscribe();
  }

  // --- Assign subject to instructor ---
  assignSubjectToInstructor(insId: string, subjId: string) {
    this.http.post(`${this.apiUrl}/Subjects/${subjId}/instructors/${insId}`, {}, this.getAuthHeaders()).subscribe();
  }

  // --- Assign subject to student ---
  assignSubjectToStudent(studentId: string, subjId: string) {
    this.http.post(`${this.apiUrl}/Attendees/${studentId}/subjects/${subjId}`, {}, this.getAuthHeaders()).subscribe();
  }

  // === Helpers ===
  getInstructorName(id: string): string {
    // Implementation needed
    return '';
  }
  getSubjectName(id: string): string {
    // Implementation needed
    return '';
  }
  private randomId(prefix = '') {
    return prefix + Math.random().toString(36).substr(2, 10);
  }
}
