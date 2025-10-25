import { Component, ChangeDetectionStrategy, input, output, signal, effect } from '@angular/core';
import { Student } from '../../models/student.model';
import { ManualGrade } from '../../models/grade.model';

@Component({
  selector: 'app-manual-grade-modal',
  templateUrl: './manual-grade-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManualGradeModalComponent {
  students = input.required<Student[]>();
  courseId = input.required<number>();
  grade = input<ManualGrade | null>(null);

  close = output<void>();
  save = output<Omit<ManualGrade, 'id'> | ManualGrade>();

  // Form State
  selectedStudentId = signal<number | null>(null);
  title = signal('');
  score = signal(0);

  isEditing = signal(false);

  constructor() {
    effect(() => {
      const g = this.grade();
      if (g) {
        this.isEditing.set(true);
        this.selectedStudentId.set(g.studentId);
        this.title.set(g.title);
        this.score.set(g.score);
      } else {
        this.isEditing.set(false);
        this.selectedStudentId.set(null);
        this.title.set('');
        this.score.set(0);
      }
    });
  }
  
  onSave() {
    if (this.selectedStudentId() === null || !this.title().trim() || this.score() < 0 || this.score() > 100) {
      alert('Por favor, preencha todos os campos com valores válidos.');
      return;
    }
    
    const gradeData = {
      studentId: this.selectedStudentId()!,
      courseId: this.courseId(),
      title: this.title(),
      score: this.score(),
    };

    if (this.isEditing()) {
      this.save.emit({ ...gradeData, id: this.grade()!.id });
    } else {
      this.save.emit(gradeData);
    }
  }
}
