import { Injectable, signal } from '@angular/core';
import { ManualGrade } from '../models/grade.model';

const MOCK_MANUAL_GRADES: ManualGrade[] = [
    { id: 1, studentId: 1, courseId: 1, title: 'Participação em Aula', score: 95 },
    { id: 2, studentId: 2, courseId: 1, title: 'Trabalho Prático 1', score: 88 },
];

@Injectable({ providedIn: 'root' })
export class GradeService {
  private _manualGrades = signal<ManualGrade[]>(MOCK_MANUAL_GRADES);
  public readonly manualGrades = this._manualGrades.asReadonly();

  getGradesForStudent(studentId: number): ManualGrade[] {
    return this._manualGrades().filter(grade => grade.studentId === studentId);
  }

  addOrUpdateGrade(grade: Omit<ManualGrade, 'id'> | ManualGrade) {
    if ('id' in grade) {
      // Update
      this._manualGrades.update(grades => 
        grades.map(g => g.id === grade.id ? grade : g)
      );
    } else {
      // Add
      const newGrade: ManualGrade = {
        ...grade,
        id: this._manualGrades().length > 0 ? Math.max(...this._manualGrades().map(g => g.id)) + 1 : 1,
      };
      this._manualGrades.update(grades => [...grades, newGrade]);
    }
  }

  deleteGrade(gradeId: number) {
    this._manualGrades.update(grades => grades.filter(g => g.id !== gradeId));
  }
}
