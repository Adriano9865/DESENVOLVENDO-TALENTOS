import { Injectable, signal } from '@angular/core';
import { Teacher } from '../models/teacher.model';

const MOCK_TEACHERS: Teacher[] = [
  { id: 1, fullName: 'Professor Padrão', whatsapp: '11999999999', login: '5678', password: '5678' },
];

@Injectable({ providedIn: 'root' })
export class TeacherService {
  private _teachers = signal<Teacher[]>(MOCK_TEACHERS);
  public readonly teachers = this._teachers.asReadonly();

  validateLogin(login: string, password: string): Teacher | undefined {
    return this._teachers().find(t => t.login === login && t.password === password);
  }

  addTeacher(teacher: Omit<Teacher, 'id'>): Teacher {
    const newTeacher: Teacher = {
      ...teacher,
      id: this._teachers().length > 0 ? Math.max(...this._teachers().map(t => t.id)) + 1 : 1,
    };
    this._teachers.update(teachers => [...teachers, newTeacher]);
    return newTeacher;
  }

  updateTeacher(updatedTeacher: Teacher) {
    this._teachers.update(teachers =>
      teachers.map(t => (t.id === updatedTeacher.id ? updatedTeacher : t))
    );
  }

  deleteTeacher(teacherId: number) {
    this._teachers.update(teachers => teachers.filter(t => t.id !== teacherId));
  }
}