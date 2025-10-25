import { Component, ChangeDetectionStrategy, input, computed, inject, signal } from '@angular/core';
import { Student } from '../../models/student.model';
import { Announcement } from '../../models/announcement.model';
import { AnnouncementService } from '../../services/announcement.service';
import { Course } from '../../models/course.model';

interface DisplayAnnouncement extends Announcement {
    courseName: string | null;
    isRead: boolean;
}

@Component({
  selector: 'app-student-announcements-view',
  templateUrl: './student-announcements-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentAnnouncementsViewComponent {
  student = input.required<Student>();
  courses = input.required<Course[]>();

  private announcementService = inject(AnnouncementService);
  
  // Modal State
  announcementToView = signal<DisplayAnnouncement | null>(null);

  private coursesMap = computed(() => {
    const map = new Map<number, string>();
    for (const course of this.courses()) {
      map.set(course.id, course.title);
    }
    return map;
  });

  private readAnnouncementIds = computed(() => {
    return this.announcementService.getReadAnnouncementIdsForStudent(this.student().id);
  });

  announcements = computed<DisplayAnnouncement[]>(() => {
      const studentAnnouncements = this.announcementService.getAnnouncementsForStudent(this.student());
      const courseMap = this.coursesMap();
      const readIds = this.readAnnouncementIds();

      return studentAnnouncements.map(a => ({
          ...a,
          courseName: a.courseId === 'all' ? 'Aviso Geral' : courseMap.get(a.courseId as number) || null,
          isRead: readIds.has(a.id),
      }));
  });

  openAnnouncement(announcement: DisplayAnnouncement) {
      this.announcementToView.set(announcement);
      // Mark as read when the student opens it
      if (!announcement.isRead) {
          this.announcementService.markAsRead(announcement.id, this.student().id);
      }
  }

  closeModal() {
      this.announcementToView.set(null);
  }

   formatDate(isoString: string): string {
      const date = new Date(isoString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) return 'hoje';
      if (diffDays <= 2) return 'ontem';
      if (diffDays <= 7) return `há ${diffDays-1} dias`;
      
      return new Date(isoString).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long'
      });
  }
}
