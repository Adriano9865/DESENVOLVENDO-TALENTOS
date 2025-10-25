import { Injectable, signal } from '@angular/core';
import { Course } from '../models/course.model';

const MOCK_COURSES: Course[] = [
  {
    id: 1,
    title: 'Angular para Iniciantes',
    instructor: 'Joana Silva',
    description: 'Um guia completo para construir sua primeira aplicação Angular do zero.',
    imageUrl: 'https://picsum.photos/seed/angular/600/400',
    status: 'active',
  },
  {
    id: 2,
    title: 'Tailwind CSS Avançado',
    instructor: 'João Santos',
    description: 'Domine CSS utility-first e construa layouts complexos e responsivos com facilidade.',
    imageUrl: 'https://picsum.photos/seed/tailwind/600/400',
    status: 'active',
  },
  {
    id: 3,
    title: 'Gerenciamento de Estado com Signals',
    instructor: 'Emília Bragança',
    description: 'Aprenda o futuro do gerenciamento de estado reativo em frameworks web modernos.',
    imageUrl: 'https://picsum.photos/seed/signals/600/400',
    isTeacherCourse: true,
    status: 'active',
  },
  {
    id: 4,
    title: 'Fundamentos de UI/UX Design',
    instructor: 'Carlos Verde',
    description: 'Descubra os princípios de um ótimo design e crie interfaces amigáveis.',
    imageUrl: 'https://picsum.photos/seed/design/600/400',
    status: 'active',
  },
  {
    id: 5,
    title: 'Introdução ao TypeScript',
    instructor: 'Sara Matos',
    description: 'Adicione tipos estáticos ao seu JavaScript para construir aplicações mais robustas e escaláveis.',
    imageUrl: 'https://picsum.photos/seed/typescript/600/400',
    status: 'inactive',
  },
  {
    id: 6,
    title: 'Desenvolvimento Full-Stack com Node.js',
    instructor: 'Miguel Pereira',
    description: 'Construa aplicações web completas, do banco de dados ao front-end.',
    imageUrl: 'https://picsum.photos/seed/fullstack/600/400',
    isTeacherCourse: true,
    status: 'active',
  },
];


@Injectable({ providedIn: 'root' })
export class CourseService {
  private _courses = signal<Course[]>(MOCK_COURSES);
  public readonly courses = this._courses.asReadonly();

  addCourse(course: Omit<Course, 'id' | 'status'>) {
    const newCourse: Course = {
      ...course,
      id: this._courses().length > 0 ? Math.max(...this._courses().map(c => c.id)) + 1 : 1,
      status: 'active',
    };
    this._courses.update(courses => [...courses, newCourse]);
  }

  updateCourse(updatedCourse: Course) {
    this._courses.update(courses =>
      courses.map(c => (c.id === updatedCourse.id ? updatedCourse : c))
    );
  }

  deleteCourse(courseId: number) {
    this._courses.update(courses => courses.filter(c => c.id !== courseId));
  }
}
