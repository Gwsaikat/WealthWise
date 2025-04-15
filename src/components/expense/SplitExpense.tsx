import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Plus,
  Trash2,
  Edit,
  Save,
  User,
  DollarSign,
  Hash,
  Check,
  X,
  Share2,
  Send,
  Calculator,
  Divide,
  TrendingUp,
  TrendingDown,
  Calendar,
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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "../ui/use-toast";
import { useAuth } from "../../context/AuthContext";
import { formatCurrency } from "../../lib/utils";
import { useUser } from "../../context/UserContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Alert, AlertDescription } from "../ui/alert";
import { Skeleton } from "../ui/skeleton";

interface Contact {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface SplitExpense {
  id: string;
  title: string;
  amount: number;
  date: Date;
  paidBy: string;
  splitWith: SplitParticipant[];
  settled: boolean;
  category: string;
}

interface SplitParticipant {
  contactId: string;
  amount: number;
  settled: boolean;
}

interface GroupData {
  id: string;
  name: string;
  members: string[];
  totalExpenses: number;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
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

const tabVariants = {
  inactive: { opacity: 0.7, y: 0 },
  active: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

const SplitExpenseTracker = () => {
  const { user } = useAuth();
  const { currency } = useUser();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("expenses");
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  
  // Sample data
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [splitExpenses, setSplitExpenses] = useState<SplitExpense[]>([]);
  const [groups, setGroups] = useState<GroupData[]>([]);
  
  // New expense form state
  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: "",
    category: "Other",
    paidBy: "me",
    splitType: "equal",
    date: new Date(),
    splitWith: [] as { contactId: string; amount: string; }[],
  });
  
