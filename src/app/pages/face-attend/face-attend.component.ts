import { Component, HostListener, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';

interface Attendance {
  id: number;
  name: string;
  status: 'Present' | 'Absent';
  time: string;
}

@Component({
  selector: 'app-face-attend',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatChipsModule],
  templateUrl: './face-attend.component.html',
  styleUrls: ['./face-attend.component.scss']
})
export class FaceAttendComponent implements AfterViewInit {
  attendance: Attendance[] = [
    { id: 1, name: 'Ahmed Mahmoud', status: 'Present', time: '08:02 AM' },
    { id: 2, name: 'Sara Ali', status: 'Absent', time: '-' },
    { id: 3, name: 'Mohamed Samir', status: 'Present', time: '08:15 AM' },
    { id: 4, name: 'Omar Hesham', status: 'Present', time: '08:01 AM' },
  ];

  displayedColumns = ['id', 'name', 'status', 'time'];

  constructor(private renderer: Renderer2, private el: ElementRef) {}

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
