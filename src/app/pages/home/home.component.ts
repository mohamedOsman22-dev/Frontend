import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, MatButtonModule, MatIconModule],
  animations: [
    trigger('pageFade', [
      transition(':leave', [
        animate('400ms cubic-bezier(.77,0,.18,1)', style({ opacity: 0, transform: 'translateY(-60px) scale(0.96)' }))
      ]),
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(60px) scale(0.96)' }),
        animate('400ms cubic-bezier(.77,0,.18,1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ])
    ])
  ]
})
export class HomeComponent {
  bubbles = Array(6);
  isLeaving = false;

  constructor(private router: Router) {}

  goToLogin() {
    this.isLeaving = true;
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 390);
  }
}
