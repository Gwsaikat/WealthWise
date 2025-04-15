# Multi-Factor Authentication for WealthWise

This document explains the Multi-Factor Authentication (MFA) implementation for the WealthWise application.

## Overview

The MFA implementation adds an extra layer of security to the application by requiring users to provide a second form of verification when logging in. This helps protect sensitive financial data even if a user's password is compromised.

### Features

- **Time-based One-Time Password (TOTP)** authentication
- **Recovery codes** for emergency access when a user loses their authentication device
- **QR code scanning** for easy setup with authenticator apps
- **Secure setup and verification** process
- **User-friendly configuration** via the Settings page

## Setup Guide

### Database Setup

Before using the MFA functionality, you need to set up the required database table:

1. Run the migration script:
```bash
node database/run-mfa-migration.js
```

2. If automatic migration doesn't work, you can manually run the SQL from `database/migrations/002_create_mfa_table.sql` in your Supabase SQL Editor.

### User Setup

As a user, you can enable MFA from the application:

1. Log in to your WealthWise account
2. Navigate to Settings → Security
3. In the Two-Factor Authentication section, toggle the switch to enable MFA
4. Follow the on-screen instructions to set up your authenticator app
5. Save your recovery codes in a secure location

## Technical Implementation

### Components

- `MfaSetup.tsx` - Handles the MFA setup process
- `MfaManager.tsx` - Manages MFA settings in the user profile
- `RecoveryCodes.tsx` - Displays and manages recovery codes
- `LoginForm.tsx` - Handles MFA verification during login

### Database Schema

The MFA configuration is stored in the `user_mfa` table:

```sql
CREATE TABLE public.user_mfa (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  secret_key TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT false,
  setup_completed BOOLEAN NOT NULL DEFAULT false,
  recovery_codes TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);
```

### Authentication Flow

1. **Normal Login**: User enters email and password
2. **MFA Check**: System checks if MFA is enabled for the user
3. **Verification Request**: If MFA is enabled, user is prompted to enter a verification code
4. **Verification Options**:
   - Enter a 6-digit code from their authenticator app
   - Use a recovery code if they've lost access to their device
5. **Authentication**: User is granted access after successful verification

## Security Considerations

- Secret keys are stored securely in the database
- Recovery codes can only be used once
- Password verification is required to disable MFA
- Brute force protection is implemented through rate limiting
- Each recovery code is unique and single-use

## User Experience

The MFA implementation is designed to be user-friendly while maintaining high security:

- Clear instructions guide users through the setup process
- QR code scanning simplifies authenticator app setup
- Recovery codes provide a backup authentication method
- Security notifications alert users to important MFA events

## Troubleshooting

### Common Issues

- **"Invalid verification code"**: Ensure your device time is synchronized correctly
- **"Cannot scan QR code"**: Use the manual entry option with the provided secret key
- **"Recovery code not working"**: Each recovery code can only be used once
- **"Lost access to authenticator and recovery codes"**: Contact support for assistance

## Future Enhancements

- SMS-based verification as an alternative to authenticator apps
- Email OTP as a backup verification method
- Device remembering for trusted devices
- Enhanced analytics for security events
- Push notification verification 