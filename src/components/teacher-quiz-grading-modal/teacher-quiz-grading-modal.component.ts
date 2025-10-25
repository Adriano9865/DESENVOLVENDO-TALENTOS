import { Component, ChangeDetectionStrategy, computed, inject, input, output, signal } from '@angular/core';
import { Course } from '../../models/course.model';
import { Student } from '../../models/student.model';
import { Quiz, QuizAttempt, StudentAnswer, Question } from '../../models/quiz.model';
import { StudentService } from '../../services/student.service';
import { QuizService } from '../../services/quiz.service';
import { NotificationService } from '../../services/notification.service';

interface GradedAttempt extends QuizAttempt {
  studentName: string;
}

interface EditableAnswer extends StudentAnswer {
    editedScore: number;
}

interface EditableAttempt extends GradedAttempt {
    answers: EditableAnswer[];
}


@Component({
  selector: 'app-teacher-quiz-grading-modal',
  templateUrl: './teacher-quiz-grading-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherQuizGradingModalComponent {
  quiz = input.required<Quiz>();
  course = input.required<Course>();
  close = output<void>();

  private studentService = inject(StudentService);
  private quizService = inject(QuizService);
  private notificationService = inject(NotificationService);

  private students = computed(() => this.studentService.getEnrolledStudentsForCourse(this.course().id));
  private studentMap = computed(() => {
    const map = new Map<number, Student>();
    this.students().forEach(s => map.set(s.id, s));
    return map;
  });

  quizAttempts = computed<GradedAttempt[]>(() => {
    const attempts = this.quizService.getAttemptsForQuiz(this.quiz().id);
    const studentMap = this.studentMap();
    return attempts.map(attempt => ({
      ...attempt,
      studentName: studentMap.get(attempt.studentId)?.fullName || 'Aluno desconhecido'
    }));
  });

  expandedStudentId = signal<number | null>(null);
  editedAttempt = signal<EditableAttempt | null>(null);

  toggleStudent(attempt: GradedAttempt) {
    if (this.expandedStudentId() === attempt.studentId) {
      this.expandedStudentId.set(null);
      this.editedAttempt.set(null);
    } else {
      this.expandedStudentId.set(attempt.studentId);
      // Create a deep copy for editing
      this.editedAttempt.set({
          ...attempt,
          answers: attempt.answers.map(a => ({...a, editedScore: a.score }))
      });
    }
  }

  updateAnswerScore(questionId: number, newScore: number) {
      this.editedAttempt.update(attempt => {
          if (!attempt) return null;
          const newAnswers = attempt.answers.map(answer => {
              if (answer.questionId === questionId) {
                  const question = this.getQuestion(questionId);
                  const maxPoints = question?.points || 0;
                  const clampedScore = Math.max(0, Math.min(newScore, maxPoints));
                  return { ...answer, editedScore: clampedScore };
              }
              return answer;
          });
          return { ...attempt, answers: newAnswers };
      });
  }

  saveGrading() {
      const attempt = this.editedAttempt();
      if (!attempt) return;

      const totalQuizPoints = this.quiz().questions.reduce((sum, q) => sum + q.points, 0);
      
      const finalAnswers = attempt.answers.map(a => ({
          questionId: a.questionId,
          answer: a.answer,
          isCorrect: a.isCorrect,
          score: a.editedScore
      }));

      const newTotalScore = finalAnswers.reduce((sum, a) => sum + a.score, 0);
      const newPercentage = totalQuizPoints > 0 ? Math.round((newTotalScore / totalQuizPoints) * 100) : 0;

      const updatedAttempt: QuizAttempt = {
          studentId: attempt.studentId,
          quizId: attempt.quizId,
          score: newPercentage,
          answers: finalAnswers,
          isGraded: true,
      };

      this.quizService.updateAttempt(updatedAttempt);
      
      // Notify student
      this.notificationService.addNotification(
        [updatedAttempt.studentId],
        'grade',
        'courses',
        `Sua nota para a prova "${this.quiz().title}" foi atualizada.`
      );
      
      this.expandedStudentId.set(null);
      this.editedAttempt.set(null);
  }
  
  getQuestion(questionId: number): Question | undefined {
    return this.quiz().questions.find(q => q.id === questionId);
  }
}
