import { Component, ChangeDetectionStrategy, output, signal, input, effect } from '@angular/core';
import { Course } from '../../models/course.model';
import { LibraryMaterial } from '../../models/library.model';

@Component({
  selector: 'app-edit-material-modal',
  templateUrl: './edit-material-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditMaterialModalComponent {
  material = input.required<LibraryMaterial>();
  courses = input.required<Course[]>();
  
  close = output<void>();
  saveMaterial = output<LibraryMaterial>();
  deleteMaterial = output<number>();
  
  // Form state
  title = signal('');
  type = signal<'PDF' | 'Vídeo' | 'Link'>('Link');
  url = signal('');
  courseId = signal<number | null>(null);

  isDeleteConfirmVisible = signal(false);

  constructor() {
    effect(() => {
      const m = this.material();
      if (m) {
        this.title.set(m.title);
        this.type.set(m.type);
        this.url.set(m.url);
        this.courseId.set(m.courseId);
      }
    });
  }

  updateField(field: 'title' | 'url', event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (field === 'title') this.title.set(value);
    else this.url.set(value);
  }

  updateType(event: Event) {
    this.type.set((event.target as HTMLSelectElement).value as 'PDF' | 'Vídeo' | 'Link');
  }
  
  updateCourseId(event: Event) {
    this.courseId.set(parseInt((event.target as HTMLSelectElement).value, 10));
  }

  onSubmit() {
    const courseId = this.courseId();
    if (this.title().trim() && this.url().trim() && courseId !== null) {
      this.saveMaterial.emit({
        id: this.material().id,
        title: this.title(),
        type: this.type(),
        url: this.url(),
        courseId: courseId,
      });
    }
  }

  onDelete() {
    this.deleteMaterial.emit(this.material().id);
  }

  closeModal() {
    this.isDeleteConfirmVisible.set(false);
    this.close.emit();
  }
}
