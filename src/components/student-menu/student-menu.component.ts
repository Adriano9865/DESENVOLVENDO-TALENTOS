import { Component, ChangeDetectionStrategy, output, input } from '@angular/core';

export type StudentView = 'courses' | 'profile' | 'library' | 'presence' | 'announcements';

interface MenuItem {
  id: StudentView;
  label: string;
  icon: string; // SVG path
  color: 'indigo' | 'sky' | 'amber' | 'emerald' | 'rose';
}

@Component({
  selector: 'app-student-menu',
  templateUrl: './student-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentMenuComponent {
  viewChanged = output<StudentView>();
  layout = input<'horizontal' | 'vertical'>('horizontal');
  activeView = input<StudentView | 'dashboard' | null>('courses');
  notificationCounts = input<Partial<Record<StudentView, number>>>({});
  
  menuItems: MenuItem[] = [
    { id: 'courses', label: 'Meus Cursos', icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25', color: 'indigo' },
    { id: 'profile', label: 'Meu Perfil', icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z', color: 'sky' },
    { id: 'library', label: 'Biblioteca', icon: 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z', color: 'amber' },
    { id: 'presence', label: 'Presença', icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18', color: 'emerald' },
    { id: 'announcements', label: 'Avisos', icon: 'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0', color: 'rose' }
  ];

  selectView(view: StudentView) {
    this.viewChanged.emit(view);
  }
}