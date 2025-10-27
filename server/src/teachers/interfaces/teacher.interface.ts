import { UserRole } from '@prisma/client';

export interface TeacherData {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  experience: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeacherWithUser {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  experience: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    email: string;
    password?: string; // Password might be included in some queries, but should be excluded in final response
    role: UserRole;
    isEmailVerified: boolean;
    emailVerifiedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
  };
  classes?: {
    id: string;
    name: string;
    subject: string;
    schedule: string;
  }[];
}

export interface CreateTeacherData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  experience: string;
  password?: string; 
}

export interface UpdateTeacherData {
  name?: string;
  phone?: string;
  subject?: string;
  experience?: string;
}

export interface TeacherQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  subject?: string;
  experience?: string;
}

export interface TeacherStats {
  total: number;
  bySubject: { subject: string; count: number }[];
  verified: number;
  unverified: number;
  averageExperience: number;
}
