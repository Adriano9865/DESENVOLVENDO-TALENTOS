import { Component, ChangeDetectionStrategy, input, computed, output, signal } from '@angular/core';
import { Course } from '../../models/course.model';
import { LibraryMaterial } from '../../models/library.model';

@Component({
  selector: 'app-teacher-library-view',
  templateUrl: './teacher-library-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherLibraryViewComponent {
  materials = input.required<LibraryMaterial[]>();
  courses = input.required<Course[]>();
  addMaterial = output<void>();
  editMaterial = output<LibraryMaterial>();
 
  private coursesMap = computed(() => {
    const map = new Map<number, Course>();
    for (const course of this.courses()) {
      map.set(course.id, course);
    }
    return map;
  });

  libraryItems = computed(() => {
    const map = this.coursesMap();
    return this.materials()
      .map(m => ({ ...m, courseTitle: map.get(m.courseId)?.title || 'Curso Desconhecido' }))
      .sort((a, b) => a.courseTitle.localeCompare(b.courseTitle) || a.title.localeCompare(b.title));
  });

  onAddMaterial() {
    this.addMaterial.emit();
  }

  onEditMaterial(material: LibraryMaterial) {
    this.editMaterial.emit(material);
  }
}
