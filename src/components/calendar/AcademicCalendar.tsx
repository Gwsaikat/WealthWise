import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, MotionValue } from "framer-motion";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar,
  Edit,
  Trash2,
  AlertCircle,
  BookOpen,
  Banknote,
  CircleDollarSign,
  GraduationCap,
  School,
  Loader2,
  ArrowDownRight,
  ArrowUpRight,
  Repeat,
  FilterIcon,
  ListChecks,
  MoreHorizontal,
  CalendarDays,
  Search,
  Download,
  X,
  Clock,
  Upload,
  CheckCircle2,
  Sparkles,
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
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import {
  Calendar as CalendarComponent
} from "../ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "../../lib/utils";
import { format, isSameDay, parse, parseISO } from "date-fns";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../ui/use-toast";
import { formatCurrency } from "../../lib/utils";
import { useUser } from "../../context/UserContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Alert, AlertDescription } from "../ui/alert";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { getRecurringTransactions, getUpcomingTransactions, getCalendarTransactions, getTransactionsInDateRange } from "../../lib/recurring";
import { useMediaQuery } from "../../hooks/useMediaQuery";

// Define types for academic events
interface AcademicEvent {
  id: string;
  user_id?: string;
  title: string;
  date: Date;
  time?: string;
  description: string;
  type: EventType;
  estimatedExpense: number;
  isRecurring: boolean;
  recurringFrequency?: "weekly" | "monthly" | "semester" | null;
  created_at?: string;
  updated_at?: string;
}

type EventType = "tuition" | "books" | "supplies" | "housing" | "fee" | "other";

// Premium animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.3
    }
  }
};

const shimmer = {
  hidden: { 
    backgroundPosition: "0% 0%" 
  },
  visible: { 
    backgroundPosition: "100% 0%",
    transition: { 
      repeat: Infinity, 
      repeatType: "mirror" as "mirror", 
      duration: 2.5,
      ease: "linear"
    }
  }
};

