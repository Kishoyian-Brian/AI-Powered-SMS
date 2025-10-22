import { Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { EmailService } from '../email/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { jwtConstants } from './constants';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private configService: ConfigService,
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

    // Generate tokens
    const tokens = await this.generateTokens(user.id, payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        name,
        role: user.role.toLowerCase(),
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
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

    // Send verification email
    const verificationResult = await this.sendVerificationEmail(user.id, user.email);

    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    // Generate tokens
    const tokens = await this.generateTokens(user.id, payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.admin?.name || 'Admin',
        role: user.role.toLowerCase(),
        isEmailVerified: user.isEmailVerified,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
      verificationToken: verificationResult.token, // Only in development
      verificationMessage: verificationResult.message,
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

    // Send password reset email
    try {
      await this.emailService.sendPasswordResetEmail(user.email, resetToken);
    } catch (error) {
      // Log error but don't reveal to user
      console.error('Failed to send password reset email:', error);
    }

    // For development: return the token
    const isDevelopment = this.configService.get('NODE_ENV') !== 'production';
    
    if (isDevelopment) {
      return {
        message: 'Password reset token generated (development mode)',
        token: resetToken,
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


  async sendVerificationEmail(userId: string, email: string): Promise<{ message: string; token?: string }> {
    // Generate 6-digit verification code
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

  
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.prisma.emailVerificationToken.deleteMany({
      where: { userId },
    });

    // Create new verification token
    await this.prisma.emailVerificationToken.create({
      data: {
        userId,
        token: hashedToken,
        expiresAt,
      },
    });

    // Send verification email
    try {
      await this.emailService.sendVerificationEmail(email, verificationToken);
    } catch (error) {
      // Log error but don't block registration
      console.error('Failed to send verification email:', error);
    }

    // For development: return the token
    const isDevelopment = this.configService.get('NODE_ENV') !== 'production';
    
    if (isDevelopment) {
      return {
        message: 'Verification email sent (development mode)',
        token: verificationToken,
      };
    }

    return { message: 'Verification email sent. Please check your inbox.' };
  }

  /**
   * Verify email with token
   */
  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<{ message: string }> {
    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(verifyEmailDto.token).digest('hex');

    // Find the verification token
    const verificationToken = await this.prisma.emailVerificationToken.findUnique({
      where: { token: hashedToken },
      include: { user: true },
    });

    if (!verificationToken) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    // Check if token has expired
    if (verificationToken.expiresAt < new Date()) {
      await this.prisma.emailVerificationToken.delete({
        where: { id: verificationToken.id },
      });
      throw new BadRequestException('Verification token has expired');
    }

    // Check if email is already verified
    if (verificationToken.user.isEmailVerified) {
      // Delete the token since email is already verified
      await this.prisma.emailVerificationToken.delete({
        where: { id: verificationToken.id },
      });
      return { message: 'Email is already verified' };
    }

    // Update user's email verification status
    await this.prisma.user.update({
      where: { id: verificationToken.userId },
      data: {
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });

    // Delete the used verification token
    await this.prisma.emailVerificationToken.delete({
      where: { id: verificationToken.id },
    });

    return { message: 'Email verified successfully' };
  }

  /**
   * Resend verification email
   */
  async resendVerificationEmail(resendDto: ResendVerificationDto): Promise<{ message: string; token?: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: resendDto.email },
    });

    if (!user) {
      // Don't reveal if user exists or not
      return { message: 'If the email exists and is not verified, a verification link has been sent.' };
    }

    if (user.isEmailVerified) {
      return { message: 'Email is already verified' };
    }

    return this.sendVerificationEmail(user.id, user.email);
  }

  /**
   * Check if user's email is verified (middleware helper)
   */
  async requireEmailVerified(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { isEmailVerified: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Please verify your email address before continuing');
    }

    return true;
  }

  /**
   * Generate access and refresh tokens
   */
  async generateTokens(userId: string, payload: any): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
    // Generate access token (short-lived)
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: jwtConstants.accessTokenExpiresIn,
    });

    // Generate refresh token (long-lived, random string)
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

    // Calculate expiry (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Store refresh token in database
    await this.prisma.refreshToken.create({
      data: {
        userId,
        token: hashedRefreshToken,
        expiresAt,
      },
    });

    // Return tokens and expiry time in seconds (15 minutes = 900 seconds)
    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
    // Hash the provided refresh token
    const hashedToken = crypto.createHash('sha256').update(refreshTokenDto.refreshToken).digest('hex');

    // Find the refresh token in database
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: hashedToken },
      include: { user: true },
    });

    // Validate token exists and is not revoked
    if (!storedToken || storedToken.isRevoked) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check if token has expired
    if (storedToken.expiresAt < new Date()) {
      // Delete expired token
      await this.prisma.refreshToken.delete({
        where: { id: storedToken.id },
      });
      throw new UnauthorizedException('Refresh token has expired');
    }

    // Token rotation: Revoke the old refresh token
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { isRevoked: true },
    });

    // Generate new tokens
    const payload = {
      email: storedToken.user.email,
      sub: storedToken.user.id,
      role: storedToken.user.role,
    };

    return this.generateTokens(storedToken.user.id, payload);
  }

  /**
   * Revoke a refresh token (logout)
   */
  async revokeRefreshToken(refreshToken: string): Promise<void> {
    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: hashedToken },
    });

    if (storedToken) {
      await this.prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { isRevoked: true },
      });
    }
  }

  /**
   * Revoke all refresh tokens for a user
   */
  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: {
        userId,
        isRevoked: false,
      },
      data: {
        isRevoked: true,
      },
    });
  }

  /**
   * Change password for authenticated user
   */
  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
    // Get user with password and relations
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        admin: true,
        teacher: true,
        student: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Check if new password is different from current
    const isSamePassword = await bcrypt.compare(
      changePasswordDto.newPassword,
      user.password,
    );

    if (isSamePassword) {
      throw new BadRequestException('New password must be different from current password');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Send password changed notification email
    const userName = user.admin?.name || user.teacher?.name || user.student?.name || 'User';
    try {
      await this.emailService.sendPasswordChangedEmail(user.email, userName);
    } catch (error) {
      console.error('Failed to send password changed email:', error);
    }

    // Optionally revoke all refresh tokens (logout from all devices)
    if (changePasswordDto.revokeAllTokens) {
      await this.revokeAllUserTokens(userId);
      return { 
        message: 'Password changed successfully. You have been logged out from all devices.' 
      };
    }

    return { message: 'Password changed successfully' };
  }
}
