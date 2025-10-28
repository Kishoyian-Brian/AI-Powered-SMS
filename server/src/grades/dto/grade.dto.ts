import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUUID, IsDateString, IsArray, ValidateNested, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateGradeDto {
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  examType: string;

  @IsNumber()
  @Min(0)
  marks: number;

  @IsNumber()
  @Min(1)
  @Max(1000)
  totalMarks: number;

  @IsOptional()
  @IsString()
  grade?: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsDateString()
  @IsNotEmpty()
  examDate: string;
}

export class UpdateGradeDto {
  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  examType?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  marks?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000)
  totalMarks?: number;

  @IsOptional()
  @IsString()
  grade?: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsDateString()
  examDate?: string;
}

export class GradeQueryDto {
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
  studentId?: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  examType?: string;

  @IsOptional()
  @IsString()
  grade?: string;

  @IsOptional()
  @IsDateString()
  examDate?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class BulkCreateGradesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateGradeDto)
  grades: CreateGradeDto[];
}

export class BulkUpdateGradesDto {
  @IsArray()
  @IsUUID('4', { each: true })
  gradeIds: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateGradeDto)
  updates: UpdateGradeDto[];
}

export class GradeSummaryQueryDto {
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

  @IsOptional()
  @IsString()
  subject?: string;
}

export class GradeCalculationDto {
  @IsNumber()
  @Min(0)
  marks: number;

  @IsNumber()
  @Min(1)
  @Max(1000)
  totalMarks: number;
}

export class GradeDistributionQueryDto {
  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  examType?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
