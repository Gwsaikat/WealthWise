import React from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  LineChart,
  PieChart,
  Calendar,
  TrendingDown,
  TrendingUp,
  Info,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

interface SpendingPatternsProps {
  data?: {
    weekly: SpendingData[];
    monthly: SpendingData[];
    categories: CategoryData[];
  };
}

interface SpendingData {
  date: string;
  amount: number;
  category?: string;
}

interface CategoryData {
  category: string;
  amount: number;
  color: string;
}

const SpendingPatterns: React.FC<SpendingPatternsProps> = ({ data }) => {
  // Default mock data if none is provided
  const defaultData = {
    weekly: [
      { date: "Mon", amount: 25, category: "Food" },
      { date: "Tue", amount: 15, category: "Transport" },
      { date: "Wed", amount: 40, category: "Entertainment" },
      { date: "Thu", amount: 30, category: "Food" },
      { date: "Fri", amount: 55, category: "Shopping" },
      { date: "Sat", amount: 65, category: "Entertainment" },
      { date: "Sun", amount: 20, category: "Food" },
    ],
    monthly: [
      { date: "Jan", amount: 300 },
      { date: "Feb", amount: 280 },
      { date: "Mar", amount: 350 },
      { date: "Apr", amount: 320 },
      { date: "May", amount: 290 },
      { date: "Jun", amount: 380 },
    ],
    categories: [
      { category: "Food", amount: 320, color: "#FF6384" },
      { category: "Transport", amount: 150, color: "#36A2EB" },
      { category: "Entertainment", amount: 280, color: "#FFCE56" },
      { category: "Shopping", amount: 240, color: "#4BC0C0" },
      { category: "Utilities", amount: 120, color: "#9966FF" },
    ],
  };

  const spendingData = data || defaultData;

  // Calculate total spending
  const totalSpending = spendingData.categories.reduce(
    (sum, category) => sum + category.amount,
    0,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Spending Patterns</h2>
        <Button
          variant="outline"
          size="sm"
          className="text-xs border-gray-700 text-gray-400 hover:text-yellow-400 hover:border-yellow-400/50 bg-transparent"
        >
          <Calendar className="h-3 w-3 mr-1" />
          This Month
        </Button>
      </div>

      <Tabs defaultValue="weekly" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="bg-gray-700/50">
            <TabsTrigger
              value="weekly"
              className="flex items-center gap-1 data-[state=active]:bg-gray-600 data-[state=active]:text-yellow-400"
            >
              <BarChart className="h-4 w-4" />
              Weekly
            </TabsTrigger>
            <TabsTrigger
              value="monthly"
              className="flex items-center gap-1 data-[state=active]:bg-gray-600 data-[state=active]:text-yellow-400"
            >
              <LineChart className="h-4 w-4" />
              Monthly
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="flex items-center gap-1 data-[state=active]:bg-gray-600 data-[state=active]:text-yellow-400"
            >
              <PieChart className="h-4 w-4" />
              Categories
            </TabsTrigger>
          </TabsList>
          <div className="text-sm font-medium text-gray-400">
            Total: <span className="text-yellow-400">${totalSpending}</span>
          </div>
        </div>

        <TabsContent value="weekly" className="mt-0">
          <div className="h-[250px] mt-4">
            {/* Weekly spending chart visualization */}
            <div className="flex h-[200px] items-end gap-2">
              {spendingData.weekly.map((day, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: `${(day.amount / Math.max(...spendingData.weekly.map((d) => d.amount))) * 150}px`,
                    opacity: 1,
                  }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center flex-1"
                >
                  <div
                    className="w-full bg-yellow-500/70 rounded-t-md transition-all duration-300 ease-in-out hover:bg-yellow-400"
                    style={{
                      height: `${(day.amount / Math.max(...spendingData.weekly.map((d) => d.amount))) * 150}px`,
                    }}
                  />
                  <div className="text-xs mt-2 text-gray-400">{day.date}</div>
                  <div className="text-xs font-medium text-white">
                    ${day.amount}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="mt-0">
          <div className="h-[250px] mt-4">
            {/* Monthly spending chart visualization */}
            <div className="flex h-[200px] items-end gap-2">
              {spendingData.monthly.map((month, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: `${(month.amount / Math.max(...spendingData.monthly.map((m) => m.amount))) * 150}px`,
                    opacity: 1,
                  }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center flex-1"
                >
                  <div
                    className="w-full bg-blue-500/70 rounded-t-md transition-all duration-300 ease-in-out hover:bg-blue-400"
                    style={{
                      height: `${(month.amount / Math.max(...spendingData.monthly.map((m) => m.amount))) * 150}px`,
                    }}
                  />
                  <div className="text-xs mt-2 text-gray-400">{month.date}</div>
                  <div className="text-xs font-medium text-white">
                    ${month.amount}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="mt-0">
          <div className="h-[250px] mt-4">
            {/* Category breakdown visualization */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-center">
                {/* Placeholder for pie chart - in a real implementation, use a chart library */}
                <div className="relative w-32 h-32 rounded-full border-8 border-gray-700 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-sm font-medium text-yellow-400">
                      ${totalSpending}
                    </div>
                  </div>
                  {/* This is a simplified visual representation */}
                  {spendingData.categories.map((category, index) => {
                    const percentage = (category.amount / totalSpending) * 100;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="absolute top-0 left-0 w-full h-full"
                        style={{
                          clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((index * 72 * Math.PI) / 180)}% ${50 - 50 * Math.sin((index * 72 * Math.PI) / 180)}%, ${50 + 50 * Math.cos(((index + 1) * 72 * Math.PI) / 180)}% ${50 - 50 * Math.sin(((index + 1) * 72 * Math.PI) / 180)}%)`,
                          backgroundColor: category.color,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="space-y-2">
                {spendingData.categories.map((category, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm text-gray-300">
                        {category.category}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-white">
                      ${category.amount}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-4 bg-gray-700/30 rounded-lg p-3 border border-gray-600/30">
        <div className="flex items-start">
          <div className="h-6 w-6 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3 mt-0.5">
            <Info className="h-3 w-3 text-yellow-400" />
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">Spending Insights</h4>
            <p className="text-xs text-gray-400">
              Your food expenses increased by 5% compared to last month.
              Consider using meal planning to reduce costs.
            </p>
            <div className="mt-2 flex items-center">
              <div className="text-xs text-yellow-400 font-medium cursor-pointer hover:underline">
                View detailed analysis
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SpendingPatterns;
