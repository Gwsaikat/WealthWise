import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  Camera,
  Plus,
  Receipt,
  ArrowRight,
  Clock,
  FilterIcon,
  Tag,
  Calendar,
  Trash2,
  PencilLine,
  Search,
  DollarSign,
  ShoppingBag,
  Coffee,
  Home,
  Car,
  MoreHorizontal,
  Edit,
  Info,
  X,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { useToast } from "../ui/use-toast";
import { useAuth } from "../../context/AuthContext";
import { getExpenses, addExpense, deleteExpense, updateExpense } from "../../lib/database";
import type { Expense } from "../../types/supabase";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { cn } from "../../lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { Calendar as CalendarComponent } from "../ui/calendar";
import { Skeleton } from "../ui/skeleton";
import { formatCurrency } from "../../lib/utils";
import { useUser } from "../../context/UserContext";
import AddExpenseForm from "./AddExpenseForm";
import { ExpenseFormValues } from "../../schemas/forms";

interface ExpenseTrackerProps {
  initialExpenses?: Expense[];
}

const EXPENSE_CATEGORIES = [
  "Food",
  "Transportation",
  "Housing",
  "Entertainment",
  "Education",
  "Shopping",
  "Utilities",
  "Healthcare",
  "Personal",
  "Other"
];

const categoryIcons: Record<string, React.ReactNode> = {
  "Food & Drink": <Coffee className="h-4 w-4" />,
  Shopping: <ShoppingBag className="h-4 w-4" />,
  Housing: <Home className="h-4 w-4" />,
  Transportation: <Car className="h-4 w-4" />,
  Other: <MoreHorizontal className="h-4 w-4" />,
};

