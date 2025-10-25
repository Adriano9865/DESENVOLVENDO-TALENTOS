export interface Lesson {
  id: number;
  courseId: number;
  title: string;
  duration: number; // in minutes
  type: 'video' | 'pdf' | 'text';
  content: string; // URL for video/pdf, or markdown text for 'text'
}
