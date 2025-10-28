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
import { ClassesService } from './classes.service';
import { CreateClassDto, UpdateClassDto, ClassQueryDto } from './dto/class.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { CurrentUserData } from '../common/decorators/current-user.decorator';

@Controller('classes')
@UseGuards(RolesGuard)
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.ADMIN)
  create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  findAll(@Query() queryDto: ClassQueryDto) {
    return this.classesService.findAll(queryDto);
  }

  @Get('stats')
  @Roles(UserRole.ADMIN)
  getStats() {
    return this.classesService.getClassStats();
  }

  @Get('subject/:subject')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  findBySubject(@Param('subject') subject: string) {
    return this.classesService.findBySubject(subject);
  }

  @Get('teacher/:teacherId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  findByTeacher(@Param('teacherId') teacherId: string) {
    return this.classesService.findByTeacher(teacherId);
  }

  @Get('name/:name')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  findByName(@Param('name') name: string) {
    return this.classesService.findByName(name);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  findOne(@Param('id') id: string) {
    return this.classesService.findOne(id);
  }

  @Get(':id/students')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  getStudentsByClass(@Param('id') id: string) {
    return this.classesService.getStudentsByClass(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classesService.update(id, updateClassDto);
  }

  @Patch(':id/assign-teacher')
  @Roles(UserRole.ADMIN)
  assignTeacher(@Param('id') id: string, @Body('teacherId') teacherId: string) {
    return this.classesService.assignTeacher(id, teacherId);
  }

  @Patch(':id/remove-teacher')
  @Roles(UserRole.ADMIN)
  removeTeacher(@Param('id') id: string) {
    return this.classesService.removeTeacher(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.classesService.remove(id);
  }
}
