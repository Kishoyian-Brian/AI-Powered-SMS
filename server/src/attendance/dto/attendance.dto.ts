import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUUID, IsEnum, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { AttendanceStatus } from '@prisma/client';

export class CreateAttendanceRecordDto {
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @IsOptional()
  @IsUUID()
  classId?: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsEnum(AttendanceStatus)
  @IsNotEmpty()
  status: AttendanceStatus;
}

export class UpdateAttendanceRecordDto {
  @IsEnum(AttendanceStatus)
  @IsOptional()
  status?: AttendanceStatus;

  @IsOptional()
  @IsUUID()
  classId?: string;
}

export class AttendanceRecordQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  @IsOptional()
  @IsUUID()
  studentId?: string;

  @IsOptional()
  @IsUUID()
  classId?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class BulkAttendanceRecordDto {
  @IsUUID()
  @IsNotEmpty()
  classId: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentAttendanceDto)
  attendanceRecords: StudentAttendanceDto[];
}

export class StudentAttendanceDto {
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @IsEnum(AttendanceStatus)
  @IsNotEmpty()
  status: AttendanceStatus;
}

export class AttendanceSummaryQueryDto {
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsOptional()
  @IsUUID()
  classId?: string;

  @IsOptional()
  @IsUUID()
  studentId?: string;
}
