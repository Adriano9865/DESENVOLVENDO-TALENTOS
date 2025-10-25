import { Component, ChangeDetectionStrategy, computed, inject, input, signal, effect } from '@angular/core';
import { Student } from '../../models/student.model';
import { AttendanceService } from '../../services/attendance.service';
import { AttendanceRecord } from '../../models/attendance.model';

type Status = 'present' | 'absent';

const toYYYYMMDD = (date: Date) => date.toISOString().split('T')[0];

@Component({
  selector: 'app-student-attendance-view',
  templateUrl: './student-attendance-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentAttendanceViewComponent {
  student = input.required<Student>();

  private attendanceService = inject(AttendanceService);

  // Component State
  selectedDate = signal<string>(toYYYYMMDD(new Date()));
  selectedStatus = signal<Status>('present');
  justification = signal('');
  saveSuccess = signal(false);

  // Modal State for deletion
  isDeleteModalOpen = signal(false);
  recordToDelete = signal<AttendanceRecord | null>(null);

  // Data from Service
  studentRecords = computed(() => {
    return this.attendanceService.getRecordsForStudent(this.student().id)
      .sort((a, b) => b.date.localeCompare(a.date)); // Sort by most recent
  });

  // Derived State
  currentRecordForSelectedDate = computed(() => {
    const selected = this.selectedDate();
    return this.studentRecords().find(r => r.date === selected);
  });

  isJustificationRequired = computed(() => this.selectedStatus() === 'absent');

  canSubmit = computed(() => {
    if (this.isJustificationRequired()) {
      return this.justification().trim().length > 0;
    }
    return true;
  });
  
  constructor() {
      // When the selected date changes, update the form state based on existing records
      effect(() => {
          const record = this.currentRecordForSelectedDate();
          if (record) {
              this.selectedStatus.set(record.status);
              this.justification.set(record.justification || '');
          } else {
              this.selectedStatus.set('present');
              this.justification.set('');
          }
      });
  }

  onDateChange(event: Event) {
    const newDate = (event.target as HTMLInputElement).value;
    this.selectedDate.set(newDate);
    this.saveSuccess.set(false);
  }

  onStatusChange(status: Status) {
    this.selectedStatus.set(status);
  }

  onJustificationChange(event: Event) {
    this.justification.set((event.target as HTMLTextAreaElement).value);
  }

  onSubmit() {
    if (!this.canSubmit()) return;

    const record: Omit<AttendanceRecord, 'id'> = {
      studentId: this.student().id,
      date: this.selectedDate(),
      status: this.selectedStatus(),
      justification: this.isJustificationRequired() ? this.justification() : undefined,
    };
    
    this.attendanceService.addOrUpdateRecord(record);
    this.saveSuccess.set(true);
    setTimeout(() => this.saveSuccess.set(false), 3000);
  }

  // New methods for deletion
  openDeleteModal(record: AttendanceRecord) {
      this.recordToDelete.set(record);
      this.isDeleteModalOpen.set(true);
  }

  confirmDelete() {
      const record = this.recordToDelete();
      if (record) {
          this.attendanceService.deleteRecord(record.id);
      }
      this.closeDeleteModal();
  }

  closeDeleteModal() {
      this.recordToDelete.set(null);
      this.isDeleteModalOpen.set(false);
  }
}