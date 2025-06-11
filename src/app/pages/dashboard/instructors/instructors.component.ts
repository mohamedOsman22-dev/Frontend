import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { DataService, Instructor, Subject } from '../../../shared/data.service';

@Component({
  selector: 'app-instructors',
  standalone: true,
  templateUrl: './instructors.component.html',
  styleUrls: ['./instructors.component.scss'],
  imports: [CommonModule, FormsModule, MatIconModule]
})
export class InstructorsComponent implements OnInit {
  instructors: Instructor[] = [];
  subjects: Subject[] = [];

  // UI State
  searchValue = '';
  filteredInstructors: Instructor[] = [];
  selectedInstructor: Instructor | null = null;

  showDialog = false;
  showSubjectDialog = false;
  editMode = false;
  editInstructor: Instructor = { id: '', name: '', email: '', avatar: '', number: '', password: '', subjects: [] };
  subjectSelection: string[] = [];
  subjectSelectMode: 'create' | 'edit' = 'edit';

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getInstructors().subscribe(instructors => {
      this.instructors = instructors;
      this.filteredInstructors = this.filterInstructors();
      if (this.selectedInstructor) {
        this.selectedInstructor = this.instructors.find(i => i.id === this.selectedInstructor?.id) || null;
      } else if (this.filteredInstructors.length > 0) {
        this.selectedInstructor = this.filteredInstructors[0];
      }
    });

    this.dataService.getSubjects().subscribe(subjects => {
      this.subjects = subjects;
    });
  }

  // ===== Filtering/Search =====
  onSearchChange() {
    this.filteredInstructors = this.filterInstructors();
    if (!this.filteredInstructors.includes(this.selectedInstructor!)) {
      this.selectedInstructor = this.filteredInstructors[0] || null;
    }
  }
  filterInstructors(): Instructor[] {
    const val = this.searchValue.trim().toLowerCase();
    if (!val) return [...this.instructors];
    return this.instructors.filter(p =>
      p.name.toLowerCase().includes(val) || p.email.toLowerCase().includes(val)
    );
  }

  selectInstructor(person: Instructor) {
    this.selectedInstructor = person;
  }

  // ===== Add/Edit/Delete Instructor =====
  openAddDialog() {
    this.editMode = false;
    this.editInstructor = { id: '', name: '', email: '', avatar: '', number: '', password: '', subjects: [] };
    this.showDialog = true;
  }
  openEditDialog(person: Instructor) {
    this.editMode = true;
    this.editInstructor = { ...person, subjects: [...person.subjects] };
    this.showDialog = true;
  }
  saveInstructor() {
    if (this.editMode && this.selectedInstructor) {
      this.editInstructor.id = this.selectedInstructor.id;
      this.dataService.editInstructor({ ...this.editInstructor });
    } else if (!this.editMode) {
      this.dataService.addInstructor({ ...this.editInstructor });
      this.selectedInstructor = { ...this.editInstructor };
    }
    this.showDialog = false;
    this.onSearchChange();
  }
  deleteInstructor(person: Instructor) {
    if (!person.id) return;
    this.dataService.deleteInstructor(person.id);
    this.onSearchChange();
    if (this.selectedInstructor?.id === person.id) {
      this.selectedInstructor = this.filteredInstructors[0] || null;
    }
  }

  // ===== Avatar Upload =====
  onAvatarChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => { this.editInstructor.avatar = e.target?.result as string; };
    reader.readAsDataURL(file);
  }

  // ===== Assign Subjects to Instructor =====
  openSubjectDialog(mode: 'create' | 'edit') {
    this.subjectSelectMode = mode;
    this.subjectSelection = mode === 'edit'
      ? [...(this.selectedInstructor?.subjects || [])]
      : [...this.editInstructor.subjects];
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
    if (this.subjectSelectMode === 'edit' && this.selectedInstructor) {
      this.selectedInstructor.subjects = [...this.subjectSelection];
      this.dataService.editInstructor({ ...this.selectedInstructor });
    } else if (this.subjectSelectMode === 'create') {
      this.editInstructor.subjects = [...this.subjectSelection];
    }
    this.showSubjectDialog = false;
  }

  getSubjectName(subjId: string): string {
    const found = this.subjects.find((s: any) => s.id === subjId);
    return found ? found.name : '';
  }
}
