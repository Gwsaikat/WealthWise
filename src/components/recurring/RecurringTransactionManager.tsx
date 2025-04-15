import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CalendarClock,
  Calendar,
  Plus,
  ArrowDownUp,
  FilterIcon,
  ArrowDown,
  ArrowUp,
  DollarSign,
  Repeat,
  Edit,
  Trash2,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Copy,
  BarChart3,
  Calendar as CalendarIcon,
  BellOff,
  Bell,
  AlertCircle,
  CreditCard,
  Wallet,
  RotateCcw,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";
import { useAuth } from "../../context/AuthContext";
import { useUser } from "../../context/UserContext";
import { formatCurrency } from "../../lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { 
  getRecurringTransactions, 
  createRecurringTransaction, 
  updateRecurringTransaction, 
  deleteRecurringTransaction, 
  getUpcomingTransactions,
  generateMissingTransactions
} from "../../lib/recurring";
import { format, addMonths, addWeeks, addDays, startOfMonth, endOfMonth, isSameMonth, parseISO, differenceInMonths, isSameDay } from "date-fns";
import { Expense } from "../../types/supabase";
import AddExpenseForm from "../expense/AddExpenseForm";
import { ExpenseFormValues } from "../../schemas/forms";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { cn } from "../../lib/utils";
import { Calendar as CalendarComponent } from "../ui/calendar";

// Define a function to format dates consistently
const formatDate = (date: Date | number, formatStr: string = 'MMM dd, yyyy') => {
  return format(date, formatStr);
};

