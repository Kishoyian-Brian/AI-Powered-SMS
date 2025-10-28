import { Grade, Student } from '@prisma/client';

// Base grade data interface
export interface GradeData {
  id: string;
  studentId: string;
  subject: string;
  examType: string;
  marks: number;
  totalMarks: number;
  grade: string | null;
  remarks: string | null;
  examDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Grade with relations
export interface GradeWithStudent extends GradeData {
  student: Student;
}

// DTOs for creating and updating grades
export interface CreateGradeData {
  studentId: string;
  subject: string;
  examType: string;
  marks: number;
  totalMarks: number;
  grade?: string | null;
  remarks?: string | null;
  examDate: Date;
}

export interface UpdateGradeData {
  subject?: string;
  examType?: string;
  marks?: number;
  totalMarks?: number;
  grade?: string | null;
  remarks?: string | null;
  examDate?: Date;
}

// Query interface for filtering and pagination
export interface GradeQuery {
  page?: number;
  limit?: number;
  studentId?: string;
  subject?: string;
  examType?: string;
  grade?: string;
  examDate?: Date;
  startDate?: Date;
  endDate?: Date;
}

// Statistics interfaces
export interface GradeStats {
  totalGrades: number;
  gradesBySubject: { subject: string; count: number; averageMarks: number }[];
  gradesByExamType: { examType: string; count: number; averageMarks: number }[];
  gradesByGrade: { grade: string; count: number }[];
  averageMarks: number;
  highestMarks: number;
  lowestMarks: number;
}

export interface StudentGradeStats {
  studentId: string;
  studentName: string;
  totalGrades: number;
  averageMarks: number;
  highestMarks: number;
  lowestMarks: number;
  gradesBySubject: { subject: string; count: number; averageMarks: number }[];
  gradesByExamType: { examType: string; count: number; averageMarks: number }[];
  gradesByGrade: { grade: string; count: number }[];
}

export interface SubjectGradeStats {
  subject: string;
  totalGrades: number;
  averageMarks: number;
  highestMarks: number;
  lowestMarks: number;
  gradesByExamType: { examType: string; count: number; averageMarks: number }[];
  gradesByGrade: { grade: string; count: number }[];
}

export interface ClassGradeStats {
  classId: string;
  className: string;
  totalStudents: number;
  totalGrades: number;
  averageMarks: number;
  gradesBySubject: { subject: string; count: number; averageMarks: number }[];
  gradesByExamType: { examType: string; count: number; averageMarks: number }[];
  gradesByGrade: { grade: string; count: number }[];
}

// Grade summary
export interface GradeSummary {
  totalGrades: number;
  overallStats: GradeStats;
  studentStats: StudentGradeStats[];
  subjectStats: SubjectGradeStats[];
  classStats: ClassGradeStats[];
}

// Bulk operations
export interface BulkCreateGradesData {
  grades: Array<{
    studentId: string;
    subject: string;
    examType: string;
    marks: number;
    totalMarks: number;
    grade?: string | null;
    remarks?: string | null;
    examDate: Date;
  }>;
}

export interface BulkUpdateGradesData {
  gradeIds: string[];
  updates: Array<{
    marks?: number;
    totalMarks?: number;
    grade?: string | null;
    remarks?: string | null;
  }>;
}

// Grade calculation utilities
export interface GradeCalculation {
  marks: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  gpa: number;
}

// Grade distribution
export interface GradeDistribution {
  grade: string;
  count: number;
  percentage: number;
  students: string[];
}
