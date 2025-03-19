import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  Camera,
  Plus,
  Receipt,
  ArrowRight,
  Clock,
  Filter,
  Tag,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";

interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  icon: React.ReactNode;
}

interface ExpenseTrackerProps {
  recentTransactions?: Transaction[];
}

const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({
  recentTransactions = [
    {
      id: "1",
      amount: 12.99,
      category: "Food",
      description: "Lunch at campus cafe",
      date: "2 hours ago",
      icon: <Receipt size={16} />,
    },
    {
      id: "2",
      amount: 45.5,
      category: "Books",
      description: "Economics textbook",
      date: "Yesterday",
      icon: <Receipt size={16} />,
    },
    {
      id: "3",
      amount: 8.75,
      category: "Transport",
      description: "Bus fare",
      date: "Yesterday",
      icon: <Receipt size={16} />,
    },
    {
      id: "4",
      amount: 29.99,
      category: "Entertainment",
      description: "Movie tickets",
      date: "3 days ago",
      icon: <Receipt size={16} />,
    },
    {
      id: "5",
      amount: 5.25,
      category: "Coffee",
      description: "Morning coffee",
      date: "3 days ago",
      icon: <Receipt size={16} />,
    },
  ],
}) => {
  const [activeTab, setActiveTab] = useState("voice");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  // Placeholder functions for the different input methods
  const handleVoiceCapture = () => {
    // In a real implementation, this would activate voice recognition
    alert("Voice capture activated");
  };

  const handleScanReceipt = () => {
    // In a real implementation, this would open the camera
    alert("Camera activated for receipt scanning");
  };

  const handleManualSubmit = () => {
    // In a real implementation, this would submit the expense
    alert(`Expense added: $${amount} for ${description}`);
    setAmount("");
    setDescription("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Track Expense</h2>
        <div className="text-sm text-gray-400">Quick expense entry</div>
      </div>

      <Tabs defaultValue="voice" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4 bg-gray-700/50">
          <TabsTrigger
            value="voice"
            onClick={() => setActiveTab("voice")}
            className="data-[state=active]:bg-gray-600 data-[state=active]:text-yellow-400"
          >
            <Mic className="mr-2 h-4 w-4" /> Voice
          </TabsTrigger>
          <TabsTrigger
            value="scan"
            onClick={() => setActiveTab("scan")}
            className="data-[state=active]:bg-gray-600 data-[state=active]:text-yellow-400"
          >
            <Camera className="mr-2 h-4 w-4" /> Scan
          </TabsTrigger>
          <TabsTrigger
            value="manual"
            onClick={() => setActiveTab("manual")}
            className="data-[state=active]:bg-gray-600 data-[state=active]:text-yellow-400"
          >
            <Plus className="mr-2 h-4 w-4" /> Manual
          </TabsTrigger>
        </TabsList>

        <TabsContent value="voice" className="space-y-4">
          <div className="flex flex-col items-center justify-center p-6 border border-dashed border-gray-600 rounded-lg bg-gray-700/30">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full h-20 w-20 flex items-center justify-center bg-yellow-500/20 hover:bg-yellow-500/30 border-none"
              onClick={handleVoiceCapture}
            >
              <Mic className="h-8 w-8 text-yellow-400" />
            </motion.button>
            <p className="mt-4 text-sm text-gray-300">
              Tap to speak your expense
            </p>
            <p className="text-xs text-gray-400 mt-1">
              "I spent $12 on lunch today"
            </p>
          </div>
        </TabsContent>

        <TabsContent value="scan" className="space-y-4">
          <div className="flex flex-col items-center justify-center p-6 border border-dashed border-gray-600 rounded-lg bg-gray-700/30">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full h-20 w-20 flex items-center justify-center bg-yellow-500/20 hover:bg-yellow-500/30 border-none"
              onClick={handleScanReceipt}
            >
              <Camera className="h-8 w-8 text-yellow-400" />
            </motion.button>
            <p className="mt-4 text-sm text-gray-300">Tap to scan receipt</p>
            <p className="text-xs text-gray-400 mt-1">
              Our AI will extract the details
            </p>
          </div>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <div className="space-y-3">
            <div>
              <Input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-yellow-500"
              />
            </div>
            <div>
              <Input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-yellow-500"
              />
            </div>
            <Button
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900"
              onClick={handleManualSubmit}
            >
              Add Expense
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium">Recent Transactions</h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-yellow-400 hover:text-yellow-300"
          >
            View All <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>

        <ScrollArea className="h-[180px]">
          <div className="space-y-2">
            <AnimatePresence>
              {recentTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700/50"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8 bg-yellow-500/20 border border-yellow-500/30">
                      <AvatarFallback className="text-yellow-400">
                        {transaction.icon}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {transaction.description}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className="text-xs py-0 h-5 border-gray-600 text-gray-300"
                        >
                          {transaction.category}
                        </Badge>
                        <span className="text-xs text-gray-400 flex items-center">
                          <Clock className="mr-1 h-3 w-3" /> {transaction.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="font-medium text-red-400">
                    -${transaction.amount.toFixed(2)}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </div>

      <div className="flex justify-center border-t border-gray-700 pt-4 mt-4">
        <p className="text-xs text-gray-400">
          Transactions are automatically categorized by our AI
        </p>
      </div>
    </motion.div>
  );
};

export default ExpenseTracker;
