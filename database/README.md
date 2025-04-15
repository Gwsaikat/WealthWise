# WealthWise Database Setup

This directory contains the database migration scripts for setting up the Supabase backend for the WealthWise application.

## Database Structure

The WealthWise application uses the following tables:

1. **profiles** - User profile information
2. **expenses** - Expense tracking records
3. **goals** - Financial goals
4. **transactions** - Financial transactions (both income and expenses)

## Setting Up Supabase

### 1. Create a Supabase Project

1. Sign up or log in at [Supabase](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key (you'll need these for configuration)

### 2. Set Up Environment Variables

Create or update your `.env.local` file with your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Database Migrations

You can run the migrations directly in the Supabase SQL Editor:

1. Log in to your Supabase dashboard
2. Go to SQL Editor
3. Create a new query
4. Copy and paste the contents of `migrations/001_create_tables.sql`
5. Run the query

## Database Schema

### Profiles Table

Stores user profile information.

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Expenses Table

Tracks individual expense entries.

```sql
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Goals Table

Tracks financial goals.

```sql
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
```

### Transactions Table

Tracks all financial transactions (both income and expenses).

```sql
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
```

## Security

The database is configured with Row Level Security (RLS) policies that ensure users can only access their own data. Each table has appropriate policies applied to restrict data access based on the authenticated user's ID. 