const categoryColors: Record<string, string> = {
  "Food & Drink": "bg-amber-500",
  Shopping: "bg-blue-500",
  Housing: "bg-green-500",
  Transportation: "bg-purple-500",
  Other: "bg-gray-500",
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({ initialExpenses = [] }) => {
  const { user } = useAuth();
  const { currency } = useUser();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("manual");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("Food");
  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isEditExpenseOpen, setIsEditExpenseOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedDate, setSelectedDate] = useState<Date>();

  // Replace these form states with a single editing expense state
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user]);
  
  const fetchExpenses = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const fetchedExpenses = await getExpenses(user.id);
      setExpenses(fetchedExpenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast({
        title: "Error",
        description: "Failed to load expenses",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Voice capture function (placeholder)
  const handleVoiceCapture = () => {
    // In a real implementation, this would activate voice recognition
    toast({
      title: "Voice Recognition",
      description: "Voice capture activated (this is a placeholder)",
    });
  };

  // Receipt scanning function (placeholder)
  const handleScanReceipt = () => {
    // In a real implementation, this would open the camera
    toast({
      title: "Camera",
      description: "Camera activated for receipt scanning (this is a placeholder)",
    });
  };

  // Fix the handleManualSubmit function to match the expected interface for quick adding expenses
  const handleManualSubmit = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to add expenses",
        variant: "destructive",
      });
      return;
    }
    
    if (!amount || !description || !category) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const newExpenseData = await addExpense(user.id, {
        amount: parseFloat(amount),
        category,
        description,
        date: new Date().toISOString(),
        is_recurring: false,
        recurring_frequency: undefined
      });
      
      if (newExpenseData) {
        setExpenses([newExpenseData, ...expenses]);
        toast({
          title: "Success",
          description: "Expense added successfully",
        });
        
        // Reset form
    setAmount("");
    setDescription("");
        setCategory("Food");
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      toast({
        title: "Error",
        description: "Failed to add expense",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Replace the existing updateExpense function with this one
  const handleUpdateExpense = async (data: ExpenseFormValues) => {
    if (!user?.id || !editingExpense?.id) {
      toast({
        title: "Error",
        description: "Unable to update expense",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Convert the form data to the format expected by the database function
      const updatedExpenseData = await updateExpense(editingExpense.id, {
        amount: typeof data.amount === 'string' ? parseFloat(data.amount) : data.amount,
        category: data.category,
        description: data.description || "",
        date: data.date.toISOString(),
        is_recurring: data.isRecurring || false,
        recurring_frequency: data.recurringFrequency as string,
      });
      
      if (updatedExpenseData) {
        // Update the expense in the list
        setExpenses(
          expenses.map((expense) => 
            expense.id === editingExpense.id ? updatedExpenseData : expense
          )
        );
        
        // Close the edit expense dialog
        setIsEditExpenseOpen(false);
        setEditingExpense(null);
        
        toast({
          title: "Success",
          description: "Expense updated successfully",
        });
      }
    } catch (error) {
      console.error("Error updating expense:", error);
      toast({
        title: "Error",
        description: "Failed to update expense",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Delete expense function
  const handleDeleteExpense = async (id: string) => {
    if (!user?.id) return;
    
    try {
      const success = await deleteExpense(id);
      
      if (success) {
        setExpenses(expenses.filter(expense => expense.id !== id));
        toast({
          title: "Success",
          description: "Expense deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive",
      });
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return dateString;
    }
  };

  // Filter and sort expenses
  const filteredExpenses = expenses
    .filter((expense) => {
      // Category filter
      if (categoryFilter !== "All" && expense.category !== categoryFilter) {
        return false;
      }
      
      // Search term filter
      if (
        searchTerm &&
        !expense.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !expense.category.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by date
      if (sortOrder === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
    });

  // Add the handleAddExpense function to receive form data
  const handleAddExpense = async (data: ExpenseFormValues) => {
    if (!user?.id) {
        toast({
        title: "Error",
        description: "You must be logged in to add expenses",
          variant: "destructive",
        });
        return;
      }

    setLoading(true);
    
    try {
      // Convert the form data to the format expected by the database function
      const newExpenseData = await addExpense(user.id, {
        amount: typeof data.amount === 'string' ? parseFloat(data.amount) : data.amount,
        category: data.category,
        description: data.description || "",
        date: data.date.toISOString(),
        is_recurring: data.isRecurring || false,
        recurring_frequency: data.recurringFrequency as string,
      });
      
      if (newExpenseData) {
        // Add the new expense to the top of the list
        setExpenses([newExpenseData, ...expenses]);
        
        // Close the add expense dialog
      setIsAddExpenseOpen(false);
      
      toast({
          title: "Success",
          description: "Expense added successfully",
      });
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      toast({
        title: "Error",
        description: "Failed to add expense",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      className="bg-gray-800/40 backdrop-blur-xl rounded-xl border border-gray-700/50 shadow-lg shadow-black/20 p-6 h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="mr-3 p-2 rounded-full bg-gradient-to-br from-yellow-500/20 to-amber-600/20">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Receipt className="h-5 w-5 text-yellow-400" />
            </motion.div>
          </div>
          <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-amber-400">Track Expense</h2>
        </div>
        <div className="text-sm text-gray-400">Quick expense entry</div>
      </div>

      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-1 rounded-lg">
          <TabsTrigger
            value="voice"
            onClick={() => setActiveTab("voice")}
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500/20 data-[state=active]:to-amber-500/20 data-[state=active]:text-yellow-400 data-[state=active]:backdrop-blur-xl data-[state=active]:shadow-sm data-[state=active]:border-yellow-500/20 rounded-md px-3 py-2 transition-all duration-300"
          >
            <Mic className="mr-2 h-4 w-4" /> Voice
          </TabsTrigger>
          <TabsTrigger
            value="scan"
            onClick={() => setActiveTab("scan")}
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500/20 data-[state=active]:to-amber-500/20 data-[state=active]:text-yellow-400 data-[state=active]:backdrop-blur-xl data-[state=active]:shadow-sm data-[state=active]:border-yellow-500/20 rounded-md px-3 py-2 transition-all duration-300"
          >
            <Camera className="mr-2 h-4 w-4" /> Scan
          </TabsTrigger>
          <TabsTrigger
            value="manual"
            onClick={() => setActiveTab("manual")}
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500/20 data-[state=active]:to-amber-500/20 data-[state=active]:text-yellow-400 data-[state=active]:backdrop-blur-xl data-[state=active]:shadow-sm data-[state=active]:border-yellow-500/20 rounded-md px-3 py-2 transition-all duration-300"
          >
            <Plus className="mr-2 h-4 w-4" /> Manual
          </TabsTrigger>
        </TabsList>

        <TabsContent value="voice" className="space-y-4">
          <motion.div
            whileHover={{ scale: 1.01, boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)" }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center p-8 border border-gray-700/50 rounded-xl bg-gradient-to-b from-gray-800/40 to-gray-900/40 backdrop-blur-xl shadow-inner"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(250, 204, 21, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="rounded-full h-24 w-24 flex items-center justify-center bg-gradient-to-br from-yellow-400/20 to-amber-600/20 hover:from-yellow-400/30 hover:to-amber-600/30 border border-yellow-500/30 shadow-lg shadow-yellow-900/20"
              onClick={handleVoiceCapture}
            >
              <Mic className="h-10 w-10 text-yellow-400" />
            </motion.button>
            <p className="mt-6 text-sm text-gray-300 font-medium">
              Tap to speak your expense
            </p>
            <motion.p 
              className="text-xs text-gray-400 mt-2 px-3 py-1.5 rounded-full bg-gray-800/40 border border-gray-700/50 shadow-inner"
              animate={{ 
                opacity: [0.6, 1, 0.6],
                y: [0, -2, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              "I spent $12 on lunch today"
            </motion.p>
          </motion.div>
        </TabsContent>

        <TabsContent value="scan" className="space-y-4">
          <motion.div
            whileHover={{ scale: 1.01, boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)" }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center p-8 border border-gray-700/50 rounded-xl bg-gradient-to-b from-gray-800/40 to-gray-900/40 backdrop-blur-xl shadow-inner"
          >
            <motion.div
              className="relative"
              animate={{
                opacity: [1, 0.8, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.div 
                className="absolute inset-0 rounded-full bg-yellow-400/10"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              />
            <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(250, 204, 21, 0.3)" }}
              whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="rounded-full h-24 w-24 flex items-center justify-center bg-gradient-to-br from-yellow-400/20 to-amber-600/20 hover:from-yellow-400/30 hover:to-amber-600/30 border border-yellow-500/30 shadow-lg shadow-yellow-900/20 z-10 relative"
              onClick={handleScanReceipt}
            >
                <Camera className="h-10 w-10 text-yellow-400" />
            </motion.button>
            </motion.div>
            <p className="mt-6 text-sm text-gray-300 font-medium">
              Tap to scan receipt
            </p>
            <motion.p 
              className="text-xs text-gray-400 mt-2 px-3 py-1.5 rounded-full bg-gray-800/40 border border-gray-700/50 shadow-inner"
              animate={{ 
                opacity: [0.6, 1, 0.6],
                y: [0, -2, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Our AI will extract the details
            </motion.p>
          </motion.div>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <Label htmlFor="amount" className="text-sm text-gray-400 mb-1.5 block">Amount</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <DollarSign className="h-4 w-4 text-yellow-500" />
                </div>
              <Input
                  id="amount"
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                  className="pl-9 text-lg bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus-visible:ring-yellow-500/50 focus-visible:border-yellow-500/50 transition-all duration-300 backdrop-blur-sm rounded-lg"
              />
            </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Label htmlFor="description" className="text-sm text-gray-400 mb-1.5 block">Description</Label>
              <Input
                id="description"
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus-visible:ring-yellow-500/50 focus-visible:border-yellow-500/50 transition-all duration-300 backdrop-blur-sm rounded-lg"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <Label htmlFor="category" className="text-sm text-gray-400 mb-1.5 block">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white focus:ring-yellow-500/50 transition-all duration-300 backdrop-blur-sm rounded-lg">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800/90 backdrop-blur-xl border-gray-700 text-white">
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat} className="focus:bg-yellow-500/20 focus:text-yellow-300">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              whileHover={{ scale: 1.01 }}
            >
            <Button
                onClick={() => {
                  setIsAddExpenseOpen(true);
                }}
              disabled={loading}
                className="w-full mt-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-600 text-gray-900 font-medium shadow-md shadow-amber-900/20 transition-all duration-300 hover:shadow-lg hover:shadow-amber-900/30 border border-yellow-500/20"
            >
              {loading ? (
                <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ 
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="mr-2"
                    >
                      <span className="h-4 w-4 block rounded-full border-2 border-gray-900 border-t-transparent"></span>
                    </motion.div>
                  Adding...
                </>
              ) : (
                <>
              Add Expense
                    <motion.div
                      animate={{ 
                        x: [0, 3, 0],
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        repeatType: "reverse"
                      }}
                      className="ml-2"
                    >
                      <Plus className="h-4 w-4" />
                    </motion.div>
                </>
              )}
            </Button>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h3 className="text-md font-medium bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Recent Expenses</h3>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="ml-2 h-1.5 w-1.5 rounded-full bg-yellow-500"
            />
          </div>
          <div className="flex space-x-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="sm" className="h-8 px-2 border-gray-700/50 bg-gray-800/30 hover:bg-gray-700/50 backdrop-blur-sm">
                <FilterIcon className="h-3.5 w-3.5 text-gray-400" />
            </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="sm" className="h-8 px-2 border-gray-700/50 bg-gray-800/30 hover:bg-gray-700/50 backdrop-blur-sm">
              <Calendar className="h-3.5 w-3.5 text-gray-400" />
          </Button>
            </motion.div>
          </div>
        </div>

        <ScrollArea className="h-[250px] pr-4 overflow-auto custom-scrollbar">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/50 backdrop-blur-sm animate-pulse">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-700/50 mr-3"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-700/50 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-700/50 rounded w-1/3"></div>
            </div>
                    <div className="h-5 bg-gray-700/50 rounded w-16"></div>
            </div>
                </div>
              ))}
            </div>
          ) : expenses.length === 0 ? (
            <motion.div 
              className="flex flex-col items-center justify-center h-full py-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="mb-4 p-4 rounded-full bg-gray-800/50 border border-gray-700/50"
                animate={{ 
                  y: [0, -8, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              >
                <Receipt className="h-10 w-10 text-yellow-500/50" />
              </motion.div>
              <motion.h4
                className="text-lg font-medium text-gray-300 mb-2"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                No expenses yet
              </motion.h4>
              <motion.p
                className="text-sm text-gray-500 max-w-xs"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Add your first expense to start tracking your spending habits
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-4"
              >
                <Button 
                  onClick={() => setIsAddExpenseOpen(true)}
                  variant="outline" 
                  size="sm"
                  className="border-yellow-500/20 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add first expense
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {filteredExpenses.map((expense, index) => (
                <motion.div
                  key={expense.id}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.01, 
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                    backgroundColor: "rgba(55, 65, 81, 0.4)"
                  }}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 border border-gray-700/50 backdrop-blur-sm hover:border-yellow-500/20 transition-all duration-300 relative overflow-hidden group"
                >
                  {/* Subtle gradient hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="flex items-center z-10">
                    <div className="flex-shrink-0 mr-3">
                      <div className={`h-10 w-10 rounded-full ${categoryColors[expense.category] || "bg-gray-600"} bg-opacity-20 flex items-center justify-center ring-2 ring-offset-2 ring-offset-gray-800 ring-opacity-40 ${categoryColors[expense.category] || "ring-gray-600"}`}>
                        {categoryIcons[expense.category] || 
                          <span className="text-white font-medium text-xs">
                          {expense.category.substring(0, 2).toUpperCase()}
                          </span>
                        }
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-white">{expense.description}</div>
                      <div className="flex items-center text-xs text-gray-400">
                        <Clock className="mr-1 h-3 w-3" />
                        {formatDate(expense.date)}
                        <Badge variant="outline" className="ml-2 py-0 px-1.5 h-4 text-[10px] border-gray-700/50 bg-gray-800/50">
                          {expense.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 z-10">
                    <div className="text-right">
                      <div className="font-bold text-yellow-400">{formatCurrency(expense.amount, currency)}</div>
                    </div>
                    <div className="relative overflow-hidden group">
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="absolute right-0 top-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                          onClick={() => {
                            setEditingExpense(expense);
                            setIsEditExpenseOpen(true);
                          }}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost"
                          className="h-6 w-6 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          onClick={() => handleDeleteExpense(expense.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </motion.div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 text-gray-400 hover:text-gray-300 hover:bg-gray-700/50 group-hover:opacity-0 transition-opacity duration-200"
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-gray-800/90 backdrop-blur-xl border-gray-700/50 shadow-xl shadow-black/20">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingExpense(expense);
                            setIsEditExpenseOpen(true);
                          }}
                            className="text-white hover:bg-gray-700/50 hover:text-blue-300 cursor-pointer focus:bg-blue-500/10 focus:text-blue-300"
                        >
                            <Edit className="h-3.5 w-3.5 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteExpense(expense.id)}
                            className="text-white hover:bg-gray-700/50 hover:text-red-300 cursor-pointer focus:bg-red-500/10 focus:text-red-300"
                        >
                            <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </ScrollArea>
      </div>

      {/* Replace the Add Expense Dialog content */}
      <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Add New Expense</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter the details of your expense below.
            </DialogDescription>
          </DialogHeader>
          
          <AddExpenseForm onSubmit={handleAddExpense} />
          
        </DialogContent>
      </Dialog>

      {/* Replace the Edit Expense Dialog content */}
      <Dialog open={isEditExpenseOpen} onOpenChange={(open) => {
        setIsEditExpenseOpen(open);
        if (!open) setEditingExpense(null);
      }}>
        <DialogContent className="bg-gray-800 text-white border-gray-700 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Edit Expense</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update the details of your expense below.
            </DialogDescription>
          </DialogHeader>
          
          {editingExpense && (
            <AddExpenseForm 
              onSubmit={handleUpdateExpense}
              defaultValues={{
                amount: editingExpense.amount,
                category: editingExpense.category || "Other",
                description: editingExpense.description || "",
                date: editingExpense.date ? new Date(editingExpense.date) : new Date(),
                isRecurring: editingExpense.is_recurring || false,
                recurringFrequency: editingExpense.recurring_frequency,
              }}
              isEdit
            />
          )}
          
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ExpenseTracker;
