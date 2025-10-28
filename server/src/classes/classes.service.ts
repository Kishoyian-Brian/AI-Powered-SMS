import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateClassDto, UpdateClassDto, ClassQueryDto } from './dto/class.dto';
import { ClassWithRelations, ClassStats } from './interfaces/class.interface';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  async create(createClassDto: CreateClassDto): Promise<ClassWithRelations> {
    // Check if teacher exists if teacherId is provided
    if (createClassDto.teacherId) {
      const teacher = await this.prisma.teacher.findUnique({
        where: { id: createClassDto.teacherId },
      });

      if (!teacher) {
        throw new NotFoundException('Teacher not found');
      }
    }

    // Check for duplicate class name
    const existingClass = await this.prisma.class.findFirst({
      where: {
        name: createClassDto.name,
        subject: createClassDto.subject,
      },
    });

    if (existingClass) {
      throw new ConflictException('Class with this name and subject already exists');
    }

    const newClass = await this.prisma.class.create({
      data: createClassDto,
      include: {
        teacher: true,
        students: true,
      },
    });

    return newClass;
  }

  async findAll(queryDto: ClassQueryDto): Promise<{
    classes: ClassWithRelations[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, search, subject, teacherId } = queryDto;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
        { schedule: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (subject) {
      where.subject = { contains: subject, mode: 'insensitive' };
    }

    if (teacherId) {
      where.teacherId = teacherId;
    }

    const [classes, total] = await Promise.all([
      this.prisma.class.findMany({
        where,
        skip,
        take: limit,
        include: {
          teacher: true,
          students: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.class.count({ where }),
    ]);

    return {
      classes,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<ClassWithRelations> {
    const classData = await this.prisma.class.findUnique({
      where: { id },
      include: {
        teacher: true,
        students: true,
      },
    });

    if (!classData) {
      throw new NotFoundException('Class not found');
    }

    return classData;
  }

  async findByName(name: string): Promise<ClassWithRelations> {
    const classData = await this.prisma.class.findFirst({
      where: { name },
      include: {
        teacher: true,
        students: true,
      },
    });

    if (!classData) {
      throw new NotFoundException('Class not found');
    }

    return classData;
  }

  async findBySubject(subject: string): Promise<ClassWithRelations[]> {
    return this.prisma.class.findMany({
      where: {
        subject: { contains: subject, mode: 'insensitive' },
      },
      include: {
        teacher: true,
        students: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByTeacher(teacherId: string): Promise<ClassWithRelations[]> {
    return this.prisma.class.findMany({
      where: { teacherId },
      include: {
        teacher: true,
        students: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, updateClassDto: UpdateClassDto): Promise<ClassWithRelations> {
    // Check if class exists
    const existingClass = await this.prisma.class.findUnique({
      where: { id },
    });

    if (!existingClass) {
      throw new NotFoundException('Class not found');
    }

    // Check if teacher exists if teacherId is provided
    if (updateClassDto.teacherId) {
      const teacher = await this.prisma.teacher.findUnique({
        where: { id: updateClassDto.teacherId },
      });

      if (!teacher) {
        throw new NotFoundException('Teacher not found');
      }
    }

    // Check for duplicate class name if name is being updated
    if (updateClassDto.name) {
      const duplicateClass = await this.prisma.class.findFirst({
        where: {
          name: updateClassDto.name,
          subject: updateClassDto.subject || existingClass.subject,
          id: { not: id },
        },
      });

      if (duplicateClass) {
        throw new ConflictException('Class with this name and subject already exists');
      }
    }

    const updatedClass = await this.prisma.class.update({
      where: { id },
      data: updateClassDto,
      include: {
        teacher: true,
        students: true,
      },
    });

    return updatedClass;
  }

  async remove(id: string): Promise<void> {
    const existingClass = await this.prisma.class.findUnique({
      where: { id },
    });

    if (!existingClass) {
      throw new NotFoundException('Class not found');
    }

    await this.prisma.class.delete({
      where: { id },
    });
  }

  async getClassStats(): Promise<ClassStats> {
    const [
      totalClasses,
      classesBySubject,
      classesWithTeachers,
      classesWithoutTeachers,
    ] = await Promise.all([
      this.prisma.class.count(),
      this.prisma.class.groupBy({
        by: ['subject'],
        _count: {
          subject: true,
        },
        orderBy: {
          _count: {
            subject: 'desc',
          },
        },
      }),
      this.prisma.class.count({
        where: {
          teacherId: { not: null },
        },
      }),
      this.prisma.class.count({
        where: {
          teacherId: null,
        },
      }),
    ]);

    // Calculate average students per class
    const classesWithStudentCount = await this.prisma.class.findMany({
      include: {
        _count: {
          select: {
            students: true,
          },
        },
      },
    });

    const totalStudents = classesWithStudentCount.reduce(
      (sum, classData) => sum + classData._count.students,
      0,
    );
    const averageStudentsPerClass = totalClasses > 0 ? totalStudents / totalClasses : 0;

    return {
      totalClasses,
      classesBySubject: classesBySubject.map((item) => ({
        subject: item.subject,
        count: item._count.subject,
      })),
      classesWithTeachers,
      classesWithoutTeachers,
      averageStudentsPerClass,
    };
  }

  async getStudentsByClass(classId: string): Promise<any[]> {
    const classData = await this.prisma.class.findUnique({
      where: { id: classId },
      include: {
        students: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!classData) {
      throw new NotFoundException('Class not found');
    }

    return classData.students;
  }

  async assignTeacher(classId: string, teacherId: string): Promise<ClassWithRelations> {
    // Check if class exists
    const existingClass = await this.prisma.class.findUnique({
      where: { id: classId },
    });

    if (!existingClass) {
      throw new NotFoundException('Class not found');
    }

    // Check if teacher exists
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: teacherId },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    const updatedClass = await this.prisma.class.update({
      where: { id: classId },
      data: { teacherId },
      include: {
        teacher: true,
        students: true,
      },
    });

    return updatedClass;
  }

  async removeTeacher(classId: string): Promise<ClassWithRelations> {
    const existingClass = await this.prisma.class.findUnique({
      where: { id: classId },
    });

    if (!existingClass) {
      throw new NotFoundException('Class not found');
    }

    const updatedClass = await this.prisma.class.update({
      where: { id: classId },
      data: { teacherId: null },
      include: {
        teacher: true,
        students: true,
      },
    });

    return updatedClass;
  }
}
