import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle,
  TrendingUp,
  Target,
  Award,
  Calendar,
  ArrowRight,
  Edit,
  Trash2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
}

interface GoalsSummaryProps {
  goals?: Goal[];
  onAddGoal?: () => void;
}

const GoalsSummary = ({
  goals = [
    {
      id: "1",
      title: "Spring Break Trip",
      targetAmount: 500,
      currentAmount: 350,
      deadline: "2023-03-15",
      category: "Travel",
    },
    {
      id: "2",
      title: "New Laptop",
      targetAmount: 1200,
      currentAmount: 600,
      deadline: "2023-06-30",
      category: "Technology",
    },
    {
      id: "3",
      title: "Emergency Fund",
      targetAmount: 1000,
      currentAmount: 250,
      deadline: "2023-12-31",
      category: "Savings",
    },
  ],
  onAddGoal = () => console.log("Add goal clicked"),
}: GoalsSummaryProps) => {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
    category: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewGoal({ ...newGoal, [name]: value });
  };

  const handleAddGoal = () => {
    // In a real implementation, this would add the goal
    console.log("Adding goal:", newGoal);
    setShowAddGoal(false);
    setNewGoal({
      title: "",
      targetAmount: "",
      currentAmount: "",
      deadline: "",
      category: "",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 h-full"
    >
      <div className="flex flex-row items-center justify-between pb-2">
        <div>
          <h2 className="text-xl font-semibold flex items-center">
            <Target className="h-5 w-5 mr-2 text-yellow-400" />
            Financial Goals
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Track your progress towards your goals
          </p>
        </div>
        <Button
          onClick={() => setShowAddGoal(true)}
          variant="outline"
          size="sm"
          className="flex items-center gap-1 border-gray-600 text-yellow-400 hover:text-yellow-300 hover:border-yellow-500/50 bg-transparent"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Goal</span>
        </Button>
      </div>

      <AnimatePresence>
        {showAddGoal && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-700/50 rounded-lg p-4 mb-4 border border-gray-600/50 overflow-hidden"
          >
            <h3 className="text-lg font-medium mb-4">Create New Goal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="md:col-span-2">
                <Label
                  htmlFor="title"
                  className="text-sm text-gray-300 mb-1 block"
                >
                  Goal Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g. New Car, Vacation, etc."
                  value={newGoal.title}
                  onChange={handleInputChange}
                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-yellow-500"
                />
              </div>
              <div>
                <Label
                  htmlFor="targetAmount"
                  className="text-sm text-gray-300 mb-1 block"
                >
                  Target Amount ($)
                </Label>
                <Input
                  id="targetAmount"
                  name="targetAmount"
                  type="number"
                  placeholder="0.00"
                  value={newGoal.targetAmount}
                  onChange={handleInputChange}
                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-yellow-500"
                />
              </div>
              <div>
                <Label
                  htmlFor="currentAmount"
                  className="text-sm text-gray-300 mb-1 block"
                >
                  Current Amount ($)
                </Label>
                <Input
                  id="currentAmount"
                  name="currentAmount"
                  type="number"
                  placeholder="0.00"
                  value={newGoal.currentAmount}
                  onChange={handleInputChange}
                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-yellow-500"
                />
              </div>
              <div>
                <Label
                  htmlFor="deadline"
                  className="text-sm text-gray-300 mb-1 block"
                >
                  Target Date
                </Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={newGoal.deadline}
                  onChange={handleInputChange}
                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-yellow-500"
                />
              </div>
              <div>
                <Label
                  htmlFor="category"
                  className="text-sm text-gray-300 mb-1 block"
                >
                  Category
                </Label>
                <Input
                  id="category"
                  name="category"
                  placeholder="e.g. Savings, Travel, etc."
                  value={newGoal.category}
                  onChange={handleInputChange}
                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-yellow-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddGoal(false)}
                className="text-gray-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddGoal}
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                size="sm"
              >
                Create Goal
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-6 text-gray-400">
            <Target className="h-12 w-12 mx-auto mb-2 text-gray-500/50" />
            <p>No financial goals yet</p>
            <p className="text-sm">
              Set your first goal to start tracking your progress
            </p>
          </div>
        ) : (
          goals.map((goal, index) => {
            const progress = Math.round(
              (goal.currentAmount / goal.targetAmount) * 100,
            );
            const remainingAmount = goal.targetAmount - goal.currentAmount;
            const deadlineDate = new Date(goal.deadline);
            const formattedDeadline = deadlineDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="p-3 border border-gray-600/30 rounded-lg bg-gray-700/30"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-white">{goal.title}</h3>
                    <div className="text-sm text-gray-400 flex items-center gap-1">
                      {goal.category === "Travel" && (
                        <TrendingUp className="h-3 w-3 text-blue-400" />
                      )}
                      {goal.category === "Technology" && (
                        <Target className="h-3 w-3 text-purple-400" />
                      )}
                      {goal.category === "Savings" && (
                        <Award className="h-3 w-3 text-yellow-400" />
                      )}
                      <span>{goal.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-white">
                      ${goal.currentAmount} / ${goal.targetAmount}
                    </div>
                    <div className="text-xs text-gray-400">
                      Due {formattedDeadline}
                    </div>
                  </div>
                </div>
                <Progress
                  value={progress}
                  className="h-2 mb-1 bg-gray-600"
                  indicatorClassName="bg-yellow-500"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{progress}% complete</span>
                  <span>${remainingAmount} to go</span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <div className="mt-4 flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          className="text-yellow-400 hover:text-yellow-300"
        >
          View All Goals <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </div>
    </motion.div>
  );
};

export default GoalsSummary;
