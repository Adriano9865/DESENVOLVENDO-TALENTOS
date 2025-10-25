import { Component, ChangeDetectionStrategy, output, input } from '@angular/core';

export type TeacherView = 'courses' | 'students' | 'library' | 'presence' | 'announcements' | 'access';

interface MenuItem {
  id: TeacherView;
  label: string;
  icon: string; // SVG path
  color: 'indigo' | 'teal' | 'purple' | 'amber' | 'pink' | 'slate';
}

@Component({
  selector: 'app-teacher-menu',
  templateUrl: './teacher-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherMenuComponent {
  viewChanged = output<TeacherView>();
  layout = input<'horizontal' | 'vertical'>('horizontal');
  activeView = input<TeacherView | 'dashboard' | null>('courses');
  
  menuItems: MenuItem[] = [
    { id: 'courses', label: 'Cursos', icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25', color: 'indigo' },
    { id: 'students', label: 'Alunos', icon: 'M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z', color: 'teal' },
    { id: 'library', label: 'Biblioteca', icon: 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z', color: 'purple' },
    { id: 'presence', label: 'Presenças', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'amber' },
    { id: 'announcements', label: 'Avisos', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-2.236 9.168-5.514C18.358 1.84 18.668 1.5 19 1.5v12.553a4.002 4.002 0 01-3.183 3.941c-1.39.376-2.824.57-4.317.475-2.592-.16-5.023-1.09-6.816-2.504z', color: 'pink' },
    { id: 'access', label: 'Meu Acesso', icon: 'M15.75 5.25a3 3 0 013 3m3 0a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.79-.44 1.06a2.25 2.25 0 10-2.86 2.86c.27.272.646.44 1.06.44h.008c.414 0 .79-.168 1.06-.44a2.25 2.25 0 002.86-2.86c-.272-.27-.44-.646-.44-1.06a2.25 2.25 0 00-2.25-2.25z', color: 'slate' }
  ];

  selectView(view: TeacherView) {
    this.viewChanged.emit(view);
  }
}
