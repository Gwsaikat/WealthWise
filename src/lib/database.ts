import { supabase } from './supabase';
import type { Database, Expense, Goal, Transaction, Profile } from '../types/supabase';
import { v4 as uuidv4 } from 'uuid';

// User profile functions
export const getProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
};

// Wellness-related functions
export type FinancialStressLevel = {
  id?: string;
  user_id: string;
  question_id: number;
  answer: string;
  created_at?: string;
  updated_at?: string;
};

export type WellnessScore = {
  id?: string;
  user_id: string;
  score: number;
  created_at?: string;
  updated_at?: string;
};

export type FinancialHabit = {
  id?: string;
  user_id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  streak: number;
  isCompleted: boolean;
  last_completed?: string;
  created_at?: string;
  updated_at?: string;
};

export type BudgetWellnessMetrics = {
  id?: string;
  user_id: string;
  savingsRate: number;
  debtToIncome: number;
  housingToIncome: number;
  hasEmergencyFund: boolean;
  created_at?: string;
  updated_at?: string;
};

// Get wellness score
export const getWellnessScore = async (userId: string): Promise<WellnessScore | null> => {
  const { data, error } = await supabase
    .from('wellness_scores')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching wellness score:', error);
    return null;
  }

  return data;
};

// Update wellness score
export const updateWellnessScore = async (userId: string, score: number): Promise<WellnessScore | null> => {
  const newScore = {
    id: uuidv4(),
    user_id: userId,
    score: score,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('wellness_scores')
    .insert([newScore])
    .select()
    .single();

  if (error) {
    console.error('Error updating wellness score:', error);
    return null;
  }

  return data;
};

// Get financial stress answers
export const getStressAnswers = async (userId: string): Promise<FinancialStressLevel[]> => {
  const { data, error } = await supabase
    .from('stress_assessment')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching stress answers:', error);
    return [];
  }

  return data || [];
};

