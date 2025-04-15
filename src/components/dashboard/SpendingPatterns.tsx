import * as React from "react";
import { motion, AnimatePresence, useAnimation, useInView, MotionValue, useTransform, useSpring, useMotionValue } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Check,
  CreditCard,
  Leaf,
  ShoppingBag,
  UtensilsCrossed,
  Wallet,
  BadgeCheck,
  BookOpen,
  Coffee,
  Bus,
  Home,
  WifiIcon,
  HeartPulse,
  Trophy,
  Loader2,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart4,
  Circle,
  DollarSign,
  PieChart as PieChartIcon
} from "lucide-react";
import { Separator } from "../ui/separator";
import { useUser } from "../../context/UserContext";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { useState, useEffect, useRef } from "react";
import { format, subDays } from "date-fns";
import { Skeleton } from "../ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  AreaChart,
  Area,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
  RadialBarChart,
  RadialBar
} from "recharts";
import { formatCurrency, cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
// Import our enhanced components
import { EnhancedTabsList, EnhancedTabsTrigger, EnhancedTabsContent, Tabs as EnhancedTabs } from "../ui/enhanced-tabs";
import { PremiumContainer, PremiumCard } from "../ui/premium-container";
import { StaggerContainer, StaggerItem, GlowingElement } from "../ui/animated-sections";

// Helper components
const SmallSparklineChart = ({ data, color, gridColor }: { data: number[], color: string, gridColor: string }) => {
  // Handle empty or all-zero data arrays
  const hasData = data.length > 0 && data.some(val => val > 0);
  
  // If no data, show a flat line at zero
  const chartData = hasData 
    ? data.map((val, i) => ({ value: val, index: i }))
    : [0, 0, 0, 0, 0].map((val, i) => ({ value: val, index: i }));
  
  return (
    <div className="h-[40px] w-full">
      {hasData ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id={`sparkline-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.6} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.2} />
            <Line 
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              animationDuration={1500}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="none"
              fill={`url(#sparkline-${color})`}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        // Empty state - flat line
        <div className="flex items-center justify-center h-full">
          <div className="w-full h-[1px] bg-gray-700/50"></div>
        </div>
      )}
    </div>
  );
};

// AnimatedProgressBar component
const AnimatedProgressBar = ({ 
  value, 
  maxValue,
  color, 
  label, 
  delay = 0
}: { 
  value: number, 
  maxValue: number, 
  color: string, 
  label: string,
  delay?: number 
}) => {
  const percentage = Math.min(100, (value / maxValue) * 100);
  
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <div className="text-xs text-gray-400">{label}</div>
        <div className="text-xs text-gray-400">{formatCurrency(value, { code: 'USD', symbol: '$', locale: 'en-US' })}</div>
      </div>
      <div className="h-2 bg-gray-800/60 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: 1, 
            delay, 
            ease: "easeOut"
          }}
        />
      </div>
    </div>
  );
};

// AnimatedCounter component
const AnimatedCounter = ({ 
  value, 
  formatter 
}: { 
  value: number, 
  formatter: (val: number) => string
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let startValue = 0;
    const increment = value / 30;
    const timer = setInterval(() => {
      startValue += increment;
      if (startValue >= value) {
        startValue = value;
        clearInterval(timer);
      }
      setDisplayValue(startValue);
    }, 33);
    
    return () => {
      clearInterval(timer);
    };
  }, [value]);
  
  return <span>{formatter(displayValue)}</span>;
};

interface SpendingPatternsProps {
  // Props can be added here if needed
  isLoading?: boolean;
}

interface DailySpending {
  name: string;
  amount: number;
}

interface CategorySpending {
  name: string;
  value: number;
  color: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Food & Drink": "#10b981", // Emerald
  "Shopping": "#3b82f6",     // Blue
  "Transport": "#f59e0b",    // Amber
  "Housing": "#8b5cf6",      // Violet
  "Internet": "#6366f1",     // Indigo
  "Entertainment": "#ec4899", // Pink
  "Other": "#f43f5e"         // Rose
};

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
      damping: 10
    }
  }
};

