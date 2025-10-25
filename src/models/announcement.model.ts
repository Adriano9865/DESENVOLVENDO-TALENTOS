export interface Announcement {
  id: number;
  title: string;
  content: string;
  courseId: number | 'all'; // 'all' for every student
  createdAt: string; // ISO Date string
}
