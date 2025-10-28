import { Class, Teacher, Student } from '@prisma/client';

// Base class data interface
export interface ClassData {
  id: string;
  name: string;
  subject: string;
  schedule: string;
  teacherId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Class with relations
export interface ClassWithTeacher extends Class {
  teacher: Teacher | null;
}

export interface ClassWithStudents extends Class {
  students: Student[];
}

export interface ClassWithRelations extends Class {
  teacher: Teacher | null;
  students: Student[];
}

// DTOs for creating and updating classes
export interface CreateClassData {
  name: string;
  subject: string;
  schedule: string;
  teacherId?: string | null;
}

export interface UpdateClassData {
  name?: string;
  subject?: string;
  schedule?: string;
  teacherId?: string | null;
}

// Query interface for filtering and pagination
export interface ClassQuery {
  page?: number;
  limit?: number;
  search?: string;
  subject?: string;
  teacherId?: string;
}

// Statistics interface
export interface ClassStats {
  totalClasses: number;
  classesBySubject: Array<{
    subject: string;
    count: number;
  }>;
  classesWithTeachers: number;
  classesWithoutTeachers: number;
  averageStudentsPerClass: number;
}
