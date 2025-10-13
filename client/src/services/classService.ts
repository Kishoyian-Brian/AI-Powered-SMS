/**
 * Class Service
 * Handles all class-related API calls
 */

import { api, API_ENDPOINTS } from './api';
import type { Student } from './studentService';

export interface Class {
  id: string;
  name: string;
  subject: string;
  teacher: string;
  teacherId: string;
  students: number;
  schedule: string;
}

export interface CreateClassRequest {
  name: string;
  subject: string;
  teacherId: string;
  schedule: string;
}

export const classService = {
  /**
   * Get all classes
   */
  getAll: async (): Promise<Class[]> => {
    return await api.get<Class[]>(API_ENDPOINTS.CLASSES);
  },

  /**
   * Get class by ID
   */
  getById: async (id: string): Promise<Class> => {
    return await api.get<Class>(API_ENDPOINTS.CLASS_BY_ID(id));
  },

  /**
   * Create new class
   */
  create: async (data: CreateClassRequest): Promise<Class> => {
    return await api.post<Class>(API_ENDPOINTS.CLASSES, data);
  },

  /**
   * Update class
   */
  update: async (id: string, data: Partial<CreateClassRequest>): Promise<Class> => {
    return await api.put<Class>(API_ENDPOINTS.CLASS_BY_ID(id), data);
  },

  /**
   * Delete class
   */
  delete: async (id: string): Promise<void> => {
    return await api.delete(API_ENDPOINTS.CLASS_BY_ID(id));
  },

  /**
   * Get students in a class
   */
  getStudents: async (classId: string): Promise<Student[]> => {
    return await api.get<Student[]>(`${API_ENDPOINTS.CLASS_BY_ID(classId)}/students`);
  },

  /**
   * Assign teacher to class
   */
  assignTeacher: async (classId: string, teacherId: string): Promise<Class> => {
    return await api.patch<Class>(`${API_ENDPOINTS.CLASS_BY_ID(classId)}/assign-teacher`, {
      teacherId,
    });
  },
};


