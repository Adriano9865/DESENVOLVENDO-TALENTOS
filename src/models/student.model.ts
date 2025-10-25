export interface Student {
  id: number;
  fullName: string;
  whatsapp: string;
  login: string; // 4-digit numeric string
  password: string; // 4-digit numeric string
  status: 'active' | 'inactive';
  enrolledCourseIds: number[];
}