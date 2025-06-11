import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DataService, Subject } from '../../../shared/data.service';

interface SubjectDate {
  day: string;
  from: string;
  to: string;
}

@Component({
  selector: 'app-subjects',
  standalone: true,
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss'],
  imports: [CommonModule, FormsModule, MatIconModule]
})
export class SubjectsComponent implements OnInit {
  subjects: Subject[] = [];
  selectedSubject: Subject | null = null;

  editMode = false;
  showDialog = false;
  editSubject: Subject = { id: '', name: '', instructorIds: [], dates: [] };

  editNameMode = false;

  // جدول المواعيد
  showDateDialog = false;
  editDateMode = false;
  editDate: SubjectDate = { day: '', from: '', to: '' };
  editingDateIndex: number | null = null;
  daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getSubjects().subscribe(subjects => {
      this.subjects = subjects;
      if (!this.selectedSubject && this.subjects.length > 0) {
        this.selectedSubject = this.subjects[0];
      }
    });
  }

  selectSubject(subj: Subject) {
    this.selectedSubject = subj;
    this.editNameMode = false;
  }

  openAddDialog() {
    this.editMode = false;
    this.editSubject = { id: '', name: '', instructorIds: [], dates: [] };
    this.showDialog = true;
  }

  openEditDialog(subj: Subject) {
    this.editMode = true;
    // تأكد أن جميع الخصائص موجودة:
    this.editSubject = {
      id: subj.id,
      name: subj.name,
      instructorIds: subj.instructorIds ? [...subj.instructorIds] : [],
      dates: subj.dates ? [...subj.dates] : [],
    };
    this.showDialog = true;
  }

  saveSubject() {
    if (this.editMode && this.selectedSubject) {
      this.editSubject.id = this.selectedSubject.id;
      this.dataService.editSubject({ ...this.editSubject });
    } else if (!this.editMode) {
      this.dataService.addSubject({ ...this.editSubject });
      this.selectedSubject = { ...this.editSubject };
    }
    this.showDialog = false;
  }

  deleteSubject(subj: Subject) {
    if (!subj.id) return;
    this.dataService.deleteSubject(subj.id);
    if (this.selectedSubject?.id === subj.id) {
      this.selectedSubject = this.subjects[0] || null;
    }
  }

  // ========== جدول المواعيد ==========
  openAddDateDialog(subject: Subject) {
    this.editDateMode = false;
    this.editDate = { day: '', from: '', to: '' };
    this.editingDateIndex = null;
    this.showDateDialog = true;
  }

  openEditDateDialog(subject: Subject, index: number) {
    this.editDateMode = true;
    this.editDate = { ...subject.dates[index] };
    this.editingDateIndex = index;
    this.showDateDialog = true;
  }

  saveDate() {
    if (!this.selectedSubject) return;
    if (!this.selectedSubject.dates) this.selectedSubject.dates = [];
    if (this.editDateMode && this.editingDateIndex !== null) {
      this.selectedSubject.dates[this.editingDateIndex] = { ...this.editDate };
    } else {
      this.selectedSubject.dates.push({ ...this.editDate });
    }
    this.showDateDialog = false;
  }

  deleteDate(subject: Subject, index: number) {
    if (subject.dates && index > -1) {
      subject.dates.splice(index, 1);
    }
  }
}
