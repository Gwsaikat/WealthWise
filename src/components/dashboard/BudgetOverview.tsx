import * as React from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import {
  ArrowDown,
  ArrowUp,
  DollarSign,
  Wallet,
  Landmark,
  ShoppingBag,
  Coffee,
  Home,
  Droplet,
  Zap,
  Car,
  PhoneCall,
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  Sparkles,
  MoreHorizontal,
  Share,
  Award
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useUser } from "../../context/UserContext";
import { supabase } from "../../lib/supabase";
import { useEffect, useState, useRef } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { formatCurrency, cn } from "../../lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { format, subDays } from "date-fns";
import { Separator } from "../ui/separator";
import { PremiumContainer, PremiumCard } from "../ui/premium-container";
import { StaggerContainer, StaggerItem, GlowingElement, AnimatedTitle, RevealSection } from "../ui/animated-sections";

interface ExpenseCategory {
  id: number;
  name: string;
  budgeted: number;
  spent: number;
  icon: React.ReactNode;
  color: string;
}

interface BudgetCategory {
  name: string;
  amount: number;
  spent: number;
  color: string;
  icon: React.ReactNode;
}

interface Transaction {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  category: string;
}

interface BudgetOverviewProps {
  className?: string;
  currency?: {
    code: string;
    symbol: string;
    locale: string;
  };
  isLoading?: boolean;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.2
    }
  }
};

const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

// Animated Card Component
const AnimatedCard = ({ 
  children, 
  delay = 0, 
  className 
}: { 
  children: React.ReactNode; 
  delay?: number; 
  className?: string;
}) => {
  return (
    <motion.div
      variants={fadeInVariants}
      transition={{ delay }}
      className={cn("rounded-xl border shadow-sm", className)}
    >
      {children}
    </motion.div>
  );
};

// Animated Statistic Component
const AnimatedStatistic = ({
  value,
  label,
  icon,
  trend,
  trendValue,
  currency,
}: {
  value: number;
  label: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: number;
  currency?: BudgetOverviewProps["currency"];
}) => {
  const spring = useSpring(0, { duration: 2.5 });
  
  React.useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  const formattedValue = React.useMemo(() => {
    return formatCurrency(spring.get(), currency);
  }, [spring, currency]);

  const getTrendColor = () => {
    if (trend === "up") return "text-emerald-400";
    if (trend === "down") return "text-rose-400";
    return "text-gray-400";
  };

  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp className="h-3 w-3 mr-1" />;
    if (trend === "down") return <TrendingDown className="h-3 w-3 mr-1" />;
    return <Activity className="h-3 w-3 mr-1" />;
  };

  return (
    <StaggerItem className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-4 rounded-xl flex items-center">
      <div className="mr-4">
        <GlowingElement
          className="h-12 w-12 rounded-full flex items-center justify-center"
          glowColor="rgba(99, 102, 241, 0.4)"
          glowSize="20px"
        >
          <div className="h-full w-full rounded-full bg-indigo-500/20 flex items-center justify-center">
            {icon}
          </div>
        </GlowingElement>
      </div>
      <div>
        <p className="text-sm text-gray-400 mb-1">{label}</p>
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="font-bold text-xl text-white">
            {formattedValue}
          </div>
        </motion.div>
        {trend && trendValue && (
          <motion.div
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className={`flex items-center text-xs ${getTrendColor()}`}
          >
            {getTrendIcon()}
            <span>{trendValue}% from last month</span>
          </motion.div>
        )}
      </div>
    </StaggerItem>
  );
};

// Circular Progress Component
const CircularProgress = ({
  value,
  size = 120,
  strokeWidth = 8,
  color = "bg-indigo-500",
  label,
  labelPosition = "center",
  animate = true,
  delay = 0,
  className,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: React.ReactNode;
  labelPosition?: "center" | "bottom";
  animate?: boolean;
  delay?: number;
  className?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth={strokeWidth}
        />
        {/* Animated progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`var(--${color.replace('bg-', '')})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ 
            strokeDashoffset: animate ? offset : circumference
          }}
          transition={{ 
            duration: 1.5, 
            delay, 
            ease: [0.34, 1.56, 0.64, 1]
          }}
        />
      </svg>

      {/* Center label */}
      {label && labelPosition === "center" && (
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          {label}
        </div>
      )}

      {/* Bottom label */}
      {label && labelPosition === "bottom" && (
        <div className="mt-3">{label}</div>
      )}
    </div>
  );
};

