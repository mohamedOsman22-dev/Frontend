import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubjectService } from '../../services/subject.service';
import { Subject } from '../../shared/interfaces/subject.interface';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { SubjectStudentsComponent } from './subject-students.component';
import { SubjectAttendanceComponent } from './subject-attendance.component';
import { SubjectAttendanceReviewComponent } from './subject-attendance-review.component';

@Component({
  selector: 'app-subject-details',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    SubjectStudentsComponent,
    SubjectAttendanceComponent,
    SubjectAttendanceReviewComponent
  ],
  templateUrl: './subject-details.component.html',
  styleUrls: ['./subject-details.component.scss']
})
export class SubjectDetailsComponent implements OnInit {
  subjectId!: string;
  subject?: Subject;

  constructor(private route: ActivatedRoute, private subjectService: SubjectService) {}

  ngOnInit(): void {
    this.subjectId = this.route.snapshot.paramMap.get('subjectId')!;
    this.subjectService.getSubjectById(this.subjectId).subscribe(subject => {
      this.subject = subject;
    });
  }
} 