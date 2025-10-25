import { Component, ChangeDetectionStrategy, computed, inject, input, signal } from '@angular/core';
import { Course } from '../../models/course.model';
import { Student } from '../../models/student.model';
import { Quiz, QuizAttempt, StudentAnswer } from '../../models/quiz.model';
import { QuizService } from '../../services/quiz.service';
import { StudentQuizModalComponent } from '../student-quiz-modal/student-quiz-modal.component';
import { StudentQuizReviewModalComponent } from '../student-quiz-review-modal/student-quiz-review-modal.component';

@Component({
  selector: 'app-student-course-grades',
  template: `
    <div class="bg-white p-6 rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-2xl font-semibold text-slate-800">Minhas Provas</h3>
        @if (averageGrade() !== null) {
          <div class="text-right">
            <p class="text-sm text-slate-500">Média Geral</p>
            <p class="text-2xl font-bold text-indigo-600">{{ averageGrade() }}%</p>
          </div>
        }
      </div>

      <div class="space-y-4">
        @for (quiz of courseQuizzesWithAttempts(); track quiz.id) {
          <div class="p-4 border rounded-lg flex justify-between items-center bg-slate-50">
            <div>
              <p class="font-semibold text-slate-700">{{ quiz.title }}</p>
              @if (quiz.attempt) {
                 <p class="text-sm text-slate-500">
                  Nota: 
                  <span class="font-bold" [class.text-green-600]="quiz.attempt.score >= 70" [class.text-red-600]="quiz.attempt.score < 70">{{ quiz.attempt.score }}%</span>
                  @if (!quiz.attempt.isGraded) {
                    <span class="ml-2 text-xs font-semibold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">Correção Pendente</span>
                  }
                </p>
              } @else {
                <p class="text-sm text-slate-500">Não realizado</p>
              }
            </div>
            <div class="flex items-center space-x-2">
              @if (quiz.attempt) {
                <button (click)="reviewAttempt(quiz, quiz.attempt)" class="bg-sky-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-600 transition-colors text-sm">
                  Revisar
                </button>
              } @else {
                <button (click)="takeQuiz(quiz)" class="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                  Fazer Prova
                </button>
              }
            </div>
          </div>
        }
        @if (courseQuizzesWithAttempts().length === 0) {
           <div class="text-center py-10 px-6 bg-slate-50 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <h3 class="mt-2 text-lg font-semibold text-slate-900">Nenhuma prova disponível</h3>
              <p class="mt-1 text-sm text-slate-500">Ainda não há provas para este curso.</p>
            </div>
        }
      </div>
    </div>

    @if (quizToTake()) {
      <app-student-quiz-modal 
        [quiz]="quizToTake()!" 
        (close)="quizToTake.set(null)"
        (submitQuiz)="handleQuizSubmit($event)"
      />
    }

    @if (attemptToReview()) {
      <app-student-quiz-review-modal 
        [quiz]="attemptToReview()!.quiz"
        [attempt]="attemptToReview()!.attempt"
        (close)="attemptToReview.set(null)"
      />
    }
  `,
  imports: [StudentQuizModalComponent, StudentQuizReviewModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentCourseGradesComponent {
  course = input.required<Course>();
  student = input.required<Student>();

  private quizService = inject(QuizService);

  private courseQuizzes = computed(() => {
    return this.quizService.getQuizzesForCourse(this.course().id)
      .filter(quiz => quiz.status === 'active');
  });

  private studentAttempts = computed(() => this.quizService.getAttemptsForStudent(this.student().id));
  
  courseQuizzesWithAttempts = computed(() => {
    const attemptsMap = new Map(this.studentAttempts().map(a => [a.quizId, a]));
    return this.courseQuizzes().map(quiz => ({
      ...quiz,
      attempt: attemptsMap.get(quiz.id) || null
    }));
  });

  averageGrade = computed<number | null>(() => {
    const attempts = this.studentAttempts().filter(attempt => this.courseQuizzes().some(q => q.id === attempt.quizId));
    if (attempts.length === 0) return null;
    const totalScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
    return Math.round(totalScore / attempts.length);
  });

  // Modal State
  quizToTake = signal<Quiz | null>(null);
  attemptToReview = signal<{ quiz: Quiz, attempt: QuizAttempt } | null>(null);

  takeQuiz(quiz: Quiz) {
    this.quizToTake.set(quiz);
  }

  reviewAttempt(quiz: Quiz, attempt: QuizAttempt) {
    this.attemptToReview.set({ quiz, attempt });
  }

  handleQuizSubmit(result: { quizId: number, answers: StudentAnswer[] }) {
    this.quizService.submitStudentAttempt(
      this.student().id,
      result.quizId,
      result.answers
    );
    this.quizToTake.set(null);
  }
}