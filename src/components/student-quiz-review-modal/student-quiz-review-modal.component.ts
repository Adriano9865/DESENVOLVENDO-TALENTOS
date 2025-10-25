import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { Quiz, QuizAttempt, StudentAnswer } from '../../models/quiz.model';

@Component({
  selector: 'app-student-quiz-review-modal',
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in" (click)="close.emit()">
      <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl relative animate-fade-in-up flex flex-col max-h-[90vh]" (click)="$event.stopPropagation()">
        <button (click)="close.emit()" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h2 class="text-3xl font-bold text-slate-800 mb-2">Revisão: {{ quiz().title }}</h2>
        <p class="text-slate-500 mb-6">Sua nota: <span class="font-bold text-indigo-600">{{ attempt().score }}%</span></p>

        <div class="flex-grow overflow-y-auto pr-4 -mr-4 space-y-8">
          @for (question of quiz().questions; track question.id; let i = $index) {
            @let studentAnswer = answersMap().get(question.id);
            <div class="border-t border-slate-200 pt-6">
              <p class="font-semibold text-slate-700 mb-1">Questão {{ i + 1 }}: {{ question.text }}</p>
               <p class="text-sm text-slate-500 mb-4">Sua pontuação: {{ studentAnswer?.score || 0 }} / {{ question.points }} pontos</p>

              @if (question.type === 'multiple-choice' && studentAnswer) {
                <div class="space-y-3">
                  @for (option of question.options; track $index; let j = $index) {
                     @let isCorrectAnswer = j === question.correctAnswerIndex;
                     @let isStudentAnswer = j === studentAnswer.answer;
                    <div class="flex items-center p-3 border rounded-lg"
                      [class.bg-green-100]="isCorrectAnswer"
                      [class.border-green-300]="isCorrectAnswer"
                      [class.bg-red-100]="!isCorrectAnswer && isStudentAnswer"
                      [class.border-red-300]="!isCorrectAnswer && isStudentAnswer"
                    >
                      <span class="flex-grow">{{ option }}</span>
                       @if (isCorrectAnswer) {
                        <span class="text-green-600 font-bold text-sm">Correta</span>
                      }
                      @if (!isCorrectAnswer && isStudentAnswer) {
                        <span class="text-red-600 font-bold text-sm">Sua Resposta</span>
                      }
                    </div>
                  }
                </div>
              } @else if ((question.type === 'text-answer' || question.type === 'essay') && studentAnswer) {
                <div class="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <p class="text-sm font-semibold text-slate-600 mb-2">Sua Resposta:</p>
                  <p class="text-slate-800 whitespace-pre-wrap">{{ studentAnswer.answer }}</p>
                </div>
              }
            </div>
          }
        </div>
        <div class="flex justify-end pt-6 border-t border-slate-200 mt-6">
          <button (click)="close.emit()" class="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">Fechar</button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentQuizReviewModalComponent {
  quiz = input.required<Quiz>();
  attempt = input.required<QuizAttempt>();
  close = output<void>();
  
  answersMap = computed(() => {
    const map = new Map<number, StudentAnswer>();
    for (const answer of this.attempt().answers) {
      map.set(answer.questionId, answer);
    }
    return map;
  });
}