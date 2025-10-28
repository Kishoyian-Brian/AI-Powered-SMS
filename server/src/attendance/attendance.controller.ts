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
import { AttendanceService } from './attendance.service';
import { 
  CreateAttendanceRecordDto, 
  UpdateAttendanceRecordDto, 
  AttendanceRecordQueryDto, 
  BulkAttendanceRecordDto,
  AttendanceSummaryQueryDto 
} from './dto/attendance.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { CurrentUserData } from '../common/decorators/current-user.decorator';

@Controller('attendance')
@UseGuards(RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  create(@Body() createAttendanceDto: CreateAttendanceRecordDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  bulkCreate(@Body() bulkAttendanceDto: BulkAttendanceRecordDto) {
    return this.attendanceService.bulkCreate(bulkAttendanceDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  findAll(@Query() queryDto: AttendanceRecordQueryDto) {
    return this.attendanceService.findAll(queryDto);
  }

  @Get('stats')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  getStats(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.attendanceService.getAttendanceStats(startDate, endDate);
  }

  @Get('summary')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  getSummary(@Query() queryDto: AttendanceSummaryQueryDto) {
    return this.attendanceService.getAttendanceSummary(queryDto);
  }

  @Get('student/:studentId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  findByStudent(
    @Param('studentId') studentId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.attendanceService.findByStudent(studentId, startDate, endDate);
  }

  @Get('student/:studentId/stats')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  getStudentStats(
    @Param('studentId') studentId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.attendanceService.getStudentAttendanceStats(studentId, startDate, endDate);
  }

  @Get('class/:classId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  findByClass(
    @Param('classId') classId: string,
    @Query('date') date?: string,
  ) {
    return this.attendanceService.findByClass(classId, date);
  }

  @Get('class/:classId/stats')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  getClassStats(
    @Param('classId') classId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.attendanceService.getClassAttendanceStats(classId, startDate, endDate);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  update(@Param('id') id: string, @Body() updateAttendanceDto: UpdateAttendanceRecordDto) {
    return this.attendanceService.update(id, updateAttendanceDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(id);
  }
}
