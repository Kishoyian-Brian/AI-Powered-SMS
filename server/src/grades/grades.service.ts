import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { 
  CreateGradeDto, 
  UpdateGradeDto, 
  GradeQueryDto, 
  BulkCreateGradesDto,
  BulkUpdateGradesDto,
  GradeSummaryQueryDto,
  GradeCalculationDto,
  GradeDistributionQueryDto
} from './dto/grade.dto';
import { 
  GradeWithStudent, 
  GradeStats, 
  StudentGradeStats, 
  SubjectGradeStats, 
  ClassGradeStats, 
  GradeSummary,
  GradeCalculation,
  GradeDistribution
} from './interfaces/grade.interface';

@Injectable()
export class GradesService {
  constructor(private prisma: PrismaService) {}

  // Grade calculation utilities
  private calculateGradeLetter(marks: number, totalMarks: number): string {
    const percentage = (marks / totalMarks) * 100;
    
    if (percentage >= 90) return 'A+';
    if (percentage >= 85) return 'A';
    if (percentage >= 80) return 'A-';
    if (percentage >= 75) return 'B+';
    if (percentage >= 70) return 'B';
    if (percentage >= 65) return 'B-';
    if (percentage >= 60) return 'C+';
    if (percentage >= 55) return 'C';
    if (percentage >= 50) return 'C-';
    if (percentage >= 45) return 'D+';
    if (percentage >= 40) return 'D';
    return 'F';
  }

  private calculateGPA(grade: string): number {
    const gradeMap: { [key: string]: number } = {
      'A+': 4.0,
      'A': 4.0,
      'A-': 3.7,
      'B+': 3.3,
      'B': 3.0,
      'B-': 2.7,
      'C+': 2.3,
      'C': 2.0,
      'C-': 1.7,
      'D+': 1.3,
      'D': 1.0,
      'F': 0.0,
    };
    return gradeMap[grade] || 0.0;
  }

  async create(createGradeDto: CreateGradeDto): Promise<GradeWithStudent> {
    // Check if student exists
    const student = await this.prisma.student.findUnique({
      where: { id: createGradeDto.studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Validate marks
    if (createGradeDto.marks > createGradeDto.totalMarks) {
      throw new BadRequestException('Marks cannot exceed total marks');
    }

    // Calculate grade if not provided
    const grade = createGradeDto.grade || this.calculateGradeLetter(createGradeDto.marks, createGradeDto.totalMarks);

    const newGrade = await this.prisma.grade.create({
      data: {
        ...createGradeDto,
        grade,
        examDate: new Date(createGradeDto.examDate),
      },
      include: {
        student: true,
      },
    });

    return newGrade;
  }

  async findAll(queryDto: GradeQueryDto): Promise<{
    grades: GradeWithStudent[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { 
      page = 1, 
      limit = 10, 
      studentId, 
      subject, 
      examType, 
      grade, 
      examDate, 
      startDate, 
      endDate 
    } = queryDto;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (studentId) {
      where.studentId = studentId;
    }

    if (subject) {
      where.subject = {
        contains: subject,
        mode: 'insensitive',
      };
    }

    if (examType) {
      where.examType = {
        contains: examType,
        mode: 'insensitive',
      };
    }

    if (grade) {
      where.grade = grade;
    }

    if (examDate) {
      const targetDate = new Date(examDate);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
      where.examDate = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    if (startDate && endDate) {
      where.examDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const [grades, total] = await Promise.all([
      this.prisma.grade.findMany({
        where,
        skip,
        take: limit,
        include: {
          student: true,
        },
        orderBy: { examDate: 'desc' },
      }),
      this.prisma.grade.count({ where }),
    ]);

    return {
      grades,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<GradeWithStudent> {
    const grade = await this.prisma.grade.findUnique({
      where: { id },
      include: {
        student: true,
      },
    });

    if (!grade) {
      throw new NotFoundException('Grade not found');
    }

    return grade;
  }

  async findByStudent(studentId: string): Promise<GradeWithStudent[]> {
    return this.prisma.grade.findMany({
      where: { studentId },
      include: {
        student: true,
      },
      orderBy: { examDate: 'desc' },
    });
  }

  async findBySubject(subject: string): Promise<GradeWithStudent[]> {
    return this.prisma.grade.findMany({
      where: { 
        subject: {
          contains: subject,
          mode: 'insensitive',
        },
      },
      include: {
        student: true,
      },
      orderBy: { examDate: 'desc' },
    });
  }

  async findByExamType(examType: string): Promise<GradeWithStudent[]> {
    return this.prisma.grade.findMany({
      where: { 
        examType: {
          contains: examType,
          mode: 'insensitive',
        },
      },
      include: {
        student: true,
      },
      orderBy: { examDate: 'desc' },
    });
  }

  async update(id: string, updateGradeDto: UpdateGradeDto): Promise<GradeWithStudent> {
    const existingGrade = await this.prisma.grade.findUnique({
      where: { id },
    });

    if (!existingGrade) {
      throw new NotFoundException('Grade not found');
    }

    // Validate marks if both are provided
    if (updateGradeDto.marks !== undefined && updateGradeDto.totalMarks !== undefined) {
      if (updateGradeDto.marks > updateGradeDto.totalMarks) {
        throw new BadRequestException('Marks cannot exceed total marks');
      }
    }

    // Calculate grade if marks are updated
    let grade = updateGradeDto.grade;
    if (updateGradeDto.marks !== undefined || updateGradeDto.totalMarks !== undefined) {
      const marks = updateGradeDto.marks ?? existingGrade.marks;
      const totalMarks = updateGradeDto.totalMarks ?? existingGrade.totalMarks;
      grade = this.calculateGradeLetter(marks, totalMarks);
    }

    const updatedGrade = await this.prisma.grade.update({
      where: { id },
      data: {
        ...updateGradeDto,
        grade,
        examDate: updateGradeDto.examDate ? new Date(updateGradeDto.examDate) : undefined,
      },
      include: {
        student: true,
      },
    });

    return updatedGrade;
  }

  async remove(id: string): Promise<void> {
    const existingGrade = await this.prisma.grade.findUnique({
      where: { id },
    });

    if (!existingGrade) {
      throw new NotFoundException('Grade not found');
    }

    await this.prisma.grade.delete({
      where: { id },
    });
  }

  // Bulk operations
  async bulkCreate(bulkDto: BulkCreateGradesDto): Promise<GradeWithStudent[]> {
    const { grades } = bulkDto;

    // Validate all students exist
    const studentIds = grades.map(grade => grade.studentId);
    const students = await this.prisma.student.findMany({
      where: { id: { in: studentIds } },
    });

    if (students.length !== studentIds.length) {
      throw new BadRequestException('One or more students not found');
    }

    // Validate marks
    for (const grade of grades) {
      if (grade.marks > grade.totalMarks) {
        throw new BadRequestException('Marks cannot exceed total marks');
      }
    }

    // Create all grades
    const createdGrades = await Promise.all(
      grades.map(grade =>
        this.prisma.grade.create({
          data: {
            ...grade,
            grade: grade.grade || this.calculateGradeLetter(grade.marks, grade.totalMarks),
            examDate: new Date(grade.examDate),
          },
          include: {
            student: true,
          },
        })
      )
    );

    return createdGrades;
  }

  async bulkUpdate(bulkDto: BulkUpdateGradesDto): Promise<GradeWithStudent[]> {
    const { gradeIds, updates } = bulkDto;

    if (gradeIds.length !== updates.length) {
      throw new BadRequestException('Number of grade IDs must match number of updates');
    }

    // Validate all grades exist
    const existingGrades = await this.prisma.grade.findMany({
      where: { id: { in: gradeIds } },
    });

    if (existingGrades.length !== gradeIds.length) {
      throw new BadRequestException('One or more grades not found');
    }

    // Update all grades
    const updatedGrades = await Promise.all(
      gradeIds.map((id, index) => {
        const update = updates[index];
        const existingGrade = existingGrades.find(g => g.id === id);
        
        // Calculate grade if marks are updated
        let grade = update.grade;
        if (update.marks !== undefined || update.totalMarks !== undefined) {
          const marks = update.marks ?? existingGrade!.marks;
          const totalMarks = update.totalMarks ?? existingGrade!.totalMarks;
          grade = this.calculateGradeLetter(marks, totalMarks);
        }

        return this.prisma.grade.update({
          where: { id },
          data: {
            ...update,
            grade,
          },
          include: {
            student: true,
          },
        });
      })
    );

    return updatedGrades;
  }

  // Statistics methods
  async getGradeStats(): Promise<GradeStats> {
    const [
      totalGrades,
      gradesBySubject,
      gradesByExamType,
      gradesByGrade,
      allGrades,
    ] = await Promise.all([
      this.prisma.grade.count(),
      this.prisma.grade.groupBy({
        by: ['subject'],
        _count: {
          subject: true,
        },
        _avg: {
          marks: true,
        },
      }),
      this.prisma.grade.groupBy({
        by: ['examType'],
        _count: {
          examType: true,
        },
        _avg: {
          marks: true,
        },
      }),
      this.prisma.grade.groupBy({
        by: ['grade'],
        _count: {
          grade: true,
        },
      }),
      this.prisma.grade.findMany(),
    ]);

    const averageMarks = allGrades.length > 0 
      ? allGrades.reduce((sum, grade) => sum + grade.marks, 0) / allGrades.length
      : 0;

    const highestMarks = allGrades.length > 0 
      ? Math.max(...allGrades.map(grade => grade.marks))
      : 0;

    const lowestMarks = allGrades.length > 0 
      ? Math.min(...allGrades.map(grade => grade.marks))
      : 0;

    return {
      totalGrades,
      gradesBySubject: gradesBySubject.map(item => ({
        subject: item.subject,
        count: item._count.subject,
        averageMarks: item._avg.marks || 0,
      })),
      gradesByExamType: gradesByExamType.map(item => ({
        examType: item.examType,
        count: item._count.examType,
        averageMarks: item._avg.marks || 0,
      })),
      gradesByGrade: gradesByGrade.map(item => ({
        grade: item.grade || 'Unknown',
        count: item._count.grade,
      })),
      averageMarks,
      highestMarks,
      lowestMarks,
    };
  }

  async getStudentGradeStats(studentId: string): Promise<StudentGradeStats> {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const grades = await this.prisma.grade.findMany({
      where: { studentId },
    });

    if (grades.length === 0) {
      return {
        studentId,
        studentName: student.name,
        totalGrades: 0,
        averageMarks: 0,
        highestMarks: 0,
        lowestMarks: 0,
        gradesBySubject: [],
        gradesByExamType: [],
        gradesByGrade: [],
      };
    }

    const averageMarks = grades.reduce((sum, grade) => sum + grade.marks, 0) / grades.length;
    const highestMarks = Math.max(...grades.map(grade => grade.marks));
    const lowestMarks = Math.min(...grades.map(grade => grade.marks));

    // Group by subject
    const subjectGroups = grades.reduce((acc, grade) => {
      if (!acc[grade.subject]) {
        acc[grade.subject] = { count: 0, totalMarks: 0 };
      }
      acc[grade.subject].count++;
      acc[grade.subject].totalMarks += grade.marks;
      return acc;
    }, {} as Record<string, { count: number; totalMarks: number }>);

    const gradesBySubject = Object.entries(subjectGroups).map(([subject, data]) => ({
      subject,
      count: data.count,
      averageMarks: data.totalMarks / data.count,
    }));

    // Group by exam type
    const examTypeGroups = grades.reduce((acc, grade) => {
      if (!acc[grade.examType]) {
        acc[grade.examType] = { count: 0, totalMarks: 0 };
      }
      acc[grade.examType].count++;
      acc[grade.examType].totalMarks += grade.marks;
      return acc;
    }, {} as Record<string, { count: number; totalMarks: number }>);

    const gradesByExamType = Object.entries(examTypeGroups).map(([examType, data]) => ({
      examType,
      count: data.count,
      averageMarks: data.totalMarks / data.count,
    }));

    // Group by grade
    const gradeGroups = grades.reduce((acc, grade) => {
      const gradeValue = grade.grade || 'Unknown';
      acc[gradeValue] = (acc[gradeValue] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const gradesByGrade = Object.entries(gradeGroups).map(([grade, count]) => ({
      grade,
      count,
    }));

    return {
      studentId,
      studentName: student.name,
      totalGrades: grades.length,
      averageMarks,
      highestMarks,
      lowestMarks,
      gradesBySubject,
      gradesByExamType,
      gradesByGrade,
    };
  }

  async getSubjectGradeStats(subject: string): Promise<SubjectGradeStats> {
    const grades = await this.prisma.grade.findMany({
      where: { 
        subject: {
          contains: subject,
          mode: 'insensitive',
        },
      },
    });

    if (grades.length === 0) {
      return {
        subject,
        totalGrades: 0,
        averageMarks: 0,
        highestMarks: 0,
        lowestMarks: 0,
        gradesByExamType: [],
        gradesByGrade: [],
      };
    }

    const averageMarks = grades.reduce((sum, grade) => sum + grade.marks, 0) / grades.length;
    const highestMarks = Math.max(...grades.map(grade => grade.marks));
    const lowestMarks = Math.min(...grades.map(grade => grade.marks));

    // Group by exam type
    const examTypeGroups = grades.reduce((acc, grade) => {
      if (!acc[grade.examType]) {
        acc[grade.examType] = { count: 0, totalMarks: 0 };
      }
      acc[grade.examType].count++;
      acc[grade.examType].totalMarks += grade.marks;
      return acc;
    }, {} as Record<string, { count: number; totalMarks: number }>);

    const gradesByExamType = Object.entries(examTypeGroups).map(([examType, data]) => ({
      examType,
      count: data.count,
      averageMarks: data.totalMarks / data.count,
    }));

    // Group by grade
    const gradeGroups = grades.reduce((acc, grade) => {
      const gradeValue = grade.grade || 'Unknown';
      acc[gradeValue] = (acc[gradeValue] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const gradesByGrade = Object.entries(gradeGroups).map(([grade, count]) => ({
      grade,
      count,
    }));

    return {
      subject,
      totalGrades: grades.length,
      averageMarks,
      highestMarks,
      lowestMarks,
      gradesByExamType,
      gradesByGrade,
    };
  }

  async getClassGradeStats(classId: string): Promise<ClassGradeStats> {
    const classData = await this.prisma.class.findUnique({
      where: { id: classId },
      include: {
        students: true,
      },
    });

    if (!classData) {
      throw new NotFoundException('Class not found');
    }

    const studentIds = classData.students.map(student => student.id);
    const grades = await this.prisma.grade.findMany({
      where: { studentId: { in: studentIds } },
    });

    if (grades.length === 0) {
      return {
        classId,
        className: classData.name,
        totalStudents: classData.students.length,
        totalGrades: 0,
        averageMarks: 0,
        gradesBySubject: [],
        gradesByExamType: [],
        gradesByGrade: [],
      };
    }

    const averageMarks = grades.reduce((sum, grade) => sum + grade.marks, 0) / grades.length;

    // Group by subject
    const subjectGroups = grades.reduce((acc, grade) => {
      if (!acc[grade.subject]) {
        acc[grade.subject] = { count: 0, totalMarks: 0 };
      }
      acc[grade.subject].count++;
      acc[grade.subject].totalMarks += grade.marks;
      return acc;
    }, {} as Record<string, { count: number; totalMarks: number }>);

    const gradesBySubject = Object.entries(subjectGroups).map(([subject, data]) => ({
      subject,
      count: data.count,
      averageMarks: data.totalMarks / data.count,
    }));

    // Group by exam type
    const examTypeGroups = grades.reduce((acc, grade) => {
      if (!acc[grade.examType]) {
        acc[grade.examType] = { count: 0, totalMarks: 0 };
      }
      acc[grade.examType].count++;
      acc[grade.examType].totalMarks += grade.marks;
      return acc;
    }, {} as Record<string, { count: number; totalMarks: number }>);

    const gradesByExamType = Object.entries(examTypeGroups).map(([examType, data]) => ({
      examType,
      count: data.count,
      averageMarks: data.totalMarks / data.count,
    }));

    // Group by grade
    const gradeGroups = grades.reduce((acc, grade) => {
      const gradeValue = grade.grade || 'Unknown';
      acc[gradeValue] = (acc[gradeValue] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const gradesByGrade = Object.entries(gradeGroups).map(([grade, count]) => ({
      grade,
      count,
    }));

    return {
      classId,
      className: classData.name,
      totalStudents: classData.students.length,
      totalGrades: grades.length,
      averageMarks,
      gradesBySubject,
      gradesByExamType,
      gradesByGrade,
    };
  }

  async getGradeSummary(queryDto: GradeSummaryQueryDto): Promise<GradeSummary> {
    const { startDate, endDate, classId, studentId, subject } = queryDto;

    const where: any = {};

    if (startDate && endDate) {
      where.examDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
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

    const [overallStats, grades] = await Promise.all([
      this.getGradeStats(),
      this.prisma.grade.findMany({
        where,
        include: {
          student: true,
        },
      }),
    ]);

    // Get unique students, subjects, and classes for stats
    const uniqueStudents = [...new Set(grades.map(g => g.studentId))];
    const uniqueSubjects = [...new Set(grades.map(g => g.subject))];
    const uniqueClasses = classId ? [classId] : [];

    const [studentStats, subjectStats, classStats] = await Promise.all([
      Promise.all(uniqueStudents.map(studentId => this.getStudentGradeStats(studentId))),
      Promise.all(uniqueSubjects.map(subject => this.getSubjectGradeStats(subject))),
      Promise.all(uniqueClasses.map(classId => this.getClassGradeStats(classId))),
    ]);

    return {
      totalGrades: grades.length,
      overallStats,
      studentStats,
      subjectStats,
      classStats,
    };
  }

  // Utility methods
  async calculateGrade(data: GradeCalculationDto): Promise<GradeCalculation> {
    const percentage = (data.marks / data.totalMarks) * 100;
    const grade = this.calculateGradeLetter(data.marks, data.totalMarks);
    const gpa = this.calculateGPA(grade);

    return {
      marks: data.marks,
      totalMarks: data.totalMarks,
      percentage,
      grade,
      gpa,
    };
  }

  async getGradeDistribution(queryDto: GradeDistributionQueryDto): Promise<GradeDistribution[]> {
    const { subject, examType, startDate, endDate } = queryDto;

    const where: any = {};

    if (subject) {
      where.subject = {
        contains: subject,
        mode: 'insensitive',
      };
    }

    if (examType) {
      where.examType = {
        contains: examType,
        mode: 'insensitive',
      };
    }

    if (startDate && endDate) {
      where.examDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const grades = await this.prisma.grade.findMany({
      where,
      include: {
        student: true,
      },
    });

    const totalGrades = grades.length;
    const gradeGroups = grades.reduce((acc, grade) => {
      const gradeValue = grade.grade || 'Unknown';
      if (!acc[gradeValue]) {
        acc[gradeValue] = { count: 0, students: [] };
      }
      acc[gradeValue].count++;
      acc[gradeValue].students.push(grade.student.name);
      return acc;
    }, {} as Record<string, { count: number; students: string[] }>);

    return Object.entries(gradeGroups).map(([grade, data]) => ({
      grade,
      count: data.count,
      percentage: totalGrades > 0 ? (data.count / totalGrades) * 100 : 0,
      students: data.students,
    }));
  }
}
