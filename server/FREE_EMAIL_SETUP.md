# 📧 100% FREE Email Setup with Nodemailer

Your email system is configured with Nodemailer and works in **3 modes**:

## 🎯 Email Modes

### 1. **Console Mode (Current - FREE)**
**No SMTP configuration needed**
- Emails logged to console/terminal
- Shows email content and verification URLs
- Perfect for development
- **Status: ✅ ACTIVE NOW**

When you register or reset password, check your server console for:
```
📧 [MOCK] Verification email would be sent to: user@example.com
🔗 Verification URL: http://localhost:5173/verify-email?token=abc123...
```

### 2. **Ethereal Email (FREE - Recommended for Testing)**
**100% FREE fake SMTP service**

**Setup in 2 minutes:**

1. Visit: https://ethereal.email/
2. Click "Create Ethereal Account" (no signup required)
3. Copy the credentials shown
4. Add to your `.env` file:

```env
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<username from ethereal>
SMTP_PASS=<password from ethereal>
SMTP_FROM_EMAIL=noreply@ethereal.email
SMTP_FROM_NAME="School Management System"
```

5. Restart your server
6. Trigger an email (register, forgot password, etc.)
7. View emails at: https://ethereal.email/messages

**Benefits:**
- ✅ Completely FREE
- ✅ No registration required
- ✅ See actual HTML emails
- ✅ Test email templates
- ✅ Web interface to view emails
- ✅ Works exactly like real SMTP

### 3. **Gmail (FREE - For Real Emails)**
**Use your personal Gmail for free**

**Setup:**

1. Enable 2-Factor Authentication on Gmail
2. Generate App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Click "Create" → "Other (custom name)"
   - Name it "SMS App"
   - Copy the 16-character password

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

**Gmail Free Limits:**
- 500 emails/day (plenty for testing)
- 2000 emails/day for Google Workspace

## 🚀 Quick Start (Choose One)

### Option A: Keep Console Mode (No Setup)
**Current mode - No changes needed**
```bash
# Just use the app!
# Emails will be logged to console
```

### Option B: Ethereal Email (2 minutes)
```bash
# 1. Get credentials from https://ethereal.email/
# 2. Add to .env:
echo "SMTP_HOST=smtp.ethereal.email" >> .env
echo "SMTP_PORT=587" >> .env
echo "SMTP_SECURE=false" >> .env
echo "SMTP_USER=your-ethereal-user" >> .env
echo "SMTP_PASS=your-ethereal-pass" >> .env

# 3. Restart server
npm run start:dev

# 4. Check https://ethereal.email/messages for emails
```

### Option C: Gmail (5 minutes)
```bash
# 1. Enable 2FA + Generate App Password
# 2. Add to .env:
echo "SMTP_HOST=smtp.gmail.com" >> .env
echo "SMTP_PORT=587" >> .env  
echo "SMTP_SECURE=false" >> .env
echo "SMTP_USER=your-email@gmail.com" >> .env
echo "SMTP_PASS=your-app-password" >> .env

# 3. Restart server
npm run start:dev
```

## 💡 Email Features Available

Your system sends these emails automatically:

### 1. **Email Verification** ✅
- Sent on registration
- Beautiful HTML template
- 24-hour expiry
- One-click verification

### 2. **Password Reset** ✅
- Sent on forgot password request
- Secure token link
- 1-hour expiry
- Clear instructions

### 3. **Welcome Email** ✅
- Sent after email verification
- Onboarding information
- Feature highlights

### 4. **Password Changed** ✅
- Security notification
- Sent on password change
- Warns about unauthorized access

## 🎨 Email Templates

Professional HTML email templates with:
- 📱 Mobile responsive
- 🎨 Beautiful gradients
- 🔘 Call-to-action buttons
- 🔒 Security notices
- 📧 Plain text fallback

## 🔍 How It Works

```
1. No SMTP configured?
   → Logs to console
   → Returns token in response (dev mode)
   → You can still test all features!

2. SMTP configured?
   → Sends real HTML emails
   → Still returns token in dev mode
   → Production-ready

3. Email fails?
   → Logs error
   → Doesn't break registration/login
   → Graceful degradation
```

## ⚡ Current Status

**Email Service: ✅ FULLY FUNCTIONAL**

**Current Mode:** Console Logging (No SMTP needed)
**Available Modes:** 
- ✅ Console (FREE - Active)
- ✅ Ethereal Email (FREE - Available)
- ✅ Gmail (FREE - Available)
- ✅ Any SMTP provider

**To enable real emails:**
1. Choose Option B (Ethereal) or C (Gmail) above
2. Add SMTP credentials to `.env`
3. Restart server
4. Done! ✅

## 🆓 Forever FREE Options

1. **Console Mode** - Always FREE, always works
2. **Ethereal Email** - 100% FREE, unlimited emails
3. **Gmail** - FREE (500 emails/day)
4. **Your own SMTP server** - FREE if self-hosted

**No paid plans required!** 🎉







