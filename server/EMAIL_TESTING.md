# 📧 Email Service Testing Guide

## Quick Setup for Testing

### Option 1: Ethereal Email (Recommended for Development)
**Free, instant setup, no registration required**

1. Visit https://ethereal.email/
2. Click "Create Ethereal Account"
3. Copy the credentials and add to your `.env`:

```env
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<username-from-ethereal>
SMTP_PASS=<password-from-ethereal>
SMTP_FROM_EMAIL=noreply@ethereal.email
SMTP_FROM_NAME="School Management System"
```

4. Restart your server
5. Trigger an email (register, forgot password, etc.)
6. View emails at: https://ethereal.email/messages

### Option 2: Gmail (Real Email)
**For production-like testing**

1. Enable 2-Factor Authentication on your Google Account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Add to `.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=<16-character-app-password>
SMTP_FROM_EMAIL=your-email@gmail.com
SMTP_FROM_NAME="School Management System"
```

## 📬 Email Templates Available

The system sends the following emails:

### 1. Email Verification
- **Trigger:** User registration
- **Template:** `verification.hbs`
- **Expires:** 24 hours
- **URL:** `{frontendUrl}/verify-email?token={token}`

### 2. Password Reset
- **Trigger:** Forgot password request
- **Template:** `password-reset.hbs`
- **Expires:** 1 hour
- **URL:** `{frontendUrl}/reset-password?token={token}`

### 3. Welcome Email
- **Trigger:** After email verification
- **Template:** `welcome.hbs`
- **Purpose:** Onboarding

### 4. Password Changed
- **Trigger:** Password change
- **Template:** `password-changed.hbs`
- **Purpose:** Security notification

## 🧪 Testing Email Flow

### Test 1: Registration + Verification
```bash
# 1. Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "phone": "0700000000",
    "password": "password123"
  }'

# 2. Check Ethereal inbox for verification email
# 3. Extract token from email or development response
# 4. Verify email
curl -X POST http://localhost:3000/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"token": "YOUR_TOKEN_HERE"}'
```

### Test 2: Password Reset
```bash
# 1. Request reset
curl -X POST http://localhost:3000/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# 2. Check email for reset link
# 3. Reset password
curl -X POST http://localhost:3000/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_TOKEN_HERE",
    "newPassword": "newpassword123"
  }'
```

### Test 3: Password Change
```bash
# 1. Login to get token
# 2. Change password
curl -X PATCH http://localhost:3000/auth/change-password \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "newpassword456",
    "revokeAllTokens": true
  }'

# 3. Check email for password changed notification
```

## 🎨 Customizing Email Templates

Email templates are located in `src/email/templates/`:
- `verification.hbs`
- `password-reset.hbs`
- `welcome.hbs`
- `password-changed.hbs`

Templates use Handlebars syntax. Available variables:
- `{{verificationUrl}}`, `{{resetUrl}}`, `{{loginUrl}}`
- `{{email}}`, `{{name}}`
- `{{supportUrl}}`

## 🐛 Debugging

### Enable Email Logging
The EmailService logs all email operations. Check your console for:
```
[EmailService] Verification email sent to user@example.com
[EmailService] Failed to send email: Error message
```

### Test SMTP Connection
```typescript
// Add this to test SMTP connection:
await this.emailService.testConnection();
```

## 🚀 Production Checklist

Before deploying:
- [ ] Configure production SMTP service (SendGrid recommended)
- [ ] Set `NODE_ENV=production` to hide tokens in responses
- [ ] Update `FRONTEND_URL` to production domain
- [ ] Use secure `JWT_SECRET` (min 64 random bytes)
- [ ] Test all email flows in production
- [ ] Set up email monitoring/alerts
- [ ] Configure SPF, DKIM, DMARC records for email domain

## 📊 Email Service Status

✅ **Fully Integrated:**
- Email verification on registration
- Password reset emails
- Password changed notifications
- Professional HTML email templates
- Error handling and logging
- Development mode token return
- Production-ready configuration

**Status: PRODUCTION READY** ✅







