import { Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
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

  /**
   * Request password reset - Generate token and send email
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string; token?: string; expiresAt?: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: forgotPasswordDto.email },
    });

    // Don't reveal if user exists or not (security best practice)
    if (!user) {
      return { 
        message: 'If the email exists, a password reset link has been sent.' 
      };
    }

    // Generate secure random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Token expires in 1 hour
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Delete any existing reset tokens for this user
    await this.prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // Create new reset token
    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: hashedToken,
        expiresAt,
      },
    });

    // TODO: Send email with reset link
    // const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    // await this.emailService.sendPasswordResetEmail(user.email, resetUrl);

    // For development: return the token (remove in production!)
    // Check if running in development mode
    const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
    
    if (isDevelopment) {
      return {
        message: 'Password reset token generated (development mode)',
        token: resetToken, // Only for development testing
        expiresAt: expiresAt.toISOString(),
      };
    }

    return { 
      message: 'If the email exists, a password reset link has been sent.' 
    };
  }

  /**
   * Reset password using token
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(resetPasswordDto.token).digest('hex');

    // Find the reset token
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token: hashedToken },
      include: { user: true },
    });

    if (!resetToken) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Check if token has expired
    if (resetToken.expiresAt < new Date()) {
      // Delete expired token
      await this.prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      });
      throw new BadRequestException('Reset token has expired');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);

    // Update user's password
    await this.prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    // Delete the used reset token
    await this.prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    });

    return { message: 'Password has been reset successfully' };
  }

  /**
   * Verify if a reset token is valid (without consuming it)
   */
  async verifyResetToken(token: string): Promise<{ valid: boolean; email?: string }> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token: hashedToken },
      include: { user: true },
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      return { valid: false };
    }

    return { 
      valid: true,
      email: resetToken.user.email,
    };
  }
}
