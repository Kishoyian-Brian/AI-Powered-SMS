import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validate user credentials
   */
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        student: true,
        teacher: true,
        admin: true,
      },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    const { password: _, ...result } = user;
    return result;
  }


  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

  
    let name = 'User';
    if (user.admin) name = user.admin.name;
    if (user.teacher) name = user.teacher.name;
    if (user.student) name = user.student.name;

    return {
      user: {
        id: user.id,
        email: user.email,
        name,
        role: user.role.toLowerCase(),
      },
      token: this.jwtService.sign(payload),
    };
  }

  
  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);


    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        role: UserRole.ADMIN,
        admin: {
          create: {
            name: registerDto.fullName,
            phone: registerDto.phone,
            schoolName: 'Default School', 
          },
        },
      },
      include: {
        admin: true,
      },
    });

    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.admin?.name || 'Admin',
        role: user.role.toLowerCase(),
      },
      token: this.jwtService.sign(payload),
    };
  }

 
  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: true,
        teacher: true,
        admin: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    let name = 'User';
    let additionalData = {};

    if (user.admin) {
      name = user.admin.name;
      additionalData = {
        phone: user.admin.phone || '',
        schoolName: user.admin.schoolName,
      };
    } else if (user.teacher) {
      name = user.teacher.name;
      additionalData = {
        phone: user.teacher.phone,
        subject: user.teacher.subject,
        experience: user.teacher.experience,
      };
    } else if (user.student) {
      name = user.student.name;
      additionalData = {
        rollNo: user.student.rollNo,
        phone: user.student.phone || '',
        classId: user.student.classId || '',
      };
    }

    return {
      id: user.id,
      email: user.email,
      name,
      role: user.role.toLowerCase(),
      ...additionalData,
    };
  }

 
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }


  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
