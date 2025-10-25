import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { Student } from '../../models/student.model';
import { Course } from '../../models/course.model';
import { LibraryMaterial } from '../../models/library.model';

@Component({
  selector: 'app-student-library-view',
  templateUrl: './student-library-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentLibraryViewComponent {
  student = input.required<Student>();
  courses = input.required<Course[]>();
  materials = input.required<LibraryMaterial[]>();

  private coursesMap = computed(() => {
    const map = new Map<number, Course>();
    for (const course of this.courses()) {
      map.set(course.id, course);
    }
    return map;
  });

  studentMaterials = computed(() => {
    const enrolledIds = new Set(this.student().enrolledCourseIds);
    const map = this.coursesMap();
    return this.materials()
      .filter(m => enrolledIds.has(m.courseId))
      .map(m => ({ ...m, courseTitle: map.get(m.courseId)?.title || 'Curso Desconhecido' }))
      .sort((a, b) => a.courseTitle.localeCompare(b.courseTitle));
  });
}
