import { Component, ChangeDetectionStrategy, output, input, signal, effect, computed } from '@angular/core';
import { Student } from '../../models/student.model';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-edit-student-modal',
  templateUrl: './edit-student-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditStudentModalComponent {
  student = input.required<Student>();
  courses = input.required<Course[]>();

  close = output<void>();
  saveStudent = output<Student>();
  deleteStudent = output<number>();

  // Form state
  fullName = signal('');
  whatsapp = signal('');
  login = signal('');
  password = signal('');
  status = signal<'active' | 'inactive'>('active');
  enrolledCourseIds = signal<Set<number>>(new Set());

  constructor() {
    effect(() => {
      const s = this.student();
      if (s) {
        this.fullName.set(s.fullName);
        this.whatsapp.set(s.whatsapp);
        this.login.set(s.login);
        this.password.set(''); // Clear password field on open
        this.status.set(s.status);
        this.enrolledCourseIds.set(new Set(s.enrolledCourseIds));
      }
    });
  }

  enrollableCourses = computed(() => {
    return this.courses().filter(c => c.isTeacherCourse && c.status === 'active');
  });

  toggleEnrollment(courseId: number) {
    this.enrolledCourseIds.update(ids => {
      const newIds = new Set(ids);
      if (newIds.has(courseId)) {
        newIds.delete(courseId);
      } else {
        newIds.add(courseId);
      }
      return newIds;
    });
  }

  updateField(field: 'fullName' | 'whatsapp' | 'login' | 'password', event: Event) {
    const value = (event.target as HTMLInputElement).value;
    switch (field) {
      case 'fullName': this.fullName.set(value); break;
      case 'whatsapp': this.whatsapp.set(value); break;
      case 'login': this.login.set(value.replace(/\D/g, '').slice(0, 4)); break;
      case 'password': this.password.set(value.replace(/\D/g, '').slice(0, 4)); break;
    }
  }

  onSave() {
    if (this.fullName().trim() && this.whatsapp().trim() && this.login().length === 4) {
      if (this.password() && this.password().length !== 4) {
        // This case is handled by form validation, but as a safeguard.
        alert('A nova senha, se preenchida, deve ter 4 dígitos.');
        return;
      }

      this.saveStudent.emit({
        id: this.student().id,
        fullName: this.fullName(),
        whatsapp: this.whatsapp(),
        login: this.login(),
        password: this.password() ? this.password() : this.student().password,
        status: this.status(),
        enrolledCourseIds: Array.from(this.enrolledCourseIds()),
      });
    }
  }

  onToggleStatus() {
    this.status.update(s => (s === 'active' ? 'inactive' : 'active'));
  }

  onDelete() {
    this.deleteStudent.emit(this.student().id);
  }

  closeModal() {
    this.close.emit();
  }
}
