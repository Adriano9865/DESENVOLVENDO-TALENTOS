import { Component, ChangeDetectionStrategy, computed, effect, input, output, signal } from '@angular/core';
import { Quiz, Question, QuestionType } from '../../models/quiz.model';

@Component({
  selector: 'app-teacher-quiz-form',
  template: `
    <form (submit)="onSave(); $event.preventDefault()" class="space-y-6 p-6">
      <div>
        <label for="quizTitle" class="block text-sm font-medium text-slate-700">Título da Prova</label>
        <input 
          id="quizTitle" 
          type="text" 
          [value]="quizTitle()"
          (input)="quizTitle.set($any($event.target).value)"
          class="mt-1 block w-full px-3 py-2 bg-slate-100 border border-slate-300 text-slate-900 rounded-lg shadow-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
          required
        />
      </div>

      <hr />

      <h4 class="text-lg font-medium text-slate-800">Questões</h4>
      
      <div class="space-y-6">
        @for (question of questions(); track question.id; let i = $index) {
          <div class="p-4 border border-slate-200 rounded-lg space-y-4 bg-slate-50">
            <div class="flex justify-between items-start">
              <div class="flex-grow">
                <label [for]="'q-text-' + i" class="block text-sm font-medium text-slate-700">Questão {{ i + 1 }}</label>
                <textarea 
                  [id]="'q-text-' + i"
                  rows="2"
                  class="mt-1 block w-full px-3 py-2 bg-slate-100 border border-slate-300 text-slate-900 rounded-lg shadow-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                  placeholder="Digite o texto da questão"
                  [value]="question.text"
                  (input)="updateQuestion(i, 'text', $any($event.target).value)"
                  required
                ></textarea>
              </div>
              <button type="button" (click)="removeQuestion(i)" class="ml-4 mt-6 text-red-500 hover:text-red-700" title="Remover Questão">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
            
            <div class="flex items-center space-x-4">
              <div>
                <label [for]="'q-type-' + i" class="block text-sm font-medium text-slate-700">Tipo</label>
                <select [id]="'q-type-' + i" [value]="question.type" (change)="updateQuestion(i, 'type', $any($event.target).value)" class="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-slate-100 border border-slate-300 text-slate-900 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm">
                  <option value="multiple-choice">Alternativa (múltipla escolha)</option>
                  <option value="text-answer">Pergunta e Resposta (curta)</option>
                  <option value="essay">Redação (longa)</option>
                </select>
              </div>
              <div>
                <label [for]="'q-points-' + i" class="block text-sm font-medium text-slate-700">Pontos</label>
                <input type="number" [id]="'q-points-' + i" [value]="question.points" (input)="updateQuestion(i, 'points', $any($event.target).value)" min="1" class="mt-1 block w-24 px-3 py-2 bg-slate-100 border border-slate-300 text-slate-900 rounded-lg shadow-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm" />
              </div>
            </div>

            @if (question.type === 'multiple-choice') {
              <div class="space-y-2">
                <p class="text-sm font-medium text-slate-700">Opções (marque a correta)</p>
                @for (option of question.options; track $index; let j = $index) {
                  <div class="flex items-center">
                    <input type="radio" [id]="'q-' + i + '-opt-' + j" [name]="'correct-answer-' + i" [checked]="question.correctAnswerIndex === j" (change)="updateQuestion(i, 'correctAnswerIndex', j)" class="h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500" />
                    <input type="text" [value]="option" (input)="updateOption(i, j, $any($event.target).value)" class="ml-2 block w-full sm:text-sm bg-slate-100 border border-slate-300 text-slate-900 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Opção {{ j + 1 }}" />
                    <button type="button" (click)="removeOption(i, j)" class="ml-2 text-slate-400 hover:text-slate-600" title="Remover Opção">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                }
                <button type="button" (click)="addOption(i)" class="text-sm text-indigo-600 hover:text-indigo-800">+ Adicionar opção</button>
              </div>
            }
          </div>
        }
      </div>
      
      <div class="relative">
        <button type="button" (click)="isAddQuestionMenuOpen.set(!isAddQuestionMenuOpen())" class="w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
          <span>+ Adicionar Questão</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform" [class.rotate-180]="isAddQuestionMenuOpen()" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        @if (isAddQuestionMenuOpen()) {
          <div class="absolute bottom-full mb-2 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-10 animate-fade-in-up" style="animation-duration: 0.2s;">
            <button type="button" (click)="addQuestion('multiple-choice')" class="w-full text-left px-4 py-3 hover:bg-slate-100 text-slate-700 transition-colors">Alternativa (múltipla escolha)</button>
            <button type="button" (click)="addQuestion('text-answer')" class="w-full text-left px-4 py-3 hover:bg-slate-100 text-slate-700 border-t border-slate-100 transition-colors">Pergunta e Resposta (curta)</button>
            <button type="button" (click)="addQuestion('essay')" class="w-full text-left px-4 py-3 hover:bg-slate-100 text-slate-700 border-t border-slate-100 transition-colors">Redação (longa)</button>
          </div>
        }
      </div>

      <div class="flex justify-end pt-6 border-t border-slate-200">
        <button type="button" (click)="onCancel()" class="mr-3 bg-white py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50">Cancelar</button>
        <button type="submit" [disabled]="!isValid()" class="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed">
          Salvar Prova
        </button>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherQuizFormComponent {
  quiz = input<Quiz | null>(null);
  courseId = input.required<number>();

  saveQuiz = output<Omit<Quiz, 'id' | 'status'> | Quiz>();
  cancel = output<void>();

  isEditing = computed(() => !!this.quiz());

  // Form State
  quizTitle = signal('');
  questions = signal<Partial<Question>[]>([]);
  isAddQuestionMenuOpen = signal(false);

  constructor() {
    effect(() => {
      const q = this.quiz();
      if (q) {
        this.quizTitle.set(q.title);
        this.questions.set(JSON.parse(JSON.stringify(q.questions))); // Deep copy for editing
      } else {
        this.quizTitle.set('');
        this.questions.set([]);
      }
    });
  }
  
  isValid = computed(() => {
      if (!this.quizTitle().trim() || this.questions().length === 0) {
          return false;
      }
      return this.questions().every(q => {
          if (!q.text?.trim() || !q.points || q.points <= 0) return false;
          if (q.type === 'multiple-choice') {
              if (!q.options || q.options.length < 2 || q.correctAnswerIndex === undefined || q.correctAnswerIndex < 0) return false;
              if (q.options.some(opt => !opt.trim())) return false;
          }
          return true;
      });
  })

  addQuestion(type: QuestionType) {
    let newQuestion: Partial<Question> = {
      id: Date.now(), // Temporary ID
      text: '',
      type: type,
      points: 10
    };

    if (type === 'multiple-choice') {
      newQuestion.options = ['', ''];
      newQuestion.correctAnswerIndex = 0;
    }

    this.questions.update(qs => [...qs, newQuestion]);
    this.isAddQuestionMenuOpen.set(false); // Close the menu
  }

  removeQuestion(index: number) {
    this.questions.update(qs => qs.filter((_, i) => i !== index));
  }

  updateQuestion(index: number, field: keyof Question, value: any) {
    this.questions.update(qs => {
      const newQuestions = [...qs];
      const question = { ...newQuestions[index] };
      if (field === 'type') {
        question.type = value as QuestionType;
        if(question.type === 'text-answer' || question.type === 'essay') {
            delete question.options;
            delete question.correctAnswerIndex;
        } else {
            question.options = question.options || ['', ''];
            question.correctAnswerIndex = question.correctAnswerIndex || 0;
        }
      } else if (field === 'points') {
        question.points = Number(value);
      } else if (field === 'correctAnswerIndex') {
        question.correctAnswerIndex = Number(value);
      } else {
        (question as any)[field] = value;
      }
      newQuestions[index] = question;
      return newQuestions;
    });
  }

  addOption(questionIndex: number) {
    this.questions.update(qs => {
      const newQuestions = [...qs];
      const question = { ...newQuestions[questionIndex] };
      question.options = [...(question.options || []), ''];
      newQuestions[questionIndex] = question;
      return newQuestions;
    });
  }

  removeOption(questionIndex: number, optionIndex: number) {
    this.questions.update(qs => {
      const newQuestions = [...qs];
      const question = { ...newQuestions[questionIndex] };
      question.options = question.options?.filter((_, i) => i !== optionIndex);
      if(question.correctAnswerIndex === optionIndex) {
          question.correctAnswerIndex = 0;
      } else if (question.correctAnswerIndex && question.correctAnswerIndex > optionIndex) {
          question.correctAnswerIndex--;
      }
      newQuestions[questionIndex] = question;
      return newQuestions;
    });
  }

  updateOption(questionIndex: number, optionIndex: number, value: string) {
    this.questions.update(qs => {
      const newQuestions = [...qs];
      const question = { ...newQuestions[questionIndex] };
      const newOptions = [...(question.options || [])];
      newOptions[optionIndex] = value;
      question.options = newOptions;
      newQuestions[questionIndex] = question;
      return newQuestions;
    });
  }

  onSave() {
    if (!this.isValid()) return;
    
    const finalQuestions = this.questions().map((q, index) => ({
        id: this.isEditing() && q.id && typeof q.id === 'number' ? q.id : Date.now() + index, // Use existing id or generate new one
        text: q.text!,
        type: q.type!,
        points: q.points!,
        options: q.type === 'multiple-choice' ? q.options : undefined,
        correctAnswerIndex: q.type === 'multiple-choice' ? q.correctAnswerIndex : undefined,
    }));

    const quizData = {
      courseId: this.courseId(),
      title: this.quizTitle(),
      questions: finalQuestions as Question[],
    };

    if (this.isEditing()) {
      const originalQuiz = this.quiz()!;
      this.saveQuiz.emit({ 
        ...originalQuiz,
        ...quizData
      });
    } else {
      this.saveQuiz.emit(quizData);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}