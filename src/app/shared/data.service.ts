import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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
  // --- Dummy Initial Data ---
  private _subjects = new BehaviorSubject<Subject[]>([
    { id: 's1', name: 'Object Oriented Programming', instructorIds: [], dates: [] },
    { id: 's2', name: 'Design Pattern', instructorIds: [], dates: [] },
    { id: 's3', name: 'Computer Science', instructorIds: [], dates: [] },
    { id: 's4', name: 'Artificial Intelligence', instructorIds: [], dates: [] }
  ]);
  private _instructors = new BehaviorSubject<Instructor[]>([
    { id: 'i1', name: 'Mohamed Mabrouk', email: 'mabrouk@instructor.com', avatar: '', number: '01223344556', subjects: ['s1', 's2'] },
    { id: 'i2', name: 'Sarah Medhat', email: 'sarah.medhat@instructor.com', avatar: '', number: '01022338877', subjects: ['s4'] }
  ]);
  private _students = new BehaviorSubject<Student[]>([
    { id: 'st1', name: 'Ahmed Mahmoud', email: 'ahmed@student.com', avatar: '', number: '01112345678', assignedSubjects: ['s1', 's2'] },
    { id: 'st2', name: 'Sara Adel', email: 'sara@student.com', avatar: '', number: '', assignedSubjects: [] }
  ]);

  // --- Observables ---
  getSubjects(): Observable<Subject[]>      { return this._subjects.asObservable(); }
  getInstructors(): Observable<Instructor[]>{ return this._instructors.asObservable(); }
  getStudents(): Observable<Student[]>      { return this._students.asObservable(); }

  // --- Add/Edit/Delete Subjects ---
  addSubject(subj: Subject) {
    subj.id = subj.id || this.randomId('s');
    subj.instructorIds = subj.instructorIds || [];
    subj.dates = subj.dates || []; // <-- مهم جداً
    this._subjects.next([...this._subjects.value, subj]);
  }
  editSubject(subj: Subject) {
    const arr = this._subjects.value.map(s => s.id === subj.id ? { ...s, ...subj } : s);
    this._subjects.next(arr);
  }
  deleteSubject(subjId: string) {
    this._subjects.next(this._subjects.value.filter(s => s.id !== subjId));
    // Remove this subject from all instructors & students
    this._instructors.next(this._instructors.value.map(ins => ({
      ...ins, subjects: ins.subjects.filter(sid => sid !== subjId)
    })));
    this._students.next(this._students.value.map(st => ({
      ...st, assignedSubjects: st.assignedSubjects.filter(sid => sid !== subjId)
    })));
  }

  // --- Add/Edit/Delete Instructor ---
  addInstructor(ins: Instructor) {
    ins.id = ins.id || this.randomId('i');
    ins.subjects = ins.subjects || [];
    this._instructors.next([...this._instructors.value, ins]);
    this.syncSubjectInstructors();
  }
  editInstructor(ins: Instructor) {
    this._instructors.next(this._instructors.value.map(i => i.id === ins.id ? { ...i, ...ins } : i));
    this.syncSubjectInstructors();
  }
  deleteInstructor(insId: string) {
    this._instructors.next(this._instructors.value.filter(i => i.id !== insId));
    // Remove instructor from all subjects
    this._subjects.next(this._subjects.value.map(s => ({
      ...s, instructorIds: (s.instructorIds || []).filter(id => id !== insId)
    })));
  }

  // --- Add/Edit/Delete Student ---
  addStudent(st: Student) {
    st.id = st.id || this.randomId('st');
    st.assignedSubjects = st.assignedSubjects || [];
    this._students.next([...this._students.value, st]);
  }
  editStudent(st: Student) {
    this._students.next(this._students.value.map(s => s.id === st.id ? { ...s, ...st } : s));
  }
  deleteStudent(stId: string) {
    this._students.next(this._students.value.filter(s => s.id !== stId));
  }

  // --- Assign subject to instructor ---
  assignSubjectToInstructor(insId: string, subjId: string) {
    const instructors = this._instructors.value.map(ins => {
      if (ins.id === insId && !ins.subjects.includes(subjId)) {
        return { ...ins, subjects: [...ins.subjects, subjId] };
      }
      return ins;
    });
    this._instructors.next(instructors);
    this.syncSubjectInstructors();
  }

  // --- Assign subject to student ---
  assignSubjectToStudent(studentId: string, subjId: string) {
    const students = this._students.value.map(st => {
      if (st.id === studentId && !st.assignedSubjects.includes(subjId)) {
        return { ...st, assignedSubjects: [...st.assignedSubjects, subjId] };
      }
      return st;
    });
    this._students.next(students);
  }

  // --- ربط المادة بالمدرس في جدول المواد (عشان تلاقيها لما تختار المدرس) ---
  syncSubjectInstructors() {
    const instructors = this._instructors.value;
    let subjects = this._subjects.value.map(s => ({
      ...s,
      instructorIds: instructors.filter(i => i.subjects?.includes(s.id)).map(i => i.id)
    }));
    this._subjects.next(subjects);
  }

  // === Helpers ===
  getInstructorName(id: string): string {
    return this._instructors.value.find(i => i.id === id)?.name || '';
  }
  getSubjectName(id: string): string {
    return this._subjects.value.find(s => s.id === id)?.name || '';
  }
  private randomId(prefix = '') {
    return prefix + Math.random().toString(36).substr(2, 10);
  }
}
