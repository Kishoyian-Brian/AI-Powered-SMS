# 🔧 Environment Variables Configuration

## Required Environment Variables

Create a `.env` file in the server root directory with the following variables:

```env
# ============================================
# DATABASE CONFIGURATION
# ============================================
DATABASE_URL="postgresql://username:password@localhost:5432/sms_db?schema=public"

# ============================================
# JWT AUTHENTICATION
# ============================================
# IMPORTANT: Change this to a strong, random secret in production!
# Generate with: openssl rand -base64 64
JWT_SECRET="your-super-secret-jwt-key-min-32-characters-change-in-production"

# ============================================
# SERVER CONFIGURATION
# ============================================
PORT=3000
NODE_ENV=development  # Options: development, production, test

# ============================================
# CORS CONFIGURATION
# ============================================
# Frontend URL for CORS
CORS_ORIGIN="http://localhost:5173"

# Frontend URL for email links
FRONTEND_URL="http://localhost:5173"

# ============================================
# EMAIL CONFIGURATION (SMTP)
# ============================================
# SMTP Server Settings
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_SECURE=false  # true for port 465, false for other ports
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-specific-password"

# Email Sender Info
SMTP_FROM_NAME="School Management System"
SMTP_FROM_EMAIL="noreply@yourdomain.com"
```

## 📧 Email Provider Setup Examples

### Gmail Setup
1. Enable 2-Factor Authentication on your Google account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use these settings:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-16-char-app-password
```

### SendGrid Setup
1. Sign up at https://sendgrid.com
2. Create API key
3. Use these settings:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

### Mailgun Setup
1. Sign up at https://mailgun.com
2. Get SMTP credentials from dashboard
3. Use these settings:
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your-mailgun-password
```

### Development Testing (Ethereal Email - Free Fake SMTP)
1. Visit https://ethereal.email/ 
2. Click "Create Ethereal Account"
3. Copy credentials to .env:
```env
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-ethereal-username
SMTP_PASS=your-ethereal-password
```
4. View sent emails at https://ethereal.email/messages

## 🔒 Security Best Practices

### JWT Secret
```bash
# Generate a secure random secret:
openssl rand -base64 64

# Or use Node.js:
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

### Password Security
- Minimum 32 characters for JWT_SECRET
- Never commit .env to version control
- Use different secrets for dev/staging/production
- Rotate secrets regularly

### Email Security
- Use App Passwords, not your main password
- Keep SMTP credentials secure
- Use TLS/SSL for email connections
- Verify email provider's security settings

## 🚀 Production Deployment

### Recommended Setup:
1. **Use environment variables** from your hosting provider (Railway, Heroku, AWS, etc.)
2. **Never use .env files** in production containers
3. **Use secrets management** (AWS Secrets Manager, HashiCorp Vault, etc.)
4. **Enable SSL/TLS** for all connections
5. **Use production-grade** email service (SendGrid, Mailgun, AWS SES)

### Environment Variable Checklist:
- [ ] `DATABASE_URL` - Production database connection
- [ ] `JWT_SECRET` - Strong random secret (min 32 chars)
- [ ] `NODE_ENV=production`
- [ ] `SMTP_*` - Production email service credentials
- [ ] `FRONTEND_URL` - Production frontend URL
- [ ] `CORS_ORIGIN` - Production frontend domain

## 📝 Quick Start

1. Copy this configuration to `.env`:
```bash
cp ENV_CONFIGURATION.md .env
# Then edit .env with your actual values
```

2. For quick testing with Ethereal Email:
```bash
# Visit https://ethereal.email and create account
# Then add credentials to .env
```

3. Verify configuration:
```bash
npm run start:dev
# Check logs for email configuration status
```

## 🔍 Troubleshooting

### "Connection refused" or "ECONNREFUSED"
- Check SMTP_HOST and SMTP_PORT
- Verify firewall isn't blocking SMTP ports
- Try different port (587 or 465)

### "Invalid login" or "535 Authentication failed"
- Verify SMTP_USER and SMTP_PASS are correct
- For Gmail: Use App Password, not regular password
- Check if 2FA is enabled (required for App Passwords)

### "TLS required" or SSL errors
- Set `SMTP_SECURE=true` for port 465
- Set `SMTP_SECURE=false` for port 587
- Verify email provider's requirements

### Emails not sending
- Check server logs for error messages
- Verify email service is configured in app.module.ts
- Test with Ethereal Email for debugging

