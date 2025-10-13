/**
 * API Client Configuration
 * Base configuration for all API calls to the backend
 */

// Backend API URL - change this to your actual backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Generic API request handler with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('authToken');
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!response.ok) {
      const error = isJson ? await response.json() : { message: response.statusText };
      throw new Error(error.message || 'API request failed');
    }

    return isJson ? await response.json() : ({} as T);
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * API Client - HTTP Methods
 */
export const api = {
  get: <T>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: 'GET' }),

  post: <T, D = unknown>(endpoint: string, data?: D) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: <T, D = unknown>(endpoint: string, data?: D) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  patch: <T, D = unknown>(endpoint: string, data?: D) =>
    apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: 'DELETE' }),
};

/**
 * API Endpoints Constants
 */
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',

  // Students
  STUDENTS: '/students',
  STUDENT_BY_ID: (id: string) => `/students/${id}`,

  // Teachers
  TEACHERS: '/teachers',
  TEACHER_BY_ID: (id: string) => `/teachers/${id}`,

  // Classes
  CLASSES: '/classes',
  CLASS_BY_ID: (id: string) => `/classes/${id}`,

  // Attendance
  ATTENDANCE: '/attendance',
  MARK_ATTENDANCE: '/attendance/mark',

  // Reports
  REPORTS: '/reports',
  GENERATE_REPORT: '/reports/generate',

  // AI Assistant
  AI_CHAT: '/ai/chat',
};


