import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AuthService } from '../auth/auth.service';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';
import { CreateTeacherDto, UpdateTeacherDto, TeacherQueryDto } from './dto/teacher.dto';
import { TeacherWithUser, TeacherStats } from './interfaces/teacher.interface';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TeachersService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}

  /**
   * Create a new teacher
   */
  async create(createTeacherDto: CreateTeacherDto): Promise<TeacherWithUser> {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createTeacherDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createTeacherDto.password, 10);

    // Create user and teacher in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email: createTeacherDto.email,
          password: hashedPassword,
          role: UserRole.TEACHER,
          isEmailVerified: false,
        },
      });

      // Create teacher
      const teacher = await tx.teacher.create({
        data: {
          userId: user.id,
          name: createTeacherDto.name,
          email: createTeacherDto.email,
          phone: createTeacherDto.phone,
          subject: createTeacherDto.subject,
          experience: createTeacherDto.experience,
        },
        include: {
          user: true,
          classes: {
            select: {
              id: true,
              name: true,
              subject: true,
              schedule: true,
            },
          },
        },
      });

      return teacher;
    });

    // Send welcome email
    try {
      await this.emailService.sendWelcomeEmail(
        createTeacherDto.email,
        createTeacherDto.name,
      );
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }

    return result;
  }

  /**
   * Get all teachers with pagination and search
   */
  async findAll(queryDto: TeacherQueryDto): Promise<{
    teachers: TeacherWithUser[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, search, subject, experience } = queryDto;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (subject) {
      where.subject = { contains: subject, mode: 'insensitive' };
    }

    if (experience) {
      where.experience = { contains: experience, mode: 'insensitive' };
    }

    const [teachers, total] = await Promise.all([
      this.prisma.teacher.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              isEmailVerified: true,
              emailVerifiedAt: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          classes: {
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
      this.prisma.teacher.count({ where }),
    ]);

    return {
      teachers,
      total,
      page,
      limit,
    };
  }

  /**
   * Get teacher by ID
   */
  async findOne(id: string): Promise<TeacherWithUser> {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isEmailVerified: true,
            emailVerifiedAt: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        classes: {
          select: {
            id: true,
            name: true,
            subject: true,
            schedule: true,
          },
        },
      },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    return teacher;
  }

  /**
   * Get teacher by email
   */
  async findByEmail(email: string): Promise<TeacherWithUser> {
    const teacher = await this.prisma.teacher.findFirst({
      where: { email },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isEmailVerified: true,
            emailVerifiedAt: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        classes: {
          select: {
            id: true,
            name: true,
            subject: true,
            schedule: true,
          },
        },
      },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    return teacher;
  }

  /**
   * Get teachers by subject
   */
  async findBySubject(subject: string): Promise<TeacherWithUser[]> {
    return this.prisma.teacher.findMany({
      where: {
        subject: { contains: subject, mode: 'insensitive' },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isEmailVerified: true,
            emailVerifiedAt: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        classes: {
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

  /**
   * Update teacher
   */
  async update(id: string, updateTeacherDto: UpdateTeacherDto): Promise<TeacherWithUser> {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    const updatedTeacher = await this.prisma.teacher.update({
      where: { id },
      data: updateTeacherDto,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isEmailVerified: true,
            emailVerifiedAt: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        classes: {
          select: {
            id: true,
            name: true,
            subject: true,
            schedule: true,
          },
        },
      },
    });

    return updatedTeacher;
  }

  /**
   * Delete teacher
   */
  async remove(id: string): Promise<void> {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    // Delete teacher (user will be deleted by cascade)
    await this.prisma.teacher.delete({
      where: { id },
    });
  }

  /**
   * Get teacher statistics
   */
  async getTeacherStats(): Promise<TeacherStats> {
    const [total, bySubject, verified, unverified] = await Promise.all([
      this.prisma.teacher.count(),
      this.prisma.teacher.groupBy({
        by: ['subject'],
        _count: { id: true },
      }),
      this.prisma.teacher.count({
        where: {
          user: {
            isEmailVerified: true,
          },
        },
      }),
      this.prisma.teacher.count({
        where: {
          user: {
            isEmailVerified: false,
          },
        },
      }),
    ]);

    // Calculate average experience (assuming experience is stored as string like "5 years")
    const teachersWithExperience = await this.prisma.teacher.findMany({
      select: { experience: true },
    });

    const averageExperience = teachersWithExperience.reduce((sum, teacher) => {
      const years = parseInt(teacher.experience.match(/\d+/)?.[0] || '0');
      return sum + years;
    }, 0) / teachersWithExperience.length || 0;

    return {
      total,
      bySubject: bySubject.map((item) => ({
        subject: item.subject,
        count: item._count.id,
      })),
      verified,
      unverified,
      averageExperience: Math.round(averageExperience * 10) / 10, // Round to 1 decimal place
    };
  }

  /**
   * Get teachers by class ID
   */
  async getTeachersByClass(classId: string): Promise<TeacherWithUser[]> {
    return this.prisma.teacher.findMany({
      where: {
        classes: {
          some: {
            id: classId,
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isEmailVerified: true,
            emailVerifiedAt: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        classes: {
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
}
