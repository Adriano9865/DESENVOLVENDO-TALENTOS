export interface AttendanceRecord {
  id: string; // Composite key: studentId-date
  studentId: number;
  date: string; // YYYY-MM-DD
  status: 'present' | 'absent';
  justification?: string;
}
