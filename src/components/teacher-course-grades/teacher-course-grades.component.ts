import { Component, ChangeDetectionStrategy, input, computed, inject, signal } from '@angular/core';
import { Course } from '../../models/course.model';
import { Student } from '../../models/student.model';
import { Quiz, QuizAttempt } from '../../models/quiz.model';
import { StudentService } from '../../services/student.service';
import { QuizService } from '../../services/quiz.service';
import { ManualGrade } from '../../models/grade.model';
import { GradeService } from '../../services/grade.service';
import { ManualGradeModalComponent } from '../manual-grade-modal/manual-grade-modal.component';
import { NotificationService } from '../../services/notification.service';

type GradeItem = 
  | { type: 'quiz'; data: QuizAttempt & { quizTitle: string } }
  | { type: 'manual'; data: ManualGrade };

interface StudentGradeInfo {
  student: Student;
  grades: GradeItem[];
  averageGrade: number | null;
}

@Component({
  selector: 'app-teacher-course-grades',
  templateUrl: './teacher-course-grades.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ManualGradeModalComponent],
})
export class TeacherCourseGradesComponent {
  course = input.required<Course>();

  private studentService = inject(StudentService);
  private quizService = inject(QuizService);
  private gradeService = inject(GradeService);
  private notificationService = inject(NotificationService);

  private courseQuizzes = computed(() => this.quizService.getQuizzesForCourse(this.course().id));
  enrolledStudents = computed(() => this.studentService.getEnrolledStudentsForCourse(this.course().id));

  studentGrades = computed<StudentGradeInfo[]>(() => {
    const courseQuizzes = this.courseQuizzes();
    const courseQuizIds = new Set(courseQuizzes.map(q => q.id));
    const allManualGrades = this.gradeService.manualGrades();

    return this.enrolledStudents().map(student => {
      // Quiz attempts
      const studentAttempts = this.quizService.getAttemptsForStudent(student.id);
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
      const studentManualGrades = allManualGrades
          .filter(grade => grade.studentId === student.id && grade.courseId === this.course().id)
          .map(grade => ({ type: 'manual' as const, data: grade }));

      const allGrades: GradeItem[] = [...relevantAttempts, ...studentManualGrades];
      
      const totalScore = allGrades.reduce((sum, grade) => sum + grade.data.score, 0);
      const averageGrade = allGrades.length > 0 ? Math.round(totalScore / allGrades.length) : null;

      return {
        student,
        grades: allGrades,
        averageGrade
      };
    });
  });
  
  // Filter state
  filteredStudentId = signal<number | 'all'>('all');
  
  filteredStudentGrades = computed(() => {
    const studentId = this.filteredStudentId();
    if (studentId === 'all') {
      return this.studentGrades();
    }
    return this.studentGrades().filter(info => info.student.id === studentId);
  });

  updateFilter(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.filteredStudentId.set(value === 'all' ? 'all' : Number(value));
  }
  
  // Modal State
  isManualGradeModalOpen = signal(false);
  manualGradeToEdit = signal<ManualGrade | null>(null);

  openAddManualGradeModal() {
    this.manualGradeToEdit.set(null);
    this.isManualGradeModalOpen.set(true);
  }

  openEditManualGradeModal(grade: ManualGrade) {
    this.manualGradeToEdit.set(grade);
    this.isManualGradeModalOpen.set(true);
  }
  
  deleteManualGrade(gradeId: number) {
    this.gradeService.deleteGrade(gradeId);
  }

  saveManualGrade(gradeData: Omit<ManualGrade, 'id'> | ManualGrade) {
    this.gradeService.addOrUpdateGrade(gradeData);

    // Notify student
    const studentId = 'id' in gradeData ? gradeData.studentId : gradeData.studentId;
    this.notificationService.addNotification(
      [studentId],
      'grade',
      'courses',
      `Você recebeu uma nova nota em ${this.course().title}: "${gradeData.title}".`
    );
    
    this.isManualGradeModalOpen.set(false);
  }
}
