import { Component, ChangeDetectionStrategy, computed, inject, input, signal } from '@angular/core';
import { Student } from '../../models/student.model';
import { AttendanceService } from '../../services/attendance.service';
import { AttendanceRecord } from '../../models/attendance.model';

const toYYYYMMDD = (date: Date) => date.toISOString().split('T')[0];

interface AttendanceViewRecord extends AttendanceRecord {
    studentName: string;
}

@Component({
  selector: 'app-teacher-attendance-view',
  templateUrl: './teacher-attendance-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherAttendanceViewComponent {
  students = input.required<Student[]>();

  private attendanceService = inject(AttendanceService);
  private studentMap = computed(() => new Map(this.students().map(s => [s.id, s.fullName])));

  // Filter State
  selectedStudentId = signal<number | 'all'>('all');
  startDate = signal<string>(toYYYYMMDD(new Date(Date.now() - 7 * 86400000))); // Default to last 7 days
  endDate = signal<string>(toYYYYMMDD(new Date()));

  // Data
  allRecords = computed<AttendanceViewRecord[]>(() => {
    const studentMap = this.studentMap();
    return this.attendanceService.records()
        .map(record => ({
            ...record,
            studentName: studentMap.get(record.studentId) || 'Aluno Desconhecido'
        }))
        .sort((a, b) => b.date.localeCompare(a.date) || a.studentName.localeCompare(b.studentName));
  });

  filteredRecords = computed<AttendanceViewRecord[]>(() => {
      const studentId = this.selectedStudentId();
      const start = this.startDate();
      const end = this.endDate();
      
      return this.allRecords().filter(record => {
          const studentMatch = studentId === 'all' || record.studentId === studentId;
          const dateMatch = record.date >= start && record.date <= end;
          return studentMatch && dateMatch;
      });
  });
  
  summary = computed(() => {
      const records = this.filteredRecords();
      if (records.length === 0) {
          return { total: 0, present: 0, absent: 0, percentage: 0 };
      }
      
      const presentCount = records.filter(r => r.status === 'present').length;
      const totalCount = records.length;
      const absentCount = totalCount - presentCount;
      const percentage = Math.round((presentCount / totalCount) * 100);
      
      return { total: totalCount, present: presentCount, absent: absentCount, percentage: percentage };
  });

  onStudentFilterChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedStudentId.set(value === 'all' ? 'all' : Number(value));
  }

  onDateChange(type: 'start' | 'end', event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (type === 'start') {
      this.startDate.set(value);
    } else {
      this.endDate.set(value);
    }
  }
}
