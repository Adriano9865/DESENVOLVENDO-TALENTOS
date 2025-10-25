import { Component, ChangeDetectionStrategy, output, signal, inject } from '@angular/core';
import { Teacher } from '../../models/teacher.model';
import { TeacherService } from '../../services/teacher.service';

@Component({
  selector: 'app-teacher-login-modal',
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in" (click)="closeModal()">
      <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-md relative animate-fade-in-up" (click)="$event.stopPropagation()">
        <button (click)="closeModal()" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <h2 class="text-2xl font-bold text-slate-800 mb-6 text-center">Login do Professor</h2>
        
        <form (submit)="onLogin(); $event.preventDefault()">
          <div class="space-y-4">
            <div>
              <label for="login" class="block text-sm font-medium text-slate-700">Login (4 dígitos)</label>
              <input 
                id="login" 
                type="text" 
                [value]="login()"
                (input)="updateLogin($event)"
                maxlength="4"
                pattern="\\d{4}"
                placeholder="****"
                class="mt-1 block w-full px-3 py-2 bg-slate-100 border border-slate-300 text-slate-900 rounded-lg shadow-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                required
                autocomplete="off"
                inputmode="numeric"
              />
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-slate-700">Senha (4 dígitos)</label>
              <input 
                id="password" 
                type="password"
                [value]="password()"
                (input)="updatePassword($event)"
                maxlength="4"
                pattern="\\d{4}"
                placeholder="****"
                class="mt-1 block w-full px-3 py-2 bg-slate-100 border border-slate-300 text-slate-900 rounded-lg shadow-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                required
                autocomplete="current-password"
                inputmode="numeric"
              />
            </div>
          </div>
          
          @if (errorMessage()) {
            <p class="text-red-500 text-sm mt-4 text-center">{{ errorMessage() }}</p>
          }

          <div class="mt-6">
            <button type="submit" class="w-full bg-teal-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400 transition-transform transform hover:scale-105 active:scale-100 disabled:bg-teal-300 disabled:cursor-not-allowed" [disabled]="login().length !== 4 || password().length !== 4">
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherLoginModalComponent {
  close = output<void>();
  loginSuccess = output<Teacher>();
  
  private teacherService = inject(TeacherService);

  login = signal('');
  password = signal('');
  errorMessage = signal<string | null>(null);

  updateLogin(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.login.set(value.replace(/\D/g, '').slice(0, 4));
  }
  
  updatePassword(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.password.set(value.replace(/\D/g, '').slice(0, 4));
  }

  onLogin() {
    this.errorMessage.set(null);
    if (this.login().length !== 4 || this.password().length !== 4) return;
    
    const teacher = this.teacherService.validateLogin(this.login(), this.password());
    if (teacher) {
      this.loginSuccess.emit(teacher);
    } else {
      this.errorMessage.set('Login ou senha inválidos. Por favor, tente novamente.');
    }
  }

  closeModal() {
    this.close.emit();
  }
}