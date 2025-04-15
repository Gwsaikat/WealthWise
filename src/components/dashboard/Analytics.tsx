import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, MotionValue, useMotionValue, useTransform, useSpring } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  Label,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { useAuth } from "../../context/AuthContext";
import { useUser } from "../../context/UserContext";
import { getExpensesByDateRange, getExpensesByCategory } from "../../lib/database";
import { formatCurrency } from "../../lib/utils";
import { Skeleton } from "../ui/skeleton";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  LineChart as LineChartIcon,
  Zap,
  AlertCircle,
  Info,
  ArrowDownRight,
  ArrowUpRight,
  Activity,
  Eye,
  ChevronRight,
  ChevronsUp,
  ChevronsDown,
} from "lucide-react";
import { format, subDays, subMonths, startOfMonth, endOfMonth, parseISO, differenceInCalendarDays } from "date-fns";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useToast } from "../ui/use-toast";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

// Define types
interface AnalyticsProps {
  isLoading?: boolean;
}

// Enhanced color palette for a premium look
const PREMIUM_COLORS = {
  primary: ["#6366F1", "#818CF8", "#A5B4FC", "#C7D2FE", "#E0E7FF"],
  success: ["#10B981", "#34D399", "#6EE7B7", "#A7F3D0", "#D1FAE5"],
  warning: ["#F59E0B", "#FBBF24", "#FCD34D", "#FDE68A", "#FEF3C7"],
  error: ["#EF4444", "#F87171", "#FCA5A5", "#FECACA", "#FEE2E2"],
  purple: ["#8B5CF6", "#A78BFA", "#C4B5FD", "#DDD6FE", "#EDE9FE"],
  cyan: ["#06B6D4", "#22D3EE", "#67E8F9", "#A5F3FC", "#CFFAFE"],
  indigo: ["#4F46E5", "#6366F1", "#818CF8", "#A5B4FC", "#C7D2FE"],
};

