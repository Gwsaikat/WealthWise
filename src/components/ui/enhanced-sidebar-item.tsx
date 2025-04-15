import * as React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";

interface EnhancedSidebarItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  icon: React.ReactNode;
  title: string;
  path: string;
  isActive?: boolean;
  isExpanded?: boolean;
  description?: string;
  accentColor?: string;
  onClick?: () => void;
}

// Color map moved outside component to prevent recreation on each render
const colorMap: Record<string, string> = {
  "bg-yellow-500": "text-yellow-400 border-yellow-500/50",
  "bg-blue-500": "text-blue-400 border-blue-500/50",
  "bg-green-500": "text-green-400 border-green-500/50",
  "bg-red-500": "text-red-400 border-red-500/50",
  "bg-indigo-500": "text-indigo-400 border-indigo-500/50",
  "bg-violet-500": "text-violet-400 border-violet-500/50",
  "bg-pink-500": "text-pink-400 border-pink-500/50",
  "bg-cyan-500": "text-cyan-400 border-cyan-500/50",
  "bg-amber-500": "text-amber-400 border-amber-500/50",
  "bg-emerald-500": "text-emerald-400 border-emerald-500/50",
  "bg-purple-500": "text-purple-400 border-purple-500/50", 
  "bg-orange-500": "text-orange-400 border-orange-500/50",
  "bg-gray-500": "text-gray-400 border-gray-500/50"
};

// Optimized sidebar item with React.memo for better performance
export const EnhancedSidebarItem = React.memo(({
  icon,
  title,
  path,
  isActive = false,
  isExpanded = true,
  description,
  accentColor = "bg-yellow-500",
  onClick,
  className,
  ...props
}: EnhancedSidebarItemProps) => {
  const navigate = useNavigate();
  
  const textColor = colorMap[accentColor] || "text-white border-gray-500/50";

  // Handle navigation to ensure components load properly
  const handleNavigation = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    // Call the original onClick if provided
    if (onClick) {
      onClick();
    }
    
    // Use navigate instead of Link to ensure proper component loading
    navigate(path);
  }, [onClick, navigate, path]);

  return (
    <a
      href={path}
      onClick={handleNavigation}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
        isActive
          ? cn("bg-gray-800/70 backdrop-blur-sm", textColor)
          : "text-gray-400 hover:bg-gray-800/40 hover:text-gray-300",
        isExpanded ? "justify-start" : "justify-center",
        className,
      )}
      {...props}
    >
      {/* Accent stripe for active items */}
      {isActive && (
        <>
          {/* Left accent bar - optimized animation */}
          <motion.div
            layoutId="sidebar-item-accent"
            className={cn("absolute left-0 top-1/2 h-[60%] w-0.5 -translate-y-1/2 will-change-transform", accentColor)}
            transition={{ duration: 0.15 }}
          />
          
          {/* Animated subtle blur glow behind the item - simplified */}
          <motion.div
            className="absolute inset-0 rounded-lg opacity-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.12 }}
            style={{ 
              background: `radial-gradient(circle at left center, ${accentColor.replace('bg-', 'var(--')}), transparent 70%)` 
            }}
            transition={{ duration: 0.15 }}
          />
        </>
      )}

      {/* Icon with animated hover effect */}
      <motion.div
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-md border transform-gpu",
          isActive
            ? cn(`${accentColor}/20 ${textColor}`)
            : "border-gray-700/50 text-gray-500 group-hover:text-gray-300 group-hover:border-gray-600/60"
        )}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {icon}
      </motion.div>

      {/* Title and description */}
      {isExpanded && (
        <div className="flex flex-col">
          <span className={isActive ? textColor.split(' ')[0] : "text-inherit"}>
            {title}
          </span>
          {description && (
            <span className="text-xs text-gray-500 group-hover:text-gray-400 truncate max-w-[180px]">
              {description}
            </span>
          )}
        </div>
      )}

      {/* Hover effect - subtle gradient overlay - optimized */}
      <div
        className={cn(
          "absolute inset-0 rounded-lg opacity-0 transition-opacity duration-200",
          "bg-gradient-to-r from-transparent via-white/5 to-transparent",
          "group-hover:opacity-100"
        )}
      />
    </a>
  );
});

EnhancedSidebarItem.displayName = 'EnhancedSidebarItem';

// Group container for sidebar items - memoized
interface SidebarGroupProps {
  children: React.ReactNode;
  title?: string;
  isExpanded?: boolean;
  className?: string;
}

export const SidebarGroup = React.memo(({
  children,
  title,
  isExpanded = true,
  className,
}: SidebarGroupProps) => {
  return (
    <div className={cn("space-y-1", className)}>
      {title && isExpanded && (
        <h4 className="px-3 pt-4 pb-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </h4>
      )}
      {!title && <div className="py-1" />}
      {children}
    </div>
  );
});

SidebarGroup.displayName = 'SidebarGroup';

export default EnhancedSidebarItem; 