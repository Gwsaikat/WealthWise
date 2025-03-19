import React from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Wallet,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { Progress } from "../ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";

interface BudgetCategory {
  name: string;
  amount: number;
  spent: number;
  icon: React.ReactNode;
  color: string;
}

interface BudgetOverviewProps {
  totalBudget?: number;
  spentAmount?: number;
  dailyAllowance?: number;
  categories?: BudgetCategory[];
}

const BudgetOverview = ({
  totalBudget = 1200,
  spentAmount = 750,
  dailyAllowance = 15,
  categories = [
    {
      name: "Groceries",
      amount: 300,
      spent: 220,
      icon: <Wallet className="h-4 w-4" />,
      color: "bg-green-500",
    },
    {
      name: "Rent",
      amount: 500,
      spent: 500,
      icon: <CreditCard className="h-4 w-4" />,
      color: "bg-blue-500",
    },
    {
      name: "Dining",
      amount: 150,
      spent: 95,
      icon: <DollarSign className="h-4 w-4" />,
      color: "bg-orange-500",
    },
    {
      name: "Coffee",
      amount: 50,
      spent: 35,
      icon: <DollarSign className="h-4 w-4" />,
      color: "bg-amber-500",
    },
    {
      name: "Education",
      amount: 200,
      spent: 100,
      icon: <DollarSign className="h-4 w-4" />,
      color: "bg-purple-500",
    },
  ],
}: BudgetOverviewProps) => {
  const remainingBudget = totalBudget - spentAmount;
  const percentSpent = Math.round((spentAmount / totalBudget) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-yellow-400" />
          Budget Overview
        </h2>
        <div className="text-sm text-gray-400">Monthly Budget</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <motion.div
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 400 }}
          className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">Total Budget</div>
            <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-yellow-400" />
            </div>
          </div>
          <div className="text-2xl font-bold mt-2">
            ${totalBudget.toFixed(2)}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Spent: ${spentAmount.toFixed(2)}
          </div>
          <Progress value={percentSpent} className="h-1 mt-2 bg-gray-600" />
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 400 }}
          className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">Remaining</div>
            <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <ArrowUpRight className="h-4 w-4 text-green-400" />
            </div>
          </div>
          <div className="text-2xl font-bold mt-2">
            ${remainingBudget.toFixed(2)}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Daily Allowance: ${dailyAllowance.toFixed(2)}
          </div>
          <Progress
            value={100 - percentSpent}
            className="h-1 mt-2 bg-gray-600"
          />
        </motion.div>
      </div>

      <Separator className="my-4 bg-gray-700/50" />

      <div className="space-y-4">
        <div className="text-sm font-medium mb-2">Budget Categories</div>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category, index) => {
            const percentSpent = Math.round(
              (category.spent / category.amount) * 100,
            );
            const isOverBudget = percentSpent > 100;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="flex items-center space-x-2"
              >
                <div
                  className={`p-1.5 rounded-full ${category.color}/20 flex items-center justify-center`}
                >
                  {category.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm">
                    <span>{category.name}</span>
                    <span className="font-medium">
                      ${category.spent.toFixed(0)}/${category.amount.toFixed(0)}
                    </span>
                  </div>
                  <Progress
                    value={percentSpent > 100 ? 100 : percentSpent}
                    className="h-1.5 mt-1 bg-gray-600"
                    indicatorClassName={
                      isOverBudget ? "bg-red-400" : category.color
                    }
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default BudgetOverview;
