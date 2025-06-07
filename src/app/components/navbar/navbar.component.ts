import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  menuOpen = false;
  role: 'student' | 'instructor' | 'guest' = 'guest';
  navLinks: any[] = [];
  lang: 'en' | 'ar' = 'en';
  theme: 'light' | 'dark' = 'light';

  constructor(
    public themeService: ThemeService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.auth.role$.subscribe(role => {
      this.role = role;
      this.updateNavLinks();
    });
    this.updateNavLinks();
    // Load theme/lang
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      const savedLang = localStorage.getItem('lang');
      if (savedTheme === 'dark') this.theme = 'dark';
      if (savedLang === 'ar') this.lang = 'ar';
    }
    this.applyTheme();
    this.setDir();
  }

  updateNavLinks() {
    if (this.role === 'student') {
      this.navLinks = [
        { label: this.lang === 'ar' ? 'التقويم' : 'Calendar', route: '/student-calendar' },
        { label: this.lang === 'ar' ? 'حسابي' : 'Account', route: '/manage-account' },
        { label: this.lang === 'ar' ? 'خروج' : 'Logout', route: '/logout', logout: true },
      ];
    } else if (this.role === 'instructor') {
      this.navLinks = [
        { label: this.lang === 'ar' ? 'لوحة التحكم' : 'Dashboard', route: '/dashboard' },
        { label: this.lang === 'ar' ? 'المستخدمون' : 'Users', route: '/users' },
        { label: this.lang === 'ar' ? 'الحضور بالوجه' : 'Face Attend', route: '/face-attend' },
        { label: this.lang === 'ar' ? 'التقارير' : 'Reports', route: '/reports' },
        { label: this.lang === 'ar' ? 'حسابي' : 'Account', route: '/manage-account' },
        { label: this.lang === 'ar' ? 'خروج' : 'Logout', route: '/logout', logout: true },
      ];
    } else {
      this.navLinks = [
        { label: this.lang === 'ar' ? 'الرئيسية' : 'Home', route: '/' },
        { label: this.lang === 'ar' ? 'تسجيل دخول' : 'Login', route: '/login' },
        { label: this.lang === 'ar' ? 'إنشاء حساب' : 'Sign Up', route: '/signup' },
      ];
    }
  }

  toggleMenu() { this.menuOpen = !this.menuOpen; }

  toggleLang() {
    this.lang = this.lang === 'en' ? 'ar' : 'en';
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('lang', this.lang);
    }
    this.updateNavLinks();
    this.setDir();
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', this.theme);
    }
    this.applyTheme();
  }

  setDir() {
    if (typeof document !== 'undefined') {
      document.body.dir = this.lang === 'ar' ? 'rtl' : 'ltr';
    }
  }

  applyTheme() {
    if (typeof document !== 'undefined') {
      if (this.theme === 'dark') {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    }
  }

  handleNav(link: any) {
    if (link.logout) {
      this.auth.setRole('guest');
      this.updateNavLinks();
      this.router.navigate(['/']);
    } else {
      this.router.navigate([link.route]);
    }
  }
}