// Save financial stress answer
export const saveStressAnswer = async (userId: string, questionId: number, answer: string): Promise<boolean> => {
  // First check if an answer for this question already exists
  const { data: existingAnswer } = await supabase
    .from('stress_assessment')
    .select('id')
    .eq('user_id', userId)
    .eq('question_id', questionId)
    .maybeSingle();

  let error;
  
  if (existingAnswer) {
    // Update existing answer
    const { error: updateError } = await supabase
      .from('stress_assessment')
      .update({
        answer: answer,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingAnswer.id);
      
    error = updateError;
  } else {
    // Insert new answer
    const { error: insertError } = await supabase
      .from('stress_assessment')
      .insert([{
        id: uuidv4(),
        user_id: userId,
        question_id: questionId,
        answer: answer,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]);
      
    error = insertError;
  }

  if (error) {
    console.error('Error saving stress answer:', error);
    return false;
  }

  return true;
};

// Get user's financial habits
export const getFinancialHabits = async (userId: string): Promise<FinancialHabit[]> => {
  const { data, error } = await supabase
    .from('financial_habits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching financial habits:', error);
    return [];
  }

  return data || [];
};

// Create new financial habit
export const createFinancialHabit = async (userId: string, habit: Omit<FinancialHabit, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<FinancialHabit | null> => {
  const newHabit = {
    id: uuidv4(),
    user_id: userId,
    ...habit,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('financial_habits')
    .insert([newHabit])
    .select()
    .single();

  if (error) {
    console.error('Error creating financial habit:', error);
    return null;
  }

  return data;
};

// Update financial habit
export const updateFinancialHabit = async (habitId: string, updates: Partial<FinancialHabit>): Promise<FinancialHabit | null> => {
  const updatedData = {
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  if (updates.isCompleted) {
    updatedData.last_completed = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('financial_habits')
    .update(updatedData)
    .eq('id', habitId)
    .select()
    .single();

  if (error) {
    console.error('Error updating financial habit:', error);
    return null;
  }

  return data;
};

// Get budget wellness metrics
export const getBudgetWellnessMetrics = async (userId: string): Promise<BudgetWellnessMetrics | null> => {
  const { data, error } = await supabase
    .from('budget_wellness')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching budget wellness metrics:', error);
    return null;
  }

  return data;
};

// Update budget wellness metrics
export const updateBudgetWellnessMetrics = async (userId: string, metrics: Omit<BudgetWellnessMetrics, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<BudgetWellnessMetrics | null> => {
  // Check if user already has metrics
  const { data: existingMetrics } = await supabase
    .from('budget_wellness')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  let result;
  
  if (existingMetrics) {
    // Update existing metrics
    const { data, error } = await supabase
      .from('budget_wellness')
      .update({
        ...metrics,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingMetrics.id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating budget wellness metrics:', error);
      return null;
    }
    
    result = data;
  } else {
    // Insert new metrics
    const newMetrics = {
      id: uuidv4(),
      user_id: userId,
      ...metrics,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('budget_wellness')
      .insert([newMetrics])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating budget wellness metrics:', error);
      return null;
    }
    
    result = data;
  }

  return result;
};

// Calculate budget wellness metrics automatically based on user transactions
export const calculateBudgetWellnessMetrics = async (userId: string): Promise<BudgetWellnessMetrics | null> => {
  try {
    // Get financial summary
    const summary = await getFinancialSummary(userId);
    const { totalIncome, totalExpenses } = summary;
    
    // Calculate metrics
    const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;
    
    // Get housing expenses (assuming category is 'housing' or 'rent')
    const categories = await getExpensesByCategory(userId);
    const housingExpense = (categories['housing'] || 0) + (categories['rent'] || 0);
    const housingToIncome = totalIncome > 0 ? Math.round((housingExpense / totalIncome) * 100) : 0;
    
    // For debt-to-income and emergency fund, we would need more data
    // For now, let's estimate based on transactions
    const debtToIncome = Math.min(Math.round(Math.random() * 20) + 10, 50); // Mock calculation
    const hasEmergencyFund = savingsRate > 15; // Assuming users with good savings rate have emergency funds
    
    // Save the calculated metrics
    const metrics = {
      savingsRate,
      debtToIncome,
      housingToIncome,
      hasEmergencyFund
    };
    
    return await updateBudgetWellnessMetrics(userId, metrics);
  } catch (error) {
    console.error('Error calculating budget wellness metrics:', error);
    return null;
  }
};

export const updateProfile = async (userId: string, updates: Partial<Profile>): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }

  return data;
};

// Expense functions
export const getExpenses = async (userId: string): Promise<Expense[]> => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching expenses:', error);
    return [];
  }

  return data || [];
};

export const getExpenseById = async (expenseId: string): Promise<Expense | null> => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('id', expenseId)
    .single();

  if (error) {
    console.error('Error fetching expense:', error);
    return null;
  }

  return data;
};

export const addExpense = async (userId: string, expenseData: {
  amount: number;
  category: string;
  description: string;
  date: string;
  is_recurring?: boolean;
  recurring_frequency?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .insert({
        user_id: userId,
        amount: expenseData.amount,
        category: expenseData.category,
        description: expenseData.description,
        date: expenseData.date,
        is_recurring: expenseData.is_recurring || false,
        recurring_frequency: expenseData.recurring_frequency
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error adding expense:", error);
    return null;
  }
};

export const updateExpense = async (
  expenseId: string,
  expenseData: Partial<{
    amount: number;
    category: string;
    description: string;
    date: string;
    is_recurring?: boolean;
    recurring_frequency?: string;
  }>
) => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .update({
        amount: expenseData.amount,
        category: expenseData.category,
        description: expenseData.description,
        date: expenseData.date,
        is_recurring: expenseData.is_recurring,
        recurring_frequency: expenseData.recurring_frequency
      })
      .eq('id', expenseId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating expense:", error);
    return null;
  }
};

export const deleteExpense = async (expenseId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', expenseId);

  if (error) {
    console.error('Error deleting expense:', error);
    return false;
  }

  return true;
};

// Goal functions
export const getGoals = async (userId: string): Promise<Goal[]> => {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching goals:', error);
    return [];
  }

  return data || [];
};

export const getGoalById = async (goalId: string): Promise<Goal | null> => {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('id', goalId)
    .single();

  if (error) {
    console.error('Error fetching goal:', error);
    return null;
  }

  return data;
};

export const addGoal = async (userId: string, goal: Omit<Goal, 'id' | 'user_id' | 'created_at'>): Promise<Goal | null> => {
  const newGoal = {
    id: uuidv4(),
    user_id: userId,
    ...goal,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('goals')
    .insert([newGoal])
    .select()
    .single();

  if (error) {
    console.error('Error adding goal:', error);
    return null;
  }

  return data;
};

export const updateGoal = async (goalId: string, updates: Partial<Goal>): Promise<Goal | null> => {
  const { data, error } = await supabase
    .from('goals')
    .update(updates)
    .eq('id', goalId)
    .select()
    .single();

  if (error) {
    console.error('Error updating goal:', error);
    return null;
  }

  return data;
};

export const deleteGoal = async (goalId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', goalId);

  if (error) {
    console.error('Error deleting goal:', error);
    return false;
  }

  return true;
};

// Transaction functions
export const getTransactions = async (userId: string, limit = 20): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }

  return data || [];
};

export const addTransaction = async (
  userId: string, 
  transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>
): Promise<Transaction | null> => {
  const newTransaction = {
    id: uuidv4(),
    user_id: userId,
    ...transaction,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('transactions')
    .insert([newTransaction])
    .select()
    .single();

  if (error) {
    console.error('Error adding transaction:', error);
    return null;
  }

  return data;
};

export const deleteTransaction = async (transactionId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', transactionId);

  if (error) {
    console.error('Error deleting transaction:', error);
    return false;
  }

  return true;
};

// Summary functions
export const getFinancialSummary = async (userId: string): Promise<{
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}> => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching financial summary:', error);
    return { totalIncome: 0, totalExpenses: 0, balance: 0 };
  }

  const transactions = data || [];
  
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
  };
};

// Category analytics
export const getExpensesByCategory = async (userId: string): Promise<Record<string, number>> => {
  const { data, error } = await supabase
    .from('expenses')
    .select('category, amount')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching expenses by category:', error);
    return {};
  }

  const expenses = data || [];
  const categories: Record<string, number> = {};
  
  expenses.forEach(expense => {
    const category = expense.category;
    if (!categories[category]) {
      categories[category] = 0;
    }
    categories[category] += expense.amount;
  });
  
  return categories;
};

// Date range queries
export const getExpensesByDateRange = async (
  userId: string, 
  startDate: string, 
  endDate: string
): Promise<Expense[]> => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching expenses by date range:', error);
    return [];
  }

  return data || [];
}; 