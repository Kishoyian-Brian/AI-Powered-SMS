import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateAttendanceRecordDto, UpdateAttendanceRecordDto, AttendanceRecordQueryDto, BulkAttendanceRecordDto, AttendanceSummaryQueryDto } from './dto/attendance.dto';
import { 
  AttendanceRecordWithRelations, 
  AttendanceStats, 
  StudentAttendanceStats, 
  ClassAttendanceStats, 
  AttendanceSummary 
} from './interfaces/attendance.interface';
import { AttendanceStatus } from '@prisma/client';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async create(createAttendanceDto: CreateAttendanceRecordDto): Promise<AttendanceRecordWithRelations> {
    // Check if student exists
    const student = await this.prisma.student.findUnique({
      where: { id: createAttendanceDto.studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Check if class exists if classId is provided
    if (createAttendanceDto.classId) {
      const classData = await this.prisma.class.findUnique({
        where: { id: createAttendanceDto.classId },
      });

      if (!classData) {
        throw new NotFoundException('Class not found');
      }
    }

    // Check for duplicate attendance record (student + date)
    const existingRecord = await this.prisma.attendanceRecord.findFirst({
      where: {
        studentId: createAttendanceDto.studentId,
        date: new Date(createAttendanceDto.date),
      },
    });

    if (existingRecord) {
      throw new ConflictException('Attendance record for this student and date already exists');
    }

    const newRecord = await this.prisma.attendanceRecord.create({
      data: {
        ...createAttendanceDto,
        date: new Date(createAttendanceDto.date),
      },
      include: {
        student: true,
        class: true,
      },
    });

    return newRecord;
  }

  async findAll(queryDto: AttendanceRecordQueryDto): Promise<{
    records: AttendanceRecordWithRelations[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { 
      page = 1, 
      limit = 10, 
      studentId, 
      classId, 
      date, 
      status, 
      startDate, 
      endDate 
    } = queryDto;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (studentId) {
      where.studentId = studentId;
    }

    if (classId) {
      where.classId = classId;
    }

    if (date) {
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
      where.date = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    if (status) {
      where.status = status;
    }

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const [records, total] = await Promise.all([
      this.prisma.attendanceRecord.findMany({
        where,
        skip,
        take: limit,
        include: {
          student: true,
          class: true,
        },
        orderBy: { date: 'desc' },
      }),
      this.prisma.attendanceRecord.count({ where }),
    ]);

    return {
      records,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<AttendanceRecordWithRelations> {
    const record = await this.prisma.attendanceRecord.findUnique({
      where: { id },
      include: {
        student: true,
        class: true,
      },
    });

    if (!record) {
      throw new NotFoundException('Attendance record not found');
    }

    return record;
  }

  async findByStudent(studentId: string, startDate?: string, endDate?: string): Promise<AttendanceRecordWithRelations[]> {
    const where: any = { studentId };

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    return this.prisma.attendanceRecord.findMany({
      where,
      include: {
        student: true,
        class: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async findByClass(classId: string, date?: string): Promise<AttendanceRecordWithRelations[]> {
    const where: any = { classId };

    if (date) {
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
      where.date = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    return this.prisma.attendanceRecord.findMany({
      where,
      include: {
        student: true,
        class: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async update(id: string, updateAttendanceDto: UpdateAttendanceRecordDto): Promise<AttendanceRecordWithRelations> {
    const existingRecord = await this.prisma.attendanceRecord.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      throw new NotFoundException('Attendance record not found');
    }

    // Check if class exists if classId is being updated
    if (updateAttendanceDto.classId) {
      const classData = await this.prisma.class.findUnique({
        where: { id: updateAttendanceDto.classId },
      });

      if (!classData) {
        throw new NotFoundException('Class not found');
      }
    }

    const updatedRecord = await this.prisma.attendanceRecord.update({
      where: { id },
      data: updateAttendanceDto,
      include: {
        student: true,
        class: true,
      },
    });

    return updatedRecord;
  }

  async remove(id: string): Promise<void> {
    const existingRecord = await this.prisma.attendanceRecord.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      throw new NotFoundException('Attendance record not found');
    }

    await this.prisma.attendanceRecord.delete({
      where: { id },
    });
  }

  async bulkCreate(bulkAttendanceDto: BulkAttendanceRecordDto): Promise<AttendanceRecordWithRelations[]> {
    const { classId, date, attendanceRecords } = bulkAttendanceDto;

    // Check if class exists
    const classData = await this.prisma.class.findUnique({
      where: { id: classId },
    });

    if (!classData) {
      throw new NotFoundException('Class not found');
    }

    // Validate all students exist
    const studentIds = attendanceRecords.map(record => record.studentId);
    const students = await this.prisma.student.findMany({
      where: { id: { in: studentIds } },
    });

    if (students.length !== studentIds.length) {
      throw new BadRequestException('One or more students not found');
    }

    // Check for existing records for the same date
    const existingRecords = await this.prisma.attendanceRecord.findMany({
      where: {
        studentId: { in: studentIds },
        date: new Date(date),
      },
    });

    if (existingRecords.length > 0) {
      throw new ConflictException('Some attendance records for this date already exist');
    }

    // Create all records
    const records = await Promise.all(
      attendanceRecords.map(record =>
        this.prisma.attendanceRecord.create({
          data: {
            studentId: record.studentId,
            classId,
            date: new Date(date),
            status: record.status,
          },
          include: {
            student: true,
            class: true,
          },
        })
      )
    );

    return records;
  }

  async getAttendanceStats(startDate?: string, endDate?: string): Promise<AttendanceStats> {
    const where: any = {};

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const [totalRecords, presentCount, absentCount, lateCount] = await Promise.all([
      this.prisma.attendanceRecord.count({ where }),
      this.prisma.attendanceRecord.count({ where: { ...where, status: AttendanceStatus.PRESENT } }),
      this.prisma.attendanceRecord.count({ where: { ...where, status: AttendanceStatus.ABSENT } }),
      this.prisma.attendanceRecord.count({ where: { ...where, status: AttendanceStatus.LATE } }),
    ]);

    const attendanceRate = totalRecords > 0 ? (presentCount + lateCount) / totalRecords : 0;

    return {
      totalRecords,
      presentCount,
      absentCount,
      lateCount,
      attendanceRate,
    };
  }

  async getStudentAttendanceStats(studentId: string, startDate?: string, endDate?: string): Promise<StudentAttendanceStats> {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const where: any = { studentId };

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const [totalDays, presentDays, absentDays, lateDays] = await Promise.all([
      this.prisma.attendanceRecord.count({ where }),
      this.prisma.attendanceRecord.count({ where: { ...where, status: AttendanceStatus.PRESENT } }),
      this.prisma.attendanceRecord.count({ where: { ...where, status: AttendanceStatus.ABSENT } }),
      this.prisma.attendanceRecord.count({ where: { ...where, status: AttendanceStatus.LATE } }),
    ]);

    const attendanceRate = totalDays > 0 ? (presentDays + lateDays) / totalDays : 0;

    return {
      studentId,
      studentName: student.name,
      totalDays,
      presentDays,
      absentDays,
      lateDays,
      attendanceRate,
    };
  }

  async getClassAttendanceStats(classId: string, startDate?: string, endDate?: string): Promise<ClassAttendanceStats> {
    const classData = await this.prisma.class.findUnique({
      where: { id: classId },
      include: {
        students: true,
      },
    });

    if (!classData) {
      throw new NotFoundException('Class not found');
    }

    const where: any = { classId };

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // Get attendance records for the class
    const attendanceRecords = await this.prisma.attendanceRecord.findMany({
      where,
      include: {
        student: true,
      },
    });

    // Calculate attendance by date
    const attendanceByDate = attendanceRecords.reduce((acc, record) => {
      const dateStr = record.date.toISOString().split('T')[0];
      if (!acc[dateStr]) {
        acc[dateStr] = {
          date: dateStr,
          presentCount: 0,
          absentCount: 0,
          lateCount: 0,
          attendanceRate: 0,
        };
      }

      switch (record.status) {
        case AttendanceStatus.PRESENT:
          acc[dateStr].presentCount++;
          break;
        case AttendanceStatus.ABSENT:
          acc[dateStr].absentCount++;
          break;
        case AttendanceStatus.LATE:
          acc[dateStr].lateCount++;
          break;
      }

      return acc;
    }, {} as Record<string, any>);

    // Calculate attendance rate for each date
    Object.values(attendanceByDate).forEach((dayStats: any) => {
      const total = dayStats.presentCount + dayStats.absentCount + dayStats.lateCount;
      dayStats.attendanceRate = total > 0 ? (dayStats.presentCount + dayStats.lateCount) / total : 0;
    });

    // Calculate average attendance rate
    const totalStudents = classData.students.length;
    const averageAttendanceRate = totalStudents > 0 
      ? attendanceRecords.length > 0 
        ? attendanceRecords.reduce((sum, record) => {
            return sum + (record.status === AttendanceStatus.PRESENT || record.status === AttendanceStatus.LATE ? 1 : 0);
          }, 0) / attendanceRecords.length
        : 0
      : 0;

    return {
      classId,
      className: classData.name,
      totalStudents,
      averageAttendanceRate,
      attendanceByDate: Object.values(attendanceByDate),
    };
  }

  async getAttendanceSummary(queryDto: AttendanceSummaryQueryDto): Promise<AttendanceSummary> {
    const { startDate, endDate, classId, studentId } = queryDto;

    const where: any = {
      date: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    };

    if (classId) {
      where.classId = classId;
    }

    if (studentId) {
      where.studentId = studentId;
    }

    const [overallStats, records] = await Promise.all([
      this.getAttendanceStats(startDate, endDate),
      this.prisma.attendanceRecord.findMany({
        where,
        include: {
          student: true,
          class: true,
        },
      }),
    ]);

    // Get unique students and classes for stats
    const uniqueStudents = [...new Set(records.map(r => r.studentId))];
    const uniqueClasses = [...new Set(records.map(r => r.classId).filter(Boolean))];

    const [studentStats, classStats] = await Promise.all([
      Promise.all(uniqueStudents.map(studentId => this.getStudentAttendanceStats(studentId, startDate, endDate))),
      Promise.all(uniqueClasses.map(classId => this.getClassAttendanceStats(classId!, startDate, endDate))),
    ]);

    return {
      dateRange: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
      totalRecords: records.length,
      overallStats,
      studentStats,
      classStats,
    };
  }
}
