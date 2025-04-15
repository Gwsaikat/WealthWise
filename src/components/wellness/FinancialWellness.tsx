import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, MotionValue } from "framer-motion";
import {
  HeartPulse,
  Activity,
  Lightbulb,
  Brain,
  Target,
  BarChart3,
  Calendar,
  BookOpen,
  Coffee,
  ArrowRight,
  Smile,
  Frown,
  Meh,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info,
  Sparkles,
  CircleCheck,
  Zap,
  Waves,
  Gem,
  Stars,
  Leaf,
  Cherry,
  Circle,
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
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { useAuth } from "../../context/AuthContext";
import { useUser } from "../../context/UserContext";
import { useToast } from "../ui/use-toast";
import { formatCurrency } from "../../lib/utils";
import { Slider } from "../ui/slider";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Skeleton } from "../ui/skeleton";
import {
  getWellnessScore,
  updateWellnessScore,
  getStressAnswers,
  saveStressAnswer,
  getFinancialHabits,
  createFinancialHabit,
  updateFinancialHabit,
  getBudgetWellnessMetrics,
  calculateBudgetWellnessMetrics,
  FinancialHabit
} from "../../lib/database";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

interface WellnessProps {
  isLoading?: boolean;
}

// Sample assessment questions for financial stress
const stressAssessmentQuestions = [
  {
    id: 1,
    question: "How often do you worry about money?",
    options: [
      { value: "rarely", label: "Rarely", score: 10 },
      { value: "sometimes", label: "Sometimes", score: 7 },
      { value: "often", label: "Often", score: 4 },
      { value: "constantly", label: "Constantly", score: 1 },
    ],
  },
  {
    id: 2,
    question: "Do you have an emergency fund?",
    options: [
      { value: "yes_3months", label: "Yes, 3+ months of expenses", score: 10 },
      { value: "yes_1month", label: "Yes, 1-2 months of expenses", score: 7 },
      { value: "minimal", label: "Minimal savings", score: 4 },
      { value: "none", label: "No emergency fund", score: 1 },
    ],
  },
  {
    id: 3,
    question: "How do you feel when checking your bank balance?",
    options: [
      { value: "confident", label: "Confident and secure", score: 10 },
      { value: "fine", label: "Generally fine", score: 7 },
      { value: "nervous", label: "Somewhat nervous", score: 4 },
      { value: "anxious", label: "Anxious or afraid", score: 1 },
    ],
  },
  {
    id: 4,
    question: "Do you have a budget that you follow?",
    options: [
      { value: "yes_strictly", label: "Yes, and I follow it strictly", score: 10 },
      { value: "yes_mostly", label: "Yes, and I mostly follow it", score: 7 },
      { value: "yes_rarely", label: "Yes, but I rarely follow it", score: 4 },
      { value: "no", label: "No budget at all", score: 1 },
    ],
  },
  {
    id: 5,
    question: "How confident are you about your financial future?",
    options: [
      { value: "very", label: "Very confident", score: 10 },
      { value: "somewhat", label: "Somewhat confident", score: 7 },
      { value: "not_very", label: "Not very confident", score: 4 },
      { value: "not_at_all", label: "Not at all confident", score: 1 },
    ],
  },
];

// Financial wellness tips database
const wellnessTips = [
  {
    id: 1,
    title: "Start an Emergency Fund",
    description: "Aim to save 3-6 months of expenses for unexpected situations.",
    category: "saving",
    icon: <Sparkles className="h-4 w-4 text-yellow-400" />,
  },
  {
    id: 2,
    title: "Follow the 50/30/20 Rule",
    description: "Allocate 50% for needs, 30% for wants, and 20% for savings/debt repayment.",
    category: "budgeting",
    icon: <Target className="h-4 w-4 text-green-400" />,
  },
  {
    id: 3,
    title: "Use Cash for Discretionary Spending",
    description: "Switch to cash for non-essential purchases to increase awareness of spending.",
    category: "spending",
    icon: <Coffee className="h-4 w-4 text-orange-400" />,
  },
  {
    id: 4,
    title: "Practice Mindful Spending",
    description: "Wait 24 hours before making non-essential purchases over $50.",
    category: "mindfulness",
    icon: <Brain className="h-4 w-4 text-purple-400" />,
  },
  {
    id: 5,
    title: "Schedule Financial Check-ins",
    description: "Review your finances weekly to stay on track with your goals.",
    category: "habits",
    icon: <Calendar className="h-4 w-4 text-blue-400" />,
  },
  {
    id: 6,
    title: "Learn About Investing",
    description: "Dedicate 30 minutes weekly to increase your financial literacy.",
    category: "education",
    icon: <BookOpen className="h-4 w-4 text-indigo-400" />,
  },
];

