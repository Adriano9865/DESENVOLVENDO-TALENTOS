import { Component, ChangeDetectionStrategy, input, output, signal, effect } from '@angular/core';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-teacher-course-settings',
  templateUrl: './teacher-course-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherCourseSettingsComponent {
  course = input.required<Course>();
  courseUpdated = output<Course>();
  courseDeleted = output<number>();

  // Form state signals
  title = signal('');
  instructor = signal('');
  imageUrl = signal('');
  description = signal('');
  status = signal<'active' | 'inactive'>('active');
  
  constructor() {
    effect(() => {
      const c = this.course();
      if (c) {
        this.title.set(c.title);
        this.instructor.set(c.instructor);
        this.imageUrl.set(c.imageUrl);
        this.description.set(c.description);
        this.status.set(c.status);
      }
    });
  }

  updateField(field: 'title' | 'instructor' | 'imageUrl' | 'description', event: Event) {
    const value = (event.target as HTMLInputElement).value;
    switch(field) {
      case 'title': this.title.set(value); break;
      case 'instructor': this.instructor.set(value); break;
      case 'imageUrl': this.imageUrl.set(value); break;
      case 'description': this.description.set(value); break;
    }
  }

  onSaveChanges() {
    const updatedCourse: Course = {
      ...this.course(),
      title: this.title(),
      instructor: this.instructor(),
      imageUrl: this.imageUrl(),
      description: this.description(),
      status: this.status(),
    };
    this.courseUpdated.emit(updatedCourse);
    alert('Alterações salvas com sucesso!');
  }
  
  onToggleStatus() {
      this.status.update(s => s === 'active' ? 'inactive' : 'active');
  }

  onDeleteCourse() {
    this.courseDeleted.emit(this.course().id);
  }
}