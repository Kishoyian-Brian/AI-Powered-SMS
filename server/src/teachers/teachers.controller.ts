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
import { TeachersService } from './teachers.service';
import { CreateTeacherDto, UpdateTeacherDto, TeacherQueryDto } from './dto/teacher.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { CurrentUserData } from '../common/decorators/current-user.decorator';

@Controller('teachers')
@UseGuards(RolesGuard)
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.ADMIN)
  create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teachersService.create(createTeacherDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  findAll(@Query() queryDto: TeacherQueryDto) {
    return this.teachersService.findAll(queryDto);
  }

  @Get('stats')
  @Roles(UserRole.ADMIN)
  getStats() {
    return this.teachersService.getTeacherStats();
  }

  @Get('subject/:subject')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  findBySubject(@Param('subject') subject: string) {
    return this.teachersService.findBySubject(subject);
  }

  @Get('class/:classId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  getTeachersByClass(@Param('classId') classId: string) {
    return this.teachersService.getTeachersByClass(classId);
  }

  @Get('me')
  @Roles(UserRole.TEACHER)
  getMe(@CurrentUser() user: CurrentUserData) {
    return this.teachersService.findByEmail(user.email);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  findOne(@Param('id') id: string) {
    return this.teachersService.findOne(id);
  }

  @Get('email/:email')
  @Roles(UserRole.ADMIN)
  findByEmail(@Param('email') email: string) {
    return this.teachersService.findByEmail(email);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  update(@Param('id') id: string, @Body() updateTeacherDto: UpdateTeacherDto) {
    return this.teachersService.update(id, updateTeacherDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.teachersService.remove(id);
  }
}
