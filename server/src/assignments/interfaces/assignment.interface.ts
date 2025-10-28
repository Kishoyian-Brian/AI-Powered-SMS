import { Assignment, StudentAssignment, AssignmentStatus, Class, Teacher, Student } from '@prisma/client';

// Base assignment data interface
export interface AssignmentData {
  id: string;
  title: string;
  description: string | null;
  dueDate: Date;
  totalMarks: number;
  classId: string;
  teacherId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Assignment with relations
export interface AssignmentWithClass extends AssignmentData {
  class: Class;
}

export interface AssignmentWithTeacher extends AssignmentData {
  teacher: Teacher;
}

export interface AssignmentWithRelations extends AssignmentData {
  class: Class;
  teacher: Teacher;
}

export interface AssignmentWithStudentAssignments extends AssignmentData {
  studentAssignments: StudentAssignment[];
}

export interface AssignmentWithFullRelations extends AssignmentData {
  class: Class;
  teacher: Teacher;
  studentAssignments: StudentAssignment[];
}

// Student assignment interfaces
export interface StudentAssignmentData {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt: Date | null;
  marksObtained: number | null;
  status: AssignmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentAssignmentWithStudent extends StudentAssignmentData {
  student: Student;
}

export interface StudentAssignmentWithAssignment extends StudentAssignmentData {
  assignment: Assignment;
}

export interface StudentAssignmentWithFullRelations extends StudentAssignmentData {
  student: Student;
  assignment: Assignment;
}

// DTOs for creating and updating assignments
export interface CreateAssignmentData {
  title: string;
  description?: string | null;
  dueDate: Date;
  totalMarks: number;
  classId: string;
  teacherId: string;
}

export interface UpdateAssignmentData {
  title?: string;
  description?: string | null;
  dueDate?: Date;
  totalMarks?: number;
  classId?: string;
  teacherId?: string;
}

// Student assignment DTOs
export interface CreateStudentAssignmentData {
  assignmentId: string;
  studentId: string;
}

export interface UpdateStudentAssignmentData {
  submittedAt?: Date | null;
  marksObtained?: number | null;
  status?: AssignmentStatus;
}

// Query interfaces
export interface AssignmentQuery {
  page?: number;
  limit?: number;
  classId?: string;
  teacherId?: string;
  title?: string;
  status?: AssignmentStatus;
  dueDate?: Date;
  startDate?: Date;
  endDate?: Date;
}

export interface StudentAssignmentQuery {
  page?: number;
  limit?: number;
  assignmentId?: string;
  studentId?: string;
  status?: AssignmentStatus;
  submitted?: boolean;
}

// Statistics interfaces
export interface AssignmentStats {
  totalAssignments: number;
  assignmentsByStatus: { status: AssignmentStatus; count: number }[];
  assignmentsByClass: { classId: string; className: string; count: number }[];
  averageMarks: number;
  submissionRate: number;
}

export interface StudentAssignmentStats {
  studentId: string;
  studentName: string;
  totalAssignments: number;
  submittedAssignments: number;
  gradedAssignments: number;
  averageMarks: number;
  submissionRate: number;
}

export interface ClassAssignmentStats {
  classId: string;
  className: string;
  totalAssignments: number;
  averageSubmissionRate: number;
  averageMarks: number;
  assignmentsByStatus: { status: AssignmentStatus; count: number }[];
}

// Assignment summary
export interface AssignmentSummary {
  totalAssignments: number;
  totalStudentAssignments: number;
  overallStats: AssignmentStats;
  studentStats: StudentAssignmentStats[];
  classStats: ClassAssignmentStats[];
}

// Bulk operations
export interface BulkCreateStudentAssignmentsData {
  assignmentId: string;
  studentIds: string[];
}

export interface BulkGradeAssignmentsData {
  studentAssignmentIds: string[];
  marksObtained: number[];
}
