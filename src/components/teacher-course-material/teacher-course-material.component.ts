import { Component, ChangeDetectionStrategy, input, computed, inject } from '@angular/core';
import { Course } from '../../models/course.model';
import { LibraryMaterial } from '../../models/library.model';
import { LibraryService } from '../../services/library.service';

@Component({
  selector: 'app-teacher-course-material',
  templateUrl: './teacher-course-material.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherCourseMaterialComponent {
  course = input.required<Course>();

  private libraryService = inject(LibraryService);

  courseMaterials = computed(() => {
    return this.libraryService.materials().filter(m => m.courseId === this.course().id);
  });

  // NOTE: The logic to open the "Add Material" modal is handled by the root AppComponent.
  // This component could emit an event to request the modal to be opened if needed in the future.
}
