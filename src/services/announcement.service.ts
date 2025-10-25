import { Injectable, signal } from '@angular/core';
import { Announcement } from '../models/announcement.model';
import { Student } from '../models/student.model';
import { AnnouncementReadReceipt } from '../models/announcement-read-receipt.model';

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: 1, title: 'Boas-vindas ao Novo Semestre!', content: 'Olá a todos! Bem-vindos de volta. Esperamos que tenham tido ótimas férias e estejam prontos para um semestre de muito aprendizado.', courseId: 'all', createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: 2, title: 'Aula de Angular Adiada', content: 'Atenção, alunos de "Angular para Iniciantes": a aula de amanhã foi adiada para a próxima semana devido a um imprevisto. Agradecemos a compreensão.', courseId: 1, createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 3, title: 'Novo Material Disponível!', content: 'Um novo e-book sobre UI/UX foi adicionado à biblioteca do curso de Fundamentos de Design. Não deixem de conferir!', courseId: 4, createdAt: new Date().toISOString() },
];


@Injectable({ providedIn: 'root' })
export class AnnouncementService {
  private _announcements = signal<Announcement[]>(MOCK_ANNOUNCEMENTS);
  private _readReceipts = signal<AnnouncementReadReceipt[]>([]);

  public readonly announcements = this._announcements.asReadonly();
  public readonly readReceipts = this._readReceipts.asReadonly();

  getAnnouncementsForStudent(student: Student): Announcement[] {
    const studentCourseIds = new Set(student.enrolledCourseIds);
    return this._announcements()
      .filter(a => a.courseId === 'all' || studentCourseIds.has(a.courseId as number))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  addAnnouncement(announcement: Omit<Announcement, 'id' | 'createdAt'>) {
    const newAnnouncement: Announcement = {
      ...announcement,
      id: this._announcements().length > 0 ? Math.max(...this._announcements().map(a => a.id)) + 1 : 1,
      createdAt: new Date().toISOString()
    };
    this._announcements.update(announcements => [newAnnouncement, ...announcements]);
  }

  updateAnnouncement(updatedAnnouncement: Announcement) {
    this._announcements.update(announcements => 
      announcements.map(a => a.id === updatedAnnouncement.id ? updatedAnnouncement : a)
    );
  }

  deleteAnnouncement(announcementId: number) {
    this._announcements.update(announcements => announcements.filter(a => a.id !== announcementId));
    // Also delete associated read receipts
    this._readReceipts.update(receipts => receipts.filter(r => r.announcementId !== announcementId));
  }
  
  // --- Read Receipt Methods ---

  markAsRead(announcementId: number, studentId: number) {
    const receiptExists = this._readReceipts().some(r => r.announcementId === announcementId && r.studentId === studentId);
    if (!receiptExists) {
        const newReceipt: AnnouncementReadReceipt = {
            announcementId,
            studentId,
            readAt: new Date().toISOString(),
        };
        this._readReceipts.update(receipts => [...receipts, newReceipt]);
    }
  }
  
  markAllAsRead(student: Student) {
    const announcementsForStudent = this.getAnnouncementsForStudent(student);
    announcementsForStudent.forEach(announcement => {
      this.markAsRead(announcement.id, student.id);
    });
  }

  getReceiptsForAnnouncement(announcementId: number): AnnouncementReadReceipt[] {
      return this._readReceipts().filter(r => r.announcementId === announcementId);
  }

  getReadAnnouncementIdsForStudent(studentId: number): Set<number> {
      const ids = this._readReceipts()
          .filter(r => r.studentId === studentId)
          .map(r => r.announcementId);
      return new Set(ids);
  }
}