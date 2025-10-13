/**
 * Report Service
 * Handles all report generation and analytics API calls
 */

import { api, API_ENDPOINTS } from './api';

export interface Report {
  id: string;
  title: string;
  type: 'monthly' | 'attendance' | 'performance' | 'teacher' | 'student' | 'ai';
  generatedAt: string;
  data: Record<string, unknown>;
  downloadUrl?: string;
}

export interface GenerateReportRequest {
  type: 'monthly' | 'attendance' | 'performance' | 'teacher' | 'student' | 'ai';
  startDate?: string;
  endDate?: string;
  classFilter?: string;
  studentId?: string;
  teacherId?: string;
}

export interface PerformanceMetrics {
  averageScore: number;
  passRate: number;
  topPerformers: number;
  improvementRate: number;
  subjectPerformance: { subject: string; average: number }[];
}

export const reportService = {
  /**
   * Get all generated reports
   */
  getAll: async (): Promise<Report[]> => {
    return await api.get<Report[]>(API_ENDPOINTS.REPORTS);
  },

  /**
   * Generate new report
   */
  generate: async (request: GenerateReportRequest): Promise<Report> => {
    return await api.post<Report>(API_ENDPOINTS.GENERATE_REPORT, request);
  },

  /**
   * Get performance metrics
   */
  getPerformanceMetrics: async (): Promise<PerformanceMetrics> => {
    return await api.get<PerformanceMetrics>(`${API_ENDPOINTS.REPORTS}/metrics`);
  },

  /**
   * Get attendance report
   */
  getAttendanceReport: async (startDate: string, endDate: string): Promise<Report> => {
    return await api.get<Report>(`${API_ENDPOINTS.REPORTS}/attendance?startDate=${startDate}&endDate=${endDate}`);
  },

  /**
   * Get monthly performance report
   */
  getMonthlyReport: async (month: number, year: number): Promise<Report> => {
    return await api.get<Report>(`${API_ENDPOINTS.REPORTS}/monthly?month=${month}&year=${year}`);
  },

  /**
   * Download report
   */
  downloadReport: async (reportId: string, format: 'pdf' | 'excel' = 'pdf'): Promise<Blob> => {
    const response = await fetch(`${API_ENDPOINTS.REPORTS}/${reportId}/download?format=${format}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download report');
    }

    return await response.blob();
  },

  /**
   * Get AI-generated insights
   */
  getAIInsights: async (): Promise<{ insights: string; recommendations: string[] }> => {
    return await api.get(`${API_ENDPOINTS.REPORTS}/ai-insights`);
  },
};

