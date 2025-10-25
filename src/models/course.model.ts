export type UserRole = 'student' | 'teacher';

export interface Course {
  id: number;
  title: string;
  instructor: string;
  description: string;
  imageUrl: string;
  isTeacherCourse?: boolean;
  status: 'active' | 'inactive';
}