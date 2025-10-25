import { Component, ChangeDetectionStrategy, output } from '@angular/core';
import { UserRole } from '../../models/course.model';

@Component({
  selector: 'app-login',
  template: `
    <div class="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
      <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        <h1 class="text-4xl font-bold text-slate-800 mb-2">Bem-vindo(a)!</h1>
        <p class="text-slate-500 mb-8">Selecione seu perfil para continuar.</p>
        <div class="space-y-4">
          <button (click)="loginAs('student')" class="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105 active:scale-100">
            Entrar como Aluno
          </button>
          <button (click)="loginAs('teacher')" class="w-full bg-teal-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400 transition-transform transform hover:scale-105 active:scale-100">
            Entrar como Professor
          </button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  login = output<UserRole>();

  loginAs(role: UserRole) {
    this.login.emit(role);
  }
}