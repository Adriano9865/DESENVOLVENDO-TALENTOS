import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-teacher-students-view',
  templateUrl: './teacher-students-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherStudentsViewComponent {
  students = input.required<Student[]>();
  addStudent = output<void>();
  editStudent = output<Student>();

  onAddStudent() {
    this.addStudent.emit();
  }

  onEditStudent(student: Student) {
    this.editStudent.emit(student);
  }
}
