-- Create the academic_events table
CREATE TABLE IF NOT EXISTS academic_events (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  estimatedExpense DECIMAL(10, 2) NOT NULL DEFAULT 0,
  isRecurring BOOLEAN NOT NULL DEFAULT false,
  recurringFrequency TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS academic_events_user_id_idx ON academic_events(user_id);

-- Set up RLS (Row Level Security)
ALTER TABLE academic_events ENABLE ROW LEVEL SECURITY;

-- Create policy to ensure users can only access their own events
CREATE POLICY "Users can only access their own events" 
  ON academic_events 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Create policy to allow authenticated users to insert their own events
CREATE POLICY "Users can insert their own events" 
  ON academic_events 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow authenticated users to update their own events
CREATE POLICY "Users can update their own events" 
  ON academic_events 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy to allow authenticated users to delete their own events
CREATE POLICY "Users can delete their own events" 
  ON academic_events 
  FOR DELETE 
  USING (auth.uid() = user_id); 