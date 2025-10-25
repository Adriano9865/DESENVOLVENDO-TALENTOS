import { Component, ChangeDetectionStrategy, input, output, signal, effect } from '@angular/core';
import { Teacher } from '../../models/teacher.model';

@Component({
  selector: 'app-teacher-access-view',
  templateUrl: './teacher-access-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherAccessViewComponent {
  currentTeacher = input.required<Teacher>();
  allTeachers = input.required<Teacher[]>();

  addTeacher = output<void>();
  saveTeacher = output<Teacher>();

  // Form state
  fullName = signal('');
  whatsapp = signal('');
  login = signal('');
  newPassword = signal('');
  
  saveSuccess = signal(false);

  constructor() {
    effect(() => {
      const teacher = this.currentTeacher();
      if (teacher) {
        this.fullName.set(teacher.fullName);
        this.whatsapp.set(teacher.whatsapp);
        this.login.set(teacher.login);
        this.newPassword.set(''); // Clear password field for security
      }
    });
  }

  updateField(field: 'fullName' | 'whatsapp' | 'login' | 'newPassword', event: Event) {
    this.saveSuccess.set(false);
    const value = (event.target as HTMLInputElement).value;
    switch (field) {
      case 'fullName': this.fullName.set(value); break;
      case 'whatsapp': this.whatsapp.set(value); break;
      case 'login': this.login.set(value.replace(/\D/g, '').slice(0, 4)); break;
      case 'newPassword': this.newPassword.set(value.replace(/\D/g, '').slice(0, 4)); break;
    }
  }

  onSaveProfile() {
    if (!this.fullName().trim() || !this.whatsapp().trim() || this.login().length !== 4) {
      alert('Por favor, preencha todos os campos obrigatórios. O login deve ter 4 dígitos.');
      return;
    }

    if (this.newPassword().trim() && this.newPassword().length !== 4) {
      alert('A nova senha, se informada, deve ter 4 dígitos.');
      return;
    }

    const updatedTeacher: Teacher = {
      ...this.currentTeacher(),
      fullName: this.fullName(),
      whatsapp: this.whatsapp(),
      login: this.login(),
      password: this.newPassword().trim() ? this.newPassword() : this.currentTeacher().password,
    };
    
    this.saveTeacher.emit(updatedTeacher);
    this.newPassword.set('');
    this.saveSuccess.set(true);
    setTimeout(() => this.saveSuccess.set(false), 3000);
  }

  onAddTeacher() {
    this.addTeacher.emit();
  }
}