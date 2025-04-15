import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Wallet,
  ClipboardList,
  LineChart,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  Target,
  Sparkles,
  MessageSquare,
  HeartPulse,
  BookOpen,
  Coffee,
  LogOut,
  Calendar,
  Split,
  CalendarClock,
  Menu,
  X,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { useAuth } from "../../context/AuthContext";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { EnhancedSidebarItem, SidebarGroup } from "../ui/enhanced-sidebar-item";
import { GlowingElement } from "../ui/animated-sections";

interface NavItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  showOnMobile?: boolean;
}

interface SidebarProps {
  className?: string;
  activePage?: string;
}

// Nav items are defined outside component to prevent re-creation on each render
const navItems: NavItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
    color: "bg-yellow-500",
    description: "Overview of your finances",
    showOnMobile: true,
  },
  {
    title: "Goals",
    path: "/goals",
    icon: <Target className="h-4 w-4" />,
    color: "bg-blue-500",
    description: "Track your financial goals",
    showOnMobile: true,
  },
  {
    title: "Expenses",
    path: "/expenses",
    icon: <Wallet className="h-4 w-4" />,
    color: "bg-green-500",
    description: "Manage your expenses",
    showOnMobile: true,
  },
  {
    title: "Split Expenses",
    path: "/split-expenses",
    icon: <Split className="h-4 w-4" />,
    color: "bg-pink-400",
    description: "Track shared expenses",
  },
  {
    title: "Recurring",
    path: "/recurring",
    icon: <CalendarClock className="h-4 w-4" />,
    color: "bg-amber-500",
    description: "Manage recurring transactions",
    showOnMobile: true,
  },
  {
    title: "Calendar",
    path: "/calendar",
    icon: <Calendar className="h-4 w-4" />,
    color: "bg-cyan-500",
    description: "Academic calendar and expenses",
  },
  {
    title: "Transactions",
    path: "/transactions",
    icon: <ClipboardList className="h-4 w-4" />,
    color: "bg-violet-500",
    description: "View your transactions",
  },
  {
    title: "Gig Marketplace",
    path: "/gigs",
    icon: <BookOpen className="h-4 w-4" />,
    color: "bg-orange-500",
    description: "Find gigs and side hustles",
  },
  {
    title: "Meal Planner",
    path: "/meals",
    icon: <Coffee className="h-4 w-4" />,
    color: "bg-pink-500",
    description: "Budget-friendly meal plans",
  },
  {
    title: "Wellness",
    path: "/wellness",
    icon: <HeartPulse className="h-4 w-4" />,
    color: "bg-red-500",
    description: "Financial wellness tools",
  },
  {
    title: "Analytics",
    path: "/analytics",
    icon: <LineChart className="h-4 w-4" />,
    color: "bg-indigo-500",
    description: "View spending analytics",
  },
  {
    title: "Profile",
    path: "/profile",
    icon: <User className="h-4 w-4" />,
    color: "bg-gray-500",
    description: "Manage your profile",
  },
  {
    title: "Settings",
    path: "/settings",
    icon: <Settings className="h-4 w-4" />,
    color: "bg-gray-500",
    description: "App settings",
    showOnMobile: true,
  },
];

// Memoized sidebar logo component for better performance
const SidebarLogo = React.memo(({ isExpanded, isMobile, mobileMenuOpen }: { 
  isExpanded: boolean, 
  isMobile: boolean, 
  mobileMenuOpen: boolean 
}) => {
  if ((isExpanded || (isMobile && mobileMenuOpen))) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center"
      >
        <GlowingElement
          className="h-6 w-6 rounded-full bg-yellow-500/20 flex items-center justify-center mr-2"
          glowColor="rgba(245, 158, 11, 0.4)"
          glowSize="10px"
        >
          <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
        </GlowingElement>
        <span className="text-lg font-bold text-white">
          <span className="text-yellow-400">Wealth</span>Wise
        </span>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto"
    >
      <Sparkles className="h-4 w-4 text-yellow-400" />
    </motion.div>
  );
});

SidebarLogo.displayName = 'SidebarLogo';

// User profile section - memoized
const UserProfile = React.memo(({ user, isExpanded, isMobile, mobileMenuOpen, handleSignOut }: {
  user: any,
  isExpanded: boolean,
  isMobile: boolean,
  mobileMenuOpen: boolean,
  handleSignOut: () => void
}) => {
  if (isExpanded || (isMobile && mobileMenuOpen)) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 px-2">
          <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center">
            <User className="h-4 w-4 text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-300 truncate">
              {user?.email || "User"}
            </p>
            <p className="text-xs text-gray-500 truncate">Student Plan</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="justify-start text-gray-400 hover:text-white"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    );
  }
  
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 mx-auto text-gray-400"
      onClick={handleSignOut}
    >
      <LogOut className="h-4 w-4" />
    </Button>
  );
});

