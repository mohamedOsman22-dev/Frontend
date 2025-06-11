import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-account',
  standalone: true,
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class ManageAccountComponent {
  // مؤقتًا هنعرض بيانات محفوظة في localStorage
  user = JSON.parse(localStorage.getItem('user') || '{}');
}
