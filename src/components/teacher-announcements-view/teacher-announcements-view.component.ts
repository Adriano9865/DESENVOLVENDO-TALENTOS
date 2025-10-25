import { Component, ChangeDetectionStrategy, input, computed, output, inject } from '@angular/core';
import { Course } from '../../models/course.model';
import { Announcement } from '../../models/announcement.model';
import { AnnouncementService } from '../../services/announcement.service';

interface DisplayAnnouncement extends Announcement {
    courseName: string;
}

@Component({
  selector: 'app-teacher-announcements-view',
  templateUrl: './teacher-announcements-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherAnnouncementsViewComponent {
  courses = input.required<Course[]>();
  addAnnouncement = output<void>();
  editAnnouncement = output<Announcement>();

  private announcementService = inject(AnnouncementService);

  private coursesMap = computed(() => {
    const map = new Map<number, string>();
    for (const course of this.courses()) {
      map.set(course.id, course.title);
    }
    return map;
  });

  announcements = computed<DisplayAnnouncement[]>(() => {
    const courseMap = this.coursesMap();
    return this.announcementService.announcements()
      .map(a => ({
          ...a,
          courseName: a.courseId === 'all' ? 'Todos os Alunos' : courseMap.get(a.courseId) || 'Curso Desconhecido'
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });

  onAddAnnouncement() {
    this.addAnnouncement.emit();
  }
  
  onEditAnnouncement(announcement: Announcement) {
    this.editAnnouncement.emit(announcement);
  }

  formatDate(isoString: string): string {
      return new Date(isoString).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
      });
  }
}
