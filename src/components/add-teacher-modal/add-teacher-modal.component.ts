import { Component, ChangeDetectionStrategy, output, signal } from '@angular/core';
import { Teacher } from '../../models/teacher.model';

@Component({
  selector: 'app-add-teacher-modal',
  templateUrl: './add-teacher-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTeacherModalComponent {
  close = output<void>();
  addTeacher = output<Omit<Teacher, 'id'>>();

  fullName = signal('');
  whatsapp = signal('');
  login = signal('');
  password = signal('');

  updateField(field: 'fullName' | 'whatsapp' | 'login' | 'password', event: Event) {
    const value = (event.target as HTMLInputElement).value;
    switch (field) {
      case 'fullName': this.fullName.set(value); break;
      case 'whatsapp': this.whatsapp.set(value); break;
      case 'login': this.login.set(value.replace(/\D/g, '').slice(0, 4)); break;
      case 'password': this.password.set(value.replace(/\D/g, '').slice(0, 4)); break;
    }
  }

  onSubmit() {
    if (this.fullName().trim() && this.whatsapp().trim() && this.login().length === 4 && this.password().length === 4) {
      this.addTeacher.emit({
        fullName: this.fullName(),
        whatsapp: this.whatsapp(),
        login: this.login(),
        password: this.password(),
      });
    }
  }

  closeModal() {
    this.close.emit();
  }
}