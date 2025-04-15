-- Migration script for WealthWise database
-- This script creates the necessary tables for the financial management application

-- Enable Row Level Security
ALTER DATABASE postgres SET app.jwt_secret TO 'your-jwt-secret';

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create expenses table
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create goals table
CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  targetAmount DECIMAL(12, 2) NOT NULL CHECK (targetAmount > 0),
  currentAmount DECIMAL(12, 2) NOT NULL DEFAULT 0 CHECK (currentAmount >= 0),
  deadline DATE NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX expenses_user_id_idx ON public.expenses (user_id);
CREATE INDEX expenses_date_idx ON public.expenses (date);
CREATE INDEX goals_user_id_idx ON public.goals (user_id);
CREATE INDEX transactions_user_id_idx ON public.transactions (user_id);
CREATE INDEX transactions_date_idx ON public.transactions (date);
CREATE INDEX transactions_type_idx ON public.transactions (type);

-- Set up Row Level Security policies
-- Profiles table: Users can only access their own profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY profiles_policy ON public.profiles
  USING (auth.uid() = user_id);

-- Expenses table: Users can only access their own expenses
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY expenses_policy ON public.expenses
  USING (auth.uid() = user_id);

-- Goals table: Users can only access their own goals
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY goals_policy ON public.goals
  USING (auth.uid() = user_id);

-- Transactions table: Users can only access their own transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY transactions_policy ON public.transactions
  USING (auth.uid() = user_id);

-- Grant access to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expenses TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.goals TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transactions TO authenticated; 