import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule],
  template: `
    <div class="home-container">
      <h1>Welcome to Attendance System</h1>
      <button mat-raised-button color="primary" routerLink="/login">Get Started</button>
    </div>
  `,
  styles: [`
    .home-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
    h1 {
      margin-bottom: 2rem;
      color: #333;
    }
  `]
})
export class HomeComponent {}
