import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "./dashboard/Sidebar";
import BudgetOverview from "./dashboard/BudgetOverview";
import SpendingPatterns from "./dashboard/SpendingPatterns";
import GoalProgress from "./dashboard/GoalProgress";
import AssistantWidget from "./ai/AssistantWidget";
import ExpenseTracker from "./expense/ExpenseTracker";
import GoalsSummary from "./goals/GoalsSummary";

const Home = () => {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const [pageContent, setPageContent] = useState<React.ReactNode>(null);

  useEffect(() => {
    const path = location.pathname.substring(1) || "dashboard";
    setPageTitle(path.charAt(0).toUpperCase() + path.slice(1));

    // Set content based on current path
    switch (path) {
      case "dashboard":
        setPageContent(
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <BudgetOverview />
              <SpendingPatterns />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <GoalProgress />
              </div>
              <AssistantWidget />
            </div>
          </>,
        );
        break;
      case "goals":
        setPageContent(<GoalsSummary />);
        break;
      case "expenses":
        setPageContent(<ExpenseTracker />);
        break;
      case "transactions":
        setPageContent(
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Transactions</h2>
            <p className="text-gray-400">
              Your recent transactions will appear here.
            </p>
          </div>,
        );
        break;
      case "analytics":
        setPageContent(
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Analytics</h2>
            <p className="text-gray-400">
              Your financial analytics will appear here.
            </p>
          </div>,
        );
        break;
      case "profile":
        setPageContent(
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Profile</h2>
            <p className="text-gray-400">
              Your profile information will appear here.
            </p>
          </div>,
        );
        break;
      case "settings":
        setPageContent(
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
            <p className="text-gray-400">
              Your account settings will appear here.
            </p>
          </div>,
        );
        break;
      default:
        setPageContent(
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Page Not Found</h2>
            <p className="text-gray-400">The requested page does not exist.</p>
          </div>,
        );
    }
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white overflow-hidden">
      {/* Background rays */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[80%] h-[80%] bg-gradient-to-br from-yellow-500/5 via-transparent to-transparent blur-3xl transform rotate-12" />
        <div className="absolute top-[20%] right-[5%] w-[50%] h-[60%] bg-gradient-to-bl from-blue-500/5 via-transparent to-transparent blur-3xl transform -rotate-12" />
        <div className="absolute bottom-[10%] left-[20%] w-[40%] h-[40%] bg-gradient-to-tr from-purple-500/5 via-transparent to-transparent blur-3xl" />
      </div>

      <Sidebar activePage={location.pathname.substring(1) || "dashboard"} />

      <div className="flex-1 p-6 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 flex items-center"
        >
          <h1 className="text-2xl font-bold">{pageTitle}</h1>
          <div className="ml-auto flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-400">Last updated just now</span>
          </div>
        </motion.div>

        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {pageContent}
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