  // New contact form state
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
  });
  
  // New group form state
  const [newGroup, setNewGroup] = useState({
    name: "",
    members: [] as string[],
  });
  
  // Fetch user data on component mount
  useEffect(() => {
    if (user) {
      fetchUserSplitData();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Simulate fetching user split expense data from a database
  const fetchUserSplitData = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call to get the user's split expense data
      // For now, we'll simulate a delay and check if user has data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate checking if this is a new user without split expense data
      // In a real app, this would be determined by the response from the API
      const hasExistingData = Math.random() > 0.7; // Randomly decide for demo
      
      if (hasExistingData) {
        // For existing users, populate with some sample data
        // In a real app, this would come from the database
        setContacts([
          { id: "1", name: "Alex Johnson", email: "alex@example.com" },
          { id: "2", name: "Sam Williams", email: "sam@example.com" },
        ]);
        
        setSplitExpenses([
          {
            id: "1",
            title: "Apartment Rent",
            amount: 1200,
            date: new Date(),
            paidBy: "me",
            splitWith: [
              { contactId: "1", amount: 400, settled: false },
              { contactId: "2", amount: 400, settled: true },
            ],
            settled: false,
            category: "Housing"
          }
        ]);
        
        setGroups([
          {
            id: "1",
            name: "Apartment",
            members: ["1", "2"],
            totalExpenses: 1200
          }
        ]);
        
        setIsNewUser(false);
      } else {
        // For new users, set empty arrays
        setContacts([]);
        setSplitExpenses([]);
        setGroups([]);
        setIsNewUser(true);
        
        // Show welcome toast for new users
        toast({
          title: "Welcome to Split Expenses!",
          description: "Get started by adding contacts to split expenses with.",
        });
      }
    } catch (error) {
      console.error("Error fetching split expense data:", error);
      toast({
        title: "Error",
        description: "Failed to load your split expense data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate total owed
  const getTotalOwed = (): number => {
    return splitExpenses
      .filter(expense => !expense.settled)
      .reduce((total, expense) => {
        if (expense.paidBy === "me") {
          // Others owe me
          const owedToMe = expense.splitWith.reduce(
            (sum, split) => sum + (split.settled ? 0 : split.amount),
            0
          );
          return total + owedToMe;
        } else {
          // I owe others
          const myShare = expense.splitWith.find(split => split.contactId === "me");
          return total - (myShare && !myShare.settled ? myShare.amount : 0);
        }
      }, 0);
  };
  
  // Function to get contact name by ID
  const getContactName = (id: string): string => {
    if (id === "me") return "You";
    const contact = contacts.find(c => c.id === id);
    return contact ? contact.name : "Unknown";
  };
  
  // Handle new expense form change
  const handleExpenseFormChange = (field: string, value: any) => {
    if (field === "splitWith") {
      setNewExpense({ ...newExpense, splitWith: value });
    } else if (field === "amount" && newExpense.splitType === "equal" && value) {
      // Recalculate split amounts when total amount changes
      const selectedContacts = newExpense.splitWith.map(sw => sw.contactId);
      const numPeople = selectedContacts.length + 1; // +1 for the current user
      const splitAmount = (parseFloat(value) / numPeople).toFixed(2);
      
      const updatedSplits = selectedContacts.map(contactId => ({
        contactId,
        amount: splitAmount,
      }));
      
      setNewExpense({
        ...newExpense,
        amount: value,
        splitWith: updatedSplits,
      });
    } else {
      setNewExpense({ ...newExpense, [field]: value });
    }
  };
  
  // Handle contact selection for splitting
  const handleContactSelection = (contactId: string, isSelected: boolean) => {
    let updatedSplits = [...newExpense.splitWith];
    
    if (isSelected) {
      // Add contact to splits
      if (newExpense.splitType === "equal" && newExpense.amount) {
        const numPeople = updatedSplits.length + 2; // +2 for the new contact and the current user
        const splitAmount = (parseFloat(newExpense.amount) / numPeople).toFixed(2);
        
        // Update all existing splits with the new amount
        updatedSplits = updatedSplits.map(split => ({
          ...split,
          amount: splitAmount,
        }));
        
        // Add the new contact
        updatedSplits.push({
          contactId,
          amount: splitAmount,
        });
      } else {
        // For custom splits, add with zero amount initially
        updatedSplits.push({
          contactId,
          amount: "0",
        });
      }
    } else {
      // Remove contact from splits
      updatedSplits = updatedSplits.filter(split => split.contactId !== contactId);
      
      // Recalculate equal splits if needed
      if (newExpense.splitType === "equal" && newExpense.amount && updatedSplits.length > 0) {
        const numPeople = updatedSplits.length + 1; // +1 for the current user
        const splitAmount = (parseFloat(newExpense.amount) / numPeople).toFixed(2);
        
        updatedSplits = updatedSplits.map(split => ({
          ...split,
          amount: splitAmount,
        }));
      }
    }
    
    setNewExpense({ ...newExpense, splitWith: updatedSplits });
  };
  
  // Add a new expense
  const handleAddExpense = () => {
    if (!newExpense.title || !newExpense.amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Convert string amounts to numbers for storage
    const splitWith = newExpense.splitWith.map(split => ({
      contactId: split.contactId,
      amount: parseFloat(split.amount),
      settled: false
    }));
    
    const newSplitExpense: SplitExpense = {
      id: Date.now().toString(),
      title: newExpense.title,
      amount: parseFloat(newExpense.amount),
      date: newExpense.date,
      paidBy: newExpense.paidBy,
      splitWith,
      settled: false,
      category: newExpense.category
    };
    
    setSplitExpenses([newSplitExpense, ...splitExpenses]);
    
    // Reset form
    setNewExpense({
      title: "",
      amount: "",
      category: "Other",
      paidBy: "me",
      splitType: "equal",
      date: new Date(),
      splitWith: [],
    });
    
    setIsAddExpenseOpen(false);
    
    toast({
      title: "Expense Added",
      description: "Split expense has been added successfully"
    });
  };
  
  // Add a new contact
  const handleAddContact = () => {
    if (!newContact.name || !newContact.email) {
      toast({
        title: "Missing Information",
        description: "Please provide a name and email",
        variant: "destructive"
      });
      return;
    }
    
    const newContactObj: Contact = {
      id: Date.now().toString(),
      name: newContact.name,
      email: newContact.email
    };
    
    setContacts([...contacts, newContactObj]);
    
    // Reset form
    setNewContact({
      name: "",
      email: ""
    });
    
    setIsAddContactOpen(false);
    
    toast({
      title: "Contact Added",
      description: "New contact has been added successfully"
    });
  };
  
  // Mark expense as settled
  const handleSettleExpense = (expenseId: string) => {
    setSplitExpenses(
      splitExpenses.map(expense => 
        expense.id === expenseId 
          ? { ...expense, settled: true, splitWith: expense.splitWith.map(split => ({ ...split, settled: true })) } 
          : expense
      )
    );
    
    toast({
      title: "Expense Settled",
      description: "The expense has been marked as fully settled"
    });
  };
  
  // Mark individual share as settled
  const handleSettleShare = (expenseId: string, contactId: string) => {
    setSplitExpenses(
      splitExpenses.map(expense => {
        if (expense.id === expenseId) {
          const updatedSplits = expense.splitWith.map(split =>
            split.contactId === contactId ? { ...split, settled: true } : split
          );
          
          // Check if all shares are settled
          const allSettled = updatedSplits.every(split => split.settled);
          
          return {
            ...expense,
            splitWith: updatedSplits,
            settled: allSettled
          };
        }
        return expense;
      })
    );
    
    toast({
      title: "Share Settled",
      description: `Share for ${getContactName(contactId)} has been settled`
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-gray-800/40 backdrop-blur-xl rounded-xl border border-gray-700/50 shadow-lg shadow-black/20 p-6 h-full"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center">
          <div className="mr-3 p-2 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-600/20">
            <motion.div
              initial={{ scale: 0.9, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Share2 className="h-5 w-5 text-purple-400" />
            </motion.div>
          </div>
          <div>
            <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-400">
              Split Expenses
            </h2>
            <p className="text-sm text-gray-400">Track and manage shared expenses with others</p>
          </div>
        </div>
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex-shrink-0"
        >
          <Button 
            onClick={() => setIsAddExpenseOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white hover:shadow-lg hover:shadow-purple-900/20 transition-all duration-300 border border-purple-500/20"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Split Expense
          </Button>
        </motion.div>
      </div>

      <Tabs
        defaultValue="expenses"
        className="w-full"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <div className="border-b border-gray-700/50 mb-4">
          <TabsList className="flex h-auto p-0 bg-transparent space-x-6">
            <motion.div
              animate={activeTab === "expenses" ? "active" : "inactive"}
              variants={tabVariants}
            >
              <TabsTrigger 
                value="expenses" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-purple-500 text-gray-400 border-b-2 border-transparent px-2 py-2 font-medium transition-all duration-200"
              >
                Expenses
              </TabsTrigger>
            </motion.div>
            <motion.div
              animate={activeTab === "contacts" ? "active" : "inactive"}
              variants={tabVariants}
            >
              <TabsTrigger 
                value="contacts" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-purple-500 text-gray-400 border-b-2 border-transparent px-2 py-2 font-medium transition-all duration-200"
              >
                Contacts
              </TabsTrigger>
            </motion.div>
            <motion.div
              animate={activeTab === "groups" ? "active" : "inactive"}
              variants={tabVariants}
            >
              <TabsTrigger 
                value="groups" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-purple-500 text-gray-400 border-b-2 border-transparent px-2 py-2 font-medium transition-all duration-200"
              >
                Groups
              </TabsTrigger>
            </motion.div>
          </TabsList>
        </div>

        <TabsContent value="expenses" className="space-y-6 mt-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 rounded-xl bg-gray-800/30 border border-gray-700/50 backdrop-blur-sm animate-pulse">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-2/3">
                      <div className="h-6 bg-gray-700/50 rounded w-1/3 mb-4"></div>
                      <div className="h-4 bg-gray-700/50 rounded w-2/3 mb-2"></div>
                      <div className="h-4 bg-gray-700/50 rounded w-1/2"></div>
                    </div>
                    <div className="w-full md:w-1/3">
                      <div className="h-10 bg-gray-700/50 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : splitExpenses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [20, 0] }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <motion.div
                className="relative mb-6"
                animate={{
                  y: [0, -10, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="absolute inset-0 rounded-full bg-purple-400/10 blur-2xl"></div>
                <div className="p-6 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-600/20 backdrop-blur-sm relative z-10 border border-purple-500/20">
                  <Share2 className="h-10 w-10 text-purple-400" />
                </div>
              </motion.div>
              <h3 className="text-xl font-medium text-white mb-2">No shared expenses yet</h3>
              <p className="text-gray-400 max-w-md mb-6">
                Split expenses with roommates, friends, or travel companions and keep track of who owes what.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-2 max-w-lg">
                <motion.div
                  whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}
                  className="p-4 rounded-xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 backdrop-blur-sm w-[140px]"
                >
                  <div className="p-2 rounded-full bg-purple-500/20 inline-flex mb-3">
                    <Users className="h-5 w-5 text-purple-400" />
                  </div>
                  <h4 className="text-white font-medium mb-1">Add Contacts</h4>
                  <p className="text-xs text-gray-400">Add people you split expenses with</p>
                </motion.div>
                <motion.div
                  whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}
                  className="p-4 rounded-xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 backdrop-blur-sm w-[140px]"
                >
                  <div className="p-2 rounded-full bg-blue-500/20 inline-flex mb-3">
                    <Calculator className="h-5 w-5 text-blue-400" />
                  </div>
                  <h4 className="text-white font-medium mb-1">Create Expense</h4>
                  <p className="text-xs text-gray-400">Add a new split expense</p>
                </motion.div>
              </div>
              <Button
                onClick={() => setIsAddExpenseOpen(true)}
                className="mt-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-900/20 border border-purple-500/20"
              >
                <Plus className="h-4 w-4 mr-1" /> Create First Split
              </Button>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
                  className="p-5 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/20 backdrop-blur-sm relative overflow-hidden"
                >
                  <div className="absolute right-0 bottom-0 -mb-6 -mr-6 opacity-10">
                    <TrendingUp className="h-32 w-32 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-400">You are owed</h3>
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-bold text-green-400">
                        {formatCurrency(getTotalOwed(), currency)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">From {splitExpenses.reduce((acc, expense) => {
                      // Count unique people who owe money
                      const filtered = expense.splitWith.filter(s => !s.settled);
                      return acc + filtered.length;
                    }, 0)} people</p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
                  className="p-5 rounded-xl bg-gradient-to-br from-red-500/10 to-orange-600/10 border border-red-500/20 backdrop-blur-sm relative overflow-hidden"
                >
                  <div className="absolute right-0 bottom-0 -mb-6 -mr-6 opacity-10">
                    <TrendingDown className="h-32 w-32 text-red-500" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-400">You owe</h3>
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-bold text-red-400">
                        {formatCurrency(0.00, currency)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">To 0 people</p>
                  </div>
                </motion.div>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-5"
              >
                {splitExpenses.map((expense) => (
                  <motion.div
                    key={expense.id}
                    variants={itemVariants}
                    whileHover={{ 
                      scale: 1.01, 
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)" 
                    }}
                    className="p-5 rounded-xl bg-gray-800/40 border border-gray-700/50 backdrop-blur-sm hover:border-purple-500/20 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row gap-5">
                      <div className="flex-1">
                        <div className="flex items-center mb-4">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-600/20 flex items-center justify-center mr-3 border border-purple-500/20">
                            <DollarSign className="h-5 w-5 text-purple-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-white">{expense.title}</h3>
                            <div className="flex items-center text-xs text-gray-400">
                              <Calendar className="h-3 w-3 mr-1" />
                              {expense.date.toLocaleDateString()}
                              <Badge className="ml-2 py-0.5 bg-purple-500/20 text-purple-300 border-purple-500/20 hover:bg-purple-500/30">
                                {expense.category}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center text-sm text-gray-400 mb-2">
                            <User className="h-4 w-4 mr-1" />
                            <span>Paid by: </span>
                            <span className="text-white ml-1 font-medium">
                              {expense.paidBy === 'me' ? 'You' : getContactName(expense.paidBy)}
                            </span>
                            <span className="text-lg font-bold text-purple-400 ml-2">
                              {formatCurrency(expense.amount, currency)}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2 pl-2 border-l-2 border-gray-700/50">
                          {expense.splitWith.map((split) => (
                            <div 
                              key={split.contactId} 
                              className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-800/40 backdrop-blur-sm"
                            >
                              <div className="flex items-center gap-2">
                                <Avatar className="h-7 w-7 border border-gray-700/50">
                                  <AvatarFallback className="bg-purple-500/20 text-purple-300 text-xs">
                                    {getContactName(split.contactId).substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-gray-300">{getContactName(split.contactId)}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-white">
                                  {formatCurrency(split.amount, currency)}
                                </span>
                                {split.settled ? (
                                  <Badge className="bg-green-500/20 text-green-300 border-green-500/20">
                                    <Check className="h-3 w-3 mr-1" /> Settled
                                  </Badge>
                                ) : (
                                  <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <Button
                                      size="sm"
                                      onClick={() => handleSettleShare(expense.id, split.contactId)}
                                      variant="outline"
                                      className="py-0 h-7 text-xs border-purple-500/20 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20"
                                    >
                                      <Check className="h-3 w-3 mr-1" /> Mark Settled
                                    </Button>
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex flex-col justify-between gap-3 min-w-[120px]">
                        <div className="flex flex-row md:flex-col gap-2">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1"
                          >
                            <Button 
                              variant="outline" 
                              onClick={() => {}} 
                              className="w-full h-9 border-blue-500/20 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300"
                            >
                              <Edit className="h-3.5 w-3.5 mr-1.5" /> Edit
                            </Button>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1"
                          >
                            <Button 
                              variant="outline" 
                              onClick={() => {}} 
                              className="w-full h-9 border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-300"
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
                            </Button>
                          </motion.div>
                        </div>
                        
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button 
                            variant={expense.settled ? "outline" : "default"} 
                            onClick={() => handleSettleExpense(expense.id)} 
                            className={`w-full ${
                              expense.settled 
                                ? "border-gray-600 text-gray-400 hover:bg-gray-700/50" 
                                : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white"
                            }`}
                          >
                            {expense.settled ? "Settled" : "Settle All"}
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="contacts" className="space-y-6 mt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-white">Your Contacts</h3>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => setIsAddContactOpen(true)}
                variant="outline"
                className="border-blue-500/20 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Contact
              </Button>
            </motion.div>
          </div>
          
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-lg bg-gray-800/30 border border-gray-700/50 animate-pulse">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-700/50 mr-3"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-700/50 rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-gray-700/50 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : contacts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <motion.div
                className="inline-block mb-4 p-4 rounded-full bg-gray-800/50 border border-gray-700/50"
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
                <Users className="h-8 w-8 text-blue-400/50" />
              </motion.div>
              <h4 className="text-lg font-medium text-white mb-2">No contacts yet</h4>
              <p className="text-gray-400 max-w-md mx-auto mb-6">
                Add people you frequently split expenses with to make it easier to track shared costs.
              </p>
              <Button
                onClick={() => setIsAddContactOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Your First Contact
              </Button>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {contacts.map((contact) => (
                <motion.div
                  key={contact.id}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.01, 
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)" 
                  }}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-800/40 border border-gray-700/50 hover:border-blue-500/20 transition-all duration-300"
                >
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 border border-gray-700/50 mr-3">
                      <AvatarFallback className="bg-blue-500/20 text-blue-300">
                        {contact.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-white">{contact.name}</div>
                      <div className="text-xs text-gray-400">{contact.email}</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </TabsContent>
        
        <TabsContent value="groups" className="space-y-6 mt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-white">Your Groups</h3>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => setIsAddGroupOpen(true)}
                variant="outline"
                className="border-green-500/20 bg-green-500/10 hover:bg-green-500/20 text-green-300"
              >
                <Plus className="h-4 w-4 mr-1" /> Create Group
              </Button>
            </motion.div>
          </div>
          
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="p-5 rounded-lg bg-gray-800/30 border border-gray-700/50 animate-pulse">
                  <div className="h-5 bg-gray-700/50 rounded w-1/4 mb-3"></div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {[1, 2, 3].map(j => (
                      <div key={j} className="h-6 w-16 bg-gray-700/50 rounded-full"></div>
                    ))}
                  </div>
                  <div className="h-4 bg-gray-700/50 rounded w-1/5"></div>
                </div>
              ))}
            </div>
          ) : groups.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <motion.div
                className="inline-block mb-4 p-4 rounded-full bg-gray-800/50 border border-gray-700/50"
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
                <Users className="h-8 w-8 text-green-400/50" />
              </motion.div>
              <h4 className="text-lg font-medium text-white mb-2">No groups yet</h4>
              <p className="text-gray-400 max-w-md mx-auto mb-6">
                Create groups for roommates, trips, or projects to make splitting expenses easier.
              </p>
              <Button
                onClick={() => setIsAddGroupOpen(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white"
              >
                <Plus className="h-4 w-4 mr-1" /> Create Your First Group
              </Button>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {groups.map((group) => (
                <motion.div
                  key={group.id}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.01, 
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)" 
                  }}
                  className="p-5 rounded-xl bg-gray-800/40 border border-gray-700/50 hover:border-green-500/20 backdrop-blur-sm transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-medium text-white flex items-center">
                      <Users className="h-4 w-4 mr-2 text-green-400" />
                      {group.name}
                    </h4>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/20">
                      {formatCurrency(group.totalExpenses, currency)}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {group.members.map((memberId) => (
                      <Badge
                        key={memberId}
                        variant="outline"
                        className="bg-gray-800/60 text-gray-300 border-gray-700/50"
                      >
                        {getContactName(memberId)}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-500/20 bg-green-500/10 hover:bg-green-500/20 text-green-300"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Expense
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-700/50 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300"
                      >
                        <Users className="h-3.5 w-3.5 mr-1.5" /> View
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add new split expense dialog */}
      <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
        <DialogContent className="bg-gray-800 border border-gray-700 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Add Split Expense</DialogTitle>
            <DialogDescription className="text-gray-400">
              Create a new shared expense to split with contacts
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="expense-title" className="text-gray-300">Expense Title</Label>
              <Input
                id="expense-title"
                value={newExpense.title}
                onChange={(e) => handleExpenseFormChange("title", e.target.value)}
                placeholder="e.g., Apartment Rent"
                className="bg-gray-700/50 border-gray-600 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expense-amount" className="text-gray-300">Total Amount ({currency.symbol})</Label>
              <Input
                id="expense-amount"
                type="number"
                value={newExpense.amount}
                onChange={(e) => handleExpenseFormChange("amount", e.target.value)}
                placeholder="0.00"
                className="bg-gray-700/50 border-gray-600 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expense-category" className="text-gray-300">Category</Label>
              <Select
                value={newExpense.category}
                onValueChange={(value) => handleExpenseFormChange("category", value)}
              >
                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Housing">Housing</SelectItem>
                  <SelectItem value="Transportation">Transportation</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paid-by" className="text-gray-300">Paid By</Label>
              <Select
                value={newExpense.paidBy}
                onValueChange={(value) => handleExpenseFormChange("paidBy", value)}
              >
                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                  <SelectValue placeholder="Who paid?" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="me">You</SelectItem>
                  {contacts.map(contact => (
                    <SelectItem key={contact.id} value={contact.id}>{contact.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-gray-300">Split Type</Label>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant={newExpense.splitType === "equal" ? "default" : "outline"}
                  className={
                    newExpense.splitType === "equal"
                      ? "bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                      : "border-gray-600 text-gray-300 hover:bg-gray-700"
                  }
                  onClick={() => handleExpenseFormChange("splitType", "equal")}
                >
                  <Divide className="h-4 w-4 mr-1.5" />
                  Equal
                </Button>
                <Button
                  type="button"
                  variant={newExpense.splitType === "custom" ? "default" : "outline"}
                  className={
                    newExpense.splitType === "custom"
                      ? "bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                      : "border-gray-600 text-gray-300 hover:bg-gray-700"
                  }
                  onClick={() => handleExpenseFormChange("splitType", "custom")}
                >
                  <Calculator className="h-4 w-4 mr-1.5" />
                  Custom
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-gray-300">Split With</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {contacts.map(contact => {
                  const isSelected = newExpense.splitWith.some(
                    split => split.contactId === contact.id
                  );
                  const splitDetails = newExpense.splitWith.find(
                    split => split.contactId === contact.id
                  );
                  
                  return (
                    <div key={contact.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`contact-${contact.id}`}
                          checked={isSelected}
                          onChange={(e) => handleContactSelection(contact.id, e.target.checked)}
                          className="rounded border-gray-600 bg-gray-700 text-yellow-500 focus:ring-yellow-500"
                        />
                        <label
                          htmlFor={`contact-${contact.id}`}
                          className="ml-2 text-sm text-gray-300 cursor-pointer"
                        >
                          {contact.name}
                        </label>
                      </div>
                      
                      {isSelected && newExpense.splitType === "custom" && (
                        <Input
                          type="number"
                          value={splitDetails?.amount || ""}
                          onChange={(e) => {
                            const updatedSplits = newExpense.splitWith.map(split =>
                              split.contactId === contact.id
                                ? { ...split, amount: e.target.value }
                                : split
                            );
                            handleExpenseFormChange("splitWith", updatedSplits);
                          }}
                          className="w-24 h-8 text-sm bg-gray-700/50 border-gray-600 text-white"
                        />
                      )}
                      
                      {isSelected && newExpense.splitType === "equal" && (
                        <span className="text-sm text-gray-300">
                          {newExpense.amount
                            ? formatCurrency(
                                parseFloat(splitDetails?.amount || "0"),
                                currency
                              )
                            : "-"
                          }
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddExpenseOpen(false)}
              className="border-gray-600 hover:bg-gray-700 text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddExpense}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
            >
              Add Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Contact Dialog */}
      <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
        <DialogContent className="bg-gray-800 border border-gray-700 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Add Contact</DialogTitle>
            <DialogDescription className="text-gray-400">
              Add a new person to split expenses with
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="contact-name" className="text-gray-300">Name</Label>
              <Input
                id="contact-name"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                placeholder="Enter contact name"
                className="bg-gray-700/50 border-gray-600 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact-email" className="text-gray-300">Email</Label>
              <Input
                id="contact-email"
                type="email"
                value={newContact.email}
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                placeholder="name@example.com"
                className="bg-gray-700/50 border-gray-600 text-white"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddContactOpen(false)}
              className="border-gray-600 hover:bg-gray-700 text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddContact}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
            >
              Add Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default SplitExpenseTracker; 