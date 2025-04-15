import React, { useState, useEffect, memo } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./dashboard/Sidebar";
import BudgetOverview from "./dashboard/BudgetOverview";
import SpendingPatterns from "./dashboard/SpendingPatterns";
import GoalProgress from "./dashboard/GoalProgress";
import AssistantWidget from "./ai/AssistantWidget";
import ExpenseTracker from "./expense/ExpenseTracker";
import GoalsSummary from "./goals/GoalsSummary";
import TransactionHistory from "./transactions/TransactionHistory";
import Analytics from "./dashboard/Analytics";
import Profile from "./dashboard/Profile";
import Settings from "./dashboard/Settings";
import AcademicCalendar from "./calendar/AcademicCalendar";
import SplitExpenseTracker from "./expense/SplitExpense";
import FinancialWellness from "./wellness/FinancialWellness";
import RecurringTransactionManager from "./recurring/RecurringTransactionManager";
import MealPlanner from "./meal/MealPlanner";
import GigMarketplace from "./gigs/GigMarketplace";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { cn } from "../lib/utils";
import { Badge } from "./ui/badge";
import { Bell, Calendar, Clock, Info, X } from "lucide-react";
import FinancialInsights from "./dashboard/FinancialInsights";

// Floating particles component for premium effect - optimized
const FloatingParticles = memo(() => {
  const particles = React.useMemo(() => 
    Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${Math.random() * 3 + 1}px`,
      height: `${Math.random() * 3 + 1}px`,
      delay: Math.random() * 10,
      duration: Math.random() * 10 + 15,
    })),
  []);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-white rounded-full opacity-0 will-change-transform"
          animate={{
            x: [
              Math.random() * 80 - 40, 
              Math.random() * 80 - 40, 
              Math.random() * 80 - 40
            ],
            y: [
              Math.random() * 80 - 40, 
              Math.random() * 80 - 40, 
              Math.random() * 80 - 40
            ],
            scale: [0, Math.random() * 0.4 + 0.2, 0],
            opacity: [0, Math.random() * 0.2, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear",
            delay: particle.delay,
          }}
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.width,
            height: particle.height,
          }}
        />
      ))}
    </div>
  );
});

FloatingParticles.displayName = 'FloatingParticles';

// Top notification component
const NotificationBanner = memo(({ onClose }: { onClose: () => void }) => {
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      className="bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-indigo-500/10 backdrop-blur-sm border border-indigo-500/20 rounded-lg p-3 mb-4 flex items-center justify-between"
    >
      <div className="flex items-center">
        <div className="p-1.5 rounded-full bg-indigo-500/20 mr-3">
          <Info className="h-4 w-4 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-white">New Financial Insights Available</h3>
          <p className="text-xs text-gray-400">Discover personalized recommendations based on your recent activity</p>
        </div>
      </div>
      <button 
        onClick={onClose}
        className="p-1.5 rounded-full hover:bg-gray-800/50 text-gray-400 hover:text-white transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
});

NotificationBanner.displayName = 'NotificationBanner';

// Dashboard Header Badges - optimized
const DashboardHeaderBadges = memo(() => {
  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant="outline" 
        className="flex items-center gap-1.5 px-2.5 py-1 border-purple-500/30 bg-purple-500/10 text-purple-400"
      >
        <Clock className="h-3.5 w-3.5" />
        <span className="text-xs">Last sync: Just now</span>
      </Badge>
      
      <motion.div
        className="relative"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <Badge 
          variant="outline" 
          className="flex items-center gap-1.5 px-2.5 py-1 border-amber-500/30 bg-amber-500/10 text-amber-400 cursor-pointer"
        >
          <Bell className="h-3.5 w-3.5" />
          <span className="text-xs">3 Alerts</span>
        </Badge>
        <motion.div 
          className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full will-change-transform"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
      
      <Badge 
        variant="outline" 
        className="flex items-center gap-1.5 px-2.5 py-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
      >
        <Calendar className="h-3.5 w-3.5" />
        <span className="text-xs">{new Date().toLocaleDateString()}</span>
      </Badge>
    </div>
  );
});

DashboardHeaderBadges.displayName = 'DashboardHeaderBadges';

// Optimized ambient backgrounds to reduce rendering load
const AmbientBackground = memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Reduced number of gradient layers for better performance */}
    <div className="absolute -top-[30%] -left-[10%] w-[80%] h-[80%] bg-gradient-to-br from-yellow-500/5 via-transparent to-transparent blur-3xl transform-gpu rotate-12" />
    <div className="absolute bottom-[10%] left-[20%] w-[40%] h-[40%] bg-gradient-to-tr from-fuchsia-500/5 via-transparent to-transparent blur-3xl transform-gpu" />
    
    {/* Optimized animated glowing spots with reduced complexity */}
    <motion.div
      className="absolute bottom-[20%] right-[15%] w-[300px] h-[300px] rounded-full bg-violet-500/5 will-change-transform"
      animate={{
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "linear",
      }}
    />
    
    {/* Floating particles */}
    <FloatingParticles />
  </div>
));

AmbientBackground.displayName = 'AmbientBackground';

const Home = () => {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const [pageContent, setPageContent] = useState<React.ReactNode>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [showNotification, setShowNotification] = useState(true);
  const [initialNavComplete, setInitialNavComplete] = useState(false);

  // Animation variants - optimized for performance
  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      transition: {
        duration: 0.2,
      }
    }
  };

  // Preload components on mount to prevent blank pages
  useEffect(() => {
    // Mark initial navigation as complete after first render
    setInitialNavComplete(true);
  }, []);

  // Load content based on route
  useEffect(() => {
    const path = location.pathname.substring(1) || "dashboard";
    
    // Set title with capitalized first letter
    const formattedTitle = path
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    setPageTitle(formattedTitle || "Dashboard");

    try {
      // Set content based on current path
      switch (path) {
        case "dashboard":
          setPageContent(
            <>
              {showNotification && (
                <NotificationBanner onClose={() => setShowNotification(false)} />
              )}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-4 lg:mb-6">
                <div className="lg:col-span-1">
                  <FinancialInsights key="financial-insights" />
                </div>
                <div className="lg:col-span-2">
                  <BudgetOverview key="budget-overview" />
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                <div className="lg:col-span-2">
                  <SpendingPatterns key="spending-patterns" />
                </div>
                <div className="lg:col-span-1">
                  <AssistantWidget key="assistant-widget" />
                </div>
              </div>
            </>
          );
          break;
        case "goals":
          setPageContent(<GoalsSummary />);
          break;
        case "expenses":
          setPageContent(<ExpenseTracker />);
          break;
        case "split-expenses":
          setPageContent(<SplitExpenseTracker />);
          break;
        case "recurring":
          setPageContent(<RecurringTransactionManager />);
          break;
        case "transactions":
          setPageContent(<TransactionHistory />);
          break;
        case "analytics":
          setPageContent(<Analytics />);
          break;
        case "profile":
          setPageContent(<Profile />);
          break;
        case "settings":
          setPageContent(<Settings />);
          break;
        case "calendar":
          setPageContent(<AcademicCalendar />);
          break;
        case "wellness":
          setPageContent(<FinancialWellness />);
          break;
        case "meals":
          setPageContent(<MealPlanner />);
          break;
        case "gigs":
          setPageContent(<GigMarketplace />);
          break;
        default:
          setPageContent(
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-semibold mb-4">Page Not Found</h2>
              <p className="text-gray-400">The requested page does not exist.</p>
            </div>,
          );
      }
    } catch (error) {
      console.error("Error rendering component for path:", path, error);
      setPageContent(
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold mb-4">Error Loading Content</h2>
          <p className="text-gray-400">There was a problem loading this content. Please try again.</p>
        </div>
      );
    }
  }, [location.pathname, showNotification]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-900 text-white overflow-hidden">
      {/* Ambient background effects - extracted to a separate optimized component */}
      <AmbientBackground />

      {/* Sidebar */}
      <Sidebar activePage={location.pathname.substring(1) || "dashboard"} />

      {/* Main content area */}
      <div 
        className={cn(
          "flex-1 overflow-auto relative z-10",
          isMobile ? "p-3 pb-20" : "p-6"
        )}
      >
        {/* Page header - hide for calendar page to prevent duplicate headers */}
        {location.pathname !== '/calendar' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "flex items-center justify-between transform-gpu will-change-transform",
              isMobile ? "mb-3 mt-2 flex-col items-start gap-2" : "mb-6 flex-row"
            )}
          >
            <div className="flex items-center">
              <h1 className={cn(
                "font-bold bg-clip-text text-transparent bg-gradient-to-r",
                isMobile ? "text-2xl from-white to-gray-400" : "text-3xl from-white to-gray-300"
              )}>
                {pageTitle}
              </h1>
              
              {/* Animated dot indicator - simplified animation */}
              <div className="relative ml-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                <motion.div
                  className="absolute inset-0 rounded-full bg-emerald-500 will-change-transform"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </div>
            
            {/* Status badges - hidden on mobile */}
            <div className={isMobile ? "hidden" : "block"}>
              <DashboardHeaderBadges />
            </div>
          </motion.div>
        )}

        {/* Page content with animations - optimized transitions */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={cn(isMobile ? "pb-16" : "", "transform-gpu will-change-transform")}
          >
            {pageContent}
          </motion.div>
        </AnimatePresence>
        
        {/* Glass effect footer - only on desktop - with simpler animations */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="mt-6 p-4 bg-gray-800/20 backdrop-blur-md border border-gray-700/30 rounded-lg flex justify-between items-center transform-gpu"
          >
            <div className="text-xs text-gray-400">
              © 2023 WealthWise • Advanced Financial Analytics
            </div>
            <div className="text-xs text-gray-400">
              Powered by AI • v2.3.0
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default memo(Home);
