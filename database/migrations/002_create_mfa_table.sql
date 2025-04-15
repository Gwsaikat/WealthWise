-- Migration script to add MFA support to the WealthWise database
-- This script creates the necessary tables for two-factor authentication

-- Create user_mfa table to store MFA configuration
CREATE TABLE IF NOT EXISTS public.user_mfa (
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

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS user_mfa_user_id_idx ON public.user_mfa(user_id);

-- Set up Row Level Security (RLS)
ALTER TABLE public.user_mfa ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_mfa
CREATE POLICY "Users can only view their own MFA settings" 
  ON public.user_mfa FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own MFA settings" 
  ON public.user_mfa FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own MFA settings" 
  ON public.user_mfa FOR UPDATE USING (auth.uid() = user_id);

-- Grant access to authenticated users
GRANT SELECT, INSERT, UPDATE ON public.user_mfa TO authenticated; 