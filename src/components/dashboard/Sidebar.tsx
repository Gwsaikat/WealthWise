import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  Target,
  Receipt,
  Settings,
  LogOut,
  CreditCard,
  PieChart,
  User,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { motion } from "framer-motion";

interface SidebarProps {
  userName?: string;
  userImage?: string;
  activePage?: string;
}

const Sidebar = ({
  userName = "Alex Johnson",
  userImage = "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
  activePage = "dashboard",
}: SidebarProps) => {
  const [activeItem, setActiveItem] = useState(activePage);
  const navigate = useNavigate();

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <Home className="mr-2 h-4 w-4" />,
    },
    { id: "goals", label: "Goals", icon: <Target className="mr-2 h-4 w-4" /> },
    {
      id: "expenses",
      label: "Expenses",
      icon: <Receipt className="mr-2 h-4 w-4" />,
    },
    {
      id: "transactions",
      label: "Transactions",
      icon: <CreditCard className="mr-2 h-4 w-4" />,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: <PieChart className="mr-2 h-4 w-4" />,
    },
    {
      id: "profile",
      label: "Profile",
      icon: <User className="mr-2 h-4 w-4" />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
    },
  ];

  const handleLogout = () => {
    // Handle logout logic here
    navigate("/");
  };

  return (
    <div className="flex h-full w-[280px] flex-col bg-gray-900 border-r border-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 py-4"
      >
        <Link to="/" className="flex items-center gap-2">
          <div className="rounded-full bg-yellow-500/10 p-2">
            <CreditCard className="h-6 w-6 text-yellow-400" />
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-xl font-bold flex items-center"
          >
            <span className="text-yellow-400">Wealth</span>
            <span className="text-white ml-1">Wise</span>
          </motion.div>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex items-center gap-3 py-4 bg-gray-800/40 rounded-lg p-3 my-2 border border-gray-700/50"
      >
        <Avatar className="h-10 w-10 border-2 border-yellow-400/50">
          <AvatarImage src={userImage} alt={userName} />
          <AvatarFallback className="bg-gray-700 text-yellow-400">
            {userName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium text-white">{userName}</p>
          <div className="flex items-center text-xs text-yellow-400/80 gap-1">
            <Sparkles className="h-3 w-3" />
            <span>Student Pro</span>
          </div>
        </div>
      </motion.div>

      <Separator className="my-4 bg-gray-700/50" />

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={`/${item.id === "dashboard" ? "dashboard" : item.id}`}
          >
            <motion.div
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                variant={activeItem === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start ${activeItem === item.id ? "bg-gray-800/80 text-yellow-400 hover:bg-gray-800" : "text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50"}`}
                onClick={() => setActiveItem(item.id)}
              >
                {item.icon}
                {item.label}
              </Button>
            </motion.div>
          </Link>
        ))}
      </nav>

      <div className="mt-auto">
        <Separator className="my-4 bg-gray-700/50" />
        <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-400 hover:text-red-400 hover:bg-gray-800/50"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Sidebar;
