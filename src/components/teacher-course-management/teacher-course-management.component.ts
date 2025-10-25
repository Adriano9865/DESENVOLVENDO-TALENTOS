import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { Course } from '../../models/course.model';

// Import tab components
import { TeacherCourseSettingsComponent } from '../teacher-course-settings/teacher-course-settings.component';
import { TeacherCourseLessonsComponent } from '../teacher-course-lessons/teacher-course-lessons.component';
import { TeacherCourseQuizzesComponent } from '../teacher-course-quizzes/teacher-course-quizzes.component';
import { TeacherCourseGradesComponent } from '../teacher-course-grades/teacher-course-grades.component';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';

type CourseManagementTab = 'aulas' | 'provas' | 'notas' | 'configuracoes';

interface Tab {
  id: CourseManagementTab;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-teacher-course-management',
  templateUrl: './teacher-course-management.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TeacherCourseSettingsComponent,
    TeacherCourseLessonsComponent,
    TeacherCourseQuizzesComponent,
    TeacherCourseGradesComponent,
    SafeHtmlPipe,
  ],
})
export class TeacherCourseManagementComponent {
  course = input.required<Course>();
  back = output<void>();
  courseUpdated = output<Course>();
  courseDeleted = output<number>();

  activeTab = signal<CourseManagementTab>('aulas');
  
  readonly tabs: Tab[] = [
    { id: 'aulas', label: 'Aulas', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />' },
    { id: 'provas', label: 'Provas', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.08.828.23 1.206l-.738 3.026c-.083.34-.377.58-.722.58h-1.034d.213.09.423.19.628.317.183.114.354.242.51.385l.738-3.026c.083-.34.377-.58.722-.58h1.034c-.023-.09-.045-.18-.068-.271a48.424 48.424 0 00-1.123-.08M15.75 9h.375m-3.75 0h.375m-3.75 0h.375M9 12v9.75M15 9.75M15 12v9.75m3.75-9.75h-.375M15.75 9h.375" />' },
    { id: 'notas', label: 'Notas', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.781a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />' },
    { id: 'configuracoes', label: 'Configurações', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.43.992a6.759 6.759 0 010 1.255c-.008.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.333.183-.582.495-.645.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.759 6.759 0 010-1.255c.008-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.298-2.247a1.125 1.125 0 011.37-.491l1.217.456c.355.133.75.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.645-.869l.213-1.28z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />' },
  ];

  selectTab(tab: CourseManagementTab) {
    this.activeTab.set(tab);
  }

  onBack() {
    this.back.emit();
  }

  onCourseUpdated(course: Course) {
    this.courseUpdated.emit(course);
  }

  onCourseDeleted(courseId: number) {
    this.courseDeleted.emit(courseId);
  }
}
