import { Component, HostListener, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface AttendanceRecord {
  empId: number;
  empName: string;
  date: string;
  status: 'Present' | 'Absent';
}

@Component({
  selector: 'app-manage-attend',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatChipsModule, MatIconModule, MatButtonModule],
  templateUrl: './manage-attend.component.html',
  styleUrls: ['./manage-attend.component.scss']
})
export class ManageAttendComponent implements AfterViewInit {
  records: AttendanceRecord[] = [
    { empId: 101, empName: 'Ahmed Mahmoud', date: '2024-05-10', status: 'Present' },
    { empId: 102, empName: 'Sara Ali', date: '2024-05-10', status: 'Absent' },
    { empId: 103, empName: 'Mohamed Samir', date: '2024-05-10', status: 'Present' },
    { empId: 104, empName: 'Omar Hesham', date: '2024-05-10', status: 'Present' },
  ];

  displayedColumns = ['empId', 'empName', 'date', 'status', 'actions'];

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  editRecord(record: AttendanceRecord) {
    alert(`Edit attendance for ${record.empName} on ${record.date}`);
  }

  deleteRecord(record: AttendanceRecord) {
    if (confirm(`Delete attendance record for ${record.empName} on ${record.date}?`)) {
      this.records = this.records.filter(r => r.empId !== record.empId || r.date !== record.date);
    }
  }

  @HostListener('window:scroll', [])
  onScroll() {
    const elements = this.el.nativeElement.querySelectorAll('.fade-up-on-scroll');
    elements.forEach((el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 50) {
        this.renderer.addClass(el, 'revealed');
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const elements = this.el.nativeElement.querySelectorAll('.fade-up-on-scroll');
      elements.forEach((el: HTMLElement) => {
        this.renderer.addClass(el, 'revealed');
      });
    }, 500);
  }
}