const pulseAnimation = {
  scale: [1, 1.02, 1],
  transition: { 
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

// Premium color palette
const PREMIUM_COLORS = {
  primary: {
    light: "#6366f1", // Indigo-500
    DEFAULT: "#4f46e5", // Indigo-600
    dark: "#4338ca",   // Indigo-700
  },
  accent: {
    light: "#c084fc", // Purple-400
    DEFAULT: "#a855f7", // Purple-500
    dark: "#9333ea",   // Purple-600
  },
  success: {
    light: "#22c55e", // Green-500
    DEFAULT: "#16a34a", // Green-600
    dark: "#15803d",   // Green-700
  },
  warning: {
    light: "#f59e0b", // Amber-500
    DEFAULT: "#d97706", // Amber-600
    dark: "#b45309",   // Amber-700
  },
  danger: {
    light: "#ef4444", // Red-500
    DEFAULT: "#dc2626", // Red-600
    dark: "#b91c1c",   // Red-700
  },
  neutral: {
    50: "#fafafa",
    100: "#f4f4f5",
    200: "#e4e4e7",
    300: "#d4d4d8",
    400: "#a1a1aa",
    500: "#71717a",
    600: "#52525b",
    700: "#3f3f46",
    800: "#27272a",
    900: "#18181b",
    950: "#0f0f11",
  }
};

// Update event types with enhanced styling
const EVENT_TYPES: Record<EventType, { 
  label: string; 
  icon: React.ReactNode; 
  color: string;
  bgColor: string;
  borderColor: string;
  hoverBg: string;
  gradient: string;
}> = {
  tuition: { 
    label: "Tuition Payment", 
    icon: <School className="h-4 w-4" />, 
    color: "text-purple-400",
    bgColor: "bg-purple-500/10", 
    borderColor: "border-purple-500/30",
    hoverBg: "hover:bg-purple-500/20",
    gradient: "from-purple-600 to-indigo-600"
  },
  books: { 
    label: "Books & Materials", 
    icon: <BookOpen className="h-4 w-4" />, 
    color: "text-blue-400",
    bgColor: "bg-blue-500/10", 
    borderColor: "border-blue-500/30",
    hoverBg: "hover:bg-blue-500/20",
    gradient: "from-blue-600 to-cyan-600"
  },
  supplies: { 
    label: "Supplies", 
    icon: <Calendar className="h-4 w-4" />, 
    color: "text-amber-400",
    bgColor: "bg-amber-500/10", 
    borderColor: "border-amber-500/30",
    hoverBg: "hover:bg-amber-500/20",
    gradient: "from-amber-500 to-yellow-600"
  },
  housing: { 
    label: "Housing Payment", 
    icon: <CircleDollarSign className="h-4 w-4" />, 
    color: "text-green-400",
    bgColor: "bg-green-500/10", 
    borderColor: "border-green-500/30",
    hoverBg: "hover:bg-green-500/20",
    gradient: "from-emerald-600 to-green-600"
  },
  fee: { 
    label: "Fees & Dues", 
    icon: <Banknote className="h-4 w-4" />, 
    color: "text-rose-400",
    bgColor: "bg-rose-500/10", 
    borderColor: "border-rose-500/30",
    hoverBg: "hover:bg-rose-500/20",
    gradient: "from-rose-600 to-pink-600"
  },
  other: { 
    label: "Other", 
    icon: <GraduationCap className="h-4 w-4" />, 
    color: "text-slate-400",
    bgColor: "bg-slate-500/10", 
    borderColor: "border-slate-500/30",
    hoverBg: "hover:bg-slate-500/20",
    gradient: "from-slate-600 to-gray-600"
  },
};

const AcademicCalendar = () => {
  const { user } = useAuth();
  const { currency } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [events, setEvents] = useState<AcademicEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("calendar");
  const [currentView, setCurrentView] = useState<"month" | "list">("month");
  const [editingEvent, setEditingEvent] = useState<AcademicEvent | null>(null);
  const [recurringTransactions, setRecurringTransactions] = useState<any[]>([]);
  const [upcomingTransactions, setUpcomingTransactions] = useState<any[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [focusedDay, setFocusedDay] = useState<Date | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // New event form state
  const [newEvent, setNewEvent] = useState<Partial<AcademicEvent>>({
    title: "",
    date: new Date(),
    description: "",
    type: "other",
    estimatedExpense: 0,
    isRecurring: false
  });

  // New state variables for premium animations
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // Reduce rotation sensitivity by 50% to prevent excessive shaking
  const rotateX = useTransform(y, [-100, 100], [1, -1]);
  const rotateY = useTransform(x, [-100, 100], [-1, 1]);

  // Add new state variables for the right panel
  const [expensesByCategory, setExpensesByCategory] = useState<Record<EventType, number>>({
    tuition: 0,
    books: 0,
    supplies: 0,
    housing: 0,
    fee: 0,
    other: 0
  });
  const [mostExpensiveMonth, setMostExpensiveMonth] = useState<string>("");
  const [totalAcademicExpenses, setTotalAcademicExpenses] = useState<number>(0);
  const [upcomingEventCount, setUpcomingEventCount] = useState<number>(0);

  // Fetch academic events from Supabase
  const fetchEvents = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('academic_events')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      if (data) {
        // Transform dates from strings to Date objects
        const formattedEvents: AcademicEvent[] = data.map(event => ({
          ...event,
          date: new Date(event.date),
          type: event.type as EventType,
          recurringFrequency: event.recurringFrequency as "weekly" | "monthly" | "semester" | null
        }));
        
        setEvents(formattedEvents);
      }
    } catch (err) {
      console.error('Error fetching academic events:', err);
      toast({
        title: "Error",
        description: "Failed to load academic events",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load events when component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  useEffect(() => {
    if (events.length > 0) {
      // Calculate expenses by category
      const byCategory = events.reduce((acc, event) => {
        acc[event.type] = (acc[event.type] || 0) + event.estimatedExpense;
        return acc;
      }, {} as Record<EventType, number>);
      
      setExpensesByCategory(byCategory);
      
      // Calculate total expenses
      const total = events.reduce((sum, event) => sum + event.estimatedExpense, 0);
      setTotalAcademicExpenses(total);
      
      // Count upcoming events
      const upcomingCount = events.filter(e => e.date >= new Date()).length;
      setUpcomingEventCount(upcomingCount);
      
      // Find most expensive month
      const expensesByMonth = events.reduce((acc, event) => {
        const monthKey = format(event.date, 'MMMM yyyy');
        acc[monthKey] = (acc[monthKey] || 0) + event.estimatedExpense;
        return acc;
      }, {} as Record<string, number>);
      
      let maxMonth = '';
      let maxAmount = 0;
      
      Object.entries(expensesByMonth).forEach(([month, amount]) => {
        if (amount > maxAmount) {
          maxMonth = month;
          maxAmount = amount;
        }
      });
      
      setMostExpensiveMonth(maxMonth);
    }
  }, [events]);

  // Calculate total monthly expenses based on events
  const getMonthlyExpenses = (): number => {
    return events.reduce((total, event) => {
      // Only count events in the current month
      if (event.date.getMonth() === selectedMonth.getMonth() &&
          event.date.getFullYear() === selectedMonth.getFullYear()) {
        return total + event.estimatedExpense;
      }
      return total;
    }, 0);
  };

  // Function to get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      isSameDay(event.date, date)
    );
  };

  // Event handlers
  const handlePreviousMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleNewEventChange = (field: string, value: any) => {
    setNewEvent({
      ...newEvent,
      [field]: value
    });
  };

  const handleAddEvent = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add events",
        variant: "destructive"
      });
      return;
    }
    
    if (!newEvent.title || !newEvent.date || !newEvent.type) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const eventToAdd: AcademicEvent = {
        id: editingEvent ? editingEvent.id : uuidv4(),
        user_id: user.id,
        title: newEvent.title || "",
        date: newEvent.date || new Date(),
        description: newEvent.description || "",
        type: (newEvent.type as EventType) || "other",
        estimatedExpense: newEvent.estimatedExpense || 0,
        isRecurring: newEvent.isRecurring || false,
        recurringFrequency: newEvent.recurringFrequency,
        updated_at: new Date().toISOString()
      };

      if (editingEvent) {
        // Update existing event
        const { error } = await supabase
          .from('academic_events')
          .update({
            title: eventToAdd.title,
            date: eventToAdd.date.toISOString(),
            description: eventToAdd.description,
            type: eventToAdd.type,
            estimatedExpense: eventToAdd.estimatedExpense,
            isRecurring: eventToAdd.isRecurring,
            recurringFrequency: eventToAdd.recurringFrequency,
            updated_at: eventToAdd.updated_at
          })
          .eq('id', eventToAdd.id)
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        // Update local state
        setEvents(events.map(event => 
          event.id === editingEvent.id ? eventToAdd : event
        ));
        
        toast({
          title: "Event Updated",
          description: "Academic calendar event has been updated"
        });
      } else {
        // Add new event
        const { error } = await supabase
          .from('academic_events')
          .insert([{
            id: eventToAdd.id,
            user_id: user.id,
            title: eventToAdd.title,
            date: eventToAdd.date.toISOString(),
            description: eventToAdd.description,
            type: eventToAdd.type,
            estimatedExpense: eventToAdd.estimatedExpense,
            isRecurring: eventToAdd.isRecurring,
            recurringFrequency: eventToAdd.recurringFrequency,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);
          
        if (error) throw error;
        
        // Update local state
        setEvents([...events, eventToAdd]);
        
        toast({
          title: "Event Added",
          description: "New academic calendar event has been added"
        });
      }
    } catch (err) {
      console.error('Error saving event:', err);
      toast({
        title: "Error",
        description: "Failed to save the event",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      
      // Reset form
      setNewEvent({
        title: "",
        date: new Date(),
        description: "",
        type: "other",
        estimatedExpense: 0,
        isRecurring: false
      });
      
      setEditingEvent(null);
      setIsAddEventOpen(false);
    }
  };

  const handleEditEvent = (event: AcademicEvent) => {
    setEditingEvent(event);
    setNewEvent({
      title: event.title,
      date: event.date,
      description: event.description,
      type: event.type,
      estimatedExpense: event.estimatedExpense,
      isRecurring: event.isRecurring,
      recurringFrequency: event.recurringFrequency
    });
    setIsAddEventOpen(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('academic_events')
        .delete()
        .eq('id', eventId)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Update local state
      setEvents(events.filter(event => event.id !== eventId));
      
      toast({
        title: "Event Deleted",
        description: "Academic calendar event has been removed"
      });
    } catch (err) {
      console.error('Error deleting event:', err);
      toast({
        title: "Error",
        description: "Failed to delete the event",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToExpenses = async (event: AcademicEvent) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Create a new expense record based on the academic event
      const { error } = await supabase
        .from('expenses')
        .insert([{
          id: uuidv4(),
          user_id: user.id,
          title: event.title,
          amount: event.estimatedExpense,
          date: new Date().toISOString(),
          category: `Academic - ${EVENT_TYPES[event.type].label}`,
          description: event.description,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);
        
      if (error) throw error;
      
      toast({
        title: "Expense Added",
        description: `${event.title} added to your expenses`
      });
      
      // Redirect to expenses page
      navigate("/expenses");
    } catch (err) {
      console.error('Error adding expense:', err);
      toast({
        title: "Error",
        description: "Failed to add to expenses",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecurringTransactions = async () => {
    if (!user?.id) return;
    
    setIsLoadingTransactions(true);
    try {
      // Get transactions formatted for calendar display
      const calendarTransactions = await getCalendarTransactions(user.id);
      setUpcomingTransactions(calendarTransactions);
      
      // Get original recurring transactions for reference
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
      setIsLoadingTransactions(false);
    }
  };

  const getTransactionsForDate = (date: Date) => {
    return upcomingTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return isSameDay(transactionDate, date);
    });
  };

  const getEventsAndTransactionsForDate = (date: Date) => {
    const events = getEventsForDate(date);
    const transactions = getTransactionsForDate(date);
    
    return {
      events,
      transactions,
      hasItems: events.length > 0 || transactions.length > 0
    };
  };

  // Define needed variables
  const today = format(new Date(), 'yyyy-MM-dd');
  const tomorrow = format(new Date(new Date().setDate(new Date().getDate() + 1)), 'yyyy-MM-dd');

  // Add groupedEvents array to fix the undefined error
  const groupedEventsObj = events
    .filter(event => event.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .reduce((groups, event) => {
      const dateKey = format(event.date, 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(event);
      return groups;
    }, {} as Record<string, AcademicEvent[]>);

  // Convert the object to an array of [date, events] pairs for mapping
  const groupedEvents = Object.entries(groupedEventsObj);

  // Filter events by search query
  const getFilteredEvents = (eventsToFilter: AcademicEvent[]) => {
    if (!searchQuery.trim()) return eventsToFilter;
    
    return eventsToFilter.filter(event => 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };
  
  // Format event date and time for display
  const formatEventDateTime = (event: AcademicEvent) => {
    let formattedDate = format(event.date, "MMM dd");
    
    if (event.time) {
      formattedDate += ` at ${format(new Date(`${format(event.date, "yyyy-MM-dd")}T${event.time}`), "h:mm a")}`;
    }
    
    return formattedDate;
  };
  
  // Function to handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, day: Date) => {
    const key = e.key;
    if (!["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "Enter", " "].includes(key)) {
      return;
    }
    
    e.preventDefault();
    let newFocusedDay = new Date(day);
    
    switch (key) {
      case "ArrowRight":
        newFocusedDay.setDate(day.getDate() + 1);
        break;
      case "ArrowLeft":
        newFocusedDay.setDate(day.getDate() - 1);
        break;
      case "ArrowUp":
        newFocusedDay.setDate(day.getDate() - 7);
        break;
      case "ArrowDown":
        newFocusedDay.setDate(day.getDate() + 7);
        break;
      case "Enter":
      case " ":
        handleDateSelect(day);
        return;
    }
    
    setFocusedDay(newFocusedDay);
    
    // Find the element to focus
    const dayElements = document.querySelectorAll("[data-date]");
    const dateStr = format(newFocusedDay, "yyyy-MM-dd");
    
    dayElements.forEach(element => {
      if (element.getAttribute("data-date") === dateStr) {
        (element as HTMLElement).focus();
      }
    });
  };
  
  // Import events from JSON file
  const handleImportEvents = async (file: File) => {
    try {
      const fileContent = await file.text();
      const importedEvents = JSON.parse(fileContent);
      
      if (!Array.isArray(importedEvents)) {
        throw new Error("Invalid file format");
      }
      
      // Process imported events (convert date strings to Date objects)
      const processedEvents = importedEvents.map((event: any) => ({
        ...event,
        date: new Date(event.date),
      }));
      
      // Update the database with imported events
      for (const event of processedEvents) {
        const { id, ...eventData } = event;
        
        await supabase
          .from('academic_events')
          .upsert({
            ...eventData,
            user_id: user?.id,
          });
      }
      
      // Refresh events
      fetchEvents();
      
      toast({
        title: "Import Successful",
        description: `Imported ${processedEvents.length} events`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error importing events:', error);
      toast({
        title: "Import Failed",
        description: "Could not import events. Please check file format.",
        variant: "destructive",
      });
    }
  };
  
  // Modify the delete process to show confirmation dialog
  const handleDelete = () => {
    setConfirmDeleteOpen(true);
  };
  
  // Modify the event dialog to include time field
  const renderTimeField = () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="grid gap-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={newEvent.date instanceof Date ? format(newEvent.date, "yyyy-MM-dd") : ""}
          onChange={(e) => {
            if (e.target.value) {
              handleNewEventChange("date", new Date(e.target.value));
            }
          }}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="time">Time (optional)</Label>
        <Input
          id="time"
          type="time"
          value={newEvent.time || ""}
          onChange={(e) => handleNewEventChange("time", e.target.value)}
        />
      </div>
    </div>
  );
  
  // Add this at the end of the component (before the return)
  // Confirmation dialog for deletion
  const renderConfirmationDialog = () => (
    <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
      <DialogContent className="bg-gradient-to-br from-rose-950 to-pink-950 border-rose-500/30 text-white sm:max-w-[400px] shadow-[0_10px_50px_rgba(244,63,94,0.25)]">
        <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] opacity-5 pointer-events-none"></div>
        <DialogHeader>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
            <DialogTitle className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-rose-200 to-pink-200">
              Confirm Deletion
            </DialogTitle>
          </motion.div>
          <DialogDescription className="text-rose-300/70">
            Are you sure you want to delete this event? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <motion.div 
          className="py-3 px-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {editingEvent && (
            <div className="bg-rose-900/30 backdrop-blur-sm p-4 rounded-lg border border-rose-500/30 shadow-inner">
              <h4 className="font-medium text-white">{editingEvent.title}</h4>
              <div className="flex items-center gap-2 text-sm text-rose-300/80 mt-2">
                <Clock className="h-4 w-4" />
                <div>
                  {format(editingEvent.date, "PPP")}
                  {editingEvent.time && ` at ${editingEvent.time}`}
                </div>
              </div>
              {editingEvent.description && (
                <p className="text-sm text-rose-300/60 mt-2">
                  {editingEvent.description}
                </p>
              )}
            </div>
          )}
        </motion.div>
        
        <DialogFooter className="gap-2">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              variant="outline" 
              onClick={() => setConfirmDeleteOpen(false)}
              className="border-rose-600/30 hover:bg-rose-900/30 hover:text-white"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              variant="destructive"
              onClick={() => {
                if (editingEvent) {
                  handleDeleteEvent(editingEvent.id);
                  setConfirmDeleteOpen(false);
                }
              }}
              className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-lg shadow-rose-500/20"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Event
            </Button>
          </motion.div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
  
  return (
    <div className="w-full h-screen bg-black/90 p-4">
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
            <CalendarIcon className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-white">Calendar</h1>
          <div className="h-2 w-2 rounded-full bg-green-500 ml-1"></div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-md border border-gray-700">
            <div className="h-5 w-5 rounded-full bg-purple-600 flex items-center justify-center">
              <Clock className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm text-gray-300">Last sync: Just now</span>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-md border border-gray-700">
            <div className="h-5 w-5 rounded-full bg-amber-600 flex items-center justify-center relative">
              <AlertCircle className="h-3 w-3 text-white" />
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border border-black"></div>
            </div>
            <span className="text-sm text-amber-400">3 Alerts</span>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-md border border-gray-700">
            <div className="h-5 w-5 rounded-full bg-teal-600 flex items-center justify-center">
              <CalendarDays className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm text-teal-400">4/15/2025</span>
          </div>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-4 h-[calc(100vh-120px)]">
        {/* Left panel - Academic Calendar */}
        <div className="bg-indigo-950/30 backdrop-blur-sm rounded-xl border border-indigo-600/20 p-4 flex flex-col h-full overflow-hidden">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-12 w-12 rounded-full bg-indigo-600/80 flex items-center justify-center">
              <CalendarIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Academic Calendar</h2>
              <p className="text-sm text-indigo-300">Organize your academic schedule with style</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Input
                type="text"
                placeholder="Search events..."
                className="w-60 bg-indigo-950/50 border-indigo-600/30 text-white placeholder:text-indigo-300/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-indigo-950/50 border-indigo-600/30 text-white"
                onClick={() => fileInputRef.current?.click()}
              >
                <Download className="h-4 w-4 mr-1.5" /> Export
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-indigo-950/50 border-indigo-600/30 text-white"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-1.5" /> Import
              </Button>
              <Select value={currentView} onValueChange={(value: "month" | "list") => setCurrentView(value)}>
                <SelectTrigger className="w-[130px] bg-indigo-950/50 border-indigo-600/30 text-white">
                  <SelectValue placeholder="Month View" />
                </SelectTrigger>
                <SelectContent className="bg-indigo-950 border-indigo-700/50 text-white">
                  <SelectItem value="month">Month View</SelectItem>
                  <SelectItem value="list">List View</SelectItem>
                </SelectContent>
              </Select>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".json"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImportEvents(file);
                  }
                  e.target.value = '';
                }}
              />
            </div>
          </div>
          
          <div className="bg-indigo-950/30 backdrop-blur-sm rounded-xl border border-indigo-600/30 p-4 flex-grow">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="h-12 w-12 rounded-full border-4 border-indigo-600/30 border-t-indigo-600 animate-spin"></div>
              </div>
            ) : (
              <div className="h-full">
                <div className="flex items-center justify-between mb-4">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="border-indigo-700/30 bg-indigo-900/30 hover:bg-indigo-800/50 text-white rounded-full h-8 w-8"
                    onClick={handlePreviousMonth}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <h2 className="text-lg font-semibold text-white px-4 py-1 rounded-full bg-indigo-900/40 border border-indigo-600/30">
                    {format(selectedMonth, "MMMM yyyy")}
                  </h2>
                  
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="border-indigo-700/30 bg-indigo-900/30 hover:bg-indigo-800/50 text-white rounded-full h-8 w-8"
                    onClick={handleNextMonth}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  month={selectedMonth}
                  onMonthChange={setSelectedMonth}
                  className="w-full bg-transparent"
                  classNames={{
                    months: "flex flex-col",
                    month: "",
                    caption: "hidden",
                    caption_label: "hidden",
                    nav: "hidden",
                    nav_button: "hidden",
                    nav_button_previous: "hidden",
                    nav_button_next: "hidden",
                    table: "w-full",
                    head_row: "flex w-full bg-indigo-950/50 rounded-md mb-1",
                    head_cell: "text-indigo-300 uppercase text-xs w-full h-8 flex items-center justify-center font-semibold",
                    row: "flex w-full mt-1",
                    cell: "text-center h-9 w-full p-0 relative focus-within:relative focus-within:z-20",
                    day: "h-9 w-9 p-0 mx-auto font-medium rounded-full flex items-center justify-center hover:bg-indigo-600/40 hover:text-white transition-colors",
                    day_today: "bg-indigo-700/40 text-white font-bold",
                    day_selected: "bg-indigo-600 text-white hover:bg-indigo-700",
                    day_outside: "text-indigo-500/40 opacity-50",
                    day_disabled: "text-indigo-500/30 opacity-30",
                    day_range_middle: "aria-selected:bg-indigo-800/20 aria-selected:text-indigo-100",
                    day_hidden: "invisible",
                  }}
                  components={{
                    DayContent: (props) => {
                      const day = props.date;
                      const dayEvents = getEventsForDate(day);
                      
                      return (
                        <div className="relative flex flex-col items-center justify-center w-full h-full">
                          <span className={cn("text-base", 
                            props.date.getMonth() === selectedMonth.getMonth() 
                              ? "text-white" 
                              : "text-indigo-500/50"
                          )}>
                            {format(props.date, "d")}
                          </span>
                          
                          {dayEvents.length > 0 && (
                            <div className="absolute -bottom-1 flex gap-0.5">
                              {dayEvents.length > 2 ? (
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                              ) : (
                                dayEvents.map((_, i) => (
                                  <div
                                    key={i}
                                    className="w-1 h-1 rounded-full bg-indigo-500"
                                  />
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      );
                    },
                  }}
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Middle panel - Upcoming Events */}
        <div className="bg-indigo-950/30 backdrop-blur-sm rounded-xl border border-indigo-600/20 p-4 flex flex-col h-full overflow-hidden">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-12 w-12 rounded-full bg-indigo-600/80 flex items-center justify-center">
              <CalendarDays className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Upcoming Events</h2>
              <p className="text-sm text-indigo-300">Your next academic deadlines</p>
            </div>
          </div>
          
          <div className="flex-grow overflow-hidden bg-indigo-950/30 backdrop-blur-sm rounded-xl border border-indigo-600/30 p-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="h-12 w-12 rounded-full border-4 border-indigo-600/30 border-t-indigo-600 animate-spin"></div>
              </div>
            ) : groupedEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="h-20 w-20 rounded-full bg-indigo-900/30 border border-indigo-500/30 flex items-center justify-center mb-6">
                  <CalendarDays className="h-10 w-10 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-indigo-300 mb-2">No upcoming events</h3>
                <p className="text-indigo-400/70 max-w-md mb-6">Your academic calendar is empty. Add events to keep track of important deadlines and expenses.</p>
                <Button
                  onClick={() => setIsAddEventOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Your First Event
                </Button>
              </div>
            ) : (
              <div className="h-full space-y-4">
                {groupedEvents.map(([dateKey, dayEvents]) => {
                  const isToday = dateKey === today;
                  const isTomorrow = dateKey === tomorrow;
                  
                  return (
                    <div key={dateKey} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shadow-md ${
                          isToday 
                            ? "bg-indigo-600 text-white" 
                            : "bg-indigo-900/50 text-indigo-300 border border-indigo-500/30"
                        }`}>
                          <span className="text-xs font-medium">{format(new Date(dateKey), "MMM")}</span>
                          <span className="text-lg font-bold leading-none">{format(new Date(dateKey), "dd")}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {isToday 
                              ? "Today" 
                              : isTomorrow 
                                ? "Tomorrow" 
                                : format(new Date(dateKey), "EEEE, MMMM d")}
                          </h3>
                          <p className="text-sm text-indigo-300">
                            {dayEvents.length} {dayEvents.length === 1 ? "event" : "events"} scheduled
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 ml-12">
                        {dayEvents.map((event) => {
                          const category = EVENT_TYPES[event.type];
                          return (
                            <div
                              key={event.id}
                              className="p-3 rounded-lg bg-indigo-900/40 border border-indigo-600/30 hover:border-indigo-500/70 transition-colors group relative"
                            >
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 text-indigo-400 hover:text-white hover:bg-indigo-700/50 rounded-full"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="w-40 bg-gray-950 border-indigo-500/30"
                                  >
                                    <DropdownMenuItem
                                      onClick={() => handleEditEvent(event)}
                                      className="text-white hover:bg-indigo-900/70"
                                    >
                                      <Edit className="mr-2 h-4 w-4 text-indigo-400" /> Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setEditingEvent(event);
                                        setConfirmDeleteOpen(true);
                                      }}
                                      className="text-rose-400 hover:text-rose-300 hover:bg-rose-900/40"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleAddToExpenses(event)}
                                      className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/40"
                                    >
                                      <CircleDollarSign className="mr-2 h-4 w-4" /> Add to Expenses
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              
                              <div className="flex items-start gap-3">
                                <div
                                  className="w-10 h-10 rounded-full flex items-center justify-center"
                                  style={{
                                    background: `linear-gradient(135deg, ${category.gradient.split(' ')[1].replace('to-', '')}, ${category.gradient.split(' ')[0].replace('from-', '')})`,
                                  }}
                                >
                                  {React.cloneElement(category.icon as React.ReactElement, { className: "h-5 w-5 text-white" })}
                                </div>
                                
                                <div className="space-y-1 flex-1 pr-8">
                                  <h4 className="font-medium text-white">{event.title}</h4>
                                  
                                  <div className="flex flex-wrap gap-2">
                                    <div className="flex items-center text-xs text-indigo-300">
                                      <Clock className="mr-1 h-3 w-3" />
                                      {event.time ? format(new Date(`${format(event.date, "yyyy-MM-dd")}T${event.time}`), "h:mm a") : "All day"}
                                    </div>
                                    
                                    {event.estimatedExpense > 0 && (
                                      <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 px-1.5 py-0 text-xs">
                                        <CircleDollarSign className="h-3 w-3 mr-1" /> {formatCurrency(event.estimatedExpense, currency)}
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  {event.description && (
                                    <p className="text-xs text-indigo-300/80 mt-1">
                                      {event.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                
                <div className="mt-4 flex justify-center pt-2">
                  <Button
                    onClick={() => setIsAddEventOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add New Event
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Right panel - Academic Insights */}
        <div className="bg-purple-950/30 backdrop-blur-sm rounded-xl border border-purple-600/20 p-4 flex flex-col h-full overflow-hidden">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-12 w-12 rounded-full bg-purple-600/80 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Academic Insights</h2>
              <p className="text-sm text-purple-300">Analytics & Statistics</p>
            </div>
          </div>
          
          <div className="space-y-4 flex-grow">
            {/* Summary Card */}
            <div className="bg-purple-950/30 backdrop-blur-sm rounded-xl border border-purple-600/30 p-4">
              <h3 className="text-lg font-semibold text-purple-200 mb-3 flex items-center">
                <GraduationCap className="h-5 w-5 mr-2 text-purple-300" />
                Summary
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-purple-300/80">Total Academic Events</span>
                  <span className="text-white font-medium">{events.length}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-purple-300/80">Upcoming Events</span>
                  <Badge className="bg-purple-600/30 text-purple-200 border-purple-500/30">
                    {upcomingEventCount}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-purple-300/80">Total Estimated Costs</span>
                  <span className="text-white font-medium">{formatCurrency(totalAcademicExpenses, currency)}</span>
                </div>
                
                {mostExpensiveMonth && (
                  <div className="flex justify-between items-center">
                    <span className="text-purple-300/80">Highest Expense Month</span>
                    <Badge className="bg-indigo-600/30 text-indigo-200 border-indigo-500/30">
                      {mostExpensiveMonth}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
            
            {/* Expense Categories */}
            <div className="bg-purple-950/30 backdrop-blur-sm rounded-xl border border-purple-600/30 p-4">
              <h3 className="text-lg font-semibold text-purple-200 mb-3 flex items-center">
                <CircleDollarSign className="h-5 w-5 mr-2 text-purple-300" />
                Expense Distribution
              </h3>
              
              <div className="space-y-3">
                {Object.entries(expensesByCategory)
                  .filter(([_, amount]) => amount > 0)
                  .sort(([_, a], [__, b]) => b - a)
                  .map(([type, amount]) => {
                    const category = EVENT_TYPES[type as EventType];
                    const percentage = totalAcademicExpenses > 0 
                      ? Math.round((amount / totalAcademicExpenses) * 100) 
                      : 0;
                    
                    return (
                      <div key={type} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center mr-2"
                              style={{
                                background: `linear-gradient(135deg, ${category.gradient.split(' ')[1].replace('to-', '')}, ${category.gradient.split(' ')[0].replace('from-', '')})`,
                              }}
                            >
                              {React.cloneElement(category.icon as React.ReactElement, { className: "h-3.5 w-3.5 text-white" })}
                            </div>
                            <span className="text-purple-200">{category.label}</span>
                          </div>
                          <span className="text-white font-medium">{formatCurrency(amount, currency)}</span>
                        </div>
                        
                        <div className="w-full bg-purple-950/80 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full rounded-full"
                            style={{
                              background: `linear-gradient(90deg, ${category.gradient.split(' ')[1].replace('to-', '')}, ${category.gradient.split(' ')[0].replace('from-', '')})`,
                              width: `${percentage}%`
                            }}
                          />
                        </div>
                        
                        <div className="text-right text-xs text-purple-300/70">
                          {percentage}% of total
                        </div>
                      </div>
                    );
                  })}
                  
                {Object.values(expensesByCategory).every(v => v === 0) && (
                  <div className="text-center py-6 text-purple-300/60">
                    No expenses recorded yet
                  </div>
                )}
              </div>
            </div>
            
            {/* Calendar Tips */}
            <div className="bg-purple-950/30 backdrop-blur-sm rounded-xl border border-purple-600/30 p-4">
              <h3 className="text-lg font-semibold text-purple-200 mb-3 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-purple-300" />
                Calendar Tips
              </h3>
              
              <ul className="space-y-2 text-sm text-purple-200/80">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Add estimated expenses to track your budget throughout the academic year</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Set recurring events for regular payments like tuition or housing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Export your calendar to share with classmates or family</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Click "Add to Expenses" to automatically create expense entries</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add/Edit Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="bg-gradient-to-br from-indigo-950 via-violet-950 to-purple-950 border border-indigo-500/30 sm:max-w-md shadow-[0_10px_50px_rgba(125,99,228,0.3)]">
          <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] opacity-5 pointer-events-none"></div>
          <DialogHeader>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3"
            >
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                {editingEvent ? (
                  <Edit className="h-5 w-5 text-white" />
                ) : (
                  <Plus className="h-5 w-5 text-white" />
                )}
              </div>
              <DialogTitle className="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
                {editingEvent ? "Edit Event" : "Add Academic Event"}
              </DialogTitle>
            </motion.div>
            <DialogDescription className="text-indigo-300/70 mt-2">
              {editingEvent 
                ? "Update details for this academic calendar event" 
                : "Add important academic deadlines and associated expenses"
              }
            </DialogDescription>
          </DialogHeader>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-5 py-4"
          >
            <motion.div variants={slideUp} className="space-y-2">
              <Label htmlFor="title" className="text-indigo-200 font-medium">Event Title</Label>
              <Input
                id="title"
                value={newEvent.title}
                onChange={(e) => handleNewEventChange("title", e.target.value)}
                placeholder="e.g., Fall Tuition Payment"
                className="bg-indigo-900/40 border-indigo-600/30 text-white placeholder:text-indigo-300/50 focus:border-indigo-500 focus:ring-indigo-500/40"
                disabled={isLoading}
              />
            </motion.div>
            
            <div className="grid grid-cols-2 gap-4">
              <motion.div variants={slideUp} className="space-y-2">
                <Label htmlFor="event-date" className="text-indigo-200 font-medium">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-indigo-900/40 border-indigo-600/30 text-white hover:bg-indigo-800/50"
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-indigo-300" />
                      {newEvent.date ? format(newEvent.date, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-indigo-950 border border-indigo-700/50">
                    <CalendarComponent
                      mode="single"
                      selected={newEvent.date}
                      onSelect={(date) => handleNewEventChange("date", date)}
                      initialFocus
                      classNames={{
                        day_today: "bg-indigo-900/30 text-indigo-300 border border-indigo-500/30 font-medium",
                        day_selected: "bg-gradient-to-br from-indigo-600 to-purple-600 text-white hover:bg-indigo-700 hover:text-white focus:bg-indigo-700 focus:text-white font-medium shadow-md shadow-indigo-500/20",
                        day: "h-10 w-10 p-0 font-normal hover:bg-indigo-800/50 hover:text-white bg-indigo-900/20",
                        head_cell: "text-indigo-300 font-medium text-[0.9rem] h-10 w-10 flex items-center justify-center",
                        caption: "flex justify-center pt-1 relative items-center px-8 py-2 mb-2 rounded-md bg-indigo-900/40 text-white",
                        nav_button: "h-8 w-8 bg-indigo-900/40 border border-indigo-600/30 p-0 opacity-80 hover:opacity-100 hover:bg-indigo-800/50",
                        head_row: "flex bg-indigo-900/30 rounded-t-md",
                        row: "flex w-full mt-0 border-t border-indigo-700/20",
                        cell: "relative p-0 text-center border-r border-indigo-700/20 last:border-r-0 text-white",
                        table: "w-full border-collapse border border-indigo-700/20 rounded-md overflow-hidden"
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </motion.div>
              
              <motion.div variants={slideUp} className="space-y-2">
                <Label htmlFor="time" className="text-indigo-200 font-medium">Time (Optional)</Label>
                <Input
                  id="time"
                  type="time"
                  value={newEvent.time || ""}
                  onChange={(e) => handleNewEventChange("time", e.target.value)}
                  className="bg-indigo-900/40 border-indigo-600/30 text-white focus:border-indigo-500 focus:ring-indigo-500/40"
                />
              </motion.div>
            </div>
            
            <motion.div variants={slideUp} className="space-y-2">
              <Label htmlFor="event-type" className="text-indigo-200 font-medium">Event Type</Label>
              <Select
                value={newEvent.type as string}
                onValueChange={(value) => handleNewEventChange("type", value as EventType)}
                disabled={isLoading}
              >
                <SelectTrigger className="bg-indigo-900/40 border-indigo-600/30 text-white">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent className="bg-indigo-950 border-indigo-700/50 text-white">
                  {Object.entries(EVENT_TYPES).map(([value, { label, icon, gradient }]) => (
                    <SelectItem 
                      key={value} 
                      value={value} 
                      className="cursor-pointer focus:bg-indigo-900/50 focus:text-white"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-6 w-6 rounded-full flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, ${gradient.split(' ')[1].replace('to-', '')}, ${gradient.split(' ')[0].replace('from-', '')})`,
                          }}
                        >
                          {React.cloneElement(icon as React.ReactElement, { className: "h-3.5 w-3.5 text-white" })}
                        </div>
                        <span>{label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
            
            <motion.div variants={slideUp} className="space-y-2">
              <Label htmlFor="estimated-expense" className="text-indigo-200 font-medium">Estimated Expense ({currency.symbol})</Label>
              <Input
                id="estimated-expense"
                type="number"
                value={newEvent.estimatedExpense}
                onChange={(e) => handleNewEventChange("estimatedExpense", parseFloat(e.target.value))}
                placeholder="0.00"
                className="bg-indigo-900/40 border-indigo-600/30 text-white placeholder:text-indigo-300/50 focus:border-indigo-500 focus:ring-indigo-500/40"
                disabled={isLoading}
              />
            </motion.div>
            
            <motion.div variants={slideUp} className="space-y-2">
              <Label htmlFor="description" className="text-indigo-200 font-medium">Description (Optional)</Label>
              <Input
                id="description"
                value={newEvent.description}
                onChange={(e) => handleNewEventChange("description", e.target.value)}
                placeholder="Add details about this event"
                className="bg-indigo-900/40 border-indigo-600/30 text-white placeholder:text-indigo-300/50 focus:border-indigo-500 focus:ring-indigo-500/40"
                disabled={isLoading}
              />
            </motion.div>
            
            <motion.div variants={slideUp} className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is-recurring"
                  checked={newEvent.isRecurring}
                  onChange={(e) => handleNewEventChange("isRecurring", e.target.checked)}
                  className="rounded border-indigo-600 bg-indigo-900/40 text-indigo-500 focus:ring-indigo-500/40"
                  disabled={isLoading}
                />
                <Label htmlFor="is-recurring" className="text-indigo-200 cursor-pointer">
                  Recurring Event
                </Label>
              </div>
            </motion.div>

            {newEvent.isRecurring && (
              <motion.div 
                variants={slideUp}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <Label htmlFor="recurring-frequency" className="text-indigo-200 font-medium">Frequency</Label>
                <Select
                  value={newEvent.recurringFrequency}
                  onValueChange={(value) => handleNewEventChange("recurringFrequency", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="bg-indigo-900/40 border-indigo-600/30 text-white">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent className="bg-indigo-950 border-indigo-700/50 text-white">
                    <SelectItem value="weekly" className="focus:bg-indigo-900/50 focus:text-white">Weekly</SelectItem>
                    <SelectItem value="monthly" className="focus:bg-indigo-900/50 focus:text-white">Monthly</SelectItem>
                    <SelectItem value="semester" className="focus:bg-indigo-900/50 focus:text-white">Each Semester</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            )}
          </motion.div>
          
          <DialogFooter className="pt-2">
            <div className="flex flex-col-reverse sm:flex-row gap-2 justify-between w-full">
              {editingEvent && (
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    onClick={() => setConfirmDeleteOpen(true)}
                    className="w-full sm:w-auto border-rose-500/30 bg-rose-950/30 hover:bg-rose-900/40 text-rose-300"
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Event
                  </Button>
                </motion.div>
              )}
              
              <div className="flex gap-2 w-full sm:w-auto">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddEventOpen(false);
                      setEditingEvent(null);
                      setNewEvent({
                        title: "",
                        date: new Date(),
                        description: "",
                        type: "other",
                        estimatedExpense: 0,
                        isRecurring: false
                      });
                    }}
                    className="w-full border-indigo-600/30 hover:bg-indigo-800/40 text-white"
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto"
                >
                  <Button
                    onClick={handleAddEvent}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-none shadow-lg shadow-indigo-500/20"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {editingEvent ? "Updating..." : "Adding..."}
                      </>
                    ) : (
                      <>
                        {editingEvent ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-2" /> Update Event
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" /> Add Event
                          </>
                        )}
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      {renderConfirmationDialog()}
    </div>
  );
};

export default AcademicCalendar; 