import { AttendanceRecord, AttendanceStatus, Student, Class } from '@prisma/client';

// Base attendance record data interface
export interface AttendanceRecordData {
  id: string;
  studentId: string;
  classId: string | null;
  date: Date;
  status: AttendanceStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Attendance record with relations
export interface AttendanceRecordWithStudent extends AttendanceRecord {
  student: Student;
}

export interface AttendanceRecordWithClass extends AttendanceRecord {
  class: Class | null;
}

export interface AttendanceRecordWithRelations extends AttendanceRecord {
  student: Student;
  class: Class | null;
}

// DTOs for creating and updating attendance records
export interface CreateAttendanceRecordData {
  studentId: string;
  classId?: string | null;
  date: Date;
  status: AttendanceStatus;
}

export interface UpdateAttendanceRecordData {
  status?: AttendanceStatus;
  classId?: string | null;
}

// Bulk attendance operations
export interface BulkAttendanceData {
  classId: string;
  date: Date;
  attendanceRecords: Array<{
    studentId: string;
    status: AttendanceStatus;
  }>;
}

// Query interface for filtering and pagination
export interface AttendanceQuery {
  page?: number;
  limit?: number;
  studentId?: string;
  classId?: string;
  date?: Date;
  status?: AttendanceStatus;
  startDate?: Date;
  endDate?: Date;
}

// Statistics interfaces
export interface AttendanceStats {
  totalRecords: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  attendanceRate: number;
}

export interface StudentAttendanceStats {
  studentId: string;
  studentName: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  attendanceRate: number;
}

export interface ClassAttendanceStats {
  classId: string;
  className: string;
  totalStudents: number;
  averageAttendanceRate: number;
  attendanceByDate: Array<{
    date: string;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    attendanceRate: number;
  }>;
}

// Attendance summary for a specific date range
export interface AttendanceSummary {
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  totalRecords: number;
  overallStats: AttendanceStats;
  studentStats: StudentAttendanceStats[];
  classStats: ClassAttendanceStats[];
}
