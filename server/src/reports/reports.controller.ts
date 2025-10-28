import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import {
  GenerateReportDto,
  ReportQueryDto,
  AttendanceReportQueryDto,
  PerformanceReportQueryDto,
  TeacherReportQueryDto,
  StudentReportQueryDto,
  MonthlyReportQueryDto,
  AIReportQueryDto,
} from './dto/report.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('reports')
@UseGuards(RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('generate')
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  generateReport(@Body() generateReportDto: GenerateReportDto) {
    return this.reportsService.generateReport(generateReportDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  findAll(@Query() queryDto: ReportQueryDto) {
    return this.reportsService.findAll(queryDto);
  }

  @Get('stats')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  getStats() {
    return this.reportsService.getReportStats();
  }

  @Get('attendance')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  generateAttendanceReport(@Query() queryDto: AttendanceReportQueryDto) {
    return this.reportsService.generateAttendanceReport(queryDto);
  }

  @Get('performance')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  generatePerformanceReport(@Query() queryDto: PerformanceReportQueryDto) {
    return this.reportsService.generatePerformanceReport(queryDto);
  }

  @Get('teacher')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  generateTeacherReport(@Query() queryDto: TeacherReportQueryDto) {
    return this.reportsService.generateTeacherReport(queryDto);
  }

  @Get('student')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  generateStudentReport(@Query() queryDto: StudentReportQueryDto) {
    return this.reportsService.generateStudentReport(queryDto);
  }

  @Get('monthly')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  generateMonthlyReport(@Query() queryDto: MonthlyReportQueryDto) {
    return this.reportsService.generateMonthlyReport(queryDto);
  }

  @Get('ai')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  generateAIReport(@Query() queryDto: AIReportQueryDto) {
    return this.reportsService.generateAIReport(queryDto);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.reportsService.remove(id);
  }
}
