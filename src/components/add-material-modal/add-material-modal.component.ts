import { Component, ChangeDetectionStrategy, output, signal, input } from '@angular/core';
import { Course } from '../../models/course.model';
import { LibraryMaterial } from '../../models/library.model';

@Component({
  selector: 'app-add-material-modal',
  templateUrl: './add-material-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddMaterialModalComponent {
  courses = input.required<Course[]>();
  close = output<void>();
  addMaterial = output<Omit<LibraryMaterial, 'id'>>();
  
  title = signal('');
  type = signal<'PDF' | 'Vídeo' | 'Link'>('Link');
  url = signal('');
  courseId = signal<number | null>(null);

  updateTitle(event: Event) {
    this.title.set((event.target as HTMLInputElement).value);
  }

  updateType(event: Event) {
    this.type.set((event.target as HTMLSelectElement).value as 'PDF' | 'Vídeo' | 'Link');
  }

  updateUrl(event: Event) {
    this.url.set((event.target as HTMLInputElement).value);
  }
  
  updateCourseId(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.courseId.set(value ? parseInt(value, 10) : null);
  }

  onSubmit() {
    const courseId = this.courseId();
    if (this.title().trim() && this.url().trim() && courseId !== null) {
      this.addMaterial.emit({
        title: this.title(),
        type: this.type(),
        url: this.url(),
        courseId: courseId,
      });
    }
  }

  closeModal() {
    this.close.emit();
  }
}
