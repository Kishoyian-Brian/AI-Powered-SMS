import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto, UpdateStudentDto, StudentQueryDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { Public } from '../common/decorators/public.decorator';

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  findAll(@Query() query: StudentQueryDto) {
    return this.studentsService.findAll(query);
  }

  @Get('stats')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  getStats() {
    return this.studentsService.getStudentStats();
  }

  @Get('class/:classId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  getStudentsByClass(@Param('classId', ParseUUIDPipe) classId: string) {
    return this.studentsService.getStudentsByClass(classId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.studentsService.findOne(id);
  }

  @Get('roll/:rollNo')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  findByRollNo(@Param('rollNo') rollNo: string) {
    return this.studentsService.findByRollNo(rollNo);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.studentsService.remove(id);
  }
}