// Default habits template
const defaultHabits = [
  {
    id: "1",
    user_id: "",
    name: "Check account balances",
    frequency: "daily" as const,
    streak: 0,
    isCompleted: false,
  },
  {
    id: "2",
    user_id: "",
    name: "Review recent transactions",
    frequency: "weekly" as const,
    streak: 0,
    isCompleted: false,
  },
  {
    id: "3",
    user_id: "",
    name: "Update budget categories",
    frequency: "weekly" as const,
    streak: 0,
    isCompleted: false,
  },
  {
    id: "4",
    user_id: "",
    name: "Put money into savings",
    frequency: "monthly" as const,
    streak: 0,
    isCompleted: false,
  },
  {
    id: "5",
    user_id: "",
    name: "Review financial goals progress",
    frequency: "monthly" as const,
    streak: 0,
    isCompleted: false,
  },
];

// Default budget wellness metrics for new users
const defaultBudgetWellness = {
  savingsRate: 0,
  debtToIncome: 0,
  housingToIncome: 0,
  hasEmergencyFund: false
};

// Add custom animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
};

const pulseAnimation = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.03, 1],
    transition: { 
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse" 
    }
  }
};

// Card hover effect component
const HoverCard = ({ children, className, delay = 0 }) => {
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.2)" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Custom score indicator that animates based on value
const AnimatedScoreIndicator = ({ score }) => {
  const progress = useMotionValue(0);
  const opacity = useTransform(progress, [0, 100], [0.5, 1]);
  const color = useTransform(
    progress, 
    [0, 40, 70, 100], 
    ["#ef4444", "#f59e0b", "#22c55e", "#10b981"]
  );
  
  useEffect(() => {
    progress.set(score);
  }, [score, progress]);
  
  return (
    <div className="relative h-40 w-40 mx-auto">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#1f2937"
          strokeWidth="8"
          className="opacity-20"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray="251.2"
          strokeDashoffset={useTransform(progress, [0, 100], [251.2, 0])}
          strokeLinecap="round"
          style={{ opacity }}
          className="drop-shadow-lg"
        />
      </svg>
      <motion.div
        className="absolute inset-0 flex items-center justify-center flex-col"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
      >
        <motion.div 
          className="text-4xl font-bold" 
          style={{ color: color }}
        >
          {score}
        </motion.div>
        <div className="text-gray-300 text-sm">Wellness Score</div>
      </motion.div>
    </div>
  );
};

