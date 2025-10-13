/**
 * Attendance Service
 * Handles all attendance-related API calls
 */

import { api, API_ENDPOINTS } from './api';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
}

export interface MarkAttendanceRequest {
  studentId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
}

export interface AttendanceStats {
  totalStudents: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

export const attendanceService = {
  /**
   * Get attendance records
   */
  getAll: async (date?: string, classFilter?: string): Promise<AttendanceRecord[]> => {
    let endpoint = API_ENDPOINTS.ATTENDANCE;
    const params = new URLSearchParams();
    
    if (date) params.append('date', date);
    if (classFilter) params.append('class', classFilter);
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }
    
    return await api.get<AttendanceRecord[]>(endpoint);
  },

  /**
   * Mark attendance for a student
   */
  markAttendance: async (data: MarkAttendanceRequest): Promise<AttendanceRecord> => {
    return await api.post<AttendanceRecord>(API_ENDPOINTS.MARK_ATTENDANCE, data);
  },

  /**
   * Mark attendance for multiple students (bulk)
   */
  markBulkAttendance: async (records: MarkAttendanceRequest[]): Promise<AttendanceRecord[]> => {
    return await api.post<AttendanceRecord[]>(`${API_ENDPOINTS.MARK_ATTENDANCE}/bulk`, {
      records,
    });
  },

  /**
   * Get attendance statistics for a date
   */
  getStats: async (date: string, classFilter?: string): Promise<AttendanceStats> => {
    let endpoint = `${API_ENDPOINTS.ATTENDANCE}/stats?date=${date}`;
    if (classFilter) {
      endpoint += `&class=${classFilter}`;
    }
    return await api.get<AttendanceStats>(endpoint);
  },

  /**
   * Get attendance by student
   */
  getByStudent: async (studentId: string): Promise<AttendanceRecord[]> => {
    return await api.get<AttendanceRecord[]>(`${API_ENDPOINTS.ATTENDANCE}/student/${studentId}`);
  },

  /**
   * Get attendance by class
   */
  getByClass: async (className: string, startDate?: string, endDate?: string): Promise<AttendanceRecord[]> => {
    let endpoint = `${API_ENDPOINTS.ATTENDANCE}/class/${className}`;
    const params = new URLSearchParams();
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }
    
    return await api.get<AttendanceRecord[]>(endpoint);
  },
};


