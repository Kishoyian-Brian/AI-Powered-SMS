import { UserRole } from '@prisma/client';

export interface StudentData {
  id: string;
  userId: string;
  name: string;
  email: string;
  rollNo: string;
  phone?: string | null;
  dateOfBirth?: Date | null;
  address?: string | null;
  classId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentWithUser {
  id: string;
  userId: string;
  name: string;
  email: string;
  rollNo: string;
  phone?: string | null;
  dateOfBirth?: Date | null;
  address?: string | null;
  classId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    email: string;
    role: UserRole;
    isEmailVerified: boolean;
    emailVerifiedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
  };
  class?: {
    id: string;
    name: string;
    subject: string;
    schedule: string;
  } | null;
}

export interface CreateStudentData {
  name: string;
  email: string;
  rollNo: string;
  phone?: string;
  dateOfBirth?: Date;
  address?: string;
  classId?: string;
  password: string;
}

export interface UpdateStudentData {
  name?: string;
  email?: string;
  rollNo?: string;
  phone?: string;
  dateOfBirth?: Date;
  address?: string;
  classId?: string;
}

export interface StudentFilters {
  classId?: string;
  search?: string;
  page?: number;
  limit?: number;
}
