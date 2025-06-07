import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { DataService, Student as Attendee, Subject, Instructor } from '../../../shared/data.service';

@Component({
  selector: 'app-attendees',
  standalone: true,
  templateUrl: './attendees.component.html',
  styleUrls: ['./attendees.component.scss'],
  imports: [CommonModule, FormsModule, MatIconModule]
})
export class AttendeesComponent implements OnInit {
  attendees: Attendee[] = [];
  subjects: Subject[] = [];
  instructors: Instructor[] = [];

  searchValue: string = '';
  filteredAttendees: Attendee[] = [];
  selectedAttendee: Attendee | null = null;

  showDialog = false;
  editMode = false;
  editAttendee: Attendee = { id: '', name: '', email: '', avatar: '', number: '', password: '', assignedSubjects: [] };

  showSubjectDialog = false;
  subjectSelection: string[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getStudents().subscribe((attendees: Attendee[]) => {
      this.attendees = attendees;
      this.filteredAttendees = this.filterAttendees();
      if (this.selectedAttendee) {
        this.selectedAttendee = this.attendees.find(a => a.id === this.selectedAttendee?.id) || null;
      } else if (this.filteredAttendees.length > 0) {
        this.selectedAttendee = this.filteredAttendees[0];
      }
    });
    this.dataService.getSubjects().subscribe((subjects: Subject[]) => this.subjects = subjects);
    this.dataService.getInstructors().subscribe((instructors: Instructor[]) => this.instructors = instructors);
  }

  
  onSearchChange() {
    this.filteredAttendees = this.filterAttendees();
    if (!this.filteredAttendees.includes(this.selectedAttendee!)) {
      this.selectedAttendee = this.filteredAttendees[0] || null;
    }
  }
  filterAttendees(): Attendee[] {
    const val = this.searchValue.trim().toLowerCase();
    if (!val) return [...this.attendees];
    return this.attendees.filter(p =>
      p.name.toLowerCase().includes(val) || p.email.toLowerCase().includes(val)
    );
  }

  selectAttendee(person: Attendee) {
    this.selectedAttendee = person;
  }

  openAddDialog() {
    this.editMode = false;
    this.editAttendee = { id: '', name: '', email: '', avatar: '', number: '', password: '', assignedSubjects: [] };
    this.showDialog = true;
  }

  openEditDialog(person: Attendee) {
    this.editMode = true;
    this.editAttendee = { ...person, assignedSubjects: [...person.assignedSubjects] };
    this.showDialog = true;
  }

  saveAttendee() {
    if (this.editMode && this.selectedAttendee) {
      this.editAttendee.id = this.selectedAttendee.id;
      Object.assign(this.selectedAttendee, this.editAttendee);
    } else if (!this.editMode) {
      this.editAttendee.id = Math.random().toString(36).substr(2, 8);
      this.attendees.push({ ...this.editAttendee });
      this.filteredAttendees = [...this.attendees];
      this.selectedAttendee = { ...this.editAttendee };
    }
    this.showDialog = false;
    this.onSearchChange();
  }

  deleteAttendee(person: Attendee) {
    if (!person.id) return;
    const idx = this.attendees.indexOf(person);
    if (idx > -1) {
      this.attendees.splice(idx, 1);
    }
    this.onSearchChange();
    if (this.selectedAttendee?.id === person.id) {
      this.selectedAttendee = this.filteredAttendees[0] || null;
    }
  }

  onAvatarChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.editAttendee.avatar = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  openSubjectDialog() {
    this.subjectSelection = [...this.editAttendee.assignedSubjects];
    this.showSubjectDialog = true;
  }

  onSubjectCheckboxChange(event: Event, subjId: string) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked && !this.subjectSelection.includes(subjId)) {
      this.subjectSelection.push(subjId);
    } else if (!checked && this.subjectSelection.includes(subjId)) {
      this.subjectSelection = this.subjectSelection.filter(id => id !== subjId);
    }
  }

  saveSelectedSubjects() {
    this.editAttendee.assignedSubjects = [...this.subjectSelection];
    this.showSubjectDialog = false;
  }

  onAssignSubject(event: Event) {
    if (!this.selectedAttendee) return;
    const value = (event.target as HTMLSelectElement).value;
    if (value) {
      this.assignSubject(this.selectedAttendee.id, value);
    }
  }

  assignSubject(attendeeId: string, subjectId: string) {
    this.dataService.assignSubjectToStudent(attendeeId, subjectId);
    const att = this.attendees.find(a => a.id === attendeeId);
    if (att && !att.assignedSubjects.includes(subjectId)) {
      att.assignedSubjects.push(subjectId);
    }
  }

  getInstructorNameForSubject(subjId: string): string {
    const subj = this.subjects.find(s => s.id === subjId);
    if (!subj || !subj.instructorIds || !subj.instructorIds.length) return '';
    return subj.instructorIds.map(id => this.dataService.getInstructorName(id)).join(', ');
  }

  getSubjectName(subjId: string): string {
    const found = this.subjects.find((s: any) => s.id === subjId);
    return found ? found.name : '';
  }
}
