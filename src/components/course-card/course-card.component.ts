import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { Course, UserRole } from '../../models/course.model';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
})
export class CourseCardComponent {
  course = input.required<Course>();
  role = input.required<UserRole>();
  isEnrolled = input<boolean>(false);
  priority = input<boolean>(false);
  manage = output<Course>();
  view = output<Course>();

  onViewClick(event: MouseEvent) {
    event.stopPropagation();
    this.view.emit(this.course());
  }

  onCardClick() {
    if (this.role() === 'teacher') {
      this.manage.emit(this.course());
    } else if (this.isEnrolled()) {
      this.view.emit(this.course());
    }
  }
}
