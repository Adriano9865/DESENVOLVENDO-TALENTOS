import { Injectable, signal } from '@angular/core';
import { AppNotification, AppNotificationTargetView, AppNotificationType } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _notifications = signal<AppNotification[]>([]);
  private nextId = 1;

  addNotification(
    studentIds: number[],
    type: AppNotificationType,
    targetView: AppNotificationTargetView,
    message: string
  ): void {
    const newNotifications: AppNotification[] = studentIds.map(studentId => ({
      id: this.nextId++,
      studentId,
      type,
      targetView,
      message,
      isRead: false,
      createdAt: new Date().toISOString(),
    }));

    this._notifications.update(existing => [...existing, ...newNotifications]);
  }

  getUnreadCountsByView(studentId: number): Partial<Record<AppNotificationTargetView, number>> {
    const counts: Partial<Record<AppNotificationTargetView, number>> = {};
    const unread = this._notifications().filter(n => n.studentId === studentId && !n.isRead);

    for (const notification of unread) {
      counts[notification.targetView] = (counts[notification.targetView] || 0) + 1;
    }

    return counts;
  }

  markViewAsRead(studentId: number, view: AppNotificationTargetView): void {
    this._notifications.update(notifications =>
      notifications.map(n =>
        n.studentId === studentId && n.targetView === view ? { ...n, isRead: true } : n
      )
    );
  }
}
