import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';
import { addDays, addWeeks, addMonths, subDays, isBefore, parseISO, format } from 'date-fns';
import { addExpense, getExpenses } from './database';
import type { Expense, TransactionSchedule } from '../types/supabase';

/**
 * Get all recurring transactions for a user
 */
export const getRecurringTransactions = async (userId: string): Promise<TransactionSchedule[]> => {
  const { data, error } = await supabase
    .from('recurring_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching recurring transactions:', error);
    return [];
  }

  return data || [];
};

/**
 * Create a new recurring transaction
 */
export const createRecurringTransaction = async (
  transaction: Omit<TransactionSchedule, 'id' | 'created_at' | 'updated_at'>
): Promise<TransactionSchedule | null> => {
  const now = new Date().toISOString();
  
  const newTransaction = {
    id: uuidv4(),
    ...transaction,
    created_at: now,
    updated_at: now
  };

  const { data, error } = await supabase
    .from('recurring_transactions')
    .insert([newTransaction])
    .select()
    .single();

  if (error) {
    console.error('Error creating recurring transaction:', error);
    return null;
  }

  // Generate the first occurrence if start date is today or in the past
  const startDate = new Date(transaction.start_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (transaction.is_active && startDate <= today) {
    await generateTransactionOccurrence(data);
  }

  return data;
};

/**
 * Update an existing recurring transaction
 */
export const updateRecurringTransaction = async (
  id: string,
  updates: Partial<TransactionSchedule>
): Promise<TransactionSchedule | null> => {
  const updatedData = {
    ...updates,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('recurring_transactions')
    .update(updatedData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating recurring transaction:', error);
    return null;
  }

  return data;
};

/**
 * Delete a recurring transaction
 */
export const deleteRecurringTransaction = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('recurring_transactions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting recurring transaction:', error);
    return false;
  }

  return true;
};

/**
 * Generate a transaction occurrence from a recurring transaction schedule
 */
const generateTransactionOccurrence = async (
  schedule: TransactionSchedule
): Promise<boolean> => {
  try {
    if (!schedule.is_active) {
      return false;
    }

    // If this is an expense type
    if (schedule.type === 'expense') {
      await addExpense(schedule.user_id, {
        amount: schedule.amount,
        category: schedule.category,
        description: `${schedule.title} (Recurring ${schedule.frequency})`,
        date: new Date().toISOString(),
        is_recurring: true,
        recurring_frequency: schedule.frequency
      });
    } else {
      // Here you would add income using a similar function to addExpense
      // For now, we'll just log it
      console.log('Income transaction would be created:', schedule);
    }

    // Update last_generated date
    await updateRecurringTransaction(schedule.id, {
      last_generated: new Date().toISOString()
    });

    return true;
  } catch (error) {
    console.error('Error generating transaction occurrence:', error);
    return false;
  }
};

/**
 * Calculate the next occurrence date based on frequency and last date
 */
const calculateNextOccurrence = (
  frequency: TransactionSchedule['frequency'],
  lastDate: Date
): Date => {
  switch (frequency) {
    case 'weekly':
      return addDays(lastDate, 7);
    case 'biweekly':
      return addDays(lastDate, 14);
    case 'monthly':
      return addMonths(lastDate, 1);
    case 'quarterly':
      return addMonths(lastDate, 3);
    case 'yearly':
      return addMonths(lastDate, 12);
    default:
      return addMonths(lastDate, 1); // Default to monthly
  }
};

/**
 * Generate all missing transactions that should have occurred by now
 */
export const generateMissingTransactions = async (userId: string): Promise<number> => {
  const schedules = await getRecurringTransactions(userId);
  let generatedCount = 0;
  const now = new Date();

  for (const schedule of schedules) {
    if (!schedule.is_active) continue;

    // Determine the last generation date or use start date if none
    const lastGenDate = schedule.last_generated
      ? new Date(schedule.last_generated)
      : new Date(schedule.start_date);

    // Calculate when the next occurrence should be
    let nextDate = calculateNextOccurrence(schedule.frequency, lastGenDate);

    // Keep generating occurrences until we reach current date
    while (isBefore(nextDate, now)) {
      // Create a clone of the schedule with the specific date
      const occurrenceSchedule = {
        ...schedule,
        start_date: nextDate.toISOString()
      };

      // Generate the transaction
      const success = await generateTransactionOccurrence(occurrenceSchedule);
      
      if (success) {
        generatedCount++;
        
        // Update the last generated date for the schedule
        await updateRecurringTransaction(schedule.id, {
          last_generated: nextDate.toISOString()
        });
      }

      // Calculate the next occurrence
      nextDate = calculateNextOccurrence(schedule.frequency, nextDate);
    }
  }

  return generatedCount;
};

/**
 * Get upcoming transactions that will be generated in the next 30 days
 */
export const getUpcomingTransactions = async (userId: string): Promise<any[]> => {
  const schedules = await getRecurringTransactions(userId);
  const upcoming: any[] = [];
  const now = new Date();
  const thirtyDaysFromNow = addDays(now, 30);

  for (const schedule of schedules) {
    if (!schedule.is_active) continue;

    // Determine the last generation date or use start date if none
    const lastGenDate = schedule.last_generated
      ? new Date(schedule.last_generated)
      : new Date(schedule.start_date);

    // Calculate when the next occurrence should be
    let nextDate = calculateNextOccurrence(schedule.frequency, lastGenDate);

    // Add all occurrences in the next 30 days
    while (isBefore(nextDate, thirtyDaysFromNow)) {
      upcoming.push({
        id: `forecast-${schedule.id}-${format(nextDate, 'yyyy-MM-dd')}`,
        title: schedule.title,
        amount: schedule.amount,
        type: schedule.type,
        category: schedule.category,
        description: schedule.description,
        date: nextDate.toISOString(),
        frequency: schedule.frequency,
        isUpcoming: true
      });

      // Calculate the next occurrence
      nextDate = calculateNextOccurrence(schedule.frequency, nextDate);
    }
  }

  // Sort by date
  upcoming.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return upcoming;
};

/**
 * Get transactions formatted for calendar integration
 * Enhanced to add display properties for calendar views
 */
export const getCalendarTransactions = async (userId: string): Promise<any[]> => {
  try {
    // Get upcoming transactions
    const upcomingTransactions = await getUpcomingTransactions(userId);
    
    // Enhance with calendar display properties
    const calendarTransactions = upcomingTransactions.map(transaction => ({
      ...transaction,
      // Add calendar-specific properties
      id: `transaction-${uuidv4()}`, // Generate a unique ID for calendar events
      dateObj: new Date(transaction.date), // Pre-parse date for easier handling
      isCalendarEvent: true,
      calendarDisplay: {
        // Properties specifically for calendar display
        color: transaction.type === 'income' ? 'green' : 'yellow',
        colorClass: transaction.type === 'income' 
          ? 'bg-green-500/20 text-green-400 border-green-500/30' 
          : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        icon: transaction.type === 'income' ? 'ArrowDown' : 'ArrowUp',
        priority: transaction.amount > 1000 ? 'high' : 'medium' // Mark high-value transactions
      }
    }));
    
    return calendarTransactions;
  } catch (error) {
    console.error('Error getting calendar transactions:', error);
    return [];
  }
};

/**
 * Get transactions for a specific date range (for date range calendar views)
 */
export const getTransactionsInDateRange = async (
  userId: string, 
  startDate: Date, 
  endDate: Date
): Promise<any[]> => {
  try {
    const allTransactions = await getCalendarTransactions(userId);
    
    // Filter transactions that fall within the date range
    return allTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  } catch (error) {
    console.error('Error fetching transactions in date range:', error);
    return [];
  }
}; 