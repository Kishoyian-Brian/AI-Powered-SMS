/**
 * Teacher Service
 * Handles all teacher-related API calls
 */

import { api, API_ENDPOINTS } from './api';
import type { Class } from './classService';

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  experience: string;
  classes?: string[];
}

export interface CreateTeacherRequest {
  name: string;
  email: string;
  phone: string;
  subject: string;
  experience: string;
}

export const teacherService = {
  /**
   * Get all teachers
   */
  getAll: async (): Promise<Teacher[]> => {
    return await api.get<Teacher[]>(API_ENDPOINTS.TEACHERS);
  },

  /**
   * Get teacher by ID
   */
  getById: async (id: string): Promise<Teacher> => {
    return await api.get<Teacher>(API_ENDPOINTS.TEACHER_BY_ID(id));
  },

  /**
   * Create new teacher
   */
  create: async (data: CreateTeacherRequest): Promise<Teacher> => {
    return await api.post<Teacher>(API_ENDPOINTS.TEACHERS, data);
  },

  /**
   * Update teacher
   */
  update: async (id: string, data: Partial<CreateTeacherRequest>): Promise<Teacher> => {
    return await api.put<Teacher>(API_ENDPOINTS.TEACHER_BY_ID(id), data);
  },

  /**
   * Delete teacher
   */
  delete: async (id: string): Promise<void> => {
    return await api.delete(API_ENDPOINTS.TEACHER_BY_ID(id));
  },

  /**
   * Get teacher's assigned classes
   */
  getClasses: async (teacherId: string): Promise<Class[]> => {
    return await api.get<Class[]>(`${API_ENDPOINTS.TEACHER_BY_ID(teacherId)}/classes`);
  },
};


