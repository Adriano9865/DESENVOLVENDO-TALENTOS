import { StudentView } from '../components/student-menu/student-menu.component';

// Tipos de notificação para eventos que não são anúncios gerais
export type AppNotificationType =
  | 'enrollment'
  | 'lesson'
  | 'quiz'
  | 'grade'
  | 'material'
  | 'presence';

// A visualização de destino é um dos itens do menu do aluno, excluindo avisos (tratados separadamente) e perfil (sem notificações).
export type AppNotificationTargetView = Exclude<StudentView, 'announcements' | 'profile'>;

export interface AppNotification {
  id: number;
  studentId: number;
  type: AppNotificationType;
  targetView: AppNotificationTargetView;
  message: string; // Isso pode ser útil para um futuro feed de notificações
  isRead: boolean;
  createdAt: string; // string de data ISO
}
