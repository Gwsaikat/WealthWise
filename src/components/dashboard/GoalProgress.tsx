import * as React from "react";
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import {
  CalendarClock,
  CheckCircle,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Lightbulb,
  Rocket,
  Laptop,
  Plane,
  Car,
  Plus,
  Target,
  Bell,
  Home as HomeIcon,
  PiggyBank,
  DollarSign,
  Gem,
  ChevronRight,
  AlertCircle,
  X
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useAuth } from "../../context/AuthContext";
import { useUser } from "../../context/UserContext";
import { supabase } from "../../lib/supabase";
import { useState, useEffect, useRef } from "react";
import { format, parseISO, differenceInDays, isBefore, addMonths } from "date-fns";
import { Skeleton } from "../ui/skeleton";
import { formatCurrency, cn } from "../../lib/utils";
import { RadialBarChart, RadialBar, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, Area, AreaChart } from "recharts";

// Import our enhanced components
import { PremiumContainer, PremiumCard } from "../ui/premium-container";
import { StaggerContainer, StaggerItem, GlowingElement, RevealSection } from "../ui/animated-sections";

interface GoalItem {
  id: string;
  user_id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.1
    }
  }
};

const goalItemVariants = {
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

const fadeInVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

// Animated progress percentage
const AnimatedProgressBar = ({ 
  value, 
  color, 
  delay = 0, 
  height = 8
}: { 
  value: number, 
  color: string, 
  delay?: number, 
  height?: number
}) => {
  return (
    <div className={`w-full bg-gray-800/60 rounded-full overflow-hidden`} style={{ height }}>
      <motion.div
        className={`h-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ 
          duration: 1.2, 
          delay, 
          ease: [0.3, 0.1, 0.3, 1]
        }}
      />
    </div>
  );
};

// Animated radar chart for goal progress
const GoalRadarChart = ({ goals }: { goals: GoalItem[] }) => {
  const data = goals.map(goal => {
    const percentage = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
    return {
      name: goal.title,
      progress: percentage,
      fill: getCategoryColor(goal.category)
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="h-[200px] w-full relative"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          cx="50%" 
          cy="50%" 
          innerRadius="20%" 
          outerRadius="90%" 
          barSize={10} 
          data={data}
          startAngle={180}
          endAngle={0}
        >
          <RadialBar
            background={{ fill: 'rgba(255, 255, 255, 0.05)' }}
            dataKey="progress"
            cornerRadius={10}
            label={false}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-gray-800/95 backdrop-blur-sm border border-gray-700/50 p-2 rounded-lg shadow-lg">
                    <p className="text-white text-xs font-medium">{payload[0].payload.name}</p>
                    <p className="text-gray-300 text-xs">
                      Progress: <span className="font-medium">{Number(payload[0].value).toFixed(1)}%</span>
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <motion.p 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-sm text-gray-400"
        >
          Overall
        </motion.p>
        <motion.p 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-2xl font-bold text-white"
        >
          {data.length > 0 ? 
            `${Math.round(data.reduce((sum, item) => sum + item.progress, 0) / data.length)}%` : 
            '0%'
          }
        </motion.p>
      </div>
    </motion.div>
  );
};

// Get icon for goal category
const getGoalIcon = (category: string) => {
  switch (category?.toLowerCase()) {
    case "tech":
      return <Laptop className="h-4 w-4" />;
    case "travel":
      return <Plane className="h-4 w-4" />;
    case "vehicle":
      return <Car className="h-4 w-4" />;
    case "education":
      return <Gem className="h-4 w-4" />;
    case "home":
      return <HomeIcon className="h-4 w-4" />;
    case "savings":
      return <PiggyBank className="h-4 w-4" />;
    default:
      return <Target className="h-4 w-4" />;
  }
};

// Get category color
const getCategoryColor = (category: string) => {
  switch (category?.toLowerCase()) {
    case "tech":
      return "#3b82f6"; // Blue
    case "education":
      return "#8b5cf6"; // Violet
    case "travel":
      return "#10b981"; // Emerald
    case "vehicle":
      return "#f59e0b"; // Amber
    case "home":
      return "#ec4899"; // Pink
    case "savings":
      return "#06b6d4"; // Cyan
    default:
      return "#6366f1"; // Indigo
  }
};

// Get icon background based on category
const getIconBackground = (category: string) => {
  switch (category?.toLowerCase()) {
    case "tech":
      return "bg-blue-500/20 text-blue-400";
    case "education":
      return "bg-violet-500/20 text-violet-400";
    case "travel":
      return "bg-emerald-500/20 text-emerald-400";
    case "vehicle":
      return "bg-amber-500/20 text-amber-400";
    case "home":
      return "bg-pink-500/20 text-pink-400";
    case "savings":
      return "bg-cyan-500/20 text-cyan-400";
    default:
      return "bg-indigo-500/20 text-indigo-400";
  }
};

// Get progress color based on category
const getProgressColor = (category: string) => {
  switch (category?.toLowerCase()) {
    case "tech":
      return "bg-gradient-to-r from-blue-600 to-blue-500";
    case "education":
      return "bg-gradient-to-r from-violet-600 to-violet-500";
    case "travel":
      return "bg-gradient-to-r from-emerald-600 to-emerald-500";
    case "vehicle":
      return "bg-gradient-to-r from-amber-600 to-amber-500";
    case "home":
      return "bg-gradient-to-r from-pink-600 to-pink-500";
    case "savings":
      return "bg-gradient-to-r from-cyan-600 to-cyan-500";
    default:
      return "bg-gradient-to-r from-indigo-600 to-indigo-500";
  }
};

// Get badge styles based on category
const getBadgeStyles = (category: string) => {
  switch (category?.toLowerCase()) {
    case "tech":
      return "border-blue-500/30 bg-blue-500/10 text-blue-400";
    case "education":
      return "border-violet-500/30 bg-violet-500/10 text-violet-400";
    case "travel":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
    case "vehicle":
      return "border-amber-500/30 bg-amber-500/10 text-amber-400";
    case "home":
      return "border-pink-500/30 bg-pink-500/10 text-pink-400";
    case "savings":
      return "border-cyan-500/30 bg-cyan-500/10 text-cyan-400";
    default:
      return "border-indigo-500/30 bg-indigo-500/10 text-indigo-400";
  }
};

// Format deadline date
const formatDeadline = (dateString: string) => {
  try {
    if (!dateString) return "No deadline";
    const date = parseISO(dateString);
    return format(date, "MMM yyyy");
  } catch (error) {
    return dateString;
  }
};

// Calculate days until deadline
const getDaysUntilDeadline = (dateString: string) => {
  try {
    if (!dateString) return null;
    const deadline = parseISO(dateString);
    const today = new Date();
    
    if (isBefore(deadline, today)) return 0;
    
    return differenceInDays(deadline, today);
  } catch (error) {
    return null;
  }
};

// Get urgency status
const getUrgencyStatus = (dateString: string) => {
  const days = getDaysUntilDeadline(dateString);
  if (days === null) return { status: "normal", label: "No deadline" };
  
  if (days <= 0) return { status: "expired", label: "Expired" };
  if (days <= 30) return { status: "urgent", label: `${days} days left` };
  if (days <= 90) return { status: "warning", label: `${Math.ceil(days/30)} months left` };
  return { status: "normal", label: `${Math.ceil(days/30)} months left` };
};

// Define sample goal descriptions for the UI
const goalDescriptions: Record<string, string> = {
  "tech": "Save for the latest tech gadgets or equipment",
  "education": "Fund your education or professional development",
  "travel": "Plan for your dream vacation or travel experience",
  "vehicle": "Save for a new vehicle or vehicle maintenance",
  "home": "Save for home purchase or improvements",
  "savings": "Build your emergency fund or general savings",
  "default": "Track progress towards your financial goal"
};

const GoalProgress = () => {
  const { user } = useAuth();
  const { currency } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [goals, setGoals] = useState<GoalItem[]>([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showCompletionAlert, setShowCompletionAlert] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<GoalItem | null>(null);
  
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  // Fetch user goals
  useEffect(() => {
    const fetchGoals = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Try to get goals from localStorage first
        const cachedGoals = localStorage.getItem('user-goals-data');
        if (cachedGoals) {
          try {
            const parsedGoals = JSON.parse(cachedGoals);
            setGoals(parsedGoals);
            
            // Check for goals that are close to completion
            const nearCompleteGoal = parsedGoals.find(goal => 
              (goal.currentAmount / goal.targetAmount) >= 0.9 && 
              (goal.currentAmount / goal.targetAmount) < 1
            );
            
            if (nearCompleteGoal) {
              setSelectedGoal(nearCompleteGoal);
              setShowCompletionAlert(true);
            }
            
            // Continue fetching fresh data in background
          } catch (e) {
            // Invalid JSON in localStorage
          }
        }
        
        const { data, error } = await supabase
          .from("goals")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        
        // Save to localStorage for persistence
        try {
          localStorage.setItem('user-goals-data', JSON.stringify(data || []));
        } catch (e) {
          // Ignore localStorage errors
        }
        
        setGoals(data || []);
        
        // Check for any goal that is close to completion (>90%)
        const nearCompleteGoal = (data || []).find(goal => 
          (goal.currentAmount / goal.targetAmount) >= 0.9 && 
          (goal.currentAmount / goal.targetAmount) < 1
        );
        
        if (nearCompleteGoal) {
          setSelectedGoal(nearCompleteGoal);
          setShowCompletionAlert(true);
        }
      } catch (err) {
        console.error("Error fetching goals:", err);
        // Don't reset state on error
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGoals();
  }, [user]);

  // Calculate goal projection data
  const getProjectionData = (goal: GoalItem) => {
    if (!goal) return [];
    
    const totalMonths = 6; // Project for next 6 months
    const monthlyContribution = goal.currentAmount / 3; // Assume current contribution is over 3 months
    
    return Array.from({ length: totalMonths }, (_, i) => {
      const projected = Math.min(goal.targetAmount, goal.currentAmount + (monthlyContribution * (i + 1)));
      const date = addMonths(new Date(), i + 1);
      return {
        name: format(date, 'MMM'),
        value: projected,
        targetValue: goal.targetAmount
      };
    });
  };

  return (
    <PremiumContainer
      ref={ref}
      variant="gradient"
      animation="pulse"
      withFloatingParticles={true}
      particleCount={20}
      withBorder={true}
      borderGradient={true}
      className="p-6 h-full"
      initial="hidden"
      animate={controls}
      variants={containerVariants}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <GlowingElement
            className="p-2 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
            glowColor="rgba(99, 102, 241, 0.4)"
            glowSize="15px"
          >
            <Target className="h-5 w-5" />
          </GlowingElement>
          <div>
            <h2 className="text-xl font-bold text-white">Financial Goals</h2>
            <p className="text-gray-400 text-xs">Track progress towards your targets</p>
          </div>
        </div>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs py-1 h-9"
          onClick={() => setShowAddGoal(true)}
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Goal
        </Button>
      </div>

      {/* Goal completion alert */}
      <AnimatePresence>
        {showCompletionAlert && selectedGoal && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, type: "spring", damping: 15 }}
            className="mb-5 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 backdrop-blur-sm rounded-lg p-4 border border-indigo-500/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GlowingElement 
                  className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center"
                  glowColor="rgba(99, 102, 241, 0.5)"
                  pulseAnimation={true}
                >
                  <Sparkles className="h-5 w-5 text-indigo-400" />
                </GlowingElement>
                <div className="flex-1">
                  <h3 className="font-medium text-white">Almost there!</h3>
                  <p className="text-xs text-gray-300 mt-1">
                    You're {Math.round((selectedGoal.currentAmount / selectedGoal.targetAmount) * 100)}% of the way to your "{selectedGoal.title}" goal!
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-gray-400 hover:text-white hover:bg-gray-700/50"
                onClick={() => setShowCompletionAlert(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI suggestion card */}
      <RevealSection 
        direction="up" 
        duration={0.6} 
        className="mb-5"
      >
        <div className="bg-gradient-to-r from-purple-500/10 via-fuchsia-500/10 to-purple-500/10 backdrop-blur-sm rounded-lg p-4 border border-purple-500/20">
        <div className="flex items-center gap-3">
            <GlowingElement 
              className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center"
              glowColor="rgba(168, 85, 247, 0.4)"
            >
              <Lightbulb className="h-5 w-5 text-purple-400" />
            </GlowingElement>
            <div className="flex-1">
              <h3 className="font-medium text-white">Smart Goal Planning</h3>
              <p className="text-sm text-gray-300 mt-1">
                {goals.length > 0 
                  ? `Focusing on your ${goals[0]?.title || 'financial'} goal can yield the best returns. Consider increasing monthly contributions by 5-10%.`
                  : 'Setting SMART financial goals helps you build wealth faster. Start with a short-term goal to build momentum.'}
              </p>
            </div>
            <Button 
              size="sm" 
              className="whitespace-nowrap text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30"
            >
              Get Insights
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </RevealSection>

      {isLoading ? (
        <StaggerContainer delay={0.2} className="space-y-4">
          <StaggerItem className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Skeleton className="h-40 w-full bg-gray-700/50 rounded-xl" />
            <Skeleton className="h-40 w-full bg-gray-700/50 rounded-xl" />
          </StaggerItem>
          <StaggerItem>
            <Skeleton className="h-24 w-full bg-gray-700/50 rounded-xl" />
          </StaggerItem>
          <StaggerItem>
            <Skeleton className="h-24 w-full bg-gray-700/50 rounded-xl" />
          </StaggerItem>
        </StaggerContainer>
      ) : goals.length === 0 ? (
        <motion.div
          variants={fadeInVariants}
          className="flex flex-col items-center justify-center py-12 text-center bg-gray-800/30 rounded-xl border border-gray-700/50"
        >
          <motion.div 
            animate={{
              y: [0, -10, 0],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="mb-4"
          >
            <Rocket className="h-16 w-16 text-gray-600" />
          </motion.div>
          <h3 className="text-xl font-medium text-white mb-2">Set Your Financial Goals</h3>
          <p className="text-gray-400 max-w-sm">
            Define clear financial targets and track your progress toward achieving them.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 max-w-xl">
            {["Savings", "Travel", "Home"].map((category) => (
              <motion.div
                key={category}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className={`p-3 rounded-lg cursor-pointer border ${getBadgeStyles(category)} bg-opacity-20 transition-all duration-300`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`p-2 rounded-full ${getIconBackground(category)}`}>
                    {getGoalIcon(category.toLowerCase())}
          </div>
                  <span className="text-sm font-medium">{category}</span>
                  <span className="text-xs text-gray-400">{goalDescriptions[category.toLowerCase()]}</span>
        </div>
              </motion.div>
          ))}
        </div>
          <Button 
            className="mt-8 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white"
            onClick={() => setShowAddGoal(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Goal
          </Button>
        </motion.div>
      ) : (
        <>
          {/* Goals overview section */}
          <motion.div
            variants={fadeInVariants}
            className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 items-stretch"
          >
            {/* Radial chart for overall progress */}
            <motion.div
              className="md:col-span-2 bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4"
            >
              <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-indigo-400" />
                Goal Progress Overview
              </h3>
              <GoalRadarChart goals={goals} />
            </motion.div>
            
            {/* Project timeline */}
            <motion.div
              className="md:col-span-3 bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4"
            >
              <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-emerald-400" />
                Projected Growth
              </h3>
              
              {goals.length > 0 && (
                <div className="h-[160px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={getProjectionData(goals[0])}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradientLine" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="5%" stopColor="#6366f1" />
                          <stop offset="95%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#9ca3af', fontSize: 12 }} 
                        axisLine={{ stroke: '#4b5563', strokeWidth: 1 }}
                      />
                      <YAxis 
                        tickFormatter={(value) => formatCurrency(value, currency)} 
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                        axisLine={{ stroke: '#4b5563', strokeWidth: 1 }}
                      />
                      <Tooltip 
                        formatter={(value) => [formatCurrency(value as number, currency), "Amount"]}
                        labelFormatter={(label) => `Projection: ${label}`}
                        contentStyle={{ 
                          backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                          border: '1px solid rgba(75, 85, 99, 0.3)',
                          borderRadius: '0.375rem',
                          color: '#e5e7eb'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="url(#gradientLine)" 
                        fill="url(#gradientArea)" 
                        strokeWidth={2} 
                        dot={{ fill: '#6366f1', strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: '#818cf8' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="targetValue" 
                        stroke="#ef4444" 
                        strokeDasharray="4 4" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </motion.div>
          </motion.div>
          
          {/* Goal cards */}
          <div className="space-y-4">
          {goals.map((goal, index) => {
              const progressPercent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
              const urgency = getUrgencyStatus(goal.deadline);
              const isUrgent = urgency.status === "urgent" || urgency.status === "expired";

            return (
              <motion.div
                key={goal.id}
                  variants={goalItemVariants}
                  className={cn(
                    "rounded-xl border overflow-hidden",
                    progressPercent >= 100 
                      ? "bg-gradient-to-r from-emerald-900/30 to-emerald-800/20 border-emerald-700/30" 
                      : "bg-gray-800/40 backdrop-blur-sm border-gray-700/50"
                  )}
                >
                  <div className="p-5">
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${getIconBackground(goal.category)}`}>
                          {getGoalIcon(goal.category)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{goal.title}</h3>
                          <div className="flex items-center gap-2 text-sm">
                            <Badge variant="outline" className={getBadgeStyles(goal.category)}>
                              {goal.category}
                            </Badge>
                            
                            {progressPercent >= 100 ? (
                    <motion.div 
                                animate={{
                                  scale: [1, 1.1, 1],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                }}
                                className="flex items-center gap-1 text-emerald-400 text-xs"
                              >
                                <CheckCircle className="h-3.5 w-3.5" />
                                <span>Completed!</span>
                    </motion.div>
                            ) : (
                      <Badge
                                variant="outline" 
                                className={cn(
                                  "text-xs",
                                  isUrgent 
                                    ? "border-red-500/30 bg-red-500/10 text-red-400" 
                                    : urgency.status === "warning"
                                      ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                                      : "border-blue-500/30 bg-blue-500/10 text-blue-400"
                                )}
                              >
                                {isUrgent && <AlertCircle className="h-3 w-3 mr-1" />}
                                {urgency.label}
                      </Badge>
                            )}
                          </div>
                    </div>
                  </div>
                      
                      <div className="text-right">
                        <div className="text-gray-400 text-xs">Target</div>
                        <div className="text-white font-bold">
                          {formatCurrency(goal.targetAmount, currency)}
                        </div>
                  </div>
                </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span className={cn(
                          "font-medium",
                          progressPercent >= 100 
                            ? "text-emerald-400" 
                            : progressPercent >= 70 
                              ? "text-amber-400" 
                              : "text-white"
                        )}>
                          {formatCurrency(goal.currentAmount, currency)} of {formatCurrency(goal.targetAmount, currency)}
                  </span>
                </div>

                      <div className="relative">
                        <AnimatedProgressBar 
                          value={progressPercent} 
                          color={getProgressColor(goal.category)} 
                          delay={0.2 * index}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + (0.1 * index) }}
                          className="absolute right-0 top-0 -mt-6 font-medium text-sm text-white"
                        >
                          {progressPercent}%
                        </motion.div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm pt-2">
                        <div className="text-gray-400 text-xs">
                          Monthly contribution needed: {formatCurrency((goal.targetAmount - goal.currentAmount) / 6, currency)}
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 text-xs text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
                        >
                          Details
                          <ChevronRight className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        </>
      )}
    </PremiumContainer>
  );
};

export default GoalProgress;
