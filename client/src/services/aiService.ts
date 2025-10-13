

import { api, API_ENDPOINTS } from './api';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  context?: string; // Optional context about what page user is on
}

export interface ChatResponse {
  reply: string;
  suggestions?: string[];
}

export interface AIInsight {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: 'performance' | 'attendance' | 'general';
}

export const aiService = {
  /**
   * Send message to AI assistant
   */
  chat: async (message: string, context?: string): Promise<ChatResponse> => {
    return await api.post<ChatResponse>(API_ENDPOINTS.AI_CHAT, {
      message,
      context,
    });
  },

  /**
   * Get AI-generated insights for dashboard
   */
  getInsights: async (): Promise<AIInsight[]> => {
    return await api.get<AIInsight[]>('/ai/insights');
  },

  /**
   * Get AI recommendations for a student
   */
  getStudentRecommendations: async (studentId: string): Promise<string[]> => {
    return await api.get<string[]>(`/ai/recommendations/student/${studentId}`);
  },

  /**
   * Get AI recommendations for a class
   */
  getClassRecommendations: async (classId: string): Promise<string[]> => {
    return await api.get<string[]>(`/ai/recommendations/class/${classId}`);
  },

  /**
   * Analyze student performance
   */
  analyzePerformance: async (studentId: string): Promise<{
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  }> => {
    return await api.post(`/ai/analyze/student/${studentId}`);
  },

  /**
   * Generate AI report
   */
  generateReport: async (params: {
    type: 'student' | 'class' | 'school';
    targetId?: string;
  }): Promise<{
    summary: string;
    insights: string[];
    recommendations: string[];
  }> => {
    return await api.post('/ai/generate-report', params);
  },
};