const FinancialWellness: React.FC<WellnessProps> = ({ isLoading = false }) => {
  const { user } = useAuth();
  const { currency } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [wellnessScore, setWellnessScore] = useState<number | null>(null);
  const [stressLevel, setStressLevel] = useState<Record<string, string>>({});
  const [habits, setHabits] = useState<FinancialHabit[]>([]);
  const [budgetWellness, setBudgetWellness] = useState(defaultBudgetWellness);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    if (user) {
      fetchUserWellnessData();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Fetch wellness data from the database
  const fetchUserWellnessData = async () => {
    if (!user) return;
    
    setLoading(true);
    
    // Initialize variables that need to be accessible both in try and catch blocks
    const stressLevelObj: Record<string, string> = {};
    
    try {
      // Try to load from localStorage first for immediate display
      const cachedData = localStorage.getItem(`wellness_data_${user.id}`);
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        setWellnessScore(parsed.wellnessScore);
        setStressLevel(parsed.stressLevel || {});
        setHabits(parsed.habits || []);
        setBudgetWellness(parsed.budgetWellness || defaultBudgetWellness);
        setIsNewUser(parsed.isNewUser);
      }

      // Fetch wellness score
      const scoreData = await getWellnessScore(user.id);
      
      // Fetch stress answers
      const stressAnswers = await getStressAnswers(user.id);
      
      // Fetch financial habits
      let habitsData = await getFinancialHabits(user.id);
      
      // Fetch budget wellness metrics
      let metricsData = await getBudgetWellnessMetrics(user.id);
      
      // If budget metrics don't exist, try to calculate them
      if (!metricsData) {
        metricsData = await calculateBudgetWellnessMetrics(user.id);
      }
      
      // Determine if this is a new user with no wellness data
      const isNewUser = !scoreData && stressAnswers.length === 0 && habitsData.length === 0 && !metricsData;
      
      if (isNewUser) {
        // For new users, set default empty states
        setWellnessScore(null);
        setIsNewUser(true);
        
        // Create default habits for new users
        if (habitsData.length === 0) {
          // Create default habits in the database
          const createdHabits = await Promise.all(
            defaultHabits.map(habit => 
              createFinancialHabit(user.id, {
                name: habit.name,
                frequency: habit.frequency,
                streak: 0,
                isCompleted: false
              })
            )
          );
          
          // Filter out any null values (failed creations)
          habitsData = createdHabits.filter(habit => habit !== null) as FinancialHabit[];
        }
        
        setBudgetWellness(defaultBudgetWellness);
        
        // Show welcome toast for new users
        toast({
          title: "Welcome to Financial Wellness!",
          description: "Start by taking the stress assessment to get your wellness score.",
        });
      } else {
        // For existing users
        // Set wellness score
        if (scoreData) {
          setWellnessScore(scoreData.score);
        }
        
        // Set stress level answers
        stressAnswers.forEach(answer => {
          stressLevelObj[`q${answer.question_id}`] = answer.answer;
        });
        setStressLevel(stressLevelObj);
        
        // Set budget wellness metrics
        if (metricsData) {
          setBudgetWellness({
            savingsRate: metricsData.savingsRate,
            debtToIncome: metricsData.debtToIncome,
            housingToIncome: metricsData.housingToIncome,
            hasEmergencyFund: metricsData.hasEmergencyFund
          });
        }
        
        setIsNewUser(false);
      }
      
      // Set habits regardless of user status
      setHabits(habitsData);
      
      // Cache the data in localStorage
      const dataToCache = {
        wellnessScore: scoreData?.score || null,
        stressLevel: stressLevelObj || {},
        habits: habitsData || [],
        budgetWellness: metricsData || defaultBudgetWellness,
        isNewUser
      };
      localStorage.setItem(`wellness_data_${user.id}`, JSON.stringify(dataToCache));
      
    } catch (error) {
      console.error("Error fetching wellness data:", error);
      toast({
        title: "Error",
        description: "Failed to load your wellness data",
        variant: "destructive",
      });
      
      // Set reasonable defaults
      setWellnessScore(null);
      setHabits(defaultHabits);
      setBudgetWellness(defaultBudgetWellness);
      setIsNewUser(true);
    } finally {
      setLoading(false);
    }
  };

  // Calculate overall financial stress score
  const calculateStressScore = (): number => {
    if (Object.keys(stressLevel).length === 0) return 0;

    const totalPossibleScore = stressAssessmentQuestions.length * 10;
    const currentScore = stressAssessmentQuestions.reduce((sum, question) => {
      const answer = stressLevel[`q${question.id}`];
      if (!answer) return sum;
      const option = question.options.find(opt => opt.value === answer);
      return sum + (option?.score || 0);
    }, 0);

    return Math.round((currentScore / totalPossibleScore) * 100);
  };

  // Handle stress assessment answers
  const handleStressAnswer = async (questionId: number, value: string) => {
    if (!user) return;
    
    // Update local state
    setStressLevel(prev => ({
      ...prev,
      [`q${questionId}`]: value,
    }));
    
    // Save to database
    try {
      await saveStressAnswer(user.id, questionId, value);
    } catch (error) {
      console.error('Error saving stress answer:', error);
      toast({
        title: "Error",
        description: "Failed to save your answer",
        variant: "destructive",
      });
    }
  };

  // Get wellness score meaning
  const getWellnessScoreCategory = (score: number): { label: string; color: string; icon: JSX.Element } => {
    if (score >= 80) {
      return { 
        label: "Excellent", 
        color: "text-green-400", 
        icon: <Smile className="h-5 w-5 text-green-400" /> 
      };
    } else if (score >= 60) {
      return { 
        label: "Good", 
        color: "text-blue-400", 
        icon: <Smile className="h-5 w-5 text-blue-400" /> 
      };
    } else if (score >= 40) {
      return { 
        label: "Fair", 
        color: "text-yellow-400", 
        icon: <Meh className="h-5 w-5 text-yellow-400" /> 
      };
    } else {
      return { 
        label: "Needs Attention", 
        color: "text-red-400", 
        icon: <Frown className="h-5 w-5 text-red-400" /> 
      };
    }
  };

  // Toggle habit completion
  const toggleHabitCompletion = async (habitId: string) => {
    if (!user) return;
    
    // Find the habit
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    
    // Toggle completion and increment streak if completed
    const isCompleted = !habit.isCompleted;
    const streak = isCompleted ? habit.streak + 1 : habit.streak;
    
    // Update local state immediately for UI response
    setHabits(habits.map(h => 
      h.id === habitId 
        ? { ...h, isCompleted, streak } 
        : h
    ));
    
    // Update in database
    try {
      await updateFinancialHabit(habitId, { isCompleted, streak });
      
      toast({
        title: "Habit updated",
        description: `You've successfully updated your habit tracking.`,
      });
    } catch (error) {
      console.error('Error updating habit:', error);
      
      // Revert local state if database update fails
      setHabits(habits.map(h => 
        h.id === habitId ? habit : h
      ));
      
      toast({
        title: "Error",
        description: "Failed to update habit",
        variant: "destructive",
      });
    }
  };

  // Submit stress assessment
  const submitStressAssessment = async () => {
    if (!user) return;
    
    const score = calculateStressScore();
    if (score > 0) {
      try {
        // Save score to database
        await updateWellnessScore(user.id, score);
        
        // Update local state
        setWellnessScore(score);
        
        toast({
          title: "Wellness Score Updated",
          description: "Your financial wellness score has been calculated based on your responses.",
        });
        
        // Navigate back to overview tab
        setActiveTab("overview");
      } catch (error) {
        console.error('Error saving wellness score:', error);
        toast({
          title: "Error",
          description: "Failed to save your wellness score",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Please complete the assessment",
        description: "Answer all questions to get your wellness score.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8 py-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <HoverCard 
          className="col-span-1 md:col-span-2 lg:col-span-1"
          delay={0.1}
        >
          <Card className="bg-gradient-to-br from-blue-950 via-indigo-950 to-indigo-900 border-indigo-500/20 shadow-lg overflow-hidden hover:shadow-indigo-500/10 transition-all duration-300">
            <CardHeader className="pb-2 border-b border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 to-transparent">
              <CardTitle className="text-2xl font-bold text-white flex items-center">
                <HeartPulse className="h-6 w-6 mr-3 text-sky-400" />
                Financial Wellness
              </CardTitle>
              <CardDescription className="text-indigo-200">
                Your personal financial health tracker
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <AnimatedScoreIndicator score={wellnessScore || 0} />
                
                <div className="w-full mt-6 space-y-4">
                  {/* Scoring categories with animated progress bars */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-sky-300 flex items-center">
                        <Target className="h-4 w-4 mr-1.5" /> Budgeting
                      </span>
                      <span className="text-sm font-medium text-indigo-200">
                        {budgetWellness.savingsRate.toFixed(2)}/100
                      </span>
                    </div>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${budgetWellness.savingsRate}%` }}
                      transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
                      className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/20"
                    />
                  </div>
                  
                  {/* Add more scoring categories with similar animations */}
                </div>
              </div>
            </CardContent>
          </Card>
        </HoverCard>
        
        {/* Similar enhancements for other cards */}
        
        {/* Stress assessment with enhanced UI */}
        <HoverCard 
          className="col-span-1 md:col-span-2 lg:col-span-3" 
          delay={0.3}
        >
          <Card className="bg-gradient-to-br from-emerald-950 via-teal-950 to-teal-900 border-emerald-500/20 shadow-lg overflow-hidden transition-all duration-300">
            <CardHeader className="pb-2 border-b border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-transparent">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Brain className="h-6 w-6 mr-3 text-emerald-400" />
                  Stress Assessment
                </CardTitle>
                <Badge 
                  variant="outline" 
                  className="bg-emerald-900/30 text-emerald-300 border-emerald-500/40"
                >
                  {calculateStressScore() > 0 ? "Complete" : "Incomplete"}
                </Badge>
              </div>
              <CardDescription className="text-emerald-200">
                Measure and manage your financial stress levels
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              {/* Stress assessment content with enhanced animations */}
              {calculateStressScore() > 0 ? (
                <div className="mb-8 bg-gray-800/80 p-6 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-white">Your Stress Score</h3>
                    <Badge className={
                      calculateStressScore() >= 80 
                        ? "bg-green-500/20 text-green-400" 
                        : calculateStressScore() >= 60 
                        ? "bg-blue-500/20 text-blue-400"
                        : calculateStressScore() >= 40
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                    }>
                      {calculateStressScore()}%
                    </Badge>
                  </div>
                  <Progress 
                    value={calculateStressScore()} 
                    className="h-2 bg-gray-700 mb-4" 
                  />
                  <div className="text-sm text-gray-400">
                    {calculateStressScore() >= 80 ? (
                      <div className="flex items-start">
                        <Smile className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                        <span>Your relationship with money is healthy. Keep maintaining these positive habits!</span>
                      </div>
                    ) : calculateStressScore() >= 60 ? (
                      <div className="flex items-start">
                        <Smile className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
                        <span>You're doing well, but there's room for improvement in managing financial stress.</span>
                      </div>
                    ) : calculateStressScore() >= 40 ? (
                      <div className="flex items-start">
                        <Meh className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
                        <span>Your financial stress is moderate. Consider implementing some of our tips to improve.</span>
                      </div>
                    ) : (
                      <div className="flex items-start">
                        <Frown className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
                        <span>Your financial stress level is high. Focus on the recommended actions to reduce stress.</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}

              <div className="space-y-6">
                {stressAssessmentQuestions.map((q) => (
                  <div key={q.id} className="bg-gray-800/80 p-4 rounded-lg border border-gray-700 space-y-4">
                    <h3 className="text-white font-medium">{q.question}</h3>
                    <RadioGroup 
                      value={stressLevel[`q${q.id}`]} 
                      onValueChange={(value) => handleStressAnswer(q.id, value)}
                    >
                      <div className="space-y-2">
                        {q.options.map((option) => (
                          <div 
                            key={option.value} 
                            className="flex items-center space-x-2 bg-gray-700/50 p-3 rounded-md border border-gray-600 hover:bg-gray-700/80 transition-colors cursor-pointer"
                            onClick={() => handleStressAnswer(q.id, option.value)}
                          >
                            <RadioGroupItem 
                              value={option.value} 
                              id={`q${q.id}-${option.value}`} 
                              className="text-yellow-400"
                            />
                            <Label 
                              htmlFor={`q${q.id}-${option.value}`}
                              className="flex-1 cursor-pointer text-white"
                            >
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                ))}

                <div className="flex justify-center mt-6">
                  <Button 
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                    onClick={submitStressAssessment}
                  >
                    {wellnessScore === null ? "Calculate My Wellness Score" : "Update My Wellness Score"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </HoverCard>
        
        {/* Add similar enhancements to other sections */}
      </motion.div>
      
      {/* Financial Habits section with new interactive animations */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6"
        transition={{ delay: 0.5 }}
      >
        <HoverCard className="w-full" delay={0.4}>
          <Card className="bg-gradient-to-br from-purple-950 via-violet-950 to-violet-900 border-purple-500/20 shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
            <CardHeader className="pb-2 border-b border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-transparent">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Sparkles className="h-6 w-6 mr-3 text-purple-400" />
                  Financial Habits
                </CardTitle>
                <Button variant="outline" size="sm" className="bg-purple-950 border-purple-500/40 text-white hover:bg-purple-900/50">
                  <Plus className="h-4 w-4 mr-1.5" /> Add Habit
                </Button>
              </div>
              <CardDescription className="text-purple-200">
                Build positive financial routines
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              {/* Enhanced habit tracking UI */}
              <AnimatePresence>
                {habits.map((habit, index) => (
                  <motion.div
                    key={habit.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: 0.1 * index }}
                    className="mb-4 last:mb-0"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 rounded-lg bg-gradient-to-r from-purple-900/40 to-violet-900/20 border border-purple-500/20 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${habit.isCompleted ? "bg-green-500/20" : "bg-purple-500/20"}`}>
                          {habit.isCompleted ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 15 }}
                            >
                              <CheckCircle className="h-5 w-5 text-green-400" />
                            </motion.div>
                          ) : (
                            <Circle className="h-5 w-5 text-purple-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-white">{habit.name}</div>
                          <div className="text-xs text-purple-300 flex items-center mt-0.5">
                            <Calendar className="h-3 w-3 mr-1" />
                            {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
                            {habit.streak > 0 && (
                              <Badge className="ml-2 bg-amber-900/30 text-amber-300 border-amber-500/30 text-[10px] px-1.5 py-0">
                                🔥 {habit.streak} streak
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={habit.isCompleted}
                        onCheckedChange={() => toggleHabitCompletion(habit.id)}
                        className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-purple-900/50"
                      />
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </CardContent>
          </Card>
        </HoverCard>
      </motion.div>
      
      {/* Add more enhanced sections */}
    </div>
  );
};

export default FinancialWellness; 