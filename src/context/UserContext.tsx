import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

// Define types for user data
type UserProfile = {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  updated_at: string;
  is_onboarded?: boolean;
  currency_preference?: string;
  locale?: string;
};

type ExpenseSummary = {
  total: number;
  categories: Record<string, number>;
};

type GoalSummary = {
  total: number;
  completed: number;
  in_progress: number;
};

type Currency = {
  code: string;
  symbol: string;
  locale: string;
  name: string;
};

type UserContextType = {
  profile: UserProfile | null;
  expenses: ExpenseSummary | null;
  goals: GoalSummary | null;
  isLoading: boolean;
  error: Error | null;
  currency: Currency;
  refreshUserData: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  updateUserCurrency: (currency: Currency) => Promise<boolean>;
  availableCurrencies: Record<string, Currency>;
};

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Common currency codes and symbols
const CURRENCIES: Record<string, Currency> = {
  USD: { code: 'USD', symbol: '$', locale: 'en-US', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', locale: 'de-DE', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', locale: 'en-GB', name: 'British Pound' },
  JPY: { code: 'JPY', symbol: '¥', locale: 'ja-JP', name: 'Japanese Yen' },
  INR: { code: 'INR', symbol: '₹', locale: 'en-IN', name: 'Indian Rupee' },
  CAD: { code: 'CAD', symbol: 'C$', locale: 'en-CA', name: 'Canadian Dollar' },
  AUD: { code: 'AUD', symbol: 'A$', locale: 'en-AU', name: 'Australian Dollar' },
  CNY: { code: 'CNY', symbol: '¥', locale: 'zh-CN', name: 'Chinese Yuan' },
  RUB: { code: 'RUB', symbol: '₽', locale: 'ru-RU', name: 'Russian Ruble' },
  BRL: { code: 'BRL', symbol: 'R$', locale: 'pt-BR', name: 'Brazilian Real' },
  MXN: { code: 'MXN', symbol: 'Mex$', locale: 'es-MX', name: 'Mexican Peso' },
};