// Floating particles for premium effect
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-indigo-500 rounded-full opacity-0"
          animate={{
            x: [
              Math.random() * 100 - 50, 
              Math.random() * 100 - 50, 
              Math.random() * 100 - 50
            ],
            y: [
              Math.random() * 100 - 50, 
              Math.random() * 100 - 50, 
              Math.random() * 100 - 50
            ],
            scale: [0, Math.random() * 0.5 + 0.2, 0],
            opacity: [0, Math.random() * 0.3, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 20,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 10,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 4 + 1}px`,
            height: `${Math.random() * 4 + 1}px`,
          }}
        />
      ))}
    </div>
  );
};

// Spending by category animated progress bar
const CategoryProgress = ({ 
  category, 
  index 
}: { 
  category: BudgetCategory;
  index: number;
}) => {
  const percentage = Math.min(100, (category.spent / category.amount) * 100);
  
      return (
    <motion.div 
      variants={fadeInVariants}
      className="mb-3 last:mb-0"
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          <div className={`p-1.5 mr-2 rounded-md ${category.color}`}>
            {category.icon}
          </div>
          <span className="text-sm text-gray-300">{category.name}</span>
        </div>
        <span className="text-sm font-medium text-white">
          {formatCurrency(category.spent, { code: "INR", symbol: '₹', locale: "en-IN" })} / {formatCurrency(category.amount, { code: "INR", symbol: '₹', locale: "en-IN" })}
        </span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${category.color.replace('bg-', 'bg-gradient-to-r from-').replace('/20', '/80')} to-${category.color.replace('bg-', '').replace('/20', '/40')}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: 1, 
            delay: 0.3 + (index * 0.1), 
            ease: [0.34, 1.56, 0.64, 1] 
          }}
        />
      </div>
    </motion.div>
  );
};

// Budget Performance Score Badge
const BudgetScoreBadge = ({ score }: { score: number }) => {
  const getScoreColor = () => {
    if (score >= 80) return "from-emerald-500 to-green-500";
    if (score >= 60) return "from-blue-500 to-indigo-500";
    if (score >= 40) return "from-amber-400 to-orange-500";
    return "from-rose-400 to-red-500";
  };

  const getScoreLabel = () => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Work";
  };

    return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex items-center gap-2"
    >
      <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getScoreColor()} text-white text-xs font-bold`}>
        {score}
      </div>
      <span className="text-sm text-gray-300">{getScoreLabel()}</span>
    </motion.div>
  );
};

// Saving Goal Visualization
const SavingGoalVisual = ({ 
  goal, 
  current, 
  currency 
}: { 
  goal: number; 
  current: number;
  currency?: BudgetOverviewProps["currency"];
}) => {
  const percentage = Math.min(100, (current / goal) * 100);
  
        return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="text-xs text-gray-400 mb-1">Saved</div>
          <div className="text-lg font-bold text-white">
            {formatCurrency(current, currency)}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            of {formatCurrency(goal, currency)}
          </div>
        </motion.div>
      </div>
      <CircularProgress
        value={percentage}
        size={160}
        strokeWidth={12}
        color="bg-indigo-500"
        animate={true}
        delay={0.3}
        className="mx-auto"
      />
          </div>
        );
  };

// Badge award animation
const AwardBadge = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
      transition={{ 
        duration: 0.5, 
        delay: 1,
        scale: { type: "spring", stiffness: 200, damping: 10 },
        y: { repeat: Infinity, repeatType: "mirror", duration: 2 }
      }}
      className="absolute -top-3 -right-3 h-12 w-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center z-10 border-2 border-white shadow-lg"
    >
      <Award className="h-6 w-6 text-white" />
    </motion.div>
  );
};

