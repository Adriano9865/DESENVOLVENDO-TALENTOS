import { Injectable, signal } from '@angular/core';
import { Student } from '../models/student.model';

const MOCK_STUDENTS: Student[] = [
  { id: 1, fullName: 'Ana Beatriz', whatsapp: '11987654321', login: '1234', password: '1111', status: 'active', enrolledCourseIds: [1, 4] },
  { id: 2, fullName: 'Bruno Costa', whatsapp: '21987654321', login: '5678', password: '2222', status: 'active', enrolledCourseIds: [1, 3, 6] },
  { id: 3, fullName: 'Carla Dias', whatsapp: '31987654321', login: '9012', password: '3333', status: 'inactive', enrolledCourseIds: [2] },
];

@Injectable({ providedIn: 'root' })
export class StudentService {
  private _students = signal<Student[]>(MOCK_STUDENTS);
  public readonly students = this._students.asReadonly();

  addStudent(student: Omit<Student, 'id' | 'status' | 'enrolledCourseIds'>): Student {
    const newStudent: Student = {
      ...student,
      id: this._students().length > 0 ? Math.max(...this._students().map(s => s.id)) + 1 : 1,
      status: 'active',
      enrolledCourseIds: [],
    };
    this._students.update(students => [...students, newStudent]);
    return newStudent;
  }

  updateStudent(updatedStudent: Student) {
    this._students.update(students =>
      students.map(s => s.id === updatedStudent.id ? updatedStudent : s)
    );
  }

  deleteStudent(studentId: number) {
    this._students.update(students => students.filter(s => s.id !== studentId));
  }
  
  validateLogin(login: string, password: string): Student | undefined {
    return this._students().find(s => s.login === login && s.password === password && s.status === 'active');
  }

  enrollInCourse(studentId: number, courseId: number) {
    this._students.update(students => students.map(student => {
      if (student.id === studentId) {
        // Evita duplicatas
        if (student.enrolledCourseIds.includes(courseId)) {
          return student;
        }
        return { ...student, enrolledCourseIds: [...student.enrolledCourseIds, courseId] };
      }
      return student;
    }));
  }

  unenrollAllStudentsFromCourse(courseId: number) {
    this._students.update(students => students.map(student => {
      if (student.enrolledCourseIds.includes(courseId)) {
        return {
          ...student,
          enrolledCourseIds: student.enrolledCourseIds.filter(id => id !== courseId)
        };
      }
      return student;
    }));
  }

  getEnrolledStudentsForCourse(courseId: number): Student[] {
    return this.students().filter(s => s.enrolledCourseIds.includes(courseId));
  }
}
