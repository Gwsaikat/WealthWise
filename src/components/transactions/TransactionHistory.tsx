import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownLeft,
  FilterIcon,
  Calendar,
  Download,
  Search,
  MoreHorizontal,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { useToast } from "../ui/use-toast";
import { useAuth } from "../../context/AuthContext";
import { getTransactions } from "../../lib/database";
import type { Transaction } from "../../types/supabase";
import { format, parseISO, isToday, isYesterday, isThisWeek, isThisMonth } from "date-fns";

interface TransactionHistoryProps {
  limit?: number;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ limit = 50 }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user, limit]);

  useEffect(() => {
    // Filter transactions based on search term
    if (searchTerm.trim() === "") {
      setFilteredTransactions(transactions);
    } else {
      const lowerCaseSearch = searchTerm.toLowerCase();
      const filtered = transactions.filter((transaction) => 
        transaction.description.toLowerCase().includes(lowerCaseSearch) || 
        transaction.category.toLowerCase().includes(lowerCaseSearch)
      );
      setFilteredTransactions(filtered);
    }
  }, [searchTerm, transactions]);

  const fetchTransactions = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const fetchedTransactions = await getTransactions(user.id, limit);
      setTransactions(fetchedTransactions);
      setFilteredTransactions(fetchedTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast({
        title: "Error",
        description: "Failed to load transaction history",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      
      if (isToday(date)) {
        return "Today";
      } else if (isYesterday(date)) {
        return "Yesterday";
      } else if (isThisWeek(date)) {
        return format(date, "EEEE"); // Day name
      } else if (isThisMonth(date)) {
        return format(date, "MMM d"); // Month and day
      } else {
        return format(date, "MMM d, yyyy"); // Full date
      }
    } catch (error) {
      return dateString;
    }
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, "h:mm a"); // e.g., 3:30 PM
    } catch (error) {
      return "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 h-full"
    >
      <div className="flex flex-col space-y-4">
        <div className="flex flex-row items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Transaction History</h2>
            <p className="text-sm text-gray-400 mt-1">
              View and search your recent transactions
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="border-gray-700 bg-gray-800/30">
              <Calendar className="h-4 w-4 mr-2" /> Filter
            </Button>
            <Button variant="outline" size="sm" className="border-gray-700 bg-gray-800/30">
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-gray-700/30 border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-yellow-500"
          />
        </div>

        <div className="rounded-lg border border-gray-700 overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-10 bg-gray-800/30">
              <p className="text-gray-400">No transactions found</p>
            </div>
          ) : (
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader className="bg-gray-800/50 sticky top-0">
                  <TableRow className="hover:bg-transparent border-gray-700">
                    <TableHead className="text-gray-300 font-medium">Description</TableHead>
                    <TableHead className="text-gray-300 font-medium">Category</TableHead>
                    <TableHead className="text-gray-300 font-medium">Date & Time</TableHead>
                    <TableHead className="text-gray-300 font-medium text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow 
                      key={transaction.id} 
                      className="hover:bg-gray-700/30 border-gray-700"
                    >
                      <TableCell className="py-3">
                        <div className="flex items-center">
                          <div className={`rounded-full p-2 mr-3 ${
                            transaction.type === 'income' 
                              ? 'bg-green-500/10 text-green-400' 
                              : 'bg-red-500/10 text-red-400'
                          }`}>
                            {transaction.type === 'income' 
                              ? <ArrowUpRight className="h-4 w-4" />
                              : <ArrowDownLeft className="h-4 w-4" />
                            }
                          </div>
                          <div className="font-medium">{transaction.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-gray-700/30 text-gray-300 border-gray-600">
                          {transaction.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-gray-300">{formatDate(transaction.date)}</div>
                        <div className="text-gray-500 text-xs">{formatTime(transaction.date)}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className={`font-semibold ${
                          transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionHistory; 