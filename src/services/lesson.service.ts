import { Injectable, signal } from '@angular/core';
import { Lesson } from '../models/lesson.model';

const MOCK_LESSONS: Lesson[] = [
  { id: 1, courseId: 1, title: 'Introdução ao Angular', duration: 15, type: 'video', content: 'https://www.youtube.com/embed/your_video_id' },
  { id: 2, courseId: 1, title: 'Estrutura de Componentes', duration: 25, type: 'video', content: 'https://www.youtube.com/embed/your_video_id' },
  { id: 3, courseId: 1, title: 'Guia de Instalação', duration: 10, type: 'pdf', content: '/assets/guia.pdf' },
  { id: 4, courseId: 3, title: 'O que são Signals?', duration: 20, type: 'video', content: 'https://www.youtube.com/embed/your_video_id' },
  { id: 5, courseId: 3, title: 'Leitura: Reatividade Detalhada', duration: 35, type: 'text', content: '## O Paradigma Reativo\n\nO paradigma reativo é centrado em fluxos de dados e na propagação de mudanças. Com a introdução dos Signals no Angular, temos uma nova primitiva para gerenciar estado de forma reativa e eficiente.' },
  { id: 6, courseId: 6, title: 'Configurando o Ambiente Node.js', duration: 18, type: 'pdf', content: '/assets/node_setup.pdf' },
  { id: 7, courseId: 6, title: 'Criando sua Primeira API REST', duration: 40, type: 'video', content: 'https://www.youtube.com/embed/your_video_id' },
];

@Injectable({ providedIn: 'root' })
export class LessonService {
  private _lessons = signal<Lesson[]>(MOCK_LESSONS);
  public readonly lessons = this._lessons.asReadonly();

  getLessonsForCourse(courseId: number): Lesson[] {
    return this._lessons().filter(lesson => lesson.courseId === courseId);
  }

  addLesson(lesson: Omit<Lesson, 'id'>) {
    const newLesson: Lesson = {
      ...lesson,
      id: this._lessons().length > 0 ? Math.max(...this._lessons().map(l => l.id)) + 1 : 1,
    };
    this._lessons.update(lessons => [...lessons, newLesson]);
  }

  updateLesson(updatedLesson: Lesson) {
    this._lessons.update(lessons =>
      lessons.map(l => (l.id === updatedLesson.id ? updatedLesson : l))
    );
  }

  deleteLesson(lessonId: number) {
    this._lessons.update(lessons => lessons.filter(l => l.id !== lessonId));
  }
}
