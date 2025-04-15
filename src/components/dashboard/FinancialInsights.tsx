import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useUser } from "../../context/UserContext";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { formatCurrency } from "../../lib/utils";
import { Skeleton } from "../ui/skeleton";
import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ChevronRight,
  PiggyBank,
  Zap,
  Award,
  Calendar,
  Clock,
  BarChart4,
  Target
} from "lucide-react";
import { StaggerContainer, StaggerItem, GlowingElement } from "../ui/animated-sections";

interface InsightType {
  id: number;
  title: string;
  description: string;
  type: "tip" | "alert" | "recommendation" | "achievement";
  icon: React.ReactNode;
  priority: number;
  actionText?: string;
  actionLink?: string;
}

interface FinancialInsightsProps {
  isLoading?: boolean;
  className?: string;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
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
      damping: 12
    }
  }
};

const FinancialInsights: React.FC<FinancialInsightsProps> = ({ 
  isLoading = false,
  className = ""
}) => {
  const { user } = useAuth();
  const { currency, profile } = useUser();
  const [loading, setLoading] = useState(isLoading);
  const [insights, setInsights] = useState<InsightType[]>([]);
  
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  useEffect(() => {
    fetchInsights();
  }, [user]);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      // Try to get cached insights from localStorage first
      const cachedInsights = localStorage.getItem('user-financial-insights');
      if (cachedInsights) {
        try {
          const parsedInsights = JSON.parse(cachedInsights);
          setInsights(parsedInsights);
        } catch (e) {
          console.error("Error parsing cached insights", e);
        }
      }

      // If no user is logged in, use demo insights
      if (!user) {
        const demoInsights = generateDemoInsights();
        setInsights(demoInsights);
        localStorage.setItem('user-financial-insights', JSON.stringify(demoInsights));
        setLoading(false);
        return;
      }

      // Fetch real insights from database
      // In a real app, you would fetch insights from a backend
      // Here we're generating insights based on the user profile and data we have
      const generatedInsights = await generatePersonalizedInsights();
      setInsights(generatedInsights);
      
      // Cache insights
      localStorage.setItem('user-financial-insights', JSON.stringify(generatedInsights));
    } catch (error) {
      console.error("Error fetching insights:", error);
      // Fallback to demo insights
      const demoInsights = generateDemoInsights();
      setInsights(demoInsights);
    } finally {
      setLoading(false);
    }
  };

  const generatePersonalizedInsights = async (): Promise<InsightType[]> => {
    try {
      // In a real app, this would fetch data from various user tables
      // and generate personalized insights based on spending patterns,
      // goals progress, etc.
      
      // Get user expenses from the past month
      const { data: recentExpenses, error: expensesError } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user?.id)
        .order("date", { ascending: false })
        .limit(30);
      
      // Get user goals
      const { data: userGoals, error: goalsError } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user?.id);
      
      // Get user budget - using transactions to estimate budget
      const { data: userTransactions, error: transactionsError } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user?.id);
        
      // Estimate monthly budget as sum of all transactions
      const userBudget = userTransactions ? {
        amount: userTransactions.reduce((sum, transaction) => sum + transaction.amount, 0)
      } : null;
      
      const personalizedInsights: InsightType[] = [];
      
      // If user has expenses
      if (recentExpenses && recentExpenses.length > 0) {
        // Calculate total expenses
        const totalExpenses = recentExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        // Group expenses by category
        const expensesByCategory = recentExpenses.reduce((acc, expense) => {
          if (!acc[expense.category]) {
            acc[expense.category] = 0;
          }
          acc[expense.category] += expense.amount;
          return acc;
        }, {} as Record<string, number>);
        
        // Find top spending category
        const topCategory = Object.entries(expensesByCategory)
          .sort(([, a], [, b]) => b - a)[0];
          
        if (topCategory) {
          personalizedInsights.push({
            id: 1,
            title: "Top Spending Category",
            description: `Your highest spending is in ${topCategory[0]} at ${formatCurrency(topCategory[1], { code: currency.code, symbol: currency.symbol, locale: currency.locale })}. Consider setting a budget for this category.`,
            type: "recommendation",
            icon: <BarChart4 className="h-5 w-5" />,
            priority: 1,
            actionText: "Set Budget",
            actionLink: "/budgets"
          });
        }
        
        // If total expenses > 80% of budget
        if (userBudget && totalExpenses > (userBudget.amount * 0.8)) {
          personalizedInsights.push({
            id: 2,
            title: "Budget Alert",
            description: `You've used ${Math.round((totalExpenses / userBudget.amount) * 100)}% of your monthly budget. Consider reducing non-essential expenses.`,
            type: "alert",
            icon: <AlertCircle className="h-5 w-5" />,
            priority: 0,
            actionText: "View Budget",
            actionLink: "/budgets"
          });
        }
      } else {
        // No expenses found
        personalizedInsights.push({
          id: 3,
          title: "Start Tracking Expenses",
          description: "Track your daily expenses to get personalized insights and recommendations.",
          type: "tip",
          icon: <Zap className="h-5 w-5" />,
          priority: 0,
          actionText: "Add Expense",
          actionLink: "/expenses/add"
        });
      }
      
      // If user has goals
      if (userGoals && userGoals.length > 0) {
        // Find closest goal to completion
        const closestGoal = userGoals
          .filter(goal => goal.currentAmount < goal.targetAmount)
          .sort((a, b) => (a.targetAmount - a.currentAmount) - (b.targetAmount - b.currentAmount))[0];
          
        if (closestGoal) {
          const percentComplete = Math.round((closestGoal.currentAmount / closestGoal.targetAmount) * 100);
          
          personalizedInsights.push({
            id: 4,
            title: "Goal Progress",
            description: `You're ${percentComplete}% of the way to your "${closestGoal.title}" goal. Keep it up!`,
            type: "achievement",
            icon: <Target className="h-5 w-5" />,
            priority: 2,
            actionText: "View Goals",
            actionLink: "/goals"
          });
        }
      } else {
        // No goals found
        personalizedInsights.push({
          id: 5,
          title: "Set Financial Goals",
          description: "Setting clear financial goals can help you stay motivated and focused on your financial journey.",
          type: "tip",
          icon: <Target className="h-5 w-5" />,
          priority: 1,
          actionText: "Set Goals",
          actionLink: "/goals"
        });
      }
      
      // Add some general tips based on user profile
      personalizedInsights.push({
        id: 6,
        title: "Emergency Fund",
        description: "Aim to save 3-6 months of living expenses in an emergency fund for financial security.",
        type: "tip",
        icon: <PiggyBank className="h-5 w-5" />,
        priority: 3
      });
      
      personalizedInsights.push({
        id: 7,
        title: "50/30/20 Rule",
        description: "Consider following the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment.",
        type: "tip",
        icon: <Lightbulb className="h-5 w-5" />,
        priority: 4
      });
      
      // Sort insights by priority (lower number = higher priority)
      return personalizedInsights.sort((a, b) => a.priority - b.priority);
    } catch (error) {
      console.error("Error generating personalized insights:", error);
      return generateDemoInsights();
    }
  };

  const generateDemoInsights = (): InsightType[] => {
    return [
      {
        id: 1,
        title: "Create a Budget",
        description: "Setting a budget is the first step toward financial control and achievement of your goals.",
        type: "tip",
        icon: <PiggyBank className="h-5 w-5" />,
        priority: 0,
        actionText: "Create Budget",
        actionLink: "/budgets"
      },
      {
        id: 2,
        title: "Track Your Expenses",
        description: "Regularly tracking expenses helps identify spending patterns and areas to save.",
        type: "recommendation",
        icon: <BarChart4 className="h-5 w-5" />,
        priority: 1,
        actionText: "Add Expenses",
        actionLink: "/expenses"
      },
      {
        id: 3,
        title: "Emergency Fund",
        description: "Aim to save 3-6 months of living expenses in an emergency fund for financial security.",
        type: "tip",
        icon: <Lightbulb className="h-5 w-5" />,
        priority: 2
      },
      {
        id: 4,
        title: "Set Financial Goals",
        description: "Setting clear financial goals can help you stay motivated and focused on your financial journey.",
        type: "tip",
        icon: <Target className="h-5 w-5" />,
        priority: 3,
        actionText: "Set Goals",
        actionLink: "/goals"
      },
      {
        id: 5,
        title: "50/30/20 Rule",
        description: "Consider following the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment.",
        type: "recommendation",
        icon: <Zap className="h-5 w-5" />,
        priority: 4
      }
    ];
  };

  // Render different styles based on insight type
  const renderInsight = (insight: InsightType, index: number) => {
    const getTypeStyles = () => {
      switch (insight.type) {
        case 'tip':
          return "bg-blue-500/10 border-blue-500/20 text-blue-400";
        case 'alert':
          return "bg-amber-500/10 border-amber-500/20 text-amber-400";
        case 'recommendation':
          return "bg-indigo-500/10 border-indigo-500/20 text-indigo-400";
        case 'achievement':
          return "bg-green-500/10 border-green-500/20 text-green-400";
        default:
          return "bg-gray-800/50 border-gray-700/50 text-gray-400";
      }
    };

    const getBadgeStyles = () => {
      switch (insight.type) {
        case 'tip':
          return "bg-blue-500/20 text-blue-400";
        case 'alert':
          return "bg-amber-500/20 text-amber-400";
        case 'recommendation':
          return "bg-indigo-500/20 text-indigo-400";
        case 'achievement':
          return "bg-green-500/20 text-green-400";
        default:
          return "bg-gray-800 text-gray-400";
      }
    };

    return (
      <StaggerItem
        key={insight.id}
        className={`relative p-4 rounded-xl border backdrop-blur-sm mb-4 ${getTypeStyles()}`}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-full ${getBadgeStyles()}`}>
            {insight.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-white mb-1">{insight.title}</h3>
            <p className="text-sm text-gray-300 mb-3">{insight.description}</p>
            {insight.actionText && insight.actionLink && (
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs font-medium flex items-center gap-1 text-white/80 hover:text-white"
                asChild
              >
                <a href={insight.actionLink}>
                  {insight.actionText} <ChevronRight className="h-3 w-3" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </StaggerItem>
    );
  };

  if (loading) {
    return (
      <Card className={`border-gray-800 bg-gray-900/50 backdrop-blur-sm ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center gap-2">
            <Zap className="h-5 w-5 text-indigo-400" />
            Financial Insights
          </CardTitle>
          <CardDescription>
            Personalized recommendations for your finances
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-1/3 bg-gray-800" />
                <Skeleton className="h-3 w-full bg-gray-800" />
                <Skeleton className="h-3 w-5/6 bg-gray-800" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-gray-800 bg-gray-900/50 backdrop-blur-sm ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <GlowingElement
            className="h-7 w-7 rounded-full flex items-center justify-center"
            glowColor="rgba(99, 102, 241, 0.4)"
            glowSize="15px"
          >
            <Zap className="h-5 w-5 text-indigo-400" />
          </GlowingElement>
          Financial Insights
        </CardTitle>
        <CardDescription>
          Personalized recommendations for your finances
        </CardDescription>
      </CardHeader>
      <CardContent>
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="space-y-1"
        >
          {insights.map((insight, index) => renderInsight(insight, index))}
          
          {insights.length === 0 && (
            <div className="text-center py-6">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-500" />
              <p className="text-gray-500">No insights available at the moment.</p>
            </div>
          )}
          
          <div className="pt-3 text-center">
            <Button variant="outline" size="sm" className="text-xs">
              View All Insights
            </Button>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default FinancialInsights; 