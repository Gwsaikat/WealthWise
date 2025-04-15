-- Migration script to update expenses table with recurring functionality
-- This adds support for tracking recurring expenses and their frequency

-- Add recurring fields to expenses table
ALTER TABLE public.expenses 
ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS recurring_frequency TEXT;

-- Create index for more efficient querying of recurring expenses
CREATE INDEX IF NOT EXISTS expenses_is_recurring_idx ON public.expenses(is_recurring);

-- Comment the new columns to improve database documentation
COMMENT ON COLUMN public.expenses.is_recurring IS 'Indicates if this is a recurring expense';
COMMENT ON COLUMN public.expenses.recurring_frequency IS 'Frequency of the recurring expense (weekly, biweekly, monthly, quarterly, yearly)';

-- Example RLS policy update (if needed)
-- Uncomment and modify if your policies need to be updated
-- 
-- DROP POLICY IF EXISTS "Users can only view their own expenses" ON public.expenses;
-- CREATE POLICY "Users can only view their own expenses" 
--   ON public.expenses FOR SELECT USING (auth.uid() = user_id);
-- 
-- DROP POLICY IF EXISTS "Users can only insert their own expenses" ON public.expenses;
-- CREATE POLICY "Users can only insert their own expenses" 
--   ON public.expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
-- 
-- DROP POLICY IF EXISTS "Users can only update their own expenses" ON public.expenses;
-- CREATE POLICY "Users can only update their own expenses" 
--   ON public.expenses FOR UPDATE USING (auth.uid() = user_id); 