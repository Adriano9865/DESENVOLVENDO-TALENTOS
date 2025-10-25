import { Component, ChangeDetectionStrategy, input, output, signal, effect } from '@angular/core';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-student-profile-view',
  templateUrl: './student-profile-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentProfileViewComponent {
  student = input.required<Student>();
  saveStudent = output<Student>();

  // Form state
  fullName = signal('');
  whatsapp = signal('');
  newPassword = signal('');
  confirmPassword = signal('');
  
  passwordError = signal<string | null>(null);
  saveSuccess = signal(false);

  constructor() {
    effect(() => {
      const s = this.student();
      if (s) {
        this.fullName.set(s.fullName);
        this.whatsapp.set(s.whatsapp);
      }
    });
  }

  updateField(field: 'fullName' | 'whatsapp' | 'newPassword' | 'confirmPassword', event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.saveSuccess.set(false); // Reset success message on edit
    this.passwordError.set(null); // Reset password error
    switch (field) {
      case 'fullName': this.fullName.set(value); break;
      case 'whatsapp': this.whatsapp.set(value); break;
      case 'newPassword': this.newPassword.set(value); break;
      case 'confirmPassword': this.confirmPassword.set(value); break;
    }
  }

  onSave() {
    this.passwordError.set(null);
    this.saveSuccess.set(false);

    // Validate password change
    if (this.newPassword() || this.confirmPassword()) {
      if (this.newPassword() !== this.confirmPassword()) {
        this.passwordError.set('As senhas não coincidem.');
        return;
      }
      if (this.newPassword().length < 4) {
        this.passwordError.set('A nova senha deve ter 4 dígitos.');
        return;
      }
    }
    
    const updatedStudent: Student = {
      ...this.student(),
      fullName: this.fullName(),
      whatsapp: this.whatsapp(),
      // Only update password if a new one is provided
      password: this.newPassword() ? this.newPassword() : this.student().password,
    };
    
    this.saveStudent.emit(updatedStudent);
    this.newPassword.set('');
    this.confirmPassword.set('');
    this.saveSuccess.set(true);
    // Hide success message after 3 seconds
    setTimeout(() => this.saveSuccess.set(false), 3000);
  }
}
