import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

// غير المسارات حسب ترتيب مشروعك
import { AttendeesComponent } from '../dashboard/attendees/attendees.component';
import { InstructorsComponent } from '../dashboard/instructors/instructors.component';
import { SubjectsComponent } from '../dashboard/subjects/subjects.component';
import { NavbarAdminComponent } from "../../components/navbar/navbar-admin.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    CommonModule,
    MatIconModule,
    AttendeesComponent,
    InstructorsComponent,
    SubjectsComponent,
    NavbarAdminComponent
],
  template: `<h2>Admin Dashboard</h2>
             <p>Welcome, Admin! (You can customize this dashboard)</p>`,
})
export class DashboardComponent {
  activeTab: string = 'attendees';

  selectTab(tab: string) {
    this.activeTab = tab;
  }
}
