import { Component, ChangeDetectionStrategy, computed, input, inject } from '@angular/core';
import { Student } from '../../models/student.model';
import { Course } from '../../models/course.model';
import { QuizService } from '../../services/quiz.service';
import { GradeService } from '../../services/grade.service';
import { ManualGrade } from '../../models/grade.model';
import { QuizAttempt } from '../../models/quiz.model';

type GradeItem = 
  | { type: 'quiz'; data: QuizAttempt & { quizTitle: string } }
  | { type: 'manual'; data: ManualGrade };

@Component({
  selector: 'app-student-grades-view',
  templateUrl: './student-grades-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentGradesViewComponent {
  student = input.required<Student>();
  course = input.required<Course>();

  private quizService = inject(QuizService);
  private gradeService = inject(GradeService);

  private courseQuizzes = computed(() => this.quizService.getQuizzesForCourse(this.course().id));
  
  gradeItems = computed<GradeItem[]>(() => {
    const courseQuizzes = this.courseQuizzes();
    const courseQuizIds = new Set(courseQuizzes.map(q => q.id));
    
    // Quiz attempts
    const studentAttempts = this.quizService.getAttemptsForStudent(this.student().id);
    const relevantAttempts = studentAttempts
      .filter(attempt => courseQuizIds.has(attempt.quizId))
      .map(attempt => ({
          type: 'quiz' as const,
          data: {
            ...attempt,
            quizTitle: courseQuizzes.find(q => q.id === attempt.quizId)?.title || 'Prova desconhecida'
          }
      }));

    // Manual grades
    const allManualGrades = this.gradeService.manualGrades();
    const studentManualGrades = allManualGrades
        .filter(grade => grade.studentId === this.student().id && grade.courseId === this.course().id)
        .map(grade => ({ type: 'manual' as const, data: grade }));

    return [...relevantAttempts, ...studentManualGrades];
  });

  averageGrade = computed<number | null>(() => {
    const grades = this.gradeItems();
    if (grades.length === 0) return null;
    const totalScore = grades.reduce((sum, grade) => sum + grade.data.score, 0);
    return Math.round(totalScore / grades.length);
  });
}
