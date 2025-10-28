import { Report, ReportType } from '@prisma/client';

// Base report data interface
export interface ReportData {
  id: string;
  title: string;
  type: ReportType;
  generatedAt: Date;
  data: any; // JSON data
  downloadUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Report generation interfaces
export interface GenerateReportData {
  title: string;
  type: ReportType;
  filters?: ReportFilters;
  format?: ReportFormat;
}

export interface ReportFilters {
  startDate?: Date;
  endDate?: Date;
  studentId?: string;
  teacherId?: string;
  classId?: string;
  subject?: string;
  examType?: string;
  grade?: string;
  status?: string;
}

export interface ReportFormat {
  type: 'PDF' | 'EXCEL' | 'CSV' | 'JSON';
  includeCharts?: boolean;
  includeSummary?: boolean;
  includeDetails?: boolean;
}

// Specific report data interfaces
export interface AttendanceReportData {
  summary: {
    totalStudents: number;
    totalDays: number;
    averageAttendanceRate: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
  };
  dailyAttendance: Array<{
    date: string;
    present: number;
    absent: number;
    late: number;
    attendanceRate: number;
  }>;
  studentAttendance: Array<{
    studentId: string;
    studentName: string;
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    attendanceRate: number;
  }>;
  classAttendance: Array<{
    classId: string;
    className: string;
    totalStudents: number;
    averageAttendanceRate: number;
  }>;
}

export interface PerformanceReportData {
  summary: {
    totalStudents: number;
    totalGrades: number;
    averageGrade: number;
    highestGrade: number;
    lowestGrade: number;
    gradeDistribution: Array<{
      grade: string;
      count: number;
      percentage: number;
    }>;
  };
  studentPerformance: Array<{
    studentId: string;
    studentName: string;
    totalGrades: number;
    averageGrade: number;
    highestGrade: number;
    lowestGrade: number;
    gradeDistribution: Array<{
      grade: string;
      count: number;
    }>;
  }>;
  subjectPerformance: Array<{
    subject: string;
    totalGrades: number;
    averageGrade: number;
    highestGrade: number;
    lowestGrade: number;
    studentCount: number;
  }>;
  classPerformance: Array<{
    classId: string;
    className: string;
    totalStudents: number;
    averageGrade: number;
    topPerformers: Array<{
      studentId: string;
      studentName: string;
      averageGrade: number;
    }>;
  }>;
}

export interface TeacherReportData {
  summary: {
    totalTeachers: number;
    totalClasses: number;
    totalStudents: number;
    averageStudentsPerClass: number;
  };
  teacherDetails: Array<{
    teacherId: string;
    teacherName: string;
    email: string;
    subject: string;
    experience: string;
    totalClasses: number;
    totalStudents: number;
    averageStudentsPerClass: number;
    classes: Array<{
      classId: string;
      className: string;
      subject: string;
      studentCount: number;
    }>;
  }>;
  subjectDistribution: Array<{
    subject: string;
    teacherCount: number;
    classCount: number;
    studentCount: number;
  }>;
}

export interface StudentReportData {
  summary: {
    totalStudents: number;
    totalClasses: number;
    averageStudentsPerClass: number;
    studentsByClass: Array<{
      classId: string;
      className: string;
      studentCount: number;
    }>;
  };
  studentDetails: Array<{
    studentId: string;
    studentName: string;
    email: string;
    rollNo: string;
    phone: string | null;
    dateOfBirth: string;
    address: string;
    classId: string | null;
    className: string | null;
    totalGrades: number;
    averageGrade: number;
    attendanceRate: number;
    assignmentCompletionRate: number;
  }>;
  classDistribution: Array<{
    classId: string;
    className: string;
    studentCount: number;
    averageGrade: number;
    averageAttendanceRate: number;
  }>;
}

export interface MonthlyReportData {
  month: string;
  year: number;
  summary: {
    totalStudents: number;
    totalTeachers: number;
    totalClasses: number;
    totalGrades: number;
    totalAttendanceRecords: number;
    averageAttendanceRate: number;
    averageGrade: number;
  };
  attendance: {
    totalRecords: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    attendanceRate: number;
    dailyBreakdown: Array<{
      date: string;
      present: number;
      absent: number;
      late: number;
      attendanceRate: number;
    }>;
  };
  performance: {
    totalGrades: number;
    averageGrade: number;
    highestGrade: number;
    lowestGrade: number;
    gradeDistribution: Array<{
      grade: string;
      count: number;
      percentage: number;
    }>;
    topPerformers: Array<{
      studentId: string;
      studentName: string;
      averageGrade: number;
    }>;
  };
  assignments: {
    totalAssignments: number;
    totalSubmissions: number;
    submissionRate: number;
    averageMarks: number;
    assignmentsByStatus: Array<{
      status: string;
      count: number;
    }>;
  };
}

export interface AIReportData {
  insights: Array<{
    type: 'ATTENDANCE' | 'PERFORMANCE' | 'ASSIGNMENT' | 'GENERAL';
    title: string;
    description: string;
    recommendation: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
  }>;
  trends: Array<{
    metric: string;
    trend: 'INCREASING' | 'DECREASING' | 'STABLE';
    change: number;
    period: string;
  }>;
  alerts: Array<{
    type: 'WARNING' | 'INFO' | 'SUCCESS';
    message: string;
    action?: string;
  }>;
  recommendations: Array<{
    category: string;
    title: string;
    description: string;
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
  }>;
}

// Report query interfaces
export interface ReportQuery {
  page?: number;
  limit?: number;
  type?: ReportType;
  startDate?: Date;
  endDate?: Date;
  title?: string;
}

// Report statistics
export interface ReportStats {
  totalReports: number;
  reportsByType: Array<{
    type: ReportType;
    count: number;
  }>;
  reportsByMonth: Array<{
    month: string;
    count: number;
  }>;
  averageReportSize: number;
  mostGeneratedType: ReportType;
}

// Report generation result
export interface ReportGenerationResult {
  reportId: string;
  title: string;
  type: ReportType;
  generatedAt: Date;
  downloadUrl?: string;
  data: any;
  format: ReportFormat;
  size: number;
}
