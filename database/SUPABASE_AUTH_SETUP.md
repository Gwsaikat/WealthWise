# Supabase Authentication Setup Guide

This guide explains how to properly configure Supabase authentication and email verification for your WealthWise application.

## Understanding Email Verification in Supabase

By default, Supabase requires email verification for new accounts. However, there are some important things to know:

1. **Development Environment:**
   - In development, actual emails are **not sent** by default
   - You can check the Supabase logs to see email content
   - You need to configure a real email provider for actual email delivery

2. **Email Provider Setup:**
   - Supabase supports several email providers:
     - SMTP (any email service with SMTP access)
     - SendGrid
     - Mailgun
     - PostMark
     - etc.

## Setting Up Email Delivery

### Method 1: Check Authentication Emails in Supabase Dashboard

For development and testing:

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Find your test user
4. Click on the user to view details
5. Look for "Confirmation links sent" section
6. Click to view the verification link
7. Use this link to verify your account

### Method 2: Configure a Real Email Provider

For production and real email delivery:

1. Go to your Supabase project dashboard
2. Navigate to Project Settings > Auth
3. Scroll down to "Email Template"
4. Customize your email templates (welcome email, magic link, etc.)
5. Go to "Email Settings" section
6. Choose and configure an email provider:
   - **SMTP Setup:** Provide SMTP credentials from your email service
   - **Other Services:** Follow Supabase docs for SendGrid, Mailgun, etc.

```
# Example SMTP Configuration
SMTP Host: smtp.example.com
SMTP Port: 587
SMTP Username: your-smtp-username
SMTP Password: your-smtp-password
Sender Email: noreply@yourapp.com
```

## Disabling Email Verification (For Development Only)

If you want to disable email verification during development:

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Settings
3. Under "Email Auth" settings, find "Confirm email"
4. Toggle it OFF
5. **IMPORTANT**: Re-enable this for production!

## Testing Authentication Flow

1. Create a new test user through your app
2. Check for confirmation emails in:
   - Your dashboard logs (Auth > Users > [your user] > Auth)
   - Your actual email (if provider is configured)
3. Complete the verification process
4. Test login with the verified account

## Troubleshooting

### Common Issues

1. **No verification emails:**
   - Check Supabase logs for email attempts
   - Verify email provider configuration
   - Check spam/junk folders

2. **Authentication errors:**
   - "Invalid login credentials": Email may not be verified
   - "Email already registered": Try password recovery

3. **JWT token errors:**
   - Check that your environment variables match your Supabase project
   - Ensure ANON_KEY is correct in .env.local file 