import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { GradesService } from './grades.service';
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
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('grades')
@UseGuards(RolesGuard)
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  create(@Body() createGradeDto: CreateGradeDto) {
    return this.gradesService.create(createGradeDto);
  }

  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  bulkCreate(@Body() bulkDto: BulkCreateGradesDto) {
    return this.gradesService.bulkCreate(bulkDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  findAll(@Query() queryDto: GradeQueryDto) {
    return this.gradesService.findAll(queryDto);
  }

  @Get('stats')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  getStats() {
    return this.gradesService.getGradeStats();
  }

  @Get('summary')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  getSummary(@Query() queryDto: GradeSummaryQueryDto) {
    return this.gradesService.getGradeSummary(queryDto);
  }

  @Get('distribution')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  getGradeDistribution(@Query() queryDto: GradeDistributionQueryDto) {
    return this.gradesService.getGradeDistribution(queryDto);
  }

  @Get('student/:studentId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  findByStudent(@Param('studentId') studentId: string) {
    return this.gradesService.findByStudent(studentId);
  }

  @Get('student/:studentId/stats')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  getStudentStats(@Param('studentId') studentId: string) {
    return this.gradesService.getStudentGradeStats(studentId);
  }

  @Get('subject/:subject')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  findBySubject(@Param('subject') subject: string) {
    return this.gradesService.findBySubject(subject);
  }

  @Get('subject/:subject/stats')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  getSubjectStats(@Param('subject') subject: string) {
    return this.gradesService.getSubjectGradeStats(subject);
  }

  @Get('exam-type/:examType')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  findByExamType(@Param('examType') examType: string) {
    return this.gradesService.findByExamType(examType);
  }

  @Get('class/:classId/stats')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  getClassStats(@Param('classId') classId: string) {
    return this.gradesService.getClassGradeStats(classId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  findOne(@Param('id') id: string) {
    return this.gradesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  update(@Param('id') id: string, @Body() updateGradeDto: UpdateGradeDto) {
    return this.gradesService.update(id, updateGradeDto);
  }

  @Patch('bulk')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  bulkUpdate(@Body() bulkDto: BulkUpdateGradesDto) {
    return this.gradesService.bulkUpdate(bulkDto);
  }

  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  calculateGrade(@Body() data: GradeCalculationDto) {
    return this.gradesService.calculateGrade(data);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  remove(@Param('id') id: string) {
    return this.gradesService.remove(id);
  }
}
