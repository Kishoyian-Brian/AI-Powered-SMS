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
import { AssignmentsService } from './assignments.service';
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
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('assignments')
@UseGuards(RolesGuard)
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  // Assignment CRUD operations
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  create(@Body() createAssignmentDto: CreateAssignmentDto) {
    return this.assignmentsService.create(createAssignmentDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  findAll(@Query() queryDto: AssignmentQueryDto) {
    return this.assignmentsService.findAll(queryDto);
  }

  @Get('stats')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  getStats() {
    return this.assignmentsService.getAssignmentStats();
  }

  @Get('summary')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  getSummary(@Query() queryDto: AssignmentSummaryQueryDto) {
    return this.assignmentsService.getAssignmentSummary(queryDto);
  }

  @Get('class/:classId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  findByClass(@Param('classId') classId: string) {
    return this.assignmentsService.findByClass(classId);
  }

  @Get('teacher/:teacherId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  findByTeacher(@Param('teacherId') teacherId: string) {
    return this.assignmentsService.findByTeacher(teacherId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  findOne(@Param('id') id: string) {
    return this.assignmentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  update(@Param('id') id: string, @Body() updateAssignmentDto: UpdateAssignmentDto) {
    return this.assignmentsService.update(id, updateAssignmentDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  remove(@Param('id') id: string) {
    return this.assignmentsService.remove(id);
  }

  // Student Assignment operations
  @Post('student-assignments')
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  createStudentAssignment(@Body() createStudentAssignmentDto: CreateStudentAssignmentDto) {
    return this.assignmentsService.createStudentAssignment(createStudentAssignmentDto);
  }

  @Post('student-assignments/bulk')
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  bulkCreateStudentAssignments(@Body() bulkDto: BulkCreateStudentAssignmentsDto) {
    return this.assignmentsService.bulkCreateStudentAssignments(bulkDto);
  }

  @Get('student-assignments')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  findAllStudentAssignments(@Query() queryDto: StudentAssignmentQueryDto) {
    return this.assignmentsService.findAllStudentAssignments(queryDto);
  }

  @Get('student-assignments/:id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  findOneStudentAssignment(@Param('id') id: string) {
    return this.assignmentsService.findOneStudentAssignment(id);
  }

  @Patch('student-assignments/:id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  updateStudentAssignment(@Param('id') id: string, @Body() updateStudentAssignmentDto: UpdateStudentAssignmentDto) {
    return this.assignmentsService.updateStudentAssignment(id, updateStudentAssignmentDto);
  }

  @Post('student-assignments/bulk-grade')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  bulkGradeAssignments(@Body() bulkDto: BulkGradeAssignmentsDto) {
    return this.assignmentsService.bulkGradeAssignments(bulkDto);
  }

  @Delete('student-assignments/:id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  removeStudentAssignment(@Param('id') id: string) {
    return this.assignmentsService.removeStudentAssignment(id);
  }

  // Student-specific endpoints
  @Get('student/:studentId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  getStudentAssignments(@Param('studentId') studentId: string) {
    return this.assignmentsService.findAllStudentAssignments({ studentId });
  }

  @Get('student/:studentId/stats')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  getStudentStats(@Param('studentId') studentId: string) {
    return this.assignmentsService.getStudentAssignmentStats(studentId);
  }

  // Class-specific endpoints
  @Get('class/:classId/stats')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  getClassStats(@Param('classId') classId: string) {
    return this.assignmentsService.getClassAssignmentStats(classId);
  }
}