const BudgetOverview = ({ className, currency, isLoading = false }: BudgetOverviewProps) => {
  const { user } = useAuth();
  const userCurrency = useUser().currency || currency;
  const containerRef = useRef<HTMLDivElement>(null);
  const [budgetScore, setBudgetScore] = useState(78);
  const [savingGoal, setSavingGoal] = useState(25000);
  const [currentSavings, setCurrentSavings] = useState(17500);
  const [totalBudget, setTotalBudget] = useState(45000);
  const [totalSpent, setTotalSpent] = useState(32450);
  const [monthlyIncome, setMonthlyIncome] = useState(62000);
  const [trendPercentage, setTrendPercentage] = useState(14.5);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [achievedBadge, setAchievedBadge] = useState(true);

  // Fetch budget data
  useEffect(() => {
    if (isLoading) return;
    
    // For demo, populating with sample data
    const sampleCategories: BudgetCategory[] = [
      { 
        name: "Housing", 
        amount: 15000, 
        spent: 14500, 
        color: "bg-indigo-500/20", 
        icon: <Home className="h-3.5 w-3.5 text-indigo-400" /> 
      },
      { 
        name: "Food", 
        amount: 8000, 
        spent: 6200, 
        color: "bg-amber-500/20", 
        icon: <Coffee className="h-3.5 w-3.5 text-amber-400" /> 
      },
      { 
        name: "Transportation", 
        amount: 5000, 
        spent: 4800, 
        color: "bg-cyan-500/20",
        icon: <Car className="h-3.5 w-3.5 text-cyan-400" /> 
      },
      { 
        name: "Utilities", 
        amount: 4000, 
        spent: 3850, 
        color: "bg-emerald-500/20", 
        icon: <Zap className="h-3.5 w-3.5 text-emerald-400" /> 
      },
      { 
        name: "Shopping", 
        amount: 6000, 
        spent: 3100, 
        color: "bg-pink-500/20", 
        icon: <ShoppingBag className="h-3.5 w-3.5 text-pink-400" /> 
      },
    ];
    
    setCategories(sampleCategories);
  }, [isLoading, user]);

  return (
    <PremiumContainer
      variant="gradient"
      animation="shimmer"
      withFloatingParticles={true}
      particleCount={20}
      className="h-full p-6"
      ref={containerRef}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <GlowingElement
            className="p-2 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
            glowColor="rgba(99, 102, 241, 0.4)"
            glowSize="15px"
          >
            <Wallet className="h-5 w-5" />
          </GlowingElement>
          <div>
            <h2 className="text-xl font-bold text-white">Budget Overview</h2>
            <p className="text-gray-400 text-xs">Track your monthly spending</p>
          </div>
        </div>
        <Badge 
          variant="outline" 
          className="px-3 py-1 border-indigo-500/30 bg-indigo-500/10 text-indigo-400"
        >
          <Clock className="h-3 w-3 mr-1" />
          <span className="text-xs">{format(new Date(), "MMM yyyy")}</span>
        </Badge>
      </div>

      {isLoading ? (
        <StaggerContainer delay={0.2} staggerDelay={0.1} className="space-y-4">
          <StaggerItem>
            <Skeleton className="h-20 w-full bg-gray-700/50 rounded-xl" />
          </StaggerItem>
          <StaggerItem className="grid grid-cols-2 gap-4">
            <Skeleton className="h-[180px] w-full bg-gray-700/50 rounded-xl" />
            <Skeleton className="h-[180px] w-full bg-gray-700/50 rounded-xl" />
          </StaggerItem>
          <StaggerItem>
            <Skeleton className="h-[140px] w-full bg-gray-700/50 rounded-xl" />
          </StaggerItem>
        </StaggerContainer>
      ) : (
        <StaggerContainer delay={0.1} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatedStatistic
              value={monthlyIncome}
              label="Monthly Income"
              icon={<Landmark className="h-5 w-5 text-indigo-400" />}
              trend="up"
              trendValue={3.2}
              currency={userCurrency}
            />
            
            <AnimatedStatistic
              value={totalBudget - totalSpent}
              label="Remaining Budget"
              icon={<DollarSign className="h-5 w-5 text-emerald-400" />}
              trend={totalSpent < totalBudget * 0.9 ? "up" : "down"}
              trendValue={trendPercentage}
              currency={userCurrency}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Savings goal visualization */}
            <RevealSection direction="left" className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-5 rounded-xl">
              {achievedBadge && <AwardBadge />}
              <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-amber-400" />
                Monthly Savings Goal
              </h3>
              
              <SavingGoalVisual 
                goal={savingGoal} 
                current={currentSavings} 
                currency={userCurrency} 
              />
              
              <div className="flex justify-center mt-3">
            <motion.div
                  initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-xs text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full"
                >
                  {Math.round((currentSavings / savingGoal) * 100)}% of target reached
                </motion.div>
              </div>
            </RevealSection>
            
            {/* Budget performance card */}
            <RevealSection direction="right" className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-5 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-300 flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-indigo-400" />
                  Budget Performance
                  </h3>
                <BudgetScoreBadge score={budgetScore} />
              </div>
              
              <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
                {categories.map((category, i) => (
                  <CategoryProgress key={i} category={category} index={i} />
                ))}
            </motion.div>
            </RevealSection>
          </div>

          {/* Tips for better budgeting */}
          <RevealSection 
            direction="up" 
            className="bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-indigo-500/10 backdrop-blur-sm rounded-lg p-4 border border-indigo-500/20"
                    >
                      <div className="flex items-center">
              <GlowingElement 
                className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3"
                glowColor="rgba(99, 102, 241, 0.4)"
              >
                <Sparkles className="h-5 w-5 text-indigo-400" />
              </GlowingElement>
              <div className="flex-1">
                <h3 className="font-medium text-white">Budget Optimization</h3>
                <p className="text-sm text-gray-300 mt-1">
                  You're saving 28% of your income! Great job maintaining a healthy budget.
                </p>
              </div>
              <Button 
                size="sm" 
                className="whitespace-nowrap text-xs bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 border border-indigo-500/30"
              >
                View Details
              </Button>
          </div>
          </RevealSection>
        </StaggerContainer>
      )}
    </PremiumContainer>
  );
};

export default BudgetOverview;
