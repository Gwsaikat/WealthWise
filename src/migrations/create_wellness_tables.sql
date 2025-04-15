-- Create wellness scores table
CREATE TABLE IF NOT EXISTS wellness_scores (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  score INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create the financial stress assessment table
CREATE TABLE IF NOT EXISTS stress_assessment (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id INT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- Create financial habits table
CREATE TABLE IF NOT EXISTS financial_habits (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  streak INT NOT NULL DEFAULT 0,
  isCompleted BOOLEAN NOT NULL DEFAULT FALSE,
  last_completed TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create budget wellness metrics table
CREATE TABLE IF NOT EXISTS budget_wellness (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  savingsRate INT NOT NULL DEFAULT 0,
  debtToIncome INT NOT NULL DEFAULT 0,
  housingToIncome INT NOT NULL DEFAULT 0,
  hasEmergencyFund BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS wellness_scores_user_id_idx ON wellness_scores(user_id);
CREATE INDEX IF NOT EXISTS stress_assessment_user_id_idx ON stress_assessment(user_id);
CREATE INDEX IF NOT EXISTS financial_habits_user_id_idx ON financial_habits(user_id);
CREATE INDEX IF NOT EXISTS budget_wellness_user_id_idx ON budget_wellness(user_id);

-- Set up Row Level Security (RLS)
ALTER TABLE wellness_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE stress_assessment ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_wellness ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for wellness_scores
CREATE POLICY "Users can only view their own wellness scores" 
  ON wellness_scores FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own wellness scores" 
  ON wellness_scores FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own wellness scores" 
  ON wellness_scores FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for stress_assessment
CREATE POLICY "Users can only view their own stress assessment answers" 
  ON stress_assessment FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own stress assessment answers" 
  ON stress_assessment FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own stress assessment answers" 
  ON stress_assessment FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for financial_habits
CREATE POLICY "Users can only view their own financial habits" 
  ON financial_habits FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own financial habits" 
  ON financial_habits FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own financial habits" 
  ON financial_habits FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for budget_wellness
CREATE POLICY "Users can only view their own budget wellness metrics" 
  ON budget_wellness FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own budget wellness metrics" 
  ON budget_wellness FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own budget wellness metrics" 
  ON budget_wellness FOR UPDATE USING (auth.uid() = user_id); 