const SpendingPatterns = ({ isLoading: externalLoading = false }: SpendingPatternsProps) => {
  const [selectedTab, setSelectedTab] = React.useState("daily");
  const { user } = useAuth();
  const { currency } = useUser();
  const [isLoading, setIsLoading] = useState(externalLoading);
  const [dailyData, setDailyData] = useState<DailySpending[]>([]);
  const [categoryData, setCategoryData] = useState<CategorySpending[]>([]);
  const [maxDailyAmount, setMaxDailyAmount] = useState(100);
  const [totalSpent, setTotalSpent] = useState(0);
  const [spendingTrend, setSpendingTrend] = useState(5.3); // percentage change
  const [isTrendPositive, setIsTrendPositive] = useState(false);
  const [comparisonData, setComparisonData] = useState<any[]>([]);
  
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  // Sample sparkline data
  const weeklySparkline = [180, 220, 205, 240, 210, 260, 245, 275, 260];
  const monthlySparkline = [210, 230, 245, 230, 250, 260, 270, 255, 290, 320, 310, 340];
  
  // Reference spending goals data for comparison
  const spendingTargets = {
    "Food & Drink": 1200,
    "Shopping": 800,
    "Transport": 600,
    "Housing": 2500,
    "Internet": 300,
    "Entertainment": 400,
    "Other": 500
  };

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  // Fetch user spending data
  useEffect(() => {
    const fetchSpendingData = async () => {
      try {
        setIsLoading(true);
        
        if (!user) {
          // Try to get cached data from localStorage even without user
          const cachedSpendingData = localStorage.getItem('user-spending-data');
          if (cachedSpendingData) {
            try {
              const parsedData = JSON.parse(cachedSpendingData);
              
              // Set state with cached data
              setDailyData(parsedData.dailyData || []);
              setCategoryData(parsedData.categoryData || []);
              setComparisonData(parsedData.comparisonData || []);
              setTotalSpent(parsedData.totalSpent || 0);
              setMaxDailyAmount(parsedData.maxDailyAmount || 100);
              setSpendingTrend(parsedData.spendingTrend || 0);
              setIsTrendPositive(parsedData.isTrendPositive || false);
            } catch (e) {
              // Invalid JSON, ignore
              console.error("Error parsing cached spending data", e);
            }
          }
          
          setIsLoading(false);
          return;
        }
        
        // Try to get data from localStorage first
        const cachedSpendingData = localStorage.getItem('user-spending-data');
        if (cachedSpendingData) {
          try {
            const parsedData = JSON.parse(cachedSpendingData);
            
            // Set state with cached data while fetching new data
            setDailyData(parsedData.dailyData || []);
            setCategoryData(parsedData.categoryData || []);
            setComparisonData(parsedData.comparisonData || []);
            setTotalSpent(parsedData.totalSpent || 0);
            setMaxDailyAmount(parsedData.maxDailyAmount || 100);
            setSpendingTrend(parsedData.spendingTrend || 0);
            setIsTrendPositive(parsedData.isTrendPositive || false);
          } catch (e) {
            // Invalid JSON, ignore
            console.error("Error parsing cached spending data", e);
          }
        }
        
        // Fetch expense data for the past 7 days
        const sevenDaysAgo = subDays(new Date(), 7);
        
        const { data: expenseData, error } = await supabase
          .from("expenses")
          .select("*")
          .eq("user_id", user.id)
          .gte("date", sevenDaysAgo.toISOString())
          .order("date", { ascending: true });
        
        if (error) {
          console.error("Error fetching expense data:", error);
          setIsLoading(false);
          return;
        }
        
        // Initialize with empty data
        const dailyArray = [
          { name: "Mon", amount: 0 },
          { name: "Tue", amount: 0 },
          { name: "Wed", amount: 0 },
          { name: "Thu", amount: 0 },
          { name: "Fri", amount: 0 },
          { name: "Sat", amount: 0 },
          { name: "Sun", amount: 0 },
        ];
        
        let resultData = {
          dailyData: dailyArray,
          categoryData: [],
          comparisonData: [],
          totalSpent: 0,
          maxDailyAmount: 100,
          spendingTrend: 0,
          isTrendPositive: true
        };
        
        if (expenseData && expenseData.length > 0) {
          // Process daily spending
          const dailyMap = new Map<string, number>();
          const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          
          // Initialize all days with zero
          daysOfWeek.forEach(day => dailyMap.set(day, 0));
          
          // Sum expenses by day of week
          expenseData.forEach(expense => {
            const date = new Date(expense.date);
            const dayName = daysOfWeek[date.getDay()];
            const currentAmount = dailyMap.get(dayName) || 0;
            dailyMap.set(dayName, currentAmount + expense.amount);
          });
          
          // Convert to array format needed for chart
          const populatedDailyArray = daysOfWeek.map(day => ({
            name: day,
            amount: dailyMap.get(day) || 0
          }));
          
          // Calculate total spent
          const total = populatedDailyArray.reduce((sum, day) => sum + day.amount, 0);
          
          // Find max daily amount for chart scaling
          const maxAmount = Math.max(...populatedDailyArray.map(d => d.amount));
          
          // Process category spending
          const categoryMap = new Map<string, number>();
          
          // Sum expenses by category
          expenseData.forEach(expense => {
            const category = expense.category || "Other";
            const currentAmount = categoryMap.get(category) || 0;
            categoryMap.set(category, currentAmount + expense.amount);
          });
          
          // Convert to array format needed for chart
          const categoryArray = Array.from(categoryMap.entries()).map(([name, value]) => ({
            name,
            value,
            color: CATEGORY_COLORS[name] || "#f43f5e" // Use default rose for unknown categories
          }));
          
          // Create comparison data against actual spending (no targets)
          const compData = categoryArray.map(cat => ({
            name: cat.name,
            spent: cat.value,
            target: cat.value * 1.2, // Simple 20% higher target as placeholder
            fill: cat.color
          }));
          
          // Determine trend based on actual data comparison
          // Compare first half of week to second half
          const firstHalf = populatedDailyArray.slice(0, 3).reduce((sum, day) => sum + day.amount, 0);
          const secondHalf = populatedDailyArray.slice(3, 6).reduce((sum, day) => sum + day.amount, 0);
          
          const trendValue = firstHalf > 0 
            ? ((secondHalf - firstHalf) / firstHalf) * 100 
            : 0;
          
          // Set the result data object
          resultData = {
            dailyData: populatedDailyArray,
            categoryData: categoryArray,
            comparisonData: compData,
            totalSpent: total,
            maxDailyAmount: maxAmount > 0 ? maxAmount : 100,
            spendingTrend: Math.abs(trendValue),
            isTrendPositive: trendValue < 0
          };
        }
        
        // Update all state variables
        setDailyData(resultData.dailyData);
        setCategoryData(resultData.categoryData);
        setComparisonData(resultData.comparisonData);
        setTotalSpent(resultData.totalSpent);
        setMaxDailyAmount(resultData.maxDailyAmount);
        setSpendingTrend(resultData.spendingTrend);
        setIsTrendPositive(resultData.isTrendPositive);
        
        // Save to localStorage for persistence
        try {
          localStorage.setItem('user-spending-data', JSON.stringify(resultData));
        } catch (e) {
          console.error("Error saving to localStorage", e);
        }
        
      } catch (err) {
        console.error("Error fetching spending data:", err);
        // Don't reset state on error to preserve existing display
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSpendingData();
  }, [user]);

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800/95 border border-gray-700/50 p-3 rounded-lg shadow-xl backdrop-blur-sm">
          <p className="text-gray-300 text-xs font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center text-sm">
              <span
                className="inline-block h-2 w-2 rounded-full mr-2"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-white">{formatCurrency(entry.value, currency)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Category tooltip
  const CategoryTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800/95 border border-gray-700/50 p-3 rounded-lg shadow-xl backdrop-blur-sm">
          <p className="text-gray-300 text-xs font-medium mb-1">{payload[0].name}</p>
          <div className="flex items-center gap-4 text-sm mt-1">
            <div className="flex items-center">
              <span
                className="inline-block h-2 w-2 rounded-full mr-2"
                style={{ backgroundColor: payload[0].fill }}
              />
              <span className="text-gray-400 text-xs">Spent: </span>
              <span className="text-white ml-1 font-medium">{formatCurrency(payload[0].value, currency)}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-400 text-xs">Target: </span>
              <span className="text-white ml-1 font-medium">{formatCurrency(payload[0].payload.target, currency)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <PremiumContainer
      ref={ref}
      variant="gradient"
      animation="pulse"
      withFloatingParticles={true}
      particleCount={15}
      borderGradient={true}
      className="p-6 h-full"
      initial="hidden"
      animate={controls}
      variants={containerVariants}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <GlowingElement
            className="p-2 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center"
            glowColor="rgba(245, 158, 11, 0.4)"
            glowSize="15px"
          >
            <Activity className="h-5 w-5 text-amber-400" />
          </GlowingElement>
          <div>
            <h2 className="text-xl font-bold text-white">Spending Insights</h2>
            <p className="text-gray-400 text-xs">Advanced analytics & patterns</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className="px-2.5 py-1 border-amber-500/30 bg-amber-500/10 text-amber-400"
          >
            <Calendar className="h-3 w-3 mr-1" />
            <span className="text-xs">{format(new Date(), "MMM yyyy")}</span>
          </Badge>
          {!isLoading && (
            <Badge 
              variant="outline" 
              className={cn(
                "px-2.5 py-1",
                isTrendPositive ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" 
                  : "border-rose-500/30 bg-rose-500/10 text-rose-400"
              )}
            >
              {isTrendPositive ? (
                <TrendingDown className="h-3 w-3 mr-1" />
              ) : (
                <TrendingUp className="h-3 w-3 mr-1" />
              )}
              <span className="text-xs">{spendingTrend.toFixed(1)}%</span>
            </Badge>
          )}
        </div>
      </div>

      {isLoading ? (
        <StaggerContainer delay={0.2} staggerDelay={0.1} className="space-y-4">
          <StaggerItem className="grid grid-cols-2 gap-4 mb-4">
            <Skeleton className="h-24 w-full bg-gray-700/50 rounded-xl" />
            <Skeleton className="h-24 w-full bg-gray-700/50 rounded-xl" />
          </StaggerItem>
          <StaggerItem>
            <Skeleton className="h-[240px] w-full bg-gray-700/50 rounded-xl" />
          </StaggerItem>
          <StaggerItem>
            <Skeleton className="h-20 w-full bg-gray-700/50 rounded-xl" />
          </StaggerItem>
        </StaggerContainer>
      ) : (
        <>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <StaggerItem>
              <motion.div
                variants={itemVariants}
                className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-400">Total Week Spending</h3>
          <motion.div 
                    className="p-1.5 rounded-full bg-amber-500/20 text-amber-400"
            animate={{
                      scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
                    <Wallet className="h-3.5 w-3.5" />
          </motion.div>
      </div>

                <div className="flex items-baseline">
                  <h4 className="text-2xl font-bold text-white">
                    <AnimatedCounter 
                      value={totalSpent} 
                      formatter={(val) => formatCurrency(val, { 
                        code: currency?.code || 'USD', 
                        symbol: currency?.symbol || '$', 
                        locale: currency?.locale || 'en-US' 
                      })} 
                    />
                  </h4>
                  <span className={cn(
                    "ml-2 text-xs font-medium flex items-center",
                    isTrendPositive ? "text-emerald-400" : "text-rose-400"
                  )}>
                    {isTrendPositive ? (
                      <TrendingDown className="h-3 w-3 mr-0.5" />
                    ) : (
                      <TrendingUp className="h-3 w-3 mr-0.5" />
                    )}
                    {spendingTrend.toFixed(1)}%
                  </span>
                    </div>
                
                <div className="mt-2">
                  <SmallSparklineChart 
                    data={dailyData.map(day => day.amount)}
                    color="#f59e0b"
                    gridColor="#78350f"
                  />
                </div>
              </motion.div>
            </StaggerItem>
            
            <StaggerItem>
              <motion.div
                variants={itemVariants}
                className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border border-blue-500/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-400">Monthly Trend</h3>
                    <motion.div 
                    className="p-1.5 rounded-full bg-blue-500/20 text-blue-400"
                      animate={{
                      y: [0, -3, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                    <TrendingUp className="h-3.5 w-3.5" />
                    </motion.div>
                    </div>
                
                <div className="flex items-baseline">
                  <h4 className="text-2xl font-bold text-white">
                    <AnimatedCounter 
                      value={totalSpent > 0 ? totalSpent * 4 : 0} 
                      formatter={(val) => formatCurrency(val, { 
                        code: currency?.code || 'USD', 
                        symbol: currency?.symbol || '$', 
                        locale: currency?.locale || 'en-US' 
                      })} 
                    />
                  </h4>
                  <span className="ml-2 text-xs font-medium text-blue-400 flex items-center">
                    {totalSpent > 0 ? "Projected" : "No data"}
                  </span>
                  </div>
                
                <div className="mt-2">
                  <SmallSparklineChart 
                    data={[...dailyData.map(day => day.amount), ...dailyData.map(day => day.amount * 1.05)]}
                    color="#3b82f6"
                    gridColor="#1e3a8a"
                  />
                </div>
              </motion.div>
            </StaggerItem>
          </StaggerContainer>

          <div className="mb-6">
            <EnhancedTabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <EnhancedTabsList variant="premium" fullWidth className="grid grid-cols-2">
                <EnhancedTabsTrigger 
                  value="daily" 
                  activeColor="amber"
                  icon={<BarChart4 className="h-4 w-4" />}
                >
                  Daily Analysis
                </EnhancedTabsTrigger>
                <EnhancedTabsTrigger 
                  value="categories" 
                  activeColor="blue"
                  icon={<PieChartIcon className="h-4 w-4" />}
                >
                  Category Breakdown
                </EnhancedTabsTrigger>
              </EnhancedTabsList>

              <AnimatePresence mode="wait">
                <EnhancedTabsContent 
                  value="daily" 
                  className="space-y-4 mt-0" 
                  transition="fade"
                >
                  <StaggerItem>
                    <PremiumCard
                      variant="subtle"
                      withBorder={true}
                      withShadow={true}
                      title={
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-amber-400" />
                          <span>Daily Spending Analysis</span>
                        </div>
                      }
                    >
                      {dailyData.length === 0 || dailyData.every(d => d.amount === 0) ? (
                        <div className="text-center py-10">
                          <p className="text-gray-400 mb-2">No spending data for the past week</p>
                          <p className="text-sm text-gray-500">Add expenses to see your spending patterns</p>
                        </div>
                      ) : (
                        <div className="h-[240px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dailyData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                              <defs>
                                <linearGradient id="dailyBarGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
                                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.2} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                              <XAxis 
                                dataKey="name" 
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                axisLine={{ stroke: '#4b5563', strokeWidth: 1 }} 
                              />
                              <YAxis 
                                tickFormatter={(value) => {
                                  // Format as currency without symbol
                                  const formatted = formatCurrency(value, { 
                                    code: currency?.code || 'USD', 
                                    symbol: currency?.symbol || '$', 
                                    locale: currency?.locale || 'en-US' 
                                  });
                                  // Remove currency symbol for axis ticks
                                  return formatted.replace(/[^\d.,]/g, '');
                                }}
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                axisLine={{ stroke: '#4b5563', strokeWidth: 1 }}
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <Bar 
                                dataKey="amount" 
                                fill="url(#dailyBarGradient)" 
                                radius={[4, 4, 0, 0]}
                                maxBarSize={60}
                                animationDuration={1500}
                              >
                                {dailyData.map((entry, index) => (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.amount === maxDailyAmount ? "#f59e0b" : "url(#dailyBarGradient)"}  
                                  />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                </div>
              )}
                    </PremiumCard>
                  </StaggerItem>
                  
                  <StaggerItem>
                    <PremiumCard
                      variant="subtle"
                      withBorder={true}
                      withShadow={true}
                      title={
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 mr-2 text-emerald-400" />
                          <span>Spending Insights</span>
                        </div>
                      }
                      footer={
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 px-3 text-xs border-gray-700 bg-gray-800/30 hover:bg-gray-700/50"
                        >
                          View Report
                          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </Button>
                      }
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-800/60 to-gray-800/20 rounded-lg border border-gray-700/30">
                          <div className={cn(
                            "p-2 rounded-full flex items-center justify-center",
                            isTrendPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                          )}>
                            {isTrendPositive ? (
                              <TrendingDown className="h-4 w-4" />
                            ) : (
                              <TrendingUp className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className="text-gray-300 text-sm">
                              {isTrendPositive 
                                ? "You're spending less than last week" 
                                : "Your spending has increased this week"}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {isTrendPositive 
                                ? "Great job maintaining your budget!" 
                                : "Consider reviewing your daily expenses"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-800/60 to-gray-800/20 rounded-lg border border-gray-700/30">
                          <div className="p-2 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center">
                            <Calendar className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-gray-300 text-sm">
                              {dailyData.findIndex(d => d.amount === maxDailyAmount) >= 0 
                                ? `Highest spending on ${dailyData.find(d => d.amount === maxDailyAmount)?.name}` 
                                : "Spending is evenly distributed"}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {dailyData.findIndex(d => d.amount === maxDailyAmount) >= 0 
                                ? "Consider planning your expenses better" 
                                : "Great job spacing out your spending"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </PremiumCard>
                  </StaggerItem>
                </EnhancedTabsContent>
                
                <EnhancedTabsContent 
                  value="categories" 
                  className="space-y-4 mt-0"
                  transition="fade" 
                >
                  <StaggerItem>
                    <PremiumCard
                      variant="subtle"
                      withBorder={true}
                      withShadow={true}
                      title={
                        <div className="flex items-center">
                          <PieChartIcon className="h-4 w-4 mr-2 text-blue-400" />
                          <span>Spending by Category</span>
            </div>
                      }
                    >
                {categoryData.length === 0 ? (
                        <div className="text-center py-10">
                    <p className="text-gray-400 mb-2">No category data available</p>
                          <p className="text-sm text-gray-500">Add categorized expenses to see the breakdown</p>
                  </div>
                ) : (
                        <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                              <defs>
                                {categoryData.map((entry, index) => (
                                  <linearGradient key={`gradient-${index}`} id={`colorGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={entry.color} stopOpacity={0.8} />
                                    <stop offset="100%" stopColor={entry.color} stopOpacity={0.2} />
                                  </linearGradient>
                                ))}
                              </defs>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={3}
                                dataKey="value"
                                animationDuration={1000}
                                animationBegin={200}
                                stroke="#111827"
                                strokeWidth={2}
                                label={({
                                  cx,
                                  cy,
                                  midAngle,
                                  innerRadius,
                                  outerRadius,
                                  percent
                                }) => {
                                  const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
                                  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                                  return (
                                    <text
                                      x={x}
                                      y={y}
                                      textAnchor={x > cx ? "start" : "end"}
                                      dominantBaseline="central"
                                      fill="#9ca3af"
                                      fontSize={12}
                                    >
                                      {`${(percent * 100).toFixed(1)}%`}
                                    </text>
                                  );
                                }}
                        >
                          {categoryData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={`url(#colorGradient-${index})`}
                                  />
                          ))}
                        </Pie>
                              <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
                    </PremiumCard>
                  </StaggerItem>
                  
                  <StaggerItem>
                    <PremiumCard
                      variant="subtle"
                      withBorder={true}
                      withShadow={true}
                      title={
                        <div className="flex items-center">
                          <BarChart4 className="h-4 w-4 mr-2 text-blue-400" />
                          <span>Budget vs Actual</span>
              </div>
                      }
                      footer={
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 px-3 text-xs border-gray-700 bg-gray-800/30 hover:bg-gray-700/50"
                        >
                          Adjust Budget
                          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </Button>
                      }
                    >
                      {comparisonData.length > 0 ? (
                        <div className="space-y-3 max-h-[240px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800/30">
                          <StaggerContainer staggerDelay={0.05} className="space-y-3">
                            {comparisonData.map((category, idx) => (
                              <StaggerItem key={idx}>
                                <motion.div 
                                  variants={itemVariants}
                                  className="bg-gray-800/30 rounded-lg border border-gray-700/30 p-3"
                                >
                                  <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center">
                                      <span
                                        className="h-3 w-3 rounded-full mr-2"
                                        style={{ backgroundColor: category.fill }}
                                      ></span>
                                      <span className="text-gray-300 text-sm">{category.name}</span>
                                    </div>
                                    <span className="text-white text-sm font-medium">
                                      {formatCurrency(category.spent, currency)}
                                    </span>
                                  </div>
                                  <div className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                                    <motion.div
                                      className="h-full rounded-full"
                                      style={{ backgroundColor: category.fill }}
                                      initial={{ width: 0 }}
                                      animate={{ width: `${Math.min(100, (category.spent / category.target) * 100)}%` }}
                                      transition={{ duration: 1, delay: idx * 0.1 }}
                                    />
                                  </div>
                                  <div className="flex justify-between mt-1.5">
                                    <span className="text-gray-400 text-xs">
                                      {((category.spent / category.target) * 100).toFixed(0)}% of budget
                                    </span>
                                    <span className="text-gray-400 text-xs">
                                      Target: {formatCurrency(category.target, currency)}
                                    </span>
                                  </div>
                                </motion.div>
                              </StaggerItem>
                            ))}
                          </StaggerContainer>
                        </div>
                      ) : (
                        <div className="text-center py-10">
                          <p className="text-gray-400 mb-2">No budget comparison available</p>
                          <p className="text-sm text-gray-500">Set up budget targets to see comparisons</p>
                  </div>
                )}
                    </PremiumCard>
                  </StaggerItem>
                </EnhancedTabsContent>
              </AnimatePresence>
            </EnhancedTabs>
              </div>
        </>
          )}
    </PremiumContainer>
  );
};

export default SpendingPatterns;
