import { Component, ChangeDetectionStrategy, input, output, signal, effect } from '@angular/core';
import { Quiz, StudentAnswer } from '../../models/quiz.model';

@Component({
  selector: 'app-student-quiz-modal',
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in" (click)="close.emit()">
      <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl relative animate-fade-in-up flex flex-col max-h-[90vh]" (click)="$event.stopPropagation()">
        <button (click)="close.emit()" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h2 class="text-3xl font-bold text-slate-800 mb-2">{{ quiz().title }}</h2>
        <p class="text-slate-500 mb-6">Responda as questões abaixo. Boa sorte!</p>

        <div class="flex-grow overflow-y-auto pr-4 -mr-4 space-y-8">
          @for (question of quiz().questions; track question.id; let i = $index) {
            <div class="border-t border-slate-200 pt-6">
              <p class="font-semibold text-slate-700 mb-1">Questão {{ i + 1 }}: {{ question.text }}</p>
              <p class="text-sm text-slate-500 mb-4">Vale: {{ question.points }} pontos</p>

              @if (question.type === 'multiple-choice') {
                <div class="space-y-3">
                  @for (option of question.options; track $index; let j = $index) {
                    <label class="flex items-center p-3 border rounded-lg cursor-pointer transition-colors"
                      [class.bg-indigo-100]="answers()[i]?.answer === j"
                      [class.border-indigo-300]="answers()[i]?.answer === j"
                      [class.hover:bg-slate-50]="answers()[i]?.answer !== j">
                      <input type="radio" [name]="'question-' + i" [value]="j" (change)="updateAnswer(i, j)" class="hidden">
                      <span class="flex-grow">{{ option }}</span>
                      <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                        [class.border-indigo-500]="answers()[i]?.answer === j"
                        [class.bg-indigo-500]="answers()[i]?.answer === j"
                        [class.border-slate-300]="answers()[i]?.answer !== j">
                        @if (answers()[i]?.answer === j) {
                          <div class="w-2 h-2 rounded-full bg-white"></div>
                        }
                      </div>
                    </label>
                  }
                </div>
              } @else if (question.type === 'text-answer' || question.type === 'essay') {
                 <div>
                    <textarea 
                      [rows]="question.type === 'essay' ? 10 : 5"
                      class="mt-1 block w-full px-3 py-2 bg-slate-100 border border-slate-300 text-slate-900 rounded-lg shadow-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                      [placeholder]="question.type === 'essay' ? 'Digite sua redação aqui...' : 'Digite sua resposta aqui...'"
                      [value]="answers()[i]?.answer || ''"
                      (input)="updateAnswer(i, $any($event.target).value)"
                    ></textarea>
                 </div>
              }
            </div>
          }
        </div>

        <div class="flex justify-end pt-6 border-t border-slate-200 mt-6">
          <button type="button" (click)="close.emit()" class="mr-3 bg-white py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50">Cancelar</button>
          <button (click)="onSubmit()" [disabled]="!allAnswered()" class="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed">
            Finalizar Prova
          </button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentQuizModalComponent {
  quiz = input.required<Quiz>();
  close = output<void>();
  submitQuiz = output<{ quizId: number, answers: StudentAnswer[] }>();

  answers = signal<StudentAnswer[]>([]);

  constructor() {
    effect(() => {
        this.answers.set(this.quiz()?.questions.map(q => ({
          questionId: q.id,
          answer: null,
          score: 0
        })) || []);
    });
  }

  updateAnswer(questionIndex: number, answer: number | string) {
    this.answers.update(currentAnswers => {
      const newAnswers = [...currentAnswers];
      newAnswers[questionIndex].answer = answer;
      return newAnswers;
    });
  }
  
  allAnswered(): boolean {
      return this.answers().every(a => a.answer !== null && a.answer !== '');
  }

  onSubmit() {
    this.submitQuiz.emit({
      quizId: this.quiz().id,
      answers: this.answers(),
    });
  }
}