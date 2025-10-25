import { Component, ChangeDetectionStrategy, input, computed, inject, signal } from '@angular/core';
import { Course } from '../../models/course.model';
import { Lesson } from '../../models/lesson.model';
import { LessonService } from '../../services/lesson.service';
import { StudentService } from '../../services/student.service';
import { NotificationService } from '../../services/notification.service';

type ModalMode = 'add' | 'edit';
type LessonType = 'video' | 'pdf' | 'text';

@Component({
  selector: 'app-teacher-course-lessons',
  templateUrl: './teacher-course-lessons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherCourseLessonsComponent {
  course = input.required<Course>();

  private lessonService = inject(LessonService);
  private studentService = inject(StudentService);
  private notificationService = inject(NotificationService);
  
  courseLessons = computed(() => {
    return this.lessonService.getLessonsForCourse(this.course().id);
  });

  // Modal State
  isModalOpen = signal(false);
  modalMode = signal<ModalMode>('add');
  lessonToEdit = signal<Lesson | null>(null);

  // Form Signals
  lessonTitle = signal('');
  lessonDuration = signal(0);
  lessonType = signal<LessonType>('video');
  lessonContent = signal('');


  openAddModal() {
    this.modalMode.set('add');
    this.lessonToEdit.set(null);
    this.lessonTitle.set('');
    this.lessonDuration.set(10);
    this.lessonType.set('video');
    this.lessonContent.set('');
    this.isModalOpen.set(true);
  }

  openEditModal(lesson: Lesson) {
    this.modalMode.set('edit');
    this.lessonToEdit.set(lesson);
    this.lessonTitle.set(lesson.title);
    this.lessonDuration.set(lesson.duration);
    this.lessonType.set(lesson.type);
    this.lessonContent.set(lesson.content);
    this.isModalOpen.set(true);
  }

  onDeleteLesson(lessonId: number) {
    this.lessonService.deleteLesson(lessonId);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  updateField(field: 'title' | 'duration' | 'content', value: string) {
    switch(field) {
      case 'title': this.lessonTitle.set(value); break;
      case 'duration': this.lessonDuration.set(Number(value)); break;
      case 'content': this.lessonContent.set(value); break;
    }
  }

  updateType(event: Event) {
    this.lessonType.set((event.target as HTMLSelectElement).value as LessonType);
  }

  saveLesson() {
    if (!this.lessonTitle() || this.lessonDuration() <= 0 || !this.lessonContent().trim()) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const lessonData = {
      courseId: this.course().id,
      title: this.lessonTitle(),
      duration: this.lessonDuration(),
      type: this.lessonType(),
      content: this.lessonContent(),
    };

    if (this.modalMode() === 'add') {
      this.lessonService.addLesson(lessonData);
      // Notify students
      const enrolledStudents = this.studentService.getEnrolledStudentsForCourse(this.course().id);
      const studentIds = enrolledStudents.map(s => s.id);
      if (studentIds.length > 0) {
          this.notificationService.addNotification(
              studentIds,
              'lesson',
              'courses',
              `Nova aula adicionada em ${this.course().title}: ${this.lessonTitle()}`
          );
      }
    } else {
      const lesson = this.lessonToEdit();
      if (lesson) {
        this.lessonService.updateLesson({
          ...lesson,
          ...lessonData,
        });
      }
    }
    this.closeModal();
  }
}
