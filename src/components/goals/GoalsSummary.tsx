import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle,
  TrendingUp,
  Target,
  Award,
  Calendar,
  ArrowRight,
  Edit,
  Trash2,
  AlertCircle,
  Plus,
  PiggyBank,
  Home,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";
import { useAuth } from "../../context/AuthContext";
import { getGoals, addGoal, updateGoal, deleteGoal } from "../../lib/database";
import type { Goal } from "../../types/supabase";
import { format, parseISO, isValid } from "date-fns";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { useUser } from "../../context/UserContext";
import { Skeleton } from "../ui/skeleton";
import { supabase } from "../../lib/supabase";
import { formatCurrency } from "../../lib/utils";

// Define goal categories
const GOAL_CATEGORIES = [
  "Savings",
  "Travel",
  "Education",
  "Home",
  "Vehicle",
  "Investment",
  "Technology",
  "Health",
  "Emergency",
  "Other"
];

const GoalsSummary = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
    category: "Savings",
  });
  const { currency } = useUser();

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      setGoals(data || []);
    } catch (error) {
      console.error("Error fetching goals:", error);
      toast({
        title: "Error",
        description: "Failed to load financial goals",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewGoal({ ...newGoal, [name]: value });
  };

  const handleCategoryChange = (value: string) => {
    setNewGoal({ ...newGoal, category: value });
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to add goals",
        variant: "destructive",
      });
      return;
    }
    
    // Validate inputs
    if (!newGoal.title || !newGoal.targetAmount || !newGoal.deadline) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      const targetAmount = parseFloat(newGoal.targetAmount);
      const currentAmount = newGoal.currentAmount ? parseFloat(newGoal.currentAmount) : 0;
      
      // Format deadline to ISO string
      const deadlineDate = parseISO(newGoal.deadline);
      if (!isValid(deadlineDate)) {
        throw new Error("Invalid date format");
      }
      
      const createdGoal = await addGoal(user.id, {
        title: newGoal.title,
        targetAmount,
        currentAmount,
        deadline: newGoal.deadline,
        category: newGoal.category,
      });
      
      if (createdGoal) {
        setGoals([createdGoal, ...goals]);
        toast({
          title: "Success",
          description: "Goal added successfully",
        });
        
        // Reset form
        setNewGoal({
          title: "",
          targetAmount: "",
          currentAmount: "",
          deadline: "",
          category: "Savings",
        });
        
        setShowAddGoal(false);
      }
    } catch (error) {
      console.error("Error adding goal:", error);
      toast({
        title: "Error",
        description: "Failed to add goal",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDeleteGoal = async (id: string) => {
    if (!user?.id) return;
    
    try {
      const success = await deleteGoal(id);
      
      if (success) {
        setGoals(goals.filter(goal => goal.id !== id));
        toast({
          title: "Success",
          description: "Goal deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting goal:", error);
      toast({
        title: "Error",
        description: "Failed to delete goal",
        variant: "destructive",
      });
    }
  };

  // Format date for display
  const formatDeadline = (dateString: string) => {
    try {
      if (!dateString) return "No deadline";
      const date = parseISO(dateString);
      return isValid(date) ? format(date, "MMM d, yyyy") : dateString;
    } catch (error) {
      return dateString;
    }
  };
  
  // Calculate progress percentage
  const calculateProgress = (current: number, target: number) => {
    const progress = Math.round((current / target) * 100);
    return isNaN(progress) ? 0 : Math.min(progress, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 h-full"
    >
      <div className="flex flex-row items-center justify-between pb-2">
        <div>
          <h2 className="text-xl font-semibold flex items-center">
            <Target className="h-5 w-5 mr-2 text-indigo-400" />
            Financial Goals
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Track progress towards your targets
          </p>
        </div>
        <Button
          onClick={() => setShowAddGoal(true)}
          variant="outline"
          size="sm"
          className="flex items-center gap-1 border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:text-indigo-300 hover:border-indigo-500/50"
        >
          <Plus className="h-4 w-4" />
          <span>Add Goal</span>
        </Button>
      </div>

      <AnimatePresence>
        {showAddGoal && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 mt-4">
              <h3 className="text-md font-medium mb-3 flex items-center">
                <PlusCircle className="h-4 w-4 mr-2 text-indigo-400" />
                New Financial Goal
              </h3>
              <form onSubmit={handleAddGoal}>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Goal Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={newGoal.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Emergency Fund"
                      className="bg-gray-800/50 border-gray-700"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={newGoal.category} onValueChange={handleCategoryChange}>
                      <SelectTrigger className="bg-gray-800/50 border-gray-700">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {GOAL_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetAmount">Target Amount</Label>
                    <Input
                      id="targetAmount"
                      name="targetAmount"
                      value={newGoal.targetAmount}
                      onChange={handleInputChange}
                      placeholder="10000"
                      type="number"
                      min="0"
                      step="0.01"
                      className="bg-gray-800/50 border-gray-700"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentAmount">Current Amount (Optional)</Label>
                    <Input
                      id="currentAmount"
                      name="currentAmount"
                      value={newGoal.currentAmount}
                      onChange={handleInputChange}
                      placeholder="0"
                      type="number"
                      min="0"
                      step="0.01"
                      className="bg-gray-800/50 border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Target Date</Label>
                    <Input
                      id="deadline"
                      name="deadline"
                      value={newGoal.deadline}
                      onChange={handleInputChange}
                      type="date"
                      className="bg-gray-800/50 border-gray-700"
                      required
                    />
                  </div>
                  <div className="flex items-end space-x-2">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                    >
                      {submitting ? (
                        <>
                          <span className="mr-2">Saving</span>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <TrendingUp className="h-4 w-4" />
                          </motion.div>
                        </>
                      ) : (
                        "Add Goal"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddGoal(false)}
                      className="border-gray-700 hover:bg-gray-800 hover:text-white"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-700/50 rounded-xl p-5 bg-gray-800/30">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Skeleton className="h-5 w-40 bg-gray-700/50 mb-2" />
                  <Skeleton className="h-4 w-20 bg-gray-700/50" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full bg-gray-700/50" />
              </div>
              <Skeleton className="h-3 w-full bg-gray-700/50 mb-2" />
              <Skeleton className="h-6 w-16 bg-gray-700/50 mt-4" />
            </div>
          ))}
        </div>
      ) : goals.length > 0 ? (
        <div className="space-y-4 mt-4">
          {goals.map((goal) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-700/50 rounded-xl p-5 bg-gray-800/30 backdrop-blur-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium text-white">{goal.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {goal.category} • Due {formatDeadline(goal.deadline)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-red-400"
                    onClick={() => handleDeleteGoal(goal.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center text-sm mb-1.5">
                  <span className="text-gray-400">Progress</span>
                  <span className="font-medium">
                    {calculateProgress(goal.currentAmount, goal.targetAmount)}%
                  </span>
                </div>
                <Progress
                  value={calculateProgress(goal.currentAmount, goal.targetAmount)}
                  className="h-2 bg-gray-700/50"
                />
                <div className="flex justify-between mt-3">
                  <span className="text-xs text-gray-400">
                    {formatCurrency(goal.currentAmount, { code: currency.code, symbol: currency.symbol, locale: currency.locale })}
                  </span>
                  <span className="text-xs font-medium">
                    {formatCurrency(goal.targetAmount, { code: currency.code, symbol: currency.symbol, locale: currency.locale })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center text-center py-12"
        >
          <div className="mb-6">
            <motion.div
              className="inline-block"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Target className="h-16 w-16 text-indigo-400 mb-4 opacity-50" />
            </motion.div>
          </div>
          <h3 className="text-xl font-medium text-white mb-2">Set Your Financial Goals</h3>
          <p className="text-gray-400 mb-8 max-w-md">
            Define clear financial targets and track your progress toward achieving them.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
            <div className="border border-blue-500/20 bg-blue-500/10 rounded-xl p-4 text-center">
              <div className="p-2 rounded-full bg-blue-500/20 inline-flex mb-3">
                <PiggyBank className="h-5 w-5 text-blue-400" />
              </div>
              <h4 className="text-white font-medium mb-1">Savings</h4>
              <p className="text-sm text-gray-400">Build your emergency fund or general savings</p>
            </div>
            
            <div className="border border-green-500/20 bg-green-500/10 rounded-xl p-4 text-center">
              <div className="p-2 rounded-full bg-green-500/20 inline-flex mb-3">
                <ArrowRight className="h-5 w-5 text-green-400" />
              </div>
              <h4 className="text-white font-medium mb-1">Travel</h4>
              <p className="text-sm text-gray-400">Plan for your dream vacation or travel experience</p>
            </div>
            
            <div className="border border-purple-500/20 bg-purple-500/10 rounded-xl p-4 text-center">
              <div className="p-2 rounded-full bg-purple-500/20 inline-flex mb-3">
                <Home className="h-5 w-5 text-purple-400" />
              </div>
              <h4 className="text-white font-medium mb-1">Home</h4>
              <p className="text-sm text-gray-400">Save for home purchase or improvements</p>
            </div>
          </div>
          
          <Button
            onClick={() => setShowAddGoal(true)}
            className="mt-10 bg-indigo-600 hover:bg-indigo-700"
            size="lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Goal
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GoalsSummary;