interface TransactionSchedule {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  end_date?: string;
  last_generated?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpcomingTransaction {
  id?: string; // Make id optional for compatibility
  title: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: string;
  frequency: string;
}

interface MonthlyForecast {
  month: Date;
  transactions: UpcomingTransaction[];
  totalIncome: number;
  totalExpenses: number;
  netImpact: number;
}

interface RecurringTransactionManagerProps {
  isLoading?: boolean;
}

const RecurringTransactionManager: React.FC<RecurringTransactionManagerProps> = ({ isLoading = false }) => {
  const { user } = useAuth();
  const { currency } = useUser();
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const [activeTab, setActiveTab] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [recurringTransactions, setRecurringTransactions] = useState<TransactionSchedule[]>([]);
  const [upcomingTransactions, setUpcomingTransactions] = useState<UpcomingTransaction[]>([]);
  const [monthlyForecasts, setMonthlyForecasts] = useState<MonthlyForecast[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [currentTransaction, setCurrentTransaction] = useState<TransactionSchedule | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [upcomingViewMode, setUpcomingViewMode] = useState<"list" | "calendar">("list");
  const [selectedTab, setSelectedTab] = useState<string>("upcoming");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  const [selectedDateTransactions, setSelectedDateTransactions] = useState<TransactionSchedule[]>([]);

  useEffect(() => {
    if (user) {
      fetchRecurringTransactions();
      fetchUpcomingTransactions();
    }
  }, [user]);

  const fetchRecurringTransactions = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const transactions = await getRecurringTransactions(user.id);
      setRecurringTransactions(transactions);
    } catch (error) {
      console.error("Error fetching recurring transactions:", error);
      toast({
        title: "Error",
        description: "Failed to load recurring transactions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingTransactions = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const upcoming = await getUpcomingTransactions(user.id);
      setUpcomingTransactions(upcoming);
      
      if (upcoming.length > 0) {
        const now = new Date();
        const forecastMonths: MonthlyForecast[] = [];
        
        for (let i = 0; i < 3; i++) {
          const monthDate = addMonths(now, i);
          const monthStart = startOfMonth(monthDate);
          const monthEnd = endOfMonth(monthDate);
          
          const monthTransactions = upcoming.filter(t => {
            const transactionDate = parseISO(t.date);
            return isSameMonth(transactionDate, monthDate);
          });
          
          const totalIncome = monthTransactions
            .filter(t => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0);
            
          const totalExpenses = monthTransactions
            .filter(t => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0);
            
          forecastMonths.push({
            month: monthDate,
            transactions: monthTransactions,
            totalIncome,
            totalExpenses,
            netImpact: totalIncome - totalExpenses,
          });
        }
        
        setMonthlyForecasts(forecastMonths);
      }
    } catch (error) {
      console.error("Error fetching upcoming transactions:", error);
      toast({
        title: "Error",
        description: "Failed to load upcoming transactions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTransactions = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const generated = await generateMissingTransactions(user.id);
      if (generated) {
        toast({
          title: "Success",
          description: `Generated ${generated} transactions`,
        });
        // Refresh the data
        fetchRecurringTransactions();
        fetchUpcomingTransactions();
      }
    } catch (error) {
      console.error("Error generating transactions:", error);
      toast({
        title: "Error",
        description: "Failed to generate transactions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (data: ExpenseFormValues) => {
    if (!user?.id) return;
    
    if (!data.recurringFrequency) {
      toast({
        title: "Error",
        description: "Please select a frequency for the recurring transaction",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      const newTransaction = {
        user_id: user.id,
        title: data.description || data.category,
        amount: typeof data.amount === 'string' ? parseFloat(data.amount) : data.amount,
        type: transactionType,
        category: data.category,
        description: data.description || "",
        frequency: data.recurringFrequency,
        start_date: data.date.toISOString(),
        is_active: true,
      };
      
      const created = await createRecurringTransaction(newTransaction);
      
      if (created) {
        setRecurringTransactions([...recurringTransactions, created]);
        setShowAddDialog(false);
        
        toast({
          title: "Success",
          description: "Recurring transaction created",
        });
        
        // Refresh data
        fetchRecurringTransactions();
        fetchUpcomingTransactions();
      }
    } catch (error) {
      console.error("Error creating recurring transaction:", error);
      toast({
        title: "Error",
        description: "Failed to create recurring transaction",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTransaction = async (data: ExpenseFormValues) => {
    if (!user?.id || !currentTransaction) return;
    
    if (!data.recurringFrequency) {
      toast({
        title: "Error",
        description: "Please select a frequency for the recurring transaction",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      const updatedTransaction = {
        ...currentTransaction,
        title: data.description || data.category,
        amount: typeof data.amount === 'string' ? parseFloat(data.amount) : data.amount,
        category: data.category,
        description: data.description || "",
        frequency: data.recurringFrequency,
        start_date: data.date.toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      const updated = await updateRecurringTransaction(currentTransaction.id, updatedTransaction);
      
      if (updated) {
        setRecurringTransactions(
          recurringTransactions.map((t) => (t.id === updated.id ? updated : t))
        );
        setShowEditDialog(false);
        setCurrentTransaction(null);
        
        toast({
          title: "Success",
          description: "Recurring transaction updated",
        });
        
        // Refresh data
        fetchRecurringTransactions();
        fetchUpcomingTransactions();
      }
    } catch (error) {
      console.error("Error updating recurring transaction:", error);
      toast({
        title: "Error",
        description: "Failed to update recurring transaction",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!user?.id) return;
    
    if (confirm("Are you sure you want to delete this recurring transaction?")) {
      setLoading(true);
      try {
        const success = await deleteRecurringTransaction(id);
        
        if (success) {
          setRecurringTransactions(recurringTransactions.filter((t) => t.id !== id));
          
          toast({
            title: "Success",
            description: "Recurring transaction deleted",
          });
          
          // Refresh the upcoming transactions
          fetchUpcomingTransactions();
        }
      } catch (error) {
        console.error("Error deleting recurring transaction:", error);
        toast({
          title: "Error",
          description: "Failed to delete recurring transaction",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleActive = async (transaction: TransactionSchedule, active: boolean) => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const updated = await updateRecurringTransaction(transaction.id, {
        ...transaction,
        is_active: active,
        updated_at: new Date().toISOString(),
      });
      
      if (updated) {
        setRecurringTransactions(
          recurringTransactions.map((t) => (t.id === updated.id ? updated : t))
        );
        
        toast({
          title: `Transaction ${active ? "Activated" : "Paused"}`,
          description: active
            ? "Transaction will continue generating"
            : "Transaction has been paused",
        });
      }
    } catch (error) {
      console.error("Error updating transaction status:", error);
      toast({
        title: "Error",
        description: "Failed to update transaction status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case "weekly":
        return "Weekly";
      case "biweekly":
        return "Every 2 Weeks";
      case "monthly":
        return "Monthly";
      case "quarterly":
        return "Quarterly";
      case "yearly":
        return "Yearly";
      default:
        return frequency;
    }
  };

  const getNextDate = (transaction: TransactionSchedule) => {
    const startDate = new Date(transaction.start_date);
    const now = new Date();
    
    if (transaction.last_generated) {
      const lastGenerated = new Date(transaction.last_generated);
      
      switch (transaction.frequency) {
        case "weekly":
          return addDays(lastGenerated, 7);
        case "biweekly":
          return addDays(lastGenerated, 14);
        case "monthly":
          return addMonths(lastGenerated, 1);
        case "quarterly":
          return addMonths(lastGenerated, 3);
        case "yearly":
          return addMonths(lastGenerated, 12);
        default:
          return lastGenerated;
      }
    } else {
      // If never generated, return start date if it's in the future
      if (startDate > now) {
        return startDate;
      }
      
      // Otherwise calculate next date from now
      switch (transaction.frequency) {
        case "weekly":
          return addDays(now, 7);
        case "biweekly":
          return addDays(now, 14);
        case "monthly":
          return addMonths(now, 1);
        case "quarterly":
          return addMonths(now, 3);
        case "yearly":
          return addMonths(now, 12);
        default:
          return now;
      }
    }
  };

  const getTransactionsForDate = (date: Date) => {
    return upcomingTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return isSameDay(transactionDate, date);
    });
  };

  const filteredTransactions = recurringTransactions.filter((transaction) => {
    if (filter === "all") return true;
    if (filter === "active") return transaction.is_active;
    if (filter === "inactive") return !transaction.is_active;
    if (filter === "income") return transaction.type === "income";
    if (filter === "expense") return transaction.type === "expense";
    return true;
  });

  const handleEditTransaction = (transaction: TransactionSchedule) => {
    setCurrentTransaction(transaction);
    setShowEditDialog(true);
  };

  const handleToggleStatus = (transaction: TransactionSchedule) => {
    handleToggleActive(transaction, !transaction.is_active);
  };

  const prevMonth = () => {
    setCurrentMonth(prev => addMonths(prev, -1));
    generateCalendarDays();
  };

  const nextMonth = () => {
    setCurrentMonth(next => addMonths(next, 1));
    generateCalendarDays();
  };

  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = differenceInMonths(monthEnd, monthStart) + 1;
    const days: Date[] = [];
    for (let i = 0; i < daysInMonth; i++) {
      days.push(addDays(monthStart, i));
    }
    setCalendarDays(days);
  };

  useEffect(() => {
    generateCalendarDays();
  }, [currentMonth]);

  useEffect(() => {
    if (selectedDate) {
      const transactions = getTransactionsForDate(selectedDate);
      // Convert UpcomingTransaction[] to TransactionSchedule[] safely
      const convertedTransactions = transactions.map(t => ({
        id: t.id || '',
        user_id: user?.id || '',
        title: t.title,
        amount: t.amount,
        type: t.type as 'income' | 'expense',
        category: t.category,
        description: t.description,
        frequency: t.frequency as 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly',
        start_date: t.date,
        is_active: true,
        created_at: '',
        updated_at: ''
      }));
      setSelectedDateTransactions(convertedTransactions);
    }
  }, [selectedDate, user?.id]);

  // Add this function to safely convert UpcomingTransaction to TransactionSchedule
  const convertToTransactionSchedule = (transaction: UpcomingTransaction): TransactionSchedule => {
    return {
      id: transaction.id || '',
      user_id: user?.id || '',
      title: transaction.title,
      amount: transaction.amount,
      type: transaction.type as 'income' | 'expense',
      category: transaction.category,
      description: transaction.description,
      frequency: transaction.frequency as 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly',
      start_date: transaction.date,
      is_active: true,
      created_at: '',
      updated_at: ''
    };
  };

  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700/50 shadow-xl overflow-hidden">
        <CardHeader className="pb-2 border-b border-slate-700/30">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-white flex items-center">
                <RotateCcw className="h-6 w-6 mr-3 text-teal-400" />
                Recurring Transactions
              </CardTitle>
              <CardDescription className="text-slate-300">
                Manage your recurring income and expenses
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 border-slate-600 bg-slate-800/60 hover:bg-slate-700 text-white"
                onClick={() => setShowAddDialog(true)}
              >
                <Plus className="mr-2 h-4 w-4 text-teal-400" />
                Add Transaction
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <Tabs 
                  defaultValue="upcoming" 
                  value={selectedTab} 
                  onValueChange={setSelectedTab}
                  className="w-full sm:w-auto"
                >
                  <TabsList className="bg-slate-800/70 border border-slate-700/50 p-1 w-full sm:w-auto">
                    <TabsTrigger 
                      value="upcoming" 
                      className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300 data-[state=active]:shadow-md"
                    >
                      Upcoming
                    </TabsTrigger>
                    <TabsTrigger 
                      value="all" 
                      className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300 data-[state=active]:shadow-md"
                    >
                      All Recurring
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[150px] h-9 bg-slate-800/70 border-slate-700/50 text-slate-300">
                      <div className="flex items-center gap-2">
                        <FilterIcon className="h-3.5 w-3.5 text-slate-400" />
                        <SelectValue placeholder="Status" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="all" className="text-slate-200">All Status</SelectItem>
                      <SelectItem value="active" className="text-slate-200">Active Only</SelectItem>
                      <SelectItem value="inactive" className="text-slate-200">Inactive Only</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full sm:w-[150px] h-9 bg-slate-800/70 border-slate-700/50 text-slate-300">
                      <div className="flex items-center gap-2">
                        <FilterIcon className="h-3.5 w-3.5 text-slate-400" />
                        <SelectValue placeholder="Type" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="all" className="text-slate-200">All Types</SelectItem>
                      <SelectItem value="income" className="text-slate-200">Income Only</SelectItem>
                      <SelectItem value="expense" className="text-slate-200">Expense Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center border border-dashed border-slate-700/50 rounded-xl bg-slate-800/30">
                  <Loader2 className="h-10 w-10 text-slate-500 animate-spin mb-4" />
                  <p className="text-slate-400">Loading transactions...</p>
                </div>
              ) : selectedTab === 'all' ? (
                <>
                  {filteredTransactions.length > 0 ? (
                    <div className="space-y-3">
                      {filteredTransactions.map((transaction) => (
                        <div 
                          key={transaction.id}
                          className="p-4 rounded-lg border border-slate-700/30 bg-gradient-to-r from-slate-800/80 to-slate-800/40 hover:from-slate-800 hover:to-slate-800/60 transition-all duration-200 group relative overflow-hidden"
                        >
                          <div className={`absolute top-0 left-0 w-1 h-full ${transaction.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                          
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className={`
                                flex items-center justify-center h-10 w-10 rounded-full 
                                ${transaction.type === 'income' 
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                }
                              `}>
                                {transaction.type === 'income' ? (
                                  <ArrowDown className="h-5 w-5" />
                                ) : (
                                  <ArrowUp className="h-5 w-5" />
                                )}
                              </div>
                              
                              <div>
                                <h3 className="font-medium text-white group-hover:text-teal-300 transition-colors">
                                  {transaction.description}
                                </h3>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span 
                                    className={`
                                      text-xs px-2 py-0.5 rounded-full
                                      ${getFrequencyColor(transaction.frequency)}
                                    `}
                                  >
                                    {getFrequencyLabel(transaction.frequency)}
                                  </span>
                                  
                                  <Badge variant={transaction.is_active ? "outline" : "secondary"} className={
                                    transaction.is_active 
                                      ? "border-teal-500/30 bg-teal-950/30 text-teal-400 hover:bg-teal-900/20"
                                      : "border-slate-700/30 bg-slate-800/30 text-slate-400"
                                  }>
                                    {transaction.is_active ? (
                                      <Bell className="h-3 w-3 mr-1 text-teal-400" />
                                    ) : (
                                      <BellOff className="h-3 w-3 mr-1 text-slate-400" />
                                    )}
                                    {transaction.is_active ? "Active" : "Inactive"}
                                  </Badge>
                                  
                                  <span className="text-xs text-slate-400">
                                    Next: {formatDate(getNextDate(transaction))}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end">
                              <span 
                                className={`
                                  font-semibold text-lg
                                  ${transaction.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}
                                `}
                              >
                                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                              </span>
                              
                              <div className="flex items-center gap-1 mt-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700"
                                  onClick={() => handleEditTransaction(transaction)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700"
                                  onClick={() => handleToggleStatus(transaction)}
                                >
                                  {transaction.is_active ? (
                                    <BellOff className="h-4 w-4" />
                                  ) : (
                                    <Bell className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-slate-400 hover:text-rose-400 hover:bg-rose-900/20"
                                  onClick={() => handleDeleteTransaction(transaction.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-16 flex flex-col items-center justify-center border border-dashed border-slate-700/50 rounded-xl bg-slate-800/30">
                      <AlertCircle className="h-10 w-10 text-slate-500 mb-4" />
                      <h3 className="text-lg font-medium text-white mb-1">No transactions found</h3>
                      <p className="text-slate-400 text-center mb-4">
                        {statusFilter !== 'all' || typeFilter !== 'all' 
                          ? "Try changing your filters or add a new transaction"
                          : "Add your first recurring transaction to get started"}
                      </p>
                      <Button
                        variant="outline"
                        className="border-slate-600 bg-slate-800/60 hover:bg-slate-700 text-white"
                        onClick={() => setShowAddDialog(true)}
                      >
                        <Plus className="mr-2 h-4 w-4 text-teal-400" />
                        Add Transaction
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                // Upcoming Transactions Tab
                <>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-teal-400" />
                      <h3 className="text-lg font-bold text-white">
                        {formatDate(currentMonth, 'MMMM yyyy')}
                      </h3>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full text-slate-400 hover:text-white hover:bg-slate-700/40"
                        onClick={prevMonth}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full text-slate-400 hover:text-white hover:bg-slate-700/40"
                        onClick={nextMonth}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl border border-slate-700/30 p-4 shadow-inner overflow-hidden">
                    <div className="grid grid-cols-7 gap-2 mb-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div
                          key={day}
                          className="text-center text-xs font-medium text-slate-400 py-2"
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-7 gap-2">
                      {calendarDays.map((day, i) => {
                        const dayTransactions = upcomingTransactions.filter(
                          (transaction) => isSameDay(parseISO(transaction.date), day)
                        );
                        
                        const isToday = isSameDay(day, new Date());
                        const isCurrentMonth = isSameMonth(day, currentMonth);
                        const isSelected = selectedDate && isSameDay(day, selectedDate);
                        
                        const hasIncome = dayTransactions.some(t => t.type === 'income');
                        const hasExpense = dayTransactions.some(t => t.type === 'expense');
                        
                        return (
                          <div 
                            key={i}
                            className={`
                              min-h-[90px] p-2 rounded-lg transition-all duration-200 border cursor-pointer
                              ${isCurrentMonth ? 'bg-slate-800/40' : 'bg-slate-900/40'} 
                              ${isToday ? 'ring-1 ring-teal-500/50 border-teal-500/30 shadow-sm shadow-teal-500/5' : 'border-slate-700/20'}
                              ${isSelected ? 'ring-2 ring-teal-400/30 bg-slate-700/40' : ''}
                              hover:bg-slate-700/40
                            `}
                            onClick={() => setSelectedDate(day)}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span
                                className={`
                                  h-6 w-6 flex items-center justify-center text-sm rounded-full
                                  ${isToday ? 'bg-teal-500 text-white font-medium' : ''}
                                  ${!isCurrentMonth && !isToday ? 'text-slate-500' : 'text-slate-300'}
                                `}
                              >
                                {formatDate(day, 'd')}
                              </span>
                              
                              {dayTransactions.length > 0 && (
                                <Badge 
                                  className="bg-slate-700/60 text-white text-[10px] h-5 px-1.5 flex items-center justify-center"
                                >
                                  {dayTransactions.length}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="space-y-1 mt-1">
                              {hasIncome && (
                                <div className="flex items-center gap-1">
                                  <div className="w-1 h-1 rounded-full bg-emerald-400"></div>
                                  <span className="text-[10px] text-emerald-400">
                                    {dayTransactions.filter(t => t.type === 'income').length} income
                                  </span>
                                </div>
                              )}
                              {hasExpense && (
                                <div className="flex items-center gap-1">
                                  <div className="w-1 h-1 rounded-full bg-rose-400"></div>
                                  <span className="text-[10px] text-rose-400">
                                    {dayTransactions.filter(t => t.type === 'expense').length} expense
                                  </span>
                                </div>
                              )}
                              
                              {dayTransactions.length > 0 && (
                                <div className="mt-2 space-y-1">
                                  {dayTransactions.slice(0, 2).map((transaction, idx) => (
                                    <div 
                                      key={idx}
                                      className={`
                                        px-1.5 py-0.5 text-[10px] rounded truncate
                                        ${transaction.type === 'income' 
                                          ? 'bg-emerald-900/30 text-emerald-300 border-l border-emerald-500/50' 
                                          : 'bg-rose-900/30 text-rose-300 border-l border-rose-500/50'
                                        }
                                      `}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Convert to TransactionSchedule before passing to handleEditTransaction
                                        handleEditTransaction(convertToTransactionSchedule(transaction));
                                      }}
                                    >
                                      {transaction.description}
                                    </div>
                                  ))}
                                  {dayTransactions.length > 2 && (
                                    <div className="px-1.5 text-[10px] text-slate-400">
                                      +{dayTransactions.length - 2} more
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl border border-slate-700/30 p-5 h-full shadow-inner">
                {selectedDate ? (
                  <>
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-lg font-bold text-white flex items-center">
                        <CalendarIcon className="h-5 w-5 mr-2 text-teal-400" />
                        {formatDate(selectedDate, 'MMMM d, yyyy')}
                      </h3>
                      {isSameDay(selectedDate, new Date()) && (
                        <Badge className="bg-teal-500/20 text-teal-300 border-0">
                          Today
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-5">
                      <div>
                        <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center">
                          <CreditCard className="h-4 w-4 mr-2 text-teal-400" />
                          Transactions on this day
                        </h4>
                        
                        {selectedDateTransactions.length > 0 ? (
                          <div className="space-y-3">
                            {selectedDateTransactions.map((transaction) => (
                              <div 
                                key={transaction.id}
                                className={`
                                  p-3 rounded-lg border border-slate-700/20
                                  ${transaction.type === 'income' 
                                    ? 'bg-emerald-900/10 hover:bg-emerald-900/20' 
                                    : 'bg-rose-900/10 hover:bg-rose-900/20'
                                  } 
                                  transition-all cursor-pointer
                                `}
                                onClick={() => handleEditTransaction(transaction)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className={`
                                      p-2 rounded-full 
                                      ${transaction.type === 'income'
                                        ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/30'
                                        : 'bg-rose-900/30 text-rose-400 border border-rose-500/30'
                                      }
                                    `}>
                                      {transaction.type === 'income' ? (
                                        <ArrowDown className="h-4 w-4" />
                                      ) : (
                                        <ArrowUp className="h-4 w-4" />
                                      )}
                                    </div>
                                    <div>
                                      <h5 className="font-medium text-white">{transaction.description}</h5>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        <span 
                                          className={`
                                            text-xs px-1.5 py-0.5 rounded-full
                                            ${getFrequencyColor(transaction.frequency)}
                                          `}
                                        >
                                          {getFrequencyLabel(transaction.frequency)}
                                        </span>
                                        {!transaction.is_active && (
                                          <Badge variant="secondary" className="border-slate-700/30 bg-slate-800/30 text-slate-400">
                                            <BellOff className="h-3 w-3 mr-1" />
                                            Inactive
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <span 
                                    className={`
                                      font-semibold text-base
                                      ${transaction.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}
                                    `}
                                  >
                                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 rounded-lg border border-dashed border-slate-700/30 text-center bg-slate-800/20">
                            <p className="text-slate-400 mb-3">No transactions scheduled for this day</p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-slate-600 bg-slate-800/60 hover:bg-slate-700 text-white"
                              onClick={() => {
                                setCurrentTransaction({
                                  id: '',
                                  user_id: '',
                                  title: '',
                                  amount: 0,
                                  type: 'expense',
                                  category: '',
                                  description: '',
                                  frequency: 'monthly',
                                  start_date: formatDate(new Date(), 'yyyy-MM-dd'),
                                  is_active: true,
                                  created_at: '',
                                  updated_at: '',
                                });
                                setShowEditDialog(true);
                              }}
                            >
                              <Plus className="mr-2 h-4 w-4 text-teal-400" />
                              Add Transaction
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <div className="pt-4 border-t border-slate-700/20">
                        <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center">
                          <Wallet className="h-4 w-4 mr-2 text-teal-400" />
                          Financial Summary
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-lg bg-emerald-900/10 border border-emerald-500/20">
                            <div className="text-xs text-emerald-300 mb-1 flex items-center">
                              <ArrowDown className="h-3 w-3 mr-1" />
                              Total Income
                            </div>
                            <div className="text-lg font-semibold text-emerald-400">
                              {formatCurrency(selectedDateTransactions
                                .filter(t => t.type === 'income')
                                .reduce((sum, t) => sum + t.amount, 0)
                              )}
                            </div>
                          </div>
                          
                          <div className="p-3 rounded-lg bg-rose-900/10 border border-rose-500/20">
                            <div className="text-xs text-rose-300 mb-1 flex items-center">
                              <ArrowUp className="h-3 w-3 mr-1" />
                              Total Expenses
                            </div>
                            <div className="text-lg font-semibold text-rose-400">
                              {formatCurrency(selectedDateTransactions
                                .filter(t => t.type === 'expense')
                                .reduce((sum, t) => sum + t.amount, 0)
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center">
                    <div className="text-center p-6">
                      <CalendarIcon className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">Select a date</h3>
                      <p className="text-slate-400 mb-5">
                        Choose a date on the calendar to view or add transactions
                      </p>
                      <Button
                        variant="outline"
                        className="border-slate-600 bg-slate-800/60 hover:bg-slate-700 text-white"
                        onClick={() => setSelectedDate(new Date())}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-teal-400" />
                        View Today
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Dialog components remain the same */}
      {/* ... existing code ... */}
    </div>
  );
};

// Helper function to get frequency color
function getFrequencyColor(frequency: string) {
  switch(frequency) {
    case 'weekly':
      return 'bg-purple-900/30 text-purple-300';
    case 'biweekly':
      return 'bg-blue-900/30 text-blue-300';
    case 'monthly':
      return 'bg-amber-900/30 text-amber-300';
    case 'quarterly':
      return 'bg-indigo-900/30 text-indigo-300';
    case 'yearly':
      return 'bg-teal-900/30 text-teal-300';
    default:
      return 'bg-slate-900/30 text-slate-300';
  }
}

export default RecurringTransactionManager; 