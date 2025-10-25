import { Injectable, signal } from '@angular/core';
import { AttendanceRecord } from '../models/attendance.model';

// Helper to get today's date in YYYY-MM-DD format
const toYYYYMMDD = (date: Date) => date.toISOString().split('T')[0];

const MOCK_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  { id: `1-${toYYYYMMDD(new Date(Date.now() - 86400000 * 2))}`, studentId: 1, date: toYYYYMMDD(new Date(Date.now() - 86400000 * 2)), status: 'present' },
  { id: `1-${toYYYYMMDD(new Date(Date.now() - 86400000 * 1))}`, studentId: 1, date: toYYYYMMDD(new Date(Date.now() - 86400000 * 1)), status: 'absent', justification: 'Consulta médica.' },
  { id: `2-${toYYYYMMDD(new Date(Date.now() - 86400000 * 2))}`, studentId: 2, date: toYYYYMMDD(new Date(Date.now() - 86400000 * 2)), status: 'present' },
  { id: `2-${toYYYYMMDD(new Date(Date.now() - 86400000 * 1))}`, studentId: 2, date: toYYYYMMDD(new Date(Date.now() - 86400000 * 1)), status: 'present' },
];

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private _records = signal<AttendanceRecord[]>(MOCK_ATTENDANCE_RECORDS);
  public readonly records = this._records.asReadonly();

  getRecordsForStudent(studentId: number): AttendanceRecord[] {
    return this._records().filter(record => record.studentId === studentId);
  }

  addOrUpdateRecord(recordData: Omit<AttendanceRecord, 'id'>) {
    const newRecord: AttendanceRecord = {
      ...recordData,
      id: `${recordData.studentId}-${recordData.date}`,
    };

    this._records.update(records => {
      const existingIndex = records.findIndex(r => r.id === newRecord.id);
      if (existingIndex > -1) {
        const updatedRecords = [...records];
        updatedRecords[existingIndex] = newRecord;
        return updatedRecords;
      }
      return [...records, newRecord];
    });
  }

  deleteRecord(recordId: string) {
    this._records.update(records => records.filter(r => r.id !== recordId));
  }
}