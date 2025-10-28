import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { 
  GenerateReportDto, 
  ReportQueryDto,
  AttendanceReportQueryDto,
  PerformanceReportQueryDto,
  TeacherReportQueryDto,
  StudentReportQueryDto,
  MonthlyReportQueryDto,
  AIReportQueryDto
} from './dto/report.dto';
import { 
  ReportData, 
  ReportStats, 
  ReportGenerationResult,
  AttendanceReportData,
  PerformanceReportData,
  TeacherReportData,
  StudentReportData,
  MonthlyReportData,
  AIReportData
} from './interfaces/report.interface';
import { ReportType } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async generateReport(generateReportDto: GenerateReportDto): Promise<ReportGenerationResult> {
    const { title, type, filters = {}, format = { type: 'JSON', includeCharts: true, includeSummary: true, includeDetails: true } } = generateReportDto;

    let reportData: any;
    let reportSize = 0;

    switch (type) {
      case ReportType.ATTENDANCE:
        reportData = await this.generateAttendanceReport(filters as AttendanceReportQueryDto);
        break;
      case ReportType.PERFORMANCE:
        reportData = await this.generatePerformanceReport(filters as PerformanceReportQueryDto);
        break;
      case ReportType.TEACHER:
        reportData = await this.generateTeacherReport(filters as TeacherReportQueryDto);
        break;
      case ReportType.STUDENT:
        reportData = await this.generateStudentReport(filters as StudentReportQueryDto);
        break;
      case ReportType.MONTHLY:
        reportData = await this.generateMonthlyReport(filters as MonthlyReportQueryDto);
        break;
      case ReportType.AI:
        reportData = await this.generateAIReport(filters as AIReportQueryDto);
        break;
      default:
        throw new BadRequestException('Invalid report type');
    }

    reportSize = JSON.stringify(reportData).length;

    const report = await this.prisma.report.create({
      data: {
        title,
        type,
        data: reportData,
        generatedAt: new Date(),
      },
    });

    return {
      reportId: report.id,
      title: report.title,
      type: report.type,
      generatedAt: report.generatedAt,
      data: reportData,
      format,
      size: reportSize,
    };
  }

  async findAll(queryDto: ReportQueryDto): Promise<{
    reports: ReportData[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, type, startDate, endDate, title } = queryDto;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (title) {
      where.title = {
        contains: title,
        mode: 'insensitive',
      };
    }

    if (startDate && endDate) {
      where.generatedAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const [reports, total] = await Promise.all([
      this.prisma.report.findMany({
        where,
        skip,
        take: limit,
        orderBy: { generatedAt: 'desc' },
      }),
      this.prisma.report.count({ where }),
    ]);

    return {
      reports,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<ReportData> {
    const report = await this.prisma.report.findUnique({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return report;
  }

  async remove(id: string): Promise<void> {
    const existingReport = await this.prisma.report.findUnique({
      where: { id },
    });

    if (!existingReport) {
      throw new NotFoundException('Report not found');
    }

    await this.prisma.report.delete({
      where: { id },
    });
  }

  async getReportStats(): Promise<ReportStats> {
    const [
      totalReports,
      reportsByType,
      reportsByMonth,
      allReports,
    ] = await Promise.all([
      this.prisma.report.count(),
      this.prisma.report.groupBy({
        by: ['type'],
        _count: {
          type: true,
        },
      }),
      this.prisma.report.groupBy({
        by: ['generatedAt'],
        _count: {
          generatedAt: true,
        },
        orderBy: {
          generatedAt: 'desc',
        },
      }),
      this.prisma.report.findMany({
        select: {
          data: true,
        },
      }),
    ]);

    const averageReportSize = allReports.length > 0 
      ? allReports.reduce((sum, report) => sum + JSON.stringify(report.data).length, 0) / allReports.length
      : 0;

    const mostGeneratedType = reportsByType.length > 0 
      ? reportsByType.reduce((max, current) => 
          current._count.type > max._count.type ? current : max
        ).type
      : ReportType.MONTHLY;

    return {
      totalReports,
      reportsByType: reportsByType.map(item => ({
        type: item.type,
        count: item._count.type,
      })),
      reportsByMonth: reportsByMonth.map(item => ({
        month: item.generatedAt.toISOString().substring(0, 7),
        count: item._count.generatedAt,
      })),
      averageReportSize,
      mostGeneratedType,
    };
  }

  // Specific report generation methods
  async generateAttendanceReport(filters: AttendanceReportQueryDto): Promise<AttendanceReportData> {
    const { startDate, endDate, classId, studentId } = filters;

    const where: any = {};
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }
    if (classId) {
      where.classId = classId;
    }
    if (studentId) {
      where.studentId = studentId;
    }

    const [
      attendanceRecords,
      students,
      classes,
    ] = await Promise.all([
      this.prisma.attendanceRecord.findMany({
        where,
        include: {
          student: true,
          class: true,
        },
      }),
      this.prisma.student.findMany(),
      this.prisma.class.findMany(),
    ]);

    const totalStudents = students.length;
    const totalDays = attendanceRecords.length > 0 
      ? new Set(attendanceRecords.map(record => record.date.toDateString())).size
      : 0;

    const presentCount = attendanceRecords.filter(record => record.status === 'PRESENT').length;
    const absentCount = attendanceRecords.filter(record => record.status === 'ABSENT').length;
    const lateCount = attendanceRecords.filter(record => record.status === 'LATE').length;
    const averageAttendanceRate = attendanceRecords.length > 0 ? presentCount / attendanceRecords.length : 0;

    // Daily attendance breakdown
    const dailyAttendanceMap = new Map<string, { present: number; absent: number; late: number }>();
    attendanceRecords.forEach(record => {
      const dateKey = record.date.toDateString();
      if (!dailyAttendanceMap.has(dateKey)) {
        dailyAttendanceMap.set(dateKey, { present: 0, absent: 0, late: 0 });
      }
      const dayData = dailyAttendanceMap.get(dateKey)!;
      if (record.status === 'PRESENT') dayData.present++;
      else if (record.status === 'ABSENT') dayData.absent++;
      else if (record.status === 'LATE') dayData.late++;
    });

    const dailyAttendance = Array.from(dailyAttendanceMap.entries()).map(([date, data]) => {
      const total = data.present + data.absent + data.late;
      return {
        date,
        present: data.present,
        absent: data.absent,
        late: data.late,
        attendanceRate: total > 0 ? data.present / total : 0,
      };
    });

    // Student attendance breakdown
    const studentAttendanceMap = new Map<string, { total: number; present: number; absent: number; late: number }>();
    attendanceRecords.forEach(record => {
      if (!studentAttendanceMap.has(record.studentId)) {
        studentAttendanceMap.set(record.studentId, { total: 0, present: 0, absent: 0, late: 0 });
      }
      const studentData = studentAttendanceMap.get(record.studentId)!;
      studentData.total++;
      if (record.status === 'PRESENT') studentData.present++;
      else if (record.status === 'ABSENT') studentData.absent++;
      else if (record.status === 'LATE') studentData.late++;
    });

    const studentAttendance = Array.from(studentAttendanceMap.entries()).map(([studentId, data]) => {
      const student = students.find(s => s.id === studentId);
      return {
        studentId,
        studentName: student?.name || 'Unknown',
        totalDays: data.total,
        presentDays: data.present,
        absentDays: data.absent,
        lateDays: data.late,
        attendanceRate: data.total > 0 ? data.present / data.total : 0,
      };
    });

    // Class attendance breakdown
    const classAttendanceMap = new Map<string, { totalStudents: number; totalRecords: number; presentRecords: number }>();
    classes.forEach(classData => {
      classAttendanceMap.set(classData.id, { totalStudents: 0, totalRecords: 0, presentRecords: 0 });
    });

    attendanceRecords.forEach(record => {
      if (record.classId && classAttendanceMap.has(record.classId)) {
        const classData = classAttendanceMap.get(record.classId)!;
        classData.totalRecords++;
        if (record.status === 'PRESENT') classData.presentRecords++;
      }
    });

    const classAttendance = Array.from(classAttendanceMap.entries()).map(([classId, data]) => {
      const classData = classes.find(c => c.id === classId);
      return {
        classId,
        className: classData?.name || 'Unknown',
        totalStudents: data.totalStudents,
        averageAttendanceRate: data.totalRecords > 0 ? data.presentRecords / data.totalRecords : 0,
      };
    });

    return {
      summary: {
        totalStudents,
        totalDays,
        averageAttendanceRate,
        presentCount,
        absentCount,
        lateCount,
      },
      dailyAttendance,
      studentAttendance,
      classAttendance,
    };
  }

  async generatePerformanceReport(filters: PerformanceReportQueryDto): Promise<PerformanceReportData> {
    const { startDate, endDate, classId, studentId, subject } = filters;

    const where: any = {};
    if (startDate && endDate) {
      where.examDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }
    if (classId) {
      where.student = {
        classId: classId,
      };
    }
    if (studentId) {
      where.studentId = studentId;
    }
    if (subject) {
      where.subject = {
        contains: subject,
        mode: 'insensitive',
      };
    }

    const [
      grades,
      students,
      classes,
    ] = await Promise.all([
      this.prisma.grade.findMany({
        where,
        include: {
          student: true,
        },
      }),
      this.prisma.student.findMany(),
      this.prisma.class.findMany(),
    ]);

    const totalStudents = students.length;
    const totalGrades = grades.length;
    const averageGrade = totalGrades > 0 ? grades.reduce((sum, grade) => sum + grade.marks, 0) / totalGrades : 0;
    const highestGrade = totalGrades > 0 ? Math.max(...grades.map(grade => grade.marks)) : 0;
    const lowestGrade = totalGrades > 0 ? Math.min(...grades.map(grade => grade.marks)) : 0;

    // Grade distribution
    const gradeDistributionMap = new Map<string, number>();
    grades.forEach(grade => {
      const gradeLetter = grade.grade || 'Unknown';
      gradeDistributionMap.set(gradeLetter, (gradeDistributionMap.get(gradeLetter) || 0) + 1);
    });

    const gradeDistribution = Array.from(gradeDistributionMap.entries()).map(([grade, count]) => ({
      grade,
      count,
      percentage: totalGrades > 0 ? (count / totalGrades) * 100 : 0,
    }));

    // Student performance breakdown
    const studentPerformanceMap = new Map<string, { grades: any[]; totalMarks: number; count: number }>();
    grades.forEach(grade => {
      if (!studentPerformanceMap.has(grade.studentId)) {
        studentPerformanceMap.set(grade.studentId, { grades: [], totalMarks: 0, count: 0 });
      }
      const studentData = studentPerformanceMap.get(grade.studentId)!;
      studentData.grades.push(grade);
      studentData.totalMarks += grade.marks;
      studentData.count++;
    });

    const studentPerformance = Array.from(studentPerformanceMap.entries()).map(([studentId, data]) => {
      const student = students.find(s => s.id === studentId);
      const studentGrades = data.grades;
      const studentGradeDistributionMap = new Map<string, number>();
      studentGrades.forEach(grade => {
        const gradeLetter = grade.grade || 'Unknown';
        studentGradeDistributionMap.set(gradeLetter, (studentGradeDistributionMap.get(gradeLetter) || 0) + 1);
      });

      return {
        studentId,
        studentName: student?.name || 'Unknown',
        totalGrades: data.count,
        averageGrade: data.count > 0 ? data.totalMarks / data.count : 0,
        highestGrade: studentGrades.length > 0 ? Math.max(...studentGrades.map(g => g.marks)) : 0,
        lowestGrade: studentGrades.length > 0 ? Math.min(...studentGrades.map(g => g.marks)) : 0,
        gradeDistribution: Array.from(studentGradeDistributionMap.entries()).map(([grade, count]) => ({
          grade,
          count,
        })),
      };
    });

    // Subject performance breakdown
    const subjectPerformanceMap = new Map<string, { grades: any[]; students: Set<string> }>();
    grades.forEach(grade => {
      if (!subjectPerformanceMap.has(grade.subject)) {
        subjectPerformanceMap.set(grade.subject, { grades: [], students: new Set() });
      }
      const subjectData = subjectPerformanceMap.get(grade.subject)!;
      subjectData.grades.push(grade);
      subjectData.students.add(grade.studentId);
    });

    const subjectPerformance = Array.from(subjectPerformanceMap.entries()).map(([subject, data]) => {
      const subjectGrades = data.grades;
      const totalMarks = subjectGrades.reduce((sum, grade) => sum + grade.marks, 0);
      return {
        subject,
        totalGrades: subjectGrades.length,
        averageGrade: subjectGrades.length > 0 ? totalMarks / subjectGrades.length : 0,
        highestGrade: subjectGrades.length > 0 ? Math.max(...subjectGrades.map(g => g.marks)) : 0,
        lowestGrade: subjectGrades.length > 0 ? Math.min(...subjectGrades.map(g => g.marks)) : 0,
        studentCount: data.students.size,
      };
    });

    // Class performance breakdown
    const classPerformanceMap = new Map<string, { students: Set<string>; grades: any[] }>();
    classes.forEach(classData => {
      classPerformanceMap.set(classData.id, { students: new Set(), grades: [] });
    });

    grades.forEach(grade => {
      const student = students.find(s => s.id === grade.studentId);
      if (student?.classId && classPerformanceMap.has(student.classId)) {
        const classData = classPerformanceMap.get(student.classId)!;
        classData.students.add(student.id);
        classData.grades.push(grade);
      }
    });

    const classPerformance = Array.from(classPerformanceMap.entries()).map(([classId, data]) => {
      const classData = classes.find(c => c.id === classId);
      const classGrades = data.grades;
      const totalMarks = classGrades.reduce((sum, grade) => sum + grade.marks, 0);
      
      // Top performers
      const studentAverages = new Map<string, { total: number; count: number }>();
      classGrades.forEach(grade => {
        if (!studentAverages.has(grade.studentId)) {
          studentAverages.set(grade.studentId, { total: 0, count: 0 });
        }
        const studentData = studentAverages.get(grade.studentId)!;
        studentData.total += grade.marks;
        studentData.count++;
      });

      const topPerformers = Array.from(studentAverages.entries())
        .map(([studentId, data]) => {
          const student = students.find(s => s.id === studentId);
          return {
            studentId,
            studentName: student?.name || 'Unknown',
            averageGrade: data.count > 0 ? data.total / data.count : 0,
          };
        })
        .sort((a, b) => b.averageGrade - a.averageGrade)
        .slice(0, 5);

      return {
        classId,
        className: classData?.name || 'Unknown',
        totalStudents: data.students.size,
        averageGrade: classGrades.length > 0 ? totalMarks / classGrades.length : 0,
        topPerformers,
      };
    });

    return {
      summary: {
        totalStudents,
        totalGrades,
        averageGrade,
        highestGrade,
        lowestGrade,
        gradeDistribution,
      },
      studentPerformance,
      subjectPerformance,
      classPerformance,
    };
  }

  async generateTeacherReport(filters: TeacherReportQueryDto): Promise<TeacherReportData> {
    const { teacherId, subject } = filters;

    const where: any = {};
    if (teacherId) {
      where.id = teacherId;
    }
    if (subject) {
      where.subject = {
        contains: subject,
        mode: 'insensitive',
      };
    }

    const [
      teachers,
      classes,
      students,
    ] = await Promise.all([
      this.prisma.teacher.findMany({
        where,
        include: {
          classes: {
            include: {
              students: true,
            },
          },
        },
      }),
      this.prisma.class.findMany({
        include: {
          teacher: true,
          students: true,
        },
      }),
      this.prisma.student.findMany(),
    ]);

    const totalTeachers = teachers.length;
    const totalClasses = classes.length;
    const totalStudents = students.length;
    const averageStudentsPerClass = totalClasses > 0 ? totalStudents / totalClasses : 0;

    const teacherDetails = teachers.map(teacher => {
      const teacherClasses = classes.filter(c => c.teacherId === teacher.id);
      const teacherStudents = teacherClasses.reduce((sum, c) => sum + c.students.length, 0);
      const averageStudentsPerClass = teacherClasses.length > 0 ? teacherStudents / teacherClasses.length : 0;

      return {
        teacherId: teacher.id,
        teacherName: teacher.name,
        email: teacher.email,
        subject: teacher.subject,
        experience: teacher.experience,
        totalClasses: teacherClasses.length,
        totalStudents: teacherStudents,
        averageStudentsPerClass,
        classes: teacherClasses.map(c => ({
          classId: c.id,
          className: c.name,
          subject: c.subject,
          studentCount: c.students.length,
        })),
      };
    });

    // Subject distribution
    const subjectDistributionMap = new Map<string, { teachers: Set<string>; classes: Set<string>; students: Set<string> }>();
    teachers.forEach(teacher => {
      if (!subjectDistributionMap.has(teacher.subject)) {
        subjectDistributionMap.set(teacher.subject, { teachers: new Set(), classes: new Set(), students: new Set() });
      }
      const subjectData = subjectDistributionMap.get(teacher.subject)!;
      subjectData.teachers.add(teacher.id);
    });

    classes.forEach(classData => {
      if (subjectDistributionMap.has(classData.subject)) {
        const subjectData = subjectDistributionMap.get(classData.subject)!;
        subjectData.classes.add(classData.id);
        classData.students.forEach(student => {
          subjectData.students.add(student.id);
        });
      }
    });

    const subjectDistribution = Array.from(subjectDistributionMap.entries()).map(([subject, data]) => ({
      subject,
      teacherCount: data.teachers.size,
      classCount: data.classes.size,
      studentCount: data.students.size,
    }));

    return {
      summary: {
        totalTeachers,
        totalClasses,
        totalStudents,
        averageStudentsPerClass,
      },
      teacherDetails,
      subjectDistribution,
    };
  }

  async generateStudentReport(filters: StudentReportQueryDto): Promise<StudentReportData> {
    const { studentId, classId } = filters;

    const where: any = {};
    if (studentId) {
      where.id = studentId;
    }
    if (classId) {
      where.classId = classId;
    }

    const [
      students,
      classes,
      grades,
      attendanceRecords,
      assignments,
    ] = await Promise.all([
      this.prisma.student.findMany({
        where,
        include: {
          class: true,
          grades: true,
        },
      }),
      this.prisma.class.findMany(),
      this.prisma.grade.findMany(),
      this.prisma.attendanceRecord.findMany(),
      this.prisma.studentAssignment.findMany(),
    ]);

    const totalStudents = students.length;
    const totalClasses = classes.length;
    const averageStudentsPerClass = totalClasses > 0 ? totalStudents / totalClasses : 0;

    const studentsByClass = classes.map(classData => ({
      classId: classData.id,
      className: classData.name,
      studentCount: students.filter(s => s.classId === classData.id).length,
    }));

    const studentDetails = students.map(student => {
      const studentGrades = grades.filter(g => g.studentId === student.id);
      const studentAttendance = attendanceRecords.filter(a => a.studentId === student.id);
      const studentAssignments = assignments.filter(a => a.studentId === student.id);

      const averageGrade = studentGrades.length > 0 
        ? studentGrades.reduce((sum, grade) => sum + grade.marks, 0) / studentGrades.length
        : 0;

      const attendanceRate = studentAttendance.length > 0
        ? studentAttendance.filter(a => a.status === 'PRESENT').length / studentAttendance.length
        : 0;

      const assignmentCompletionRate = studentAssignments.length > 0
        ? studentAssignments.filter(a => a.submittedAt !== null).length / studentAssignments.length
        : 0;

      return {
        studentId: student.id,
        studentName: student.name,
        email: student.email,
        rollNo: student.rollNo,
        phone: student.phone,
        dateOfBirth: student.dateOfBirth?.toISOString().split('T')[0] || 'N/A',
        address: student.address || 'N/A',
        classId: student.classId,
        className: student.classId ? classes.find(c => c.id === student.classId)?.name || 'N/A' : 'N/A',
        totalGrades: studentGrades.length,
        averageGrade,
        attendanceRate,
        assignmentCompletionRate,
      };
    });

    const classDistribution = classes.map(classData => {
      const classStudents = students.filter(s => s.classId === classData.id);
      const classGrades = grades.filter(g => classStudents.some(s => s.id === g.studentId));
      const classAttendance = attendanceRecords.filter(a => classStudents.some(s => s.id === a.studentId));

      const averageGrade = classGrades.length > 0
        ? classGrades.reduce((sum, grade) => sum + grade.marks, 0) / classGrades.length
        : 0;

      const averageAttendanceRate = classAttendance.length > 0
        ? classAttendance.filter(a => a.status === 'PRESENT').length / classAttendance.length
        : 0;

      return {
        classId: classData.id,
        className: classData.name,
        studentCount: classStudents.length,
        averageGrade,
        averageAttendanceRate,
      };
    });

    return {
      summary: {
        totalStudents,
        totalClasses,
        averageStudentsPerClass,
        studentsByClass,
      },
      studentDetails,
      classDistribution,
    };
  }

  async generateMonthlyReport(filters: MonthlyReportQueryDto): Promise<MonthlyReportData> {
    const { month, year } = filters;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const [
      students,
      teachers,
      classes,
      grades,
      attendanceRecords,
      assignments,
      studentAssignments,
    ] = await Promise.all([
      this.prisma.student.findMany(),
      this.prisma.teacher.findMany(),
      this.prisma.class.findMany(),
      this.prisma.grade.findMany({
        where: {
          examDate: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      this.prisma.attendanceRecord.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      this.prisma.assignment.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      this.prisma.studentAssignment.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
    ]);

    const monthName = startDate.toLocaleString('default', { month: 'long' });

    // Attendance data
    const presentCount = attendanceRecords.filter(record => record.status === 'PRESENT').length;
    const absentCount = attendanceRecords.filter(record => record.status === 'ABSENT').length;
    const lateCount = attendanceRecords.filter(record => record.status === 'LATE').length;
    const attendanceRate = attendanceRecords.length > 0 ? presentCount / attendanceRecords.length : 0;

    const dailyAttendanceMap = new Map<string, { present: number; absent: number; late: number }>();
    attendanceRecords.forEach(record => {
      const dateKey = record.date.toISOString().split('T')[0];
      if (!dailyAttendanceMap.has(dateKey)) {
        dailyAttendanceMap.set(dateKey, { present: 0, absent: 0, late: 0 });
      }
      const dayData = dailyAttendanceMap.get(dateKey)!;
      if (record.status === 'PRESENT') dayData.present++;
      else if (record.status === 'ABSENT') dayData.absent++;
      else if (record.status === 'LATE') dayData.late++;
    });

    const dailyBreakdown = Array.from(dailyAttendanceMap.entries()).map(([date, data]) => {
      const total = data.present + data.absent + data.late;
      return {
        date,
        present: data.present,
        absent: data.absent,
        late: data.late,
        attendanceRate: total > 0 ? data.present / total : 0,
      };
    });

    // Performance data
    const averageGrade = grades.length > 0 ? grades.reduce((sum, grade) => sum + grade.marks, 0) / grades.length : 0;
    const highestGrade = grades.length > 0 ? Math.max(...grades.map(grade => grade.marks)) : 0;
    const lowestGrade = grades.length > 0 ? Math.min(...grades.map(grade => grade.marks)) : 0;

    const gradeDistributionMap = new Map<string, number>();
    grades.forEach(grade => {
      const gradeLetter = grade.grade || 'Unknown';
      gradeDistributionMap.set(gradeLetter, (gradeDistributionMap.get(gradeLetter) || 0) + 1);
    });

    const gradeDistribution = Array.from(gradeDistributionMap.entries()).map(([grade, count]) => ({
      grade,
      count,
      percentage: grades.length > 0 ? (count / grades.length) * 100 : 0,
    }));

    // Top performers
    const studentAverages = new Map<string, { total: number; count: number }>();
    grades.forEach(grade => {
      if (!studentAverages.has(grade.studentId)) {
        studentAverages.set(grade.studentId, { total: 0, count: 0 });
      }
      const studentData = studentAverages.get(grade.studentId)!;
      studentData.total += grade.marks;
      studentData.count++;
    });

    const topPerformers = Array.from(studentAverages.entries())
      .map(([studentId, data]) => {
        const student = students.find(s => s.id === studentId);
        return {
          studentId,
          studentName: student?.name || 'Unknown',
          averageGrade: data.count > 0 ? data.total / data.count : 0,
        };
      })
      .sort((a, b) => b.averageGrade - a.averageGrade)
      .slice(0, 10);

    // Assignment data
    const totalSubmissions = studentAssignments.filter(sa => sa.submittedAt !== null).length;
    const submissionRate = studentAssignments.length > 0 ? totalSubmissions / studentAssignments.length : 0;
    const averageMarks = studentAssignments.filter(sa => sa.marksObtained !== null).length > 0
      ? studentAssignments.filter(sa => sa.marksObtained !== null).reduce((sum, sa) => sum + (sa.marksObtained || 0), 0) / studentAssignments.filter(sa => sa.marksObtained !== null).length
      : 0;

    const assignmentsByStatusMap = new Map<string, number>();
    studentAssignments.forEach(sa => {
      const status = sa.status;
      assignmentsByStatusMap.set(status, (assignmentsByStatusMap.get(status) || 0) + 1);
    });

    const assignmentsByStatus = Array.from(assignmentsByStatusMap.entries()).map(([status, count]) => ({
      status,
      count,
    }));

    return {
      month: monthName,
      year,
      summary: {
        totalStudents: students.length,
        totalTeachers: teachers.length,
        totalClasses: classes.length,
        totalGrades: grades.length,
        totalAttendanceRecords: attendanceRecords.length,
        averageAttendanceRate: attendanceRate,
        averageGrade: averageGrade,
      },
      attendance: {
        totalRecords: attendanceRecords.length,
        presentCount,
        absentCount,
        lateCount,
        attendanceRate,
        dailyBreakdown,
      },
      performance: {
        totalGrades: grades.length,
        averageGrade,
        highestGrade,
        lowestGrade,
        gradeDistribution,
        topPerformers,
      },
      assignments: {
        totalAssignments: assignments.length,
        totalSubmissions,
        submissionRate,
        averageMarks,
        assignmentsByStatus,
      },
    };
  }

  async generateAIReport(filters: AIReportQueryDto): Promise<AIReportData> {
    const { focus, startDate, endDate } = filters;

    // This is a simplified AI report generation
    // In a real implementation, this would use AI/ML algorithms to analyze data patterns

    const insights = [
      {
        type: 'ATTENDANCE' as const,
        title: 'Attendance Pattern Analysis',
        description: 'Students show consistent attendance patterns with slight variations on Mondays.',
        recommendation: 'Consider implementing Monday morning motivation sessions to improve attendance.',
        priority: 'MEDIUM' as const,
      },
      {
        type: 'PERFORMANCE' as const,
        title: 'Grade Distribution Analysis',
        description: 'Grade distribution shows a normal curve with most students performing in the B+ to A range.',
        recommendation: 'Focus on supporting students in the C range to improve overall performance.',
        priority: 'HIGH' as const,
      },
    ];

    const trends = [
      {
        metric: 'Average Attendance Rate',
        trend: 'INCREASING' as const,
        change: 5.2,
        period: 'Last 30 days',
      },
      {
        metric: 'Average Grade',
        trend: 'STABLE' as const,
        change: 0.1,
        period: 'Last 30 days',
      },
    ];

    const alerts = [
      {
        type: 'WARNING' as const,
        message: '3 students have attendance rates below 70%',
        action: 'Schedule parent meetings',
      },
      {
        type: 'INFO' as const,
        message: 'Mathematics class shows improved performance this month',
      },
    ];

    const recommendations = [
      {
        category: 'Teaching',
        title: 'Implement Peer Learning Groups',
        description: 'Create study groups for students to collaborate and learn from each other.',
        impact: 'HIGH' as const,
      },
      {
        category: 'Assessment',
        title: 'Increase Quiz Frequency',
        description: 'More frequent quizzes can help identify learning gaps early.',
        impact: 'MEDIUM' as const,
      },
    ];

    return {
      insights,
      trends,
      alerts,
      recommendations,
    };
  }
}
