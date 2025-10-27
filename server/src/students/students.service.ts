import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateStudentDto, UpdateStudentDto, StudentQueryDto } from './dto';
import { StudentWithUser, CreateStudentData, UpdateStudentData } from './interfaces/student.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(createStudentDto: CreateStudentDto): Promise<StudentWithUser> {
    const { password, ...studentData } = createStudentDto;

    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createStudentDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Check if roll number already exists
    const existingStudent = await this.prisma.student.findUnique({
      where: { rollNo: createStudentDto.rollNo },
    });

    if (existingStudent) {
      throw new ConflictException('Roll number already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and student in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email: createStudentDto.email,
          password: hashedPassword,
          role: 'STUDENT',
          isEmailVerified: false,
        },
      });

      // Create student
      const student = await tx.student.create({
        data: {
          userId: user.id,
          name: createStudentDto.name,
          email: createStudentDto.email,
          rollNo: createStudentDto.rollNo,
          phone: createStudentDto.phone,
          dateOfBirth: createStudentDto.dateOfBirth ? new Date(createStudentDto.dateOfBirth) : null,
          address: createStudentDto.address,
          classId: createStudentDto.classId,
        },
        include: {
          user: true,
          class: {
            select: {
              id: true,
              name: true,
              subject: true,
              schedule: true,
            },
          },
        },
      });

      return student;
    });

    return result;
  }

  async findAll(query: StudentQueryDto): Promise<{ students: StudentWithUser[]; total: number; page: number; limit: number }> {
    const { classId, search, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (classId) {
      where.classId = classId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { rollNo: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [students, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: true,
          class: {
            select: {
              id: true,
              name: true,
              subject: true,
              schedule: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.student.count({ where }),
    ]);

    return {
      students,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<StudentWithUser> {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        user: true,
        class: {
          select: {
            id: true,
            name: true,
            subject: true,
            schedule: true,
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  async findByRollNo(rollNo: string): Promise<StudentWithUser> {
    const student = await this.prisma.student.findUnique({
      where: { rollNo },
      include: {
        user: true,
        class: {
          select: {
            id: true,
            name: true,
            subject: true,
            schedule: true,
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<StudentWithUser> {
    // Check if student exists
    const existingStudent = await this.prisma.student.findUnique({
      where: { id },
    });

    if (!existingStudent) {
      throw new NotFoundException('Student not found');
    }

    // Check if email is being updated and if it already exists
    if (updateStudentDto.email && updateStudentDto.email !== existingStudent.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: updateStudentDto.email },
      });

      if (emailExists) {
        throw new ConflictException('Email already exists');
      }
    }

    // Check if roll number is being updated and if it already exists
    if (updateStudentDto.rollNo && updateStudentDto.rollNo !== existingStudent.rollNo) {
      const rollNoExists = await this.prisma.student.findUnique({
        where: { rollNo: updateStudentDto.rollNo },
      });

      if (rollNoExists) {
        throw new ConflictException('Roll number already exists');
      }
    }

    // Prepare update data
    const updateData: any = {};

    if (updateStudentDto.name) updateData.name = updateStudentDto.name;
    if (updateStudentDto.rollNo) updateData.rollNo = updateStudentDto.rollNo;
    if (updateStudentDto.phone !== undefined) updateData.phone = updateStudentDto.phone;
    if (updateStudentDto.dateOfBirth) updateData.dateOfBirth = new Date(updateStudentDto.dateOfBirth);
    if (updateStudentDto.address !== undefined) updateData.address = updateStudentDto.address;
    if (updateStudentDto.classId !== undefined) updateData.classId = updateStudentDto.classId;

    // Update student and user email if provided
    const result = await this.prisma.$transaction(async (tx) => {
      // Update student
      const student = await tx.student.update({
        where: { id },
        data: updateData,
        include: {
          user: true,
          class: {
            select: {
              id: true,
              name: true,
              subject: true,
              schedule: true,
            },
          },
        },
      });

      // Update user email if provided
      if (updateStudentDto.email) {
        await tx.user.update({
          where: { id: student.userId },
          data: { email: updateStudentDto.email },
        });
      }

      return student;
    });

    return result;
  }

  async remove(id: string): Promise<void> {
    const student = await this.prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Delete student (user will be deleted due to cascade)
    await this.prisma.student.delete({
      where: { id },
    });
  }

  async getStudentsByClass(classId: string): Promise<StudentWithUser[]> {
    return this.prisma.student.findMany({
      where: { classId },
      include: {
        user: true,
        class: {
          select: {
            id: true,
            name: true,
            subject: true,
            schedule: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getStudentStats(): Promise<{
    total: number;
    byClass: { classId: string; className: string; count: number }[];
    verified: number;
    unverified: number;
  }> {
    const [total, byClass, verified, unverified] = await Promise.all([
      this.prisma.student.count(),
      this.prisma.student.groupBy({
        by: ['classId'],
        _count: { id: true },
      }),
      this.prisma.student.count({
        where: {
          user: {
            isEmailVerified: true,
          },
        },
      }),
      this.prisma.student.count({
        where: {
          user: {
            isEmailVerified: false,
          },
        },
      }),
    ]);

    // Get class names for the grouped results
    const classIds = byClass.map(item => item.classId).filter((id): id is string => id !== null);
    const classes = classIds.length > 0 ? await this.prisma.class.findMany({
      where: { id: { in: classIds } },
      select: { id: true, name: true },
    }) : [];

    return {
      total,
      byClass: byClass.map((item) => {
        const className = item.classId 
          ? classes.find(c => c.id === item.classId)?.name || 'Unknown Class'
          : 'Unassigned';
        return {
          classId: item.classId || 'unassigned',
          className,
          count: item._count.id,
        };
      }),
      verified,
      unverified,
    };
  }
}
