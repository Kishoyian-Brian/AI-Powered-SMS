import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly frontendUrl: string;
  private readonly emailEnabled: boolean;

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    this.frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:5173';
    // Check if SMTP is configured
    this.emailEnabled = !!(
      this.configService.get('SMTP_HOST') &&
      this.configService.get('SMTP_USER')
    );
    
    if (!this.emailEnabled) {
      this.logger.warn('⚠️  SMTP not configured - Emails will be logged to console only');
      this.logger.warn('📧 To enable emails, configure SMTP_* variables in .env');
      this.logger.warn('💡 Use Ethereal Email for free testing: https://ethereal.email');
    } else {
      this.logger.log(`✅ Email service configured: ${this.configService.get('SMTP_HOST')}`);
    }
  }

  /**
   * Send verification email
   */
  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationCode = token; // 6-digit code
    const verificationUrl = `${this.frontendUrl}/verify-email`; // URL without token

    if (!this.emailEnabled) {
      this.logger.log(`📧 [MOCK] Verification email would be sent to: ${email}`);
      this.logger.log(`🔢 Verification Code: ${verificationCode}`);
      return;
    }

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Verify Your Email - School Management System',
        template: './verification',
        context: {
          verificationUrl: verificationCode, // Pass 6-digit code as verificationUrl for template compatibility
          email,
        },
      });
      this.logger.log(`✅ Verification email sent to ${email} - Code: ${verificationCode}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send verification email to ${email}`, error);
      // Don't throw - allow registration to continue
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${this.frontendUrl}/reset-password?token=${token}`;

    if (!this.emailEnabled) {
      this.logger.log(`📧 [MOCK] Password reset email would be sent to: ${email}`);
      this.logger.log(`🔗 Reset URL: ${resetUrl}`);
      return;
    }

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Password Reset Request - School Management System',
        template: './password-reset',
        context: {
          resetUrl,
          email,
        },
      });
      this.logger.log(`✅ Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send password reset email to ${email}`, error);
      // Don't throw - allow process to continue
    }
  }

  /**
   * Send welcome email after registration
   */
  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    if (!this.emailEnabled) {
      this.logger.log(`📧 [MOCK] Welcome email would be sent to: ${email} (${name})`);
      return;
    }

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome to School Management System',
        template: './welcome',
        context: {
          name,
          email,
          loginUrl: `${this.frontendUrl}/login`,
        },
      });
      this.logger.log(`✅ Welcome email sent to ${email}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send welcome email to ${email}`, error);
    }
  }

  /**
   * Send password changed notification
   */
  async sendPasswordChangedEmail(email: string, name: string): Promise<void> {
    if (!this.emailEnabled) {
      this.logger.log(`📧 [MOCK] Password changed notification would be sent to: ${email} (${name})`);
      return;
    }

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Password Changed - School Management System',
        template: './password-changed',
        context: {
          name,
          email,
          supportUrl: `${this.frontendUrl}/support`,
        },
      });
      this.logger.log(`✅ Password changed notification sent to ${email}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send password changed email to ${email}`, error);
    }
  }
}