UserProfile.displayName = 'UserProfile';

const Sidebar = React.memo(({ className, activePage = "dashboard" }: SidebarProps) => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Auto collapse sidebar on mobile
  React.useEffect(() => {
    if (isMobile) {
      setIsExpanded(false);
    }
  }, [isMobile]);

  // Close mobile menu when route changes
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = React.useCallback(async () => {
    await signOut();
    navigate("/login");
  }, [signOut, navigate]);

  // Memoize filtered mobile nav items to prevent recreation on each render
  const mobileNavItems = React.useMemo(() => 
    navItems.filter(item => item.showOnMobile), 
    []
  );

  const renderSidebar = React.useCallback(() => (
    <div
      className={cn(
        "bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300 relative z-30",
        isExpanded ? "w-64" : "w-16",
        isMobile && !mobileMenuOpen && "hidden",
        isMobile && mobileMenuOpen && "fixed inset-0 w-full h-full",
        className,
      )}
    >
      <div className="p-4 border-b border-gray-800 flex items-center justify-between h-16">
        <SidebarLogo isExpanded={isExpanded} isMobile={isMobile} mobileMenuOpen={mobileMenuOpen} />

        {isMobile && mobileMenuOpen && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        )}

        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-gray-800">
        <SidebarGroup>
          {navItems.map((item) => (
            (isMobile && !item.showOnMobile)
              ? null
              : (
                <EnhancedSidebarItem
                  key={item.path}
                  icon={item.icon}
                  title={item.title}
                  description={isExpanded ? item.description : undefined}
                  path={item.path}
                  isActive={location.pathname === item.path || ('/' + activePage === item.path)}
                  isExpanded={isExpanded || (isMobile && mobileMenuOpen)}
                  accentColor={item.color}
                />
              )
          ))}
        </SidebarGroup>
      </div>

      <div className="p-4 border-t border-gray-800">
        <UserProfile 
          user={user}
          isExpanded={isExpanded}
          isMobile={isMobile}
          mobileMenuOpen={mobileMenuOpen}
          handleSignOut={handleSignOut}
        />
      </div>

      {/* Mobile: Help section */}
      {isMobile && mobileMenuOpen && isExpanded && (
        <div className="p-4 border-t border-gray-800">
          <Button
            variant="outline"
            className="w-full justify-start bg-gray-800/50 border-gray-700"
          >
            <MessageSquare className="h-4 w-4 mr-2 text-yellow-400" />
            Chat with Assistant
          </Button>
        </div>
      )}

      {/* Desktop: Help section */}
      {!isMobile && isExpanded && (
        <div className="p-4 border-t border-gray-800">
          <div className="rounded-lg bg-gray-800/50 p-3 border border-gray-700/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-yellow-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">Need help?</h4>
                <p className="text-xs text-gray-400">Chat with our assistant</p>
              </div>
            </div>
            <Button
              variant="secondary"
              className="w-full text-xs h-8 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20"
            >
              Open Chat
            </Button>
          </div>
        </div>
      )}
    </div>
  ), [isExpanded, isMobile, mobileMenuOpen, className, user, handleSignOut, activePage, location.pathname]);

  // Mobile menu toggle button
  const renderMobileMenuButton = React.useCallback(() => (
    isMobile && !mobileMenuOpen && (
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="fixed left-4 top-4 z-40 p-2 rounded-full bg-gray-800/80 text-white shadow-lg border border-gray-700 transform-gpu"
      >
        <Menu className="h-5 w-5" />
      </button>
    )
  ), [isMobile, mobileMenuOpen]);

  // Mobile bottom navigation
  const renderMobileNav = React.useCallback(() => (
    isMobile && (
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-40 px-2 py-1">
        <div className="flex justify-around">
          {mobileNavItems.map((item) => {
            const isActive = activePage === item.path.substring(1);
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.path);
                }}
                className="flex flex-col items-center py-2 px-3"
              >
                <div
                  className={cn(
                    "p-1.5 rounded-full mb-1 transform-gpu",
                    isActive ? `${item.color}/30` : "bg-transparent"
                  )}
                >
                  <div className={cn(
                    "h-5 w-5",
                    isActive ? "text-white" : "text-gray-500" 
                  )}>
                    {item.icon}
                  </div>
                </div>
                <span className={cn(
                  "text-[10px]",
                  isActive ? "text-white" : "text-gray-500"
                )}>
                  {item.title}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    )
  ), [isMobile, mobileNavItems, activePage, navigate]);

  return (
    <>
      {renderSidebar()}
      {renderMobileMenuButton()}
      {renderMobileNav()}
      
      {/* Overlay for mobile menu - with simplified animation */}
      <AnimatePresence>
        {isMobile && mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/50 z-20"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
