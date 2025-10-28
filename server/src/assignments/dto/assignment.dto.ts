import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUUID, IsEnum, IsDateString, IsArray, ValidateNested, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { AssignmentStatus } from '@prisma/client';

export class CreateAssignmentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  @IsNotEmpty()
  dueDate: string;

  @IsNumber()
  @Min(1)
  @Max(1000)
  totalMarks: number;

  @IsUUID()
  @IsNotEmpty()
  classId: string;

  @IsUUID()
  @IsNotEmpty()
  teacherId: string;
}

export class UpdateAssignmentDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000)
  totalMarks?: number;

  @IsOptional()
  @IsUUID()
  classId?: string;

  @IsOptional()
  @IsUUID()
  teacherId?: string;
}

export class AssignmentQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsUUID()
  classId?: string;

  @IsOptional()
  @IsUUID()
  teacherId?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(AssignmentStatus)
  status?: AssignmentStatus;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class CreateStudentAssignmentDto {
  @IsUUID()
  @IsNotEmpty()
  assignmentId: string;

  @IsUUID()
  @IsNotEmpty()
  studentId: string;
}

export class UpdateStudentAssignmentDto {
  @IsOptional()
  @IsDateString()
  submittedAt?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  marksObtained?: number;

  @IsOptional()
  @IsEnum(AssignmentStatus)
  status?: AssignmentStatus;
}

export class StudentAssignmentQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsUUID()
  assignmentId?: string;

  @IsOptional()
  @IsUUID()
  studentId?: string;

  @IsOptional()
  @IsEnum(AssignmentStatus)
  status?: AssignmentStatus;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  submitted?: boolean;
}

export class BulkCreateStudentAssignmentsDto {
  @IsUUID()
  @IsNotEmpty()
  assignmentId: string;

  @IsArray()
  @IsUUID('4', { each: true })
  studentIds: string[];
}

export class BulkGradeAssignmentsDto {
  @IsArray()
  @IsUUID('4', { each: true })
  studentAssignmentIds: string[];

  @IsArray()
  @IsNumber({}, { each: true })
  @Min(0, { each: true })
  marksObtained: number[];
}

export class AssignmentSummaryQueryDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsUUID()
  classId?: string;

  @IsOptional()
  @IsUUID()
  studentId?: string;
}
