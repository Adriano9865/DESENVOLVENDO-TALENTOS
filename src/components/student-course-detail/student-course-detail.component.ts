import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { Course } from '../../models/course.model';
import { Student } from '../../models/student.model';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';
import { NgOptimizedImage } from '@angular/common';

// Tab Components
import { StudentCourseGradesComponent } from '../student-course-grades/student-course-grades.component';
import { PlaceholderViewComponent } from '../placeholder-view/placeholder-view.component';
import { StudentGradesViewComponent } from '../student-grades-view/student-grades-view.component';


type StudentCourseTab = 'lessons' | 'provas' | 'grades';

interface Tab {
  id: StudentCourseTab;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-student-course-detail',
  imports: [
    SafeHtmlPipe,
    StudentCourseGradesComponent,
    PlaceholderViewComponent,
    NgOptimizedImage,
    StudentGradesViewComponent
  ],
  template: `
    <div class="animate-fade-in">
      <button (click)="onBack()" class="mb-6 inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
        Voltar para Meus Cursos
      </button>

      <div class="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div class="flex flex-col md:flex-row gap-8">
          <div class="md:w-1/3">
            <img [ngSrc]="course().imageUrl" [alt]="course().title" width="600" height="400" class="rounded-lg shadow-md w-full h-auto object-cover aspect-[4/3]" priority>
          </div>
          <div class="md:w-2/3">
            <h1 class="text-4xl font-extrabold tracking-tight text-slate-900">{{ course().title }}</h1>
            <p class="mt-2 text-lg text-slate-600">com {{ course().instructor }}</p>
            <p class="mt-4 text-slate-500">{{ course().description }}</p>
          </div>
        </div>
      </div>
      
      <!-- Tabs -->
      <div class="mb-8">
        <div class="border-b border-slate-200">
          <nav class="-mb-px flex space-x-6" aria-label="Tabs">
            @for (tab of tabs; track tab.id) {
              <button
                (click)="activeTab.set(tab.id)"
                [class.border-indigo-500]="activeTab() === tab.id"
                [class.text-indigo-600]="activeTab() === tab.id"
                [class.border-transparent]="activeTab() !== tab.id"
                [class.text-slate-500]="activeTab() !== tab.id"
                [class.hover:text-slate-700]="activeTab() !== tab.id"
                [class.hover:border-slate-300]="activeTab() !== tab.id"
                class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm inline-flex items-center transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <g [innerHTML]="tab.icon | safeHtml"></g>
                </svg>
                {{ tab.label }}
              </button>
            }
          </nav>
        </div>
      </div>
      
      <!-- Tab Content -->
      <div class="animate-fade-in-up">
        @switch (activeTab()) {
          @case ('lessons') {
            <app-placeholder-view title="Aulas" message="Esta seção exibirá todas as aulas do curso." />
          }
          @case ('provas') {
            <app-student-course-grades [course]="course()" [student]="student()" />
          }
          @case ('grades') {
            <app-student-grades-view [course]="course()" [student]="student()" />
          }
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentCourseDetailComponent {
  course = input.required<Course>();
  student = input.required<Student>();
  back = output<void>();

  activeTab = signal<StudentCourseTab>('lessons');

  readonly tabs: Tab[] = [
    { id: 'lessons', label: 'Aulas', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />' },
    { id: 'provas', label: 'Provas', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.08.828.23 1.206l-.738 3.026c-.083.34-.377.58-.722.58h-1.034d.213.09.423.19.628.317.183.114.354.242.51.385l.738-3.026c.083-.34.377-.58.722-.58h1.034c-.023-.09-.045-.18-.068-.271a48.424 48.424 0 00-1.123-.08M15.75 9h.375m-3.75 0h.375m-3.75 0h.375M9 12v9.75M15 9.75M15 12v9.75m3.75-9.75h-.375M15.75 9h.375" />' },
    { id: 'grades', label: 'Notas', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.781a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />' },
  ];

  onBack() {
    this.back.emit();
  }
}
