import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { Student } from '../../models/student.model';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-enroll-student-modal',
  templateUrl: './enroll-student-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnrollStudentModalComponent {
  student = input.required<Student>();
  courses = input.required<Course[]>();
  
  close = output<void>();
  enroll = output<{ studentId: number, courseIds: number[] }>();

  selectedCourseIds = signal<Set<number>>(new Set());

  toggleCourseSelection(courseId: number) {
    this.selectedCourseIds.update(ids => {
      const newIds = new Set(ids);
      if (newIds.has(courseId)) {
        newIds.delete(courseId);
      } else {
        newIds.add(courseId);
      }
      return newIds;
    });
  }

  onEnroll() {
    this.enroll.emit({ 
      studentId: this.student().id,
      courseIds: Array.from(this.selectedCourseIds()) 
    });
  }

  closeModal() {
    this.close.emit();
  }
}