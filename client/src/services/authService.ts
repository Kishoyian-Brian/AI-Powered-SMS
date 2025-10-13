/**
 * Authentication Service
 * Handles login, registration, and authentication-related API calls
 */

import { api, API_ENDPOINTS } from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  schoolName: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'teacher' | 'student';
  };
  token: string;
}

export const authService = {
  /**
   * Login user
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.LOGIN, credentials);
    
    // Store auth token
    if (response.token) {
      localStorage.setItem('authToken', response.token);
    }
    
    return response;
  },

  /**
   * Register new user/school
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.REGISTER, data);
    
    // Store auth token
    if (response.token) {
      localStorage.setItem('authToken', response.token);
    }
    
    return response;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    try {
      await api.post(API_ENDPOINTS.LOGOUT);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: async (): Promise<AuthResponse['user']> => {
    return await api.get(API_ENDPOINTS.ME);
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken');
  },

  /**
   * Get stored auth token
   */
  getToken: (): string | null => {
    return localStorage.getItem('authToken');
  },
};


