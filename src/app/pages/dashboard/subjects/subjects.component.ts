import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DataService, Subject } from '../../../shared/data.service';
import { Instructor } from '../../../shared/data.service';

interface SubjectDate {
  day?: string;
  dayOfWeek?: number;
  from?: string;
  to?: string;
  startTime?: string;
  endTime?: string;
}

@Component({
  selector: 'app-subjects',
  standalone: true,
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss'],
  imports: [CommonModule, FormsModule, MatIconModule]
})
export class SubjectsComponent implements OnInit {
  @Output() subjectsChanged = new EventEmitter<number>();
  subjects: Subject[] = [];
  selectedSubject: Subject | null = null;

  editMode = false;
  showDialog = false;
  editSubject: Subject = { id: '', name: '', instructorIds: [], dates: [] };

  editNameMode = false;

  // جدول المواعيد
  showDateDialog = false;
  editDateMode = false;
  editDate: SubjectDate = {};
  editingDateIndex: number | null = null;
  daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  selectedInstructor: Instructor | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getSubjects().subscribe((subjects: any[]) => {
      // تأكد أن كل subject يحتوي على dates
      this.subjects = (Array.isArray(subjects) ? subjects : []).map(subj => ({
        ...subj,
        dates: subj.dates || subj.subjectDates || []
      }));
      this.subjectsChanged.emit(this.subjects.length);
      if (!this.selectedSubject && this.subjects.length > 0) {
        this.selectedSubject = this.subjects[0];
      }
    });
  }

  selectSubject(subj: Subject) {
    this.dataService.getSubjectById(subj.id).subscribe((apiSubj: any) => {
      this.selectedSubject = {
        ...apiSubj,
        dates: apiSubj.dates || apiSubj.subjectDates || []
      };
      this.editNameMode = false;
    });
  }

  openAddDialog() {
    this.editMode = false;
    this.editSubject = { id: '', name: '', instructorIds: [], dates: [] };
    this.showDialog = true;
  }

  openEditDialog(subj: Subject) {
    this.editMode = true;
    this.dataService.getSubjectById(subj.id).subscribe((apiSubj: any) => {
      this.editSubject = {
        id: apiSubj?.id || subj.id,
        name: apiSubj?.name || subj.name,
        description: apiSubj?.description || subj.description || '',
        instructorId: apiSubj?.instructorId || subj.instructorId || '',
        instructorIds: apiSubj?.instructorIds || subj.instructorIds || [],
        dates: apiSubj?.dates || apiSubj?.subjectDates || subj.dates || [],
      };
      this.selectedSubject = this.editSubject;
      this.showDialog = true;
    });
  }

  saveSubject() {
    if (this.editMode && this.selectedSubject) {
      this.editSubject.id = this.selectedSubject.id;
      this.dataService.patchSubject(this.editSubject.id, this.editSubject).subscribe(() => {
        this.dataService.getSubjects().subscribe(subjects => {
          this.subjects = subjects;
          this.selectedSubject = this.subjects.find(s => s.id === this.editSubject.id) || null;
        });
      });
    } else if (!this.editMode) {
      this.dataService.addSubject({ ...this.editSubject }).subscribe(() => {
        this.dataService.getSubjects().subscribe(subjects => {
          this.subjects = subjects;
          this.selectedSubject = this.subjects[this.subjects.length-1] || null;
        });
      });
    }
    this.showDialog = false;
  }

  deleteSubject(subj: Subject) {
    if (!subj.id) return;
    this.dataService.deleteSubject(subj.id).subscribe(() => {
      this.dataService.getSubjects().subscribe(subjects => {
        this.subjects = subjects;
        if (this.selectedSubject?.id === subj.id) {
          this.selectedSubject = this.subjects[0] || null;
        }
      });
    });
  }

  // ========== جدول المواعيد ==========
  openAddDateDialog(subject: Subject) {
    this.editDateMode = false;
    this.editDate = { day: 'Sunday', from: '00:00', to: '00:00' };
    this.editingDateIndex = null;
    this.showDateDialog = true;
  }

  openEditDateDialog(subject: Subject, index: number) {
    this.editDateMode = true;
    const date = subject.dates[index];
    this.editDate = {
      day: typeof date.dayOfWeek === 'number'
        ? ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][date.dayOfWeek]
        : date.day || 'Sunday',
      from: date.startTime ? date.startTime.substring(0,5) : (date.from || '00:00'),
      to: date.endTime ? date.endTime.substring(0,5) : (date.to || '00:00')
    };
    this.editingDateIndex = index;
    this.showDateDialog = true;
  }

  saveDate() {
    if (!this.selectedSubject) return;

    // تحقق من صحة الوقت
    const from = this.editDate.from || '';
    const to = this.editDate.to || '';
    if (!from || !to || from === '00:00' || to === '00:00') {
      alert('يرجى اختيار وقت بداية ونهاية صحيحين');
      return;
    }

    if (this.editDateMode && this.editingDateIndex !== null && this.selectedSubject.dates) {
      this.selectedSubject.dates![this.editingDateIndex] = { ...this.editDate };
      this.dataService.getSubjectById(this.selectedSubject!.id!).subscribe((apiSubj: any) => {
        if (apiSubj && this.selectedSubject) {
          this.selectedSubject = { ...apiSubj, dates: (apiSubj.subjectDates || []).map((d: any) => d as SubjectDate) };
        }
      });
    } else if (this.selectedSubject.id) {
      this.dataService.postSubjectDates(this.selectedSubject!.id!, this.editDate).subscribe(() => {
        this.dataService.getSubjectById(this.selectedSubject!.id!).subscribe((apiSubj: any) => {
          if (apiSubj && this.selectedSubject) {
            this.selectedSubject = { ...apiSubj, dates: (apiSubj.subjectDates || []).map((d: any) => d as SubjectDate) };
          }
        });
      });
    }
    this.showDateDialog = false;
  }

  deleteDate(subject: Subject, index: number) {
    const date: any = subject.dates[index];
    const dateId = date && date.id;
    if (dateId) {
      this.dataService.deleteSubjectDate(subject.id, dateId).subscribe(() => {
        this.dataService.getSubjectById(subject.id).subscribe((apiSubj: any) => {
          subject.dates = apiSubj.dates;
        });
      });
    } else {
      subject.dates.splice(index, 1);
    }
  }

  // Add Delete All Subjects button
  deleteAllSubjects() {
    this.dataService.deleteAllSubjects().subscribe(() => {
      this.subjects = [];
      this.selectedSubject = null;
    });
  }

  // Get attendees for a subject
  getSubjectAttendees(subjectId: string) {
    this.dataService.getSubjectAttendees(subjectId).subscribe(attendees => {
      // handle attendees (e.g., show in modal or assign to property)
    });
  }

  getDayName(day: number|string|undefined): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    if (typeof day === 'number' && day >= 0 && day <= 6) return days[day];
    if (!isNaN(Number(day))) return days[Number(day)] || '';
    return day ? String(day) : '';
  }

  selectInstructor(person: Instructor) {
    this.selectedInstructor = person;
    // جلب المواد من الـ API وربطها بالمدرس
    this.dataService.getSubjectsByInstructorId(person.id).subscribe((subjects: any[]) => {
      this.selectedInstructor!.subjects = subjects.map(s => s.id);
    });
  }
}
