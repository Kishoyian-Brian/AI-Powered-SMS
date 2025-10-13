/**
 * Student Service
 * Handles all student-related API calls
 */

import { api, API_ENDPOINTS } from './api';

export interface Student {
  id: string;
  name: string;
  email: string;
  class: string;
  rollNo: string;
  marks: number;
  attendance: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
}

export interface CreateStudentRequest {
  name: string;
  email: string;
  class: string;
  marks: number;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
}

export interface UpdateStudentRequest extends Partial<CreateStudentRequest> {
  id: string;
}

export const studentService = {
  /**
   * Get all students
   */
  getAll: async (): Promise<Student[]> => {
    return await api.get<Student[]>(API_ENDPOINTS.STUDENTS);
  },

  /**
   * Get student by ID
   */
  getById: async (id: string): Promise<Student> => {
    return await api.get<Student>(API_ENDPOINTS.STUDENT_BY_ID(id));
  },

  /**
   * Create new student
   */
  create: async (data: CreateStudentRequest): Promise<Student> => {
    return await api.post<Student>(API_ENDPOINTS.STUDENTS, data);
  },

  /**
   * Update student
   */
  update: async (id: string, data: Partial<CreateStudentRequest>): Promise<Student> => {
    return await api.put<Student>(API_ENDPOINTS.STUDENT_BY_ID(id), data);
  },

  /**
   * Delete student
   */
  delete: async (id: string): Promise<void> => {
    return await api.delete(API_ENDPOINTS.STUDENT_BY_ID(id));
  },

  /**
   * Search students by name
   */
  search: async (query: string): Promise<Student[]> => {
    return await api.get<Student[]>(`${API_ENDPOINTS.STUDENTS}?search=${query}`);
  },

  /**
   * Filter students by class
   */
  getByClass: async (className: string): Promise<Student[]> => {
    return await api.get<Student[]>(`${API_ENDPOINTS.STUDENTS}?class=${className}`);
  },
};