// Custom hook for using the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [expenses, setExpenses] = useState<ExpenseSummary | null>(null);
  const [goals, setGoals] = useState<GoalSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [currency, setCurrency] = useState<Currency>(CURRENCIES.INR);
  const [currencyDetected, setCurrencyDetected] = useState(false);

  // Get user's currency based on geolocation
  const detectUserCurrency = async (): Promise<string> => {
    try {
      // First try to detect currency from IP address (most accurate)
      try {
        console.log("Attempting to detect location from IP address...");
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data && data.country_code === 'IN') {
          console.log("User detected in India, setting currency to INR");
          return 'INR';
        }
        
        if (data && data.currency && CURRENCIES[data.currency]) {
          console.log("Successfully detected currency from IP:", data.currency);
          return data.currency;
        }
      } catch (err) {
        console.error("Error detecting location from IP:", err);
      }
      
      // Fallback to browser locale if IP detection fails
      const browserLocale = navigator.language;
      let detectedCurrency = '';
      
      console.log("Falling back to browser locale detection:", browserLocale);
      
      // Map common locales to currencies
      if (browserLocale.startsWith('en-US')) detectedCurrency = 'USD';
      else if (browserLocale.startsWith('en-GB')) detectedCurrency = 'GBP';
      else if (browserLocale.startsWith('en-IN')) detectedCurrency = 'INR';
      else if (browserLocale.startsWith('en-CA')) detectedCurrency = 'CAD';
      else if (browserLocale.startsWith('en-AU')) detectedCurrency = 'AUD';
      else if (browserLocale.startsWith('ja')) detectedCurrency = 'JPY';
      else if (browserLocale.startsWith('zh')) detectedCurrency = 'CNY';
      else if (browserLocale.startsWith('ru')) detectedCurrency = 'RUB';
      else if (browserLocale.startsWith('pt')) detectedCurrency = 'BRL';
      else if (browserLocale.startsWith('es-MX')) detectedCurrency = 'MXN';
      else if (browserLocale.startsWith('de') || 
               browserLocale.startsWith('fr') || 
               browserLocale.startsWith('it') || 
               browserLocale.startsWith('es')) {
        detectedCurrency = 'EUR';
      }
      
      // If still no currency detected, use USD as fallback
      if (!detectedCurrency || !CURRENCIES[detectedCurrency]) {
        console.log("No currency detected from browser locale, using USD as fallback");
        detectedCurrency = 'USD';
      }
      
      console.log("Final detected currency:", detectedCurrency);
      return detectedCurrency;
    } catch (error) {
      console.error('Error detecting currency:', error);
      return 'USD'; // Default to USD on error
    }
  };

  // Update user's currency preference
  const updateUserCurrency = async (newCurrency: Currency): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Validate currency code
      if (!CURRENCIES[newCurrency.code]) {
        throw new Error(`Invalid currency code: ${newCurrency.code}`);
      }
      
      // Update local state immediately
      setCurrency(newCurrency);
      
      // If user is logged in, update in database
      if (user && profile) {
        // Update profile in database
        const { error } = await supabase
          .from('profiles')
          .update({
            currency_preference: newCurrency.code,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
  
        if (error) throw error;
        
        // Save to localStorage for persistence
        localStorage.setItem('user_currency', newCurrency.code);
        
        // Refresh profile to get updated data
        await fetchUserProfile();
      } else {
        // Even if not logged in, save to localStorage
        localStorage.setItem('user_currency', newCurrency.code);
      }
      
      console.log('Currency updated successfully to:', newCurrency.code);
      return true;
    } catch (err) {
      console.error('Error updating currency:', err);
      setError(err as Error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Apply detected or saved currency immediately
  useEffect(() => {
    const initializeCurrency = async () => {
      // First check localStorage
      const savedCurrency = localStorage.getItem('user_currency');
      
      if (savedCurrency && CURRENCIES[savedCurrency]) {
        console.log('Using saved currency from localStorage:', savedCurrency);
        setCurrency(CURRENCIES[savedCurrency]);
        setCurrencyDetected(true);
      } else if (!currencyDetected) {
        // If no saved currency, detect it
        const detectedCurrency = await detectUserCurrency();
        setCurrency(CURRENCIES[detectedCurrency] || CURRENCIES.USD);
        setCurrencyDetected(true);
        
        // Save to localStorage for next time
        localStorage.setItem('user_currency', detectedCurrency);
      }
    };
    
    initializeCurrency();
  }, []);

  // Fetch user profile data
  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      
      if (data) {
        // Cast data to the UserProfile type
        const userProfile = data as UserProfile;
        setProfile(userProfile);
        
        // Set currency based on profile preference if it exists
        if (userProfile.currency_preference && CURRENCIES[userProfile.currency_preference]) {
          setCurrency(CURRENCIES[userProfile.currency_preference]);
          
          // Also update localStorage
          localStorage.setItem('user_currency', userProfile.currency_preference);
        }
        // If no currency in profile but we already have one set, use it
        else if (currencyDetected && currency.code) {
          // Update the profile with our detected currency
          await supabase
            .from('profiles')
            .update({
              currency_preference: currency.code,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id);
        }
        // If no currency anywhere, detect and set it
        else if (!currencyDetected) {
          const detectedCurrency = await detectUserCurrency();
          setCurrency(CURRENCIES[detectedCurrency] || CURRENCIES.USD);
          setCurrencyDetected(true);
          
          // Update profile with detected currency
          await supabase
            .from('profiles')
            .update({
              currency_preference: detectedCurrency,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id);
            
          // Save to localStorage
          localStorage.setItem('user_currency', detectedCurrency);
        }
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user expense summary
  const fetchExpenseSummary = async () => {
    if (!user) return;
    
    try {
      // Fetch expenses for the current user
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Calculate totals and categorize
      if (data) {
        const total = data.reduce((sum, expense) => sum + (expense.amount || 0), 0);
        
        // Group by category
        const categories: Record<string, number> = {};
        data.forEach(expense => {
          const category = expense.category || 'Other';
          categories[category] = (categories[category] || 0) + (expense.amount || 0);
        });
        
        setExpenses({ total, categories });
      }
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError(err as Error);
    }
  };

  // Fetch goals summary
  const fetchGoalsSummary = async () => {
    if (!user) return;
    
    try {
      // Fetch goals for the current user
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      
      if (data) {
        const total = data.length;
        const completed = data.filter(goal => 
          goal.currentAmount >= goal.targetAmount
        ).length;
        const in_progress = total - completed;
        
        setGoals({ total, completed, in_progress });
      }
    } catch (err) {
      console.error('Error fetching goals:', err);
      setError(err as Error);
    }
  };

  // Refresh all user data
  const refreshUserData = async () => {
    setIsLoading(true);
    await Promise.all([
      fetchUserProfile(),
      fetchExpenseSummary(),
      fetchGoalsSummary()
    ]);
    setIsLoading(false);
  };

  // Update user profile
  const updateProfile = async (data: Partial<UserProfile>): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;
      
      // If currency is being updated, update it in our state as well
      if (data.currency_preference && CURRENCIES[data.currency_preference]) {
        setCurrency(CURRENCIES[data.currency_preference]);
        localStorage.setItem('user_currency', data.currency_preference);
      }
      
      // Refresh profile to get updated data
      await fetchUserProfile();
      
      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err as Error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Load user data on auth state change
  useEffect(() => {
    if (user) {
      // Initialize state first if it's the very first load
      if (!currencyDetected) {
        const detectAndSetCurrency = async () => {
          const detectedCurrencyCode = await detectUserCurrency();
          if (detectedCurrencyCode && CURRENCIES[detectedCurrencyCode]) {
            setCurrency(CURRENCIES[detectedCurrencyCode]);
          setCurrencyDetected(true);
          }
        };
        
        detectAndSetCurrency();
      }
      
      // Then fetch the complete user data
      refreshUserData();
    } else {
      // Reset state if logged out
      setProfile(null);
      setExpenses(null);
      setGoals(null);
      // But keep the currency preference if it exists
    }
  }, [user]);

  return (
    <UserContext.Provider value={{
    profile,
    expenses,
    goals,
    isLoading,
    error,
    currency,
    refreshUserData,
    updateProfile,
      updateUserCurrency,
      availableCurrencies: CURRENCIES
    }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider; 