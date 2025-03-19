import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import {
  CalendarClock,
  CheckCircle,
  Target,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Badge } from "../ui/badge";

interface GoalItem {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
}

interface GoalProgressProps {
  goals?: GoalItem[];
}

const GoalProgress = ({ goals = defaultGoals }: GoalProgressProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Target className="h-5 w-5 mr-2 text-yellow-400" />
          <h2 className="text-xl font-semibold">Goal Progress</h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-xs text-yellow-400 hover:text-yellow-300 flex items-center"
        >
          View All
          <ArrowRight className="h-3 w-3 ml-1" />
        </motion.button>
      </div>

      {goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-center">
          <Target className="h-10 w-10 text-gray-500 mb-2" />
          <p className="text-gray-400">No financial goals set yet</p>
          <p className="text-sm text-gray-500">
            Create a goal to start tracking your progress
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {goals.map((goal, index) => {
            const progressPercentage = Math.min(
              Math.round((goal.currentAmount / goal.targetAmount) * 100),
              100,
            );
            const isCompleted = progressPercentage === 100;

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{goal.title}</h3>
                    <Badge
                      variant={getBadgeVariant(goal.category)}
                      className="text-xs bg-gray-700 hover:bg-gray-600 text-yellow-400 border-yellow-500/20"
                    >
                      {goal.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <CalendarClock className="h-3.5 w-3.5" />
                    <span>{goal.deadline}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-3">
                  <Progress
                    value={progressPercentage}
                    className="h-2 flex-1 bg-gray-600"
                    indicatorClassName="bg-yellow-500"
                  />
                  <span className="text-sm font-medium text-yellow-400">
                    {progressPercentage}%
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm mt-2">
                  <div className="flex items-center gap-1">
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                    )}
                    <span
                      className={
                        isCompleted ? "text-green-400" : "text-blue-400"
                      }
                    >
                      ${goal.currentAmount.toLocaleString()}
                    </span>
                    <span className="text-gray-400">
                      of ${goal.targetAmount.toLocaleString()}
                    </span>
                  </div>
                  {!isCompleted && (
                    <span className="text-gray-400">
                      $
                      {(
                        goal.targetAmount - goal.currentAmount
                      ).toLocaleString()}{" "}
                      to go
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

const getBadgeVariant = (category: string) => {
  switch (category.toLowerCase()) {
    case "savings":
      return "default";
    case "education":
      return "secondary";
    case "travel":
      return "outline";
    case "emergency":
      return "destructive";
    default:
      return "default";
  }
};

const defaultGoals: GoalItem[] = [
  {
    id: "1",
    title: "Emergency Fund",
    targetAmount: 3000,
    currentAmount: 1500,
    deadline: "Dec 2023",
    category: "Emergency",
  },
  {
    id: "2",
    title: "Spring Break Trip",
    targetAmount: 800,
    currentAmount: 800,
    deadline: "Mar 2024",
    category: "Travel",
  },
  {
    id: "3",
    title: "Laptop Upgrade",
    targetAmount: 1200,
    currentAmount: 450,
    deadline: "Aug 2024",
    category: "Education",
  },
];

export default GoalProgress;
