import { Component, ChangeDetectionStrategy, output, signal } from '@angular/core';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-add-course-modal',
  templateUrl: './add-course-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCourseModalComponent {
  close = output<void>();
  addCourse = output<Omit<Course, 'id' | 'isTeacherCourse' | 'status'>>();
  
  courseTitle = signal('');
  courseInstructor = signal('');
  courseDescription = signal('');

  updateTitle(event: Event) {
    this.courseTitle.set((event.target as HTMLInputElement).value);
  }

  updateInstructor(event: Event) {
    this.courseInstructor.set((event.target as HTMLInputElement).value);
  }

  updateDescription(event: Event) {
    this.courseDescription.set((event.target as HTMLTextAreaElement).value);
  }

  onSubmit() {
    if (this.courseTitle().trim() && this.courseInstructor().trim() && this.courseDescription().trim()) {
      this.addCourse.emit({
        title: this.courseTitle(),
        instructor: this.courseInstructor(),
        description: this.courseDescription(),
        imageUrl: `https://picsum.photos/seed/${this.courseTitle().replace(/\s/g, '-')}/600/400`,
      });
    }
  }

  closeModal() {
    this.close.emit();
  }
}