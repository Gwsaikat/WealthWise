// Define the Supabase database schema types
export type Database = {
  public: {
    Tables: {
      expenses: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          category: string;
          description: string;
          date: string;
          created_at: string;
          is_recurring?: boolean;
          recurring_frequency?: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          category: string;
          description: string;
          date: string;
          created_at?: string;
          is_recurring?: boolean;
          recurring_frequency?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          category?: string;
          description?: string;
          date?: string;
          created_at?: string;
          is_recurring?: boolean;
          recurring_frequency?: string;
        };
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          targetAmount: number;
          currentAmount: number;
          deadline: string;
          category: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          targetAmount: number;
          currentAmount: number;
          deadline: string;
          category: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          targetAmount?: number;
          currentAmount?: number;
          deadline?: string;
          category?: string;
          created_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          type: 'income' | 'expense';
          category: string;
          description: string;
          date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          type: 'income' | 'expense';
          category: string;
          description: string;
          date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          type?: 'income' | 'expense';
          category?: string;
          description?: string;
          date?: string;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string | null;
          avatar_url: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string | null;
        };
      };
      academic_events: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          date: string;
          description: string;
          type: string;
          estimatedExpense: number;
          isRecurring: boolean;
          recurringFrequency: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          date: string;
          description?: string;
          type: string;
          estimatedExpense: number;
          isRecurring?: boolean;
          recurringFrequency?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          date?: string;
          description?: string;
          type?: string;
          estimatedExpense?: number;
          isRecurring?: boolean;
          recurringFrequency?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      wellness_scores: {
        Row: {
          id: string;
          user_id: string;
          score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          score: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          score?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      stress_assessment: {
        Row: {
          id: string;
          user_id: string;
          question_id: number;
          answer: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          question_id: number;
          answer: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          question_id?: number;
          answer?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      financial_habits: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          frequency: 'daily' | 'weekly' | 'monthly';
          streak: number;
          isCompleted: boolean;
          last_completed: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          frequency: 'daily' | 'weekly' | 'monthly';
          streak?: number;
          isCompleted?: boolean;
          last_completed?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          frequency?: 'daily' | 'weekly' | 'monthly';
          streak?: number;
          isCompleted?: boolean;
          last_completed?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      budget_wellness: {
        Row: {
          id: string;
          user_id: string;
          savingsRate: number;
          debtToIncome: number;
          housingToIncome: number;
          hasEmergencyFund: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          savingsRate?: number;
          debtToIncome?: number;
          housingToIncome?: number;
          hasEmergencyFund?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          savingsRate?: number;
          debtToIncome?: number;
          housingToIncome?: number;
          hasEmergencyFund?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_mfa: {
        Row: {
          id: string;
          user_id: string;
          secret_key: string;
          enabled: boolean;
          setup_completed: boolean;
          recovery_codes: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          secret_key: string;
          enabled?: boolean;
          setup_completed?: boolean;
          recovery_codes?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          secret_key?: string;
          enabled?: boolean;
          setup_completed?: boolean;
          recovery_codes?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      recurring_transactions: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          amount: number;
          type: 'income' | 'expense';
          category: string;
          description: string;
          frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
          start_date: string;
          end_date?: string | null;
          last_generated?: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          amount: number;
          type: 'income' | 'expense';
          category: string;
          description: string;
          frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
          start_date: string;
          end_date?: string | null;
          last_generated?: string | null;
          is_active: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          amount?: number;
          type?: 'income' | 'expense';
          category?: string;
          description?: string;
          frequency?: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
          start_date?: string;
          end_date?: string | null;
          last_generated?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};

// Helper types for specific tables
export type Expense = Database['public']['Tables']['expenses']['Row'];
export type Goal = Database['public']['Tables']['goals']['Row'];
export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type AcademicEvent = Database['public']['Tables']['academic_events']['Row'];
export type WellnessScore = Database['public']['Tables']['wellness_scores']['Row'];
export type StressAssessment = Database['public']['Tables']['stress_assessment']['Row'];
export type FinancialHabit = Database['public']['Tables']['financial_habits']['Row'];
export type BudgetWellness = Database['public']['Tables']['budget_wellness']['Row'];
export type UserMfa = Database['public']['Tables']['user_mfa']['Row'];
export type TransactionSchedule = Database['public']['Tables']['recurring_transactions']['Row'];
