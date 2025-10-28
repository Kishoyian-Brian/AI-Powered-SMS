import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { 
  CreateAssignmentDto, 
  UpdateAssignmentDto, 
  AssignmentQueryDto, 
  CreateStudentAssignmentDto, 
  UpdateStudentAssignmentDto, 
  StudentAssignmentQueryDto,
  BulkCreateStudentAssignmentsDto,
  BulkGradeAssignmentsDto,
  AssignmentSummaryQueryDto
} from './dto/assignment.dto';
import { 
  AssignmentWithRelations, 
  AssignmentWithFullRelations,
  StudentAssignmentWithFullRelations,
  AssignmentStats, 
  StudentAssignmentStats, 
  ClassAssignmentStats, 
  AssignmentSummary 
} from './interfaces/assignment.interface';
import { AssignmentStatus } from '@prisma/client';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createAssignmentDto: CreateAssignmentDto): Promise<AssignmentWithRelations> {
    // Check if class exists
    const classData = await this.prisma.class.findUnique({
      where: { id: createAssignmentDto.classId },
    });

    if (!classData) {
      throw new NotFoundException('Class not found');
    }

    // Check if teacher exists
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: createAssignmentDto.teacherId },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    const newAssignment = await this.prisma.assignment.create({
      data: {
        ...createAssignmentDto,
        dueDate: new Date(createAssignmentDto.dueDate),
      },
      include: {
        class: true,
        teacher: true,
      },
    });

    return newAssignment;
  }

  async findAll(queryDto: AssignmentQueryDto): Promise<{
    assignments: AssignmentWithRelations[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { 
      page = 1, 
      limit = 10, 
      classId, 
      teacherId, 
      title, 
      status, 
      dueDate, 
      startDate, 
      endDate 
    } = queryDto;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (classId) {
      where.classId = classId;
    }

    if (teacherId) {
      where.teacherId = teacherId;
    }

    if (title) {
      where.title = {
        contains: title,
        mode: 'insensitive',
      };
    }

    if (dueDate) {
      const targetDate = new Date(dueDate);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
      where.dueDate = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    if (startDate && endDate) {
      where.dueDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // Note: status filtering would need to be done through studentAssignments
    // This is a simplified version - in a real app, you might want to join with studentAssignments

    const [assignments, total] = await Promise.all([
      this.prisma.assignment.findMany({
        where,
        skip,
        take: limit,
        include: {
          class: true,
          teacher: true,
        },
        orderBy: { dueDate: 'asc' },
      }),
      this.prisma.assignment.count({ where }),
    ]);

    return {
      assignments,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<AssignmentWithFullRelations> {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
      include: {
        class: true,
        teacher: true,
        studentAssignments: {
          include: {
            student: true,
          },
        },
      },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    return assignment;
  }

  async findByClass(classId: string): Promise<AssignmentWithRelations[]> {
    return this.prisma.assignment.findMany({
      where: { classId },
      include: {
        class: true,
        teacher: true,
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async findByTeacher(teacherId: string): Promise<AssignmentWithRelations[]> {
    return this.prisma.assignment.findMany({
      where: { teacherId },
      include: {
        class: true,
        teacher: true,
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async update(id: string, updateAssignmentDto: UpdateAssignmentDto): Promise<AssignmentWithRelations> {
    const existingAssignment = await this.prisma.assignment.findUnique({
      where: { id },
    });

    if (!existingAssignment) {
      throw new NotFoundException('Assignment not found');
    }

    // Check if class exists if classId is being updated
    if (updateAssignmentDto.classId) {
      const classData = await this.prisma.class.findUnique({
        where: { id: updateAssignmentDto.classId },
      });

      if (!classData) {
        throw new NotFoundException('Class not found');
      }
    }

    // Check if teacher exists if teacherId is being updated
    if (updateAssignmentDto.teacherId) {
      const teacher = await this.prisma.teacher.findUnique({
        where: { id: updateAssignmentDto.teacherId },
      });

      if (!teacher) {
        throw new NotFoundException('Teacher not found');
      }
    }

    const updatedAssignment = await this.prisma.assignment.update({
      where: { id },
      data: {
        ...updateAssignmentDto,
        dueDate: updateAssignmentDto.dueDate ? new Date(updateAssignmentDto.dueDate) : undefined,
      },
      include: {
        class: true,
        teacher: true,
      },
    });

    return updatedAssignment;
  }

  async remove(id: string): Promise<void> {
    const existingAssignment = await this.prisma.assignment.findUnique({
      where: { id },
    });

    if (!existingAssignment) {
      throw new NotFoundException('Assignment not found');
    }

    await this.prisma.assignment.delete({
      where: { id },
    });
  }

  // Student Assignment methods
  async createStudentAssignment(createStudentAssignmentDto: CreateStudentAssignmentDto): Promise<StudentAssignmentWithFullRelations> {
    // Check if assignment exists
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: createStudentAssignmentDto.assignmentId },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    // Check if student exists
    const student = await this.prisma.student.findUnique({
      where: { id: createStudentAssignmentDto.studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Check for duplicate student assignment
    const existingStudentAssignment = await this.prisma.studentAssignment.findFirst({
      where: {
        assignmentId: createStudentAssignmentDto.assignmentId,
        studentId: createStudentAssignmentDto.studentId,
      },
    });

    if (existingStudentAssignment) {
      throw new ConflictException('Student assignment already exists');
    }

    const newStudentAssignment = await this.prisma.studentAssignment.create({
      data: createStudentAssignmentDto,
      include: {
        student: true,
        assignment: true,
      },
    });

    return newStudentAssignment;
  }

  async findAllStudentAssignments(queryDto: StudentAssignmentQueryDto): Promise<{
    studentAssignments: StudentAssignmentWithFullRelations[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { 
      page = 1, 
      limit = 10, 
      assignmentId, 
      studentId, 
      status, 
      submitted 
    } = queryDto;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (assignmentId) {
      where.assignmentId = assignmentId;
    }

    if (studentId) {
      where.studentId = studentId;
    }

    if (status) {
      where.status = status;
    }

    if (submitted !== undefined) {
      if (submitted) {
        where.submittedAt = { not: null };
      } else {
        where.submittedAt = null;
      }
    }

    const [studentAssignments, total] = await Promise.all([
      this.prisma.studentAssignment.findMany({
        where,
        skip,
        take: limit,
        include: {
          student: true,
          assignment: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.studentAssignment.count({ where }),
    ]);

    return {
      studentAssignments,
      total,
      page,
      limit,
    };
  }

  async findOneStudentAssignment(id: string): Promise<StudentAssignmentWithFullRelations> {
    const studentAssignment = await this.prisma.studentAssignment.findUnique({
      where: { id },
      include: {
        student: true,
        assignment: true,
      },
    });

    if (!studentAssignment) {
      throw new NotFoundException('Student assignment not found');
    }

    return studentAssignment;
  }

  async updateStudentAssignment(id: string, updateStudentAssignmentDto: UpdateStudentAssignmentDto): Promise<StudentAssignmentWithFullRelations> {
    const existingStudentAssignment = await this.prisma.studentAssignment.findUnique({
      where: { id },
    });

    if (!existingStudentAssignment) {
      throw new NotFoundException('Student assignment not found');
    }

    const updatedStudentAssignment = await this.prisma.studentAssignment.update({
      where: { id },
      data: {
        ...updateStudentAssignmentDto,
        submittedAt: updateStudentAssignmentDto.submittedAt ? new Date(updateStudentAssignmentDto.submittedAt) : undefined,
      },
      include: {
        student: true,
        assignment: true,
      },
    });

    return updatedStudentAssignment;
  }

  async removeStudentAssignment(id: string): Promise<void> {
    const existingStudentAssignment = await this.prisma.studentAssignment.findUnique({
      where: { id },
    });

    if (!existingStudentAssignment) {
      throw new NotFoundException('Student assignment not found');
    }

    await this.prisma.studentAssignment.delete({
      where: { id },
    });
  }

  // Bulk operations
  async bulkCreateStudentAssignments(bulkDto: BulkCreateStudentAssignmentsDto): Promise<StudentAssignmentWithFullRelations[]> {
    const { assignmentId, studentIds } = bulkDto;

    // Check if assignment exists
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    // Validate all students exist
    const students = await this.prisma.student.findMany({
      where: { id: { in: studentIds } },
    });

    if (students.length !== studentIds.length) {
      throw new BadRequestException('One or more students not found');
    }

    // Check for existing student assignments
    const existingStudentAssignments = await this.prisma.studentAssignment.findMany({
      where: {
        assignmentId,
        studentId: { in: studentIds },
      },
    });

    if (existingStudentAssignments.length > 0) {
      throw new ConflictException('Some student assignments already exist');
    }

    // Create all student assignments
    const studentAssignments = await Promise.all(
      studentIds.map(studentId =>
        this.prisma.studentAssignment.create({
          data: {
            assignmentId,
            studentId,
          },
          include: {
            student: true,
            assignment: true,
          },
        })
      )
    );

    return studentAssignments;
  }

  async bulkGradeAssignments(bulkDto: BulkGradeAssignmentsDto): Promise<StudentAssignmentWithFullRelations[]> {
    const { studentAssignmentIds, marksObtained } = bulkDto;

    if (studentAssignmentIds.length !== marksObtained.length) {
      throw new BadRequestException('Number of student assignment IDs must match number of marks');
    }

    // Validate all student assignments exist
    const existingStudentAssignments = await this.prisma.studentAssignment.findMany({
      where: { id: { in: studentAssignmentIds } },
    });

    if (existingStudentAssignments.length !== studentAssignmentIds.length) {
      throw new BadRequestException('One or more student assignments not found');
    }

    // Update all student assignments
    const updatedStudentAssignments = await Promise.all(
      studentAssignmentIds.map((id, index) =>
        this.prisma.studentAssignment.update({
          where: { id },
          data: {
            marksObtained: marksObtained[index],
            status: AssignmentStatus.GRADED,
          },
          include: {
            student: true,
            assignment: true,
          },
        })
      )
    );

    return updatedStudentAssignments;
  }

  // Statistics methods
  async getAssignmentStats(): Promise<AssignmentStats> {
    const [
      totalAssignments,
      assignmentsByClass,
      studentAssignments,
    ] = await Promise.all([
      this.prisma.assignment.count(),
      this.prisma.assignment.groupBy({
        by: ['classId'],
        _count: {
          classId: true,
        },
      }),
      this.prisma.studentAssignment.findMany({
        include: {
          assignment: true,
        },
      }),
    ]);

    // Get class names separately
    const classIds = assignmentsByClass.map(item => item.classId);
    const classes = await this.prisma.class.findMany({
      where: { id: { in: classIds } },
      select: { id: true, name: true },
    });

    // Calculate average marks
    const gradedAssignments = studentAssignments.filter(sa => sa.marksObtained !== null);
    const averageMarks = gradedAssignments.length > 0 
      ? gradedAssignments.reduce((sum, sa) => sum + (sa.marksObtained || 0), 0) / gradedAssignments.length
      : 0;

    // Calculate submission rate
    const submittedAssignments = studentAssignments.filter(sa => sa.submittedAt !== null);
    const submissionRate = studentAssignments.length > 0 ? submittedAssignments.length / studentAssignments.length : 0;

    // Calculate assignments by status
    const assignmentsByStatus = Object.values(AssignmentStatus).map(status => ({
      status,
      count: studentAssignments.filter(sa => sa.status === status).length,
    }));

    return {
      totalAssignments,
      assignmentsByStatus,
      assignmentsByClass: assignmentsByClass.map(item => {
        const classData = classes.find(c => c.id === item.classId);
        return {
          classId: item.classId,
          className: classData?.name || 'Unknown',
          count: item._count.classId,
        };
      }),
      averageMarks,
      submissionRate,
    };
  }

  async getStudentAssignmentStats(studentId: string): Promise<StudentAssignmentStats> {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const studentAssignments = await this.prisma.studentAssignment.findMany({
      where: { studentId },
      include: {
        assignment: true,
      },
    });

    const totalAssignments = studentAssignments.length;
    const submittedAssignments = studentAssignments.filter(sa => sa.submittedAt !== null).length;
    const gradedAssignments = studentAssignments.filter(sa => sa.status === AssignmentStatus.GRADED).length;
    
    const gradedWithMarks = studentAssignments.filter(sa => sa.marksObtained !== null);
    const averageMarks = gradedWithMarks.length > 0 
      ? gradedWithMarks.reduce((sum, sa) => sum + (sa.marksObtained || 0), 0) / gradedWithMarks.length
      : 0;

    const submissionRate = totalAssignments > 0 ? submittedAssignments / totalAssignments : 0;

    return {
      studentId,
      studentName: student.name,
      totalAssignments,
      submittedAssignments,
      gradedAssignments,
      averageMarks,
      submissionRate,
    };
  }

  async getClassAssignmentStats(classId: string): Promise<ClassAssignmentStats> {
    const classData = await this.prisma.class.findUnique({
      where: { id: classId },
    });

    if (!classData) {
      throw new NotFoundException('Class not found');
    }

    const assignments = await this.prisma.assignment.findMany({
      where: { classId },
      include: {
        studentAssignments: true,
      },
    });

    const totalAssignments = assignments.length;
    const allStudentAssignments = assignments.flatMap(a => a.studentAssignments);
    
    const averageSubmissionRate = allStudentAssignments.length > 0 
      ? allStudentAssignments.filter(sa => sa.submittedAt !== null).length / allStudentAssignments.length
      : 0;

    const gradedAssignments = allStudentAssignments.filter(sa => sa.marksObtained !== null);
    const averageMarks = gradedAssignments.length > 0 
      ? gradedAssignments.reduce((sum, sa) => sum + (sa.marksObtained || 0), 0) / gradedAssignments.length
      : 0;

    const assignmentsByStatus = Object.values(AssignmentStatus).map(status => ({
      status,
      count: allStudentAssignments.filter(sa => sa.status === status).length,
    }));

    return {
      classId,
      className: classData.name,
      totalAssignments,
      averageSubmissionRate,
      averageMarks,
      assignmentsByStatus,
    };
  }

  async getAssignmentSummary(queryDto: AssignmentSummaryQueryDto): Promise<AssignmentSummary> {
    const { startDate, endDate, classId, studentId } = queryDto;

    const where: any = {};

    if (startDate && endDate) {
      where.dueDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    if (classId) {
      where.classId = classId;
    }

    const [overallStats, assignments, studentAssignments] = await Promise.all([
      this.getAssignmentStats(),
      this.prisma.assignment.findMany({
        where,
        include: {
          class: true,
          teacher: true,
        },
      }),
      this.prisma.studentAssignment.findMany({
        where: studentId ? { studentId } : {},
        include: {
          student: true,
          assignment: true,
        },
      }),
    ]);

    // Get unique students and classes for stats
    const uniqueStudents = [...new Set(studentAssignments.map(sa => sa.studentId))];
    const uniqueClasses = [...new Set(assignments.map(a => a.classId))];

    const [studentStats, classStats] = await Promise.all([
      Promise.all(uniqueStudents.map(studentId => this.getStudentAssignmentStats(studentId))),
      Promise.all(uniqueClasses.map(classId => this.getClassAssignmentStats(classId))),
    ]);

    return {
      totalAssignments: assignments.length,
      totalStudentAssignments: studentAssignments.length,
      overallStats,
      studentStats,
      classStats,
    };
  }
}
