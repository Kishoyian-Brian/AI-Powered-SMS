/**
 * Services Index
 * Export all services from a single file for easy importing
 * 
 * Usage:
 * import { studentService, teacherService, authService } from '../services';
 */

export { api, API_ENDPOINTS } from './api';
export { authService } from './authService';
export { studentService } from './studentService';
export { teacherService } from './teacherService';
export { classService } from './classService';
export { attendanceService } from './attendanceService';
export { reportService } from './reportService';
export { aiService } from './aiService';

// Re-export types for convenience
export type { AuthResponse, LoginRequest, RegisterRequest } from './authService';
export type { Student, CreateStudentRequest } from './studentService';
export type { Teacher, CreateTeacherRequest } from './teacherService';
export type { Class, CreateClassRequest } from './classService';
export type { AttendanceRecord, MarkAttendanceRequest, AttendanceStats } from './attendanceService';
export type { Report, GenerateReportRequest, PerformanceMetrics } from './reportService';
export type { ChatMessage, ChatRequest, ChatResponse, AIInsight } from './aiService';


