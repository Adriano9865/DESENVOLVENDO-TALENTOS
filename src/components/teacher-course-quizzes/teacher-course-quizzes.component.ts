import { Component, ChangeDetectionStrategy, computed, inject, input, signal } from '@angular/core';
import { Course } from '../../models/course.model';
import { Quiz } from '../../models/quiz.model';
import { QuizService } from '../../services/quiz.service';
import { TeacherQuizFormComponent } from '../teacher-quiz-form/teacher-quiz-form.component';
import { TeacherQuizGradingModalComponent } from '../teacher-quiz-grading-modal/teacher-quiz-grading-modal.component';
import { StudentService } from '../../services/student.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-teacher-course-quizzes',
  imports: [TeacherQuizFormComponent, TeacherQuizGradingModalComponent],
  templateUrl: './teacher-course-quizzes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherCourseQuizzesComponent {
  course = input.required<Course>();

  private quizService = inject(QuizService);
  private studentService = inject(StudentService);
  private notificationService = inject(NotificationService);

  courseQuizzes = computed(() => this.quizService.getQuizzesForCourse(this.course().id));
  
  isQuizFormModalOpen = signal(false);
  quizToEdit = signal<Quiz | null>(null);
  quizToGrade = signal<Quiz | null>(null);

  openAddForm() {
    this.quizToEdit.set(null);
    this.isQuizFormModalOpen.set(true);
  }

  openEditForm(quiz: Quiz) {
    this.quizToEdit.set(quiz);
    this.isQuizFormModalOpen.set(true);
  }

  closeForm() {
    this.quizToEdit.set(null);
    this.isQuizFormModalOpen.set(false);
  }

  onSaveQuiz(quizData: Omit<Quiz, 'id' | 'status'> | Quiz) {
    if ('id' in quizData) {
      this.quizService.updateQuiz(quizData);
    } else {
      this.quizService.addQuiz(quizData);
       // Notify students of new quiz
       const enrolledStudents = this.studentService.getEnrolledStudentsForCourse(this.course().id);
       const studentIds = enrolledStudents.map(s => s.id);
       if (studentIds.length > 0) {
         this.notificationService.addNotification(
           studentIds,
           'quiz',
           'courses',
           `Nova prova disponível em ${this.course().title}: ${quizData.title}`
         );
       }
    }
    this.closeForm();
  }

  onDeleteQuiz(quizId: number) {
    this.quizService.deleteQuiz(quizId);
  }

  openGradingModal(quiz: Quiz) {
    this.quizToGrade.set(quiz);
  }

  onToggleStatus(quiz: Quiz) {
    this.quizService.toggleQuizStatus(quiz.id);
  }
}
