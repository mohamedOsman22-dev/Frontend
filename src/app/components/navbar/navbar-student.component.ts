import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar-student',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar-student.component.html',
  styleUrls: ['./navbar-student.component.scss'],
})
export class NavbarStudentComponent {
  menuOpen = false;
  navLinks = [
    { label: 'Home', route: '/' },
    { label: 'Calendar', route: '/calendar' },
    { label: 'Account', route: '/manage-account' },
    { label: 'Logout', route: '/login' }
  ];

  toggleMenu() { this.menuOpen = !this.menuOpen; }

  user = {
    name: 'Ahmed Mahmoud',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg' // أو dynamic
  };
}