// Chart gradients
const chartGradients = {
  area: [
    { offset: 0, color: 'rgba(99, 102, 241, 0.8)' },
    { offset: 100, color: 'rgba(99, 102, 241, 0.1)' }
  ],
  areaPositive: [
    { offset: 0, color: 'rgba(16, 185, 129, 0.8)' },
    { offset: 100, color: 'rgba(16, 185, 129, 0.1)' }
  ],
  areaNegative: [
    { offset: 0, color: 'rgba(239, 68, 68, 0.8)' },
    { offset: 100, color: 'rgba(239, 68, 68, 0.1)' }
  ]
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

const pulseVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const floatVariants = {
  float: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const AnimatedNumber = ({ value }: { value: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, latest => Math.round(latest));
  const displayValue = useTransform(rounded, latest => `${latest}`);
  
  useEffect(() => {
    const controls = useSpring(count, { 
      stiffness: 100, 
      damping: 30, 
      duration: 1.5
    });
    controls.set(value);
  }, [value, count]);

  return <motion.span>{displayValue}</motion.span>;
};

const Analytics: React.FC<AnalyticsProps> = ({ isLoading = false }) => {
  const { user } = useAuth();
  const { currency } = useUser();
  const [activeTab, setActiveTab] = useState("trends");
  const [timeRange, setTimeRange] = useState("month");
  const [chartData, setChartData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<string[]>([]);
  const { toast } = useToast();
  
  // Animation state
  const [chartVisible, setChartVisible] = useState(false);

  // Enhanced colors for the charts
  const CHART_COLORS = [
    PREMIUM_COLORS.primary[0],
    PREMIUM_COLORS.success[0],
    PREMIUM_COLORS.warning[0],
    PREMIUM_COLORS.error[0],
    PREMIUM_COLORS.purple[0],
    PREMIUM_COLORS.cyan[0],
  ];

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, timeRange]);

  useEffect(() => {
    // Simulate loading insights from an API
    const loadInsights = async () => {
      setLoading(true);
      try {
        // In a real app, fetch insights from backend
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate default insights for new users
        const defaultInsights = [
          "Welcome to your Analytics dashboard! Add your expenses to see personalized insights.",
          "Track your spending for at least a week to see spending patterns.",
          "Set up a budget to see how well you're sticking to your financial goals.",
        ];
        
        setInsights(defaultInsights);
        
        // Show chart after data is loaded
        setTimeout(() => setChartVisible(true), 300);
      } catch (error) {
        console.error("Error loading insights:", error);
        toast({
          title: "Error loading insights",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadInsights();
  }, [user, toast]);

  const fetchData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Get date range based on selected time range
      let startDate, endDate;
      const now = new Date();
      
      switch (timeRange) {
        case "week":
          startDate = subDays(now, 7).toISOString();
          endDate = now.toISOString();
          break;
        case "month":
          startDate = startOfMonth(now).toISOString();
          endDate = endOfMonth(now).toISOString();
          break;
        case "quarter":
          startDate = subMonths(now, 3).toISOString();
          endDate = now.toISOString();
          break;
        case "year":
          startDate = subMonths(now, 12).toISOString();
          endDate = now.toISOString();
          break;
        default:
          startDate = startOfMonth(now).toISOString();
          endDate = endOfMonth(now).toISOString();
      }
      
      // Fetch expenses for the selected time range
      const expenses = await getExpensesByDateRange(user.id, startDate, endDate);
      
      // Generate chart data based on the expenses
      generateChartData(expenses);
      
      // Get category breakdown
      const categories = await getExpensesByCategory(user.id);
      const categoryChartData = Object.entries(categories).map(([name, value], index) => ({
        name,
        value,
        color: CHART_COLORS[index % CHART_COLORS.length],
      }));
      
      setCategoryData(categoryChartData);
      
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = (expenses: any[]) => {
    if (!expenses || expenses.length === 0) {
      setChartData([]);
      return;
    }
    
    // Group expenses by date
    const groupedByDate = expenses.reduce((acc: any, expense: any) => {
      const date = format(parseISO(expense.date), "MMM dd");
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += expense.amount;
      return acc;
    }, {});
    
    // Convert to array for charts
    const data = Object.entries(groupedByDate).map(([date, amount]) => ({
      date,
      amount,
    }));
    
    // Sort by date
    data.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
    
    setChartData(data);
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800/90 backdrop-blur-md p-4 rounded-lg border border-gray-700/50 shadow-xl animate-in fade-in zoom-in-95 duration-200">
          <p className="text-sm font-semibold text-white mb-1">{label}</p>
          <p className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {formatCurrency(payload[0].value, currency)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden"
      >
        <div className="absolute -inset-[150px] bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-pink-500/10 blur-3xl opacity-30 -z-10"></div>
        <Card className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 shadow-lg overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                  <motion.div className="flex items-center" variants={itemVariants}>
                    <Activity className="h-5 w-5 mr-2 text-indigo-400" />
                    Financial Analytics
                  </motion.div>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Analyze your spending patterns and financial trends
                </CardDescription>
              </div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Select
                  value={timeRange}
                  onValueChange={setTimeRange}
                >
                  <SelectTrigger className="w-[140px] bg-gray-700/50 border-gray-600/50 focus:ring-indigo-500/30 hover:bg-gray-700/80 transition-all duration-200">
                    <Calendar className="h-4 w-4 mr-2 text-indigo-400" />
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800/95 backdrop-blur-xl border-gray-700/70 shadow-xl">
                    <SelectItem value="week" className="focus:bg-indigo-500/20 focus:text-indigo-300">This Week</SelectItem>
                    <SelectItem value="month" className="focus:bg-indigo-500/20 focus:text-indigo-300">This Month</SelectItem>
                    <SelectItem value="quarter" className="focus:bg-indigo-500/20 focus:text-indigo-300">Last 3 Months</SelectItem>
                    <SelectItem value="year" className="focus:bg-indigo-500/20 focus:text-indigo-300">Last 12 Months</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-6 bg-gray-700/30 backdrop-blur-sm border border-gray-700/50 p-1 rounded-lg">
                <TabsTrigger 
                  value="trends" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-indigo-300 
                  data-[state=active]:backdrop-blur-xl data-[state=active]:shadow-sm data-[state=active]:border-indigo-500/20 rounded-md px-3 py-2 transition-all duration-300"
                >
                  <LineChartIcon className="h-4 w-4 mr-2" /> Trends
                </TabsTrigger>
                <TabsTrigger 
                  value="categories" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-indigo-300 
                  data-[state=active]:backdrop-blur-xl data-[state=active]:shadow-sm data-[state=active]:border-indigo-500/20 rounded-md px-3 py-2 transition-all duration-300"
                >
                  <PieChartIcon className="h-4 w-4 mr-2" /> Categories
                </TabsTrigger>
                <TabsTrigger 
                  value="insights" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-indigo-300 
                  data-[state=active]:backdrop-blur-xl data-[state=active]:shadow-sm data-[state=active]:border-indigo-500/20 rounded-md px-3 py-2 transition-all duration-300"
                >
                  <Zap className="h-4 w-4 mr-2" /> Insights
                </TabsTrigger>
              </TabsList>

              <TabsContent value="trends" className="mt-0">
                {loading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-[300px] w-full bg-gray-700/30" />
                    <div className="flex justify-between gap-2">
                      <Skeleton className="h-8 w-20 bg-gray-700/30" />
                      <Skeleton className="h-8 w-24 bg-gray-700/30" />
                    </div>
                  </div>
                ) : chartData.length > 0 ? (
                  <AnimatePresence>
                    {chartVisible && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 300, 
                          damping: 24
                        }}
                        className="h-[300px] w-full p-4 bg-gray-800/20 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-inner"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={chartData}
                            margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
                          >
                            <defs>
                              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                {chartGradients.area.map((stop, index) => (
                                  <stop key={index} offset={`${stop.offset}%`} stopColor={stop.color} />
                                ))}
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis 
                              dataKey="date" 
                              stroke="rgba(255,255,255,0.5)" 
                              tick={{ fill: 'rgba(255,255,255,0.7)' }}
                              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                              tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            />
                            <YAxis 
                              stroke="rgba(255,255,255,0.5)" 
                              tick={{ fill: 'rgba(255,255,255,0.7)' }}
                              tickFormatter={(value) => formatCurrency(value, currency)}
                              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                              tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                              type="monotone"
                              dataKey="amount"
                              stroke={PREMIUM_COLORS.indigo[0]}
                              strokeWidth={2}
                              fillOpacity={1}
                              fill="url(#colorAmount)"
                              activeDot={{ 
                                r: 6, 
                                fill: PREMIUM_COLORS.indigo[0], 
                                stroke: '#fff',
                                strokeWidth: 2
                              }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </motion.div>
                    )}
                  </AnimatePresence>
                ) : (
                  <motion.div 
                    variants={itemVariants}
                    className="flex flex-col items-center justify-center h-[300px] bg-gray-800/30 backdrop-blur-sm rounded-lg border border-dashed border-gray-700/70 shadow-inner"
                  >
                    <motion.div
                      variants={floatVariants}
                      animate="float"
                      className="mb-4 p-4 rounded-full bg-gray-700/30 border border-gray-600/30"
                    >
                      <Calendar className="h-10 w-10 text-indigo-400/60" />
                    </motion.div>
                    <h3 className="text-lg font-medium text-gray-300">No data available</h3>
                    <p className="text-sm text-gray-500 mt-1 max-w-xs text-center">
                      Start tracking your expenses to see analytics and visualize your spending patterns
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className="mt-6"
                    >
                      <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-none shadow-md hover:shadow-lg shadow-indigo-900/20 hover:shadow-indigo-900/40">
                        Add Your First Expense
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="categories" className="mt-0">
                {loading ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    <Skeleton className="h-[300px] w-full bg-gray-700/30" />
                    <div className="space-y-3">
                      <Skeleton className="h-12 w-full bg-gray-700/30" />
                      <Skeleton className="h-12 w-full bg-gray-700/30" />
                      <Skeleton className="h-12 w-full bg-gray-700/30" />
                    </div>
                  </div>
                ) : categoryData.length > 0 ? (
                  <motion.div 
                    variants={itemVariants}
                    className="grid md:grid-cols-2 gap-6"
                  >
                    <div className="h-[300px] p-4 bg-gray-800/20 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-inner">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <defs>
                            {categoryData.map((entry, index) => (
                              <linearGradient key={`gradient-${index}`} id={`colorGradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor={entry.color} stopOpacity={0.8} />
                                <stop offset="100%" stopColor={entry.color} stopOpacity={1} />
                              </linearGradient>
                            ))}
                          </defs>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            innerRadius={60}
                            outerRadius={90}
                            fill="#8884d8"
                            dataKey="value"
                            paddingAngle={3}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {categoryData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={`url(#colorGradient-${index})`}
                                stroke={entry.color}
                                strokeWidth={1}
                              />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                      {categoryData.map((category, index) => (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          whileHover={{ 
                            scale: 1.02, 
                            boxShadow: `0 0 20px 2px rgba(${parseInt(category.color.slice(1, 3), 16)}, ${parseInt(category.color.slice(3, 5), 16)}, ${parseInt(category.color.slice(5, 7), 16)}, 0.15)`,
                            y: -2
                          }}
                          className="flex items-center justify-between p-4 bg-gray-800/40 backdrop-blur-sm rounded-lg border border-gray-700/50 transition-all duration-300"
                        >
                          <div className="flex items-center">
                            <span
                              className="w-4 h-4 rounded-full mr-3 shadow-sm"
                              style={{ backgroundColor: category.color, boxShadow: `0 0 10px ${category.color}50` }}
                            />
                            <span className="text-gray-200 font-medium">{category.name}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium text-white">
                              {formatCurrency(category.value, currency)}
                            </span>
                            <Badge
                              variant="outline"
                              className="ml-2 border-gray-600 text-xs"
                            >
                              {((category.value / categoryData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] bg-gray-800/30 rounded-lg border border-dashed border-gray-700">
                    <PieChartIcon className="h-10 w-10 text-gray-600 mb-2" />
                    <h3 className="text-lg font-medium text-gray-400">No category data</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Add expenses with categories to see the breakdown
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="insights" className="mt-0">
                <div className="space-y-4">
                  {loading ? (
                    <>
                      <Skeleton className="h-16 w-full bg-gray-700/50" />
                      <Skeleton className="h-16 w-full bg-gray-700/50" />
                      <Skeleton className="h-16 w-full bg-gray-700/50" />
                    </>
                  ) : insights.length > 0 ? (
                    insights.map((insight, index) => (
                      <Alert key={index} variant="default" className="bg-gray-700/50 border">
                        <div className="flex items-start">
                          <Info className="h-4 w-4 text-gray-400 mr-3" />
                          <AlertDescription className="text-inherit">
                            {insight}
                          </AlertDescription>
                        </div>
                      </Alert>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[300px] bg-gray-800/30 rounded-lg border border-dashed border-gray-700">
                      <Zap className="h-10 w-10 text-gray-600 mb-2" />
                      <h3 className="text-lg font-medium text-gray-400">No insights available</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Continue using the app to generate personalized insights
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Analytics; 