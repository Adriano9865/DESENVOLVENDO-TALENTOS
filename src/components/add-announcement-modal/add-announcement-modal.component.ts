import { Component, ChangeDetectionStrategy, output, signal, input } from '@angular/core';
import { Course } from '../../models/course.model';
import { Announcement } from '../../models/announcement.model';

@Component({
  selector: 'app-add-announcement-modal',
  templateUrl: './add-announcement-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddAnnouncementModalComponent {
  courses = input.required<Course[]>();
  close = output<void>();
  addAnnouncement = output<Omit<Announcement, 'id' | 'createdAt'>>();
  
  title = signal('');
  content = signal('');
  courseId = signal<number | 'all'>('all');

  updateField(field: 'title' | 'content', event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (field === 'title') this.title.set(value);
    else this.content.set(value);
  }
  
  updateCourseId(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.courseId.set(value === 'all' ? 'all' : parseInt(value, 10));
  }

  onSubmit() {
    if (this.title().trim() && this.content().trim()) {
      this.addAnnouncement.emit({
        title: this.title(),
        content: this.content(),
        courseId: this.courseId(),
      });
    }
  }

  closeModal() {
    this.close.emit();
  }
}
