import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
import { cn } from "../../lib/utils";

interface EnhancedTabsListProps extends React.ComponentPropsWithoutRef<typeof TabsList> {
  variant?: "default" | "premium" | "glassmorphic" | "gradient";
  iconPosition?: "left" | "top";
  size?: "default" | "sm" | "lg";
  fullWidth?: boolean;
}

export const EnhancedTabsList = React.forwardRef<
  React.ElementRef<typeof TabsList>,
  EnhancedTabsListProps
>(({ 
  className, 
  variant = "default", 
  iconPosition = "left",
  size = "default",
  fullWidth = true,
  ...props 
}, ref) => {
  const variantStyles = {
    default: "bg-gray-800/50 backdrop-blur-sm border border-gray-700/30",
    premium: "bg-gray-800/70 backdrop-blur-md border border-gray-700/50 shadow-lg shadow-black/20",
    glassmorphic: "bg-gray-800/30 backdrop-blur-lg border border-gray-700/30 shadow-xl shadow-black/10",
    gradient: "bg-gradient-to-r from-gray-800/80 via-gray-800/50 to-gray-800/80 backdrop-blur-md border border-gray-700/30"
  };

  const sizeStyles = {
    sm: "h-8 text-xs",
    default: "h-10",
    lg: "h-12 text-base"
  };

  return (
    <TabsList
      ref={ref}
      className={cn(
        "p-1 mb-6 rounded-xl transition-all duration-300 ease-in-out",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full grid",
        iconPosition === "top" && "flex-col gap-1",
        className
      )}
      {...props}
    />
  );
});
EnhancedTabsList.displayName = "EnhancedTabsList";

interface EnhancedTabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsTrigger> {
  icon?: React.ReactNode;
  iconPosition?: "left" | "top";
  activeColor?: string;
}

export const EnhancedTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsTrigger>,
  EnhancedTabsTriggerProps
>(({ 
  className, 
  icon, 
  children, 
  iconPosition = "left", 
  activeColor = "amber",
  ...props 
}, ref) => {
  const colorMap: Record<string, string> = {
    amber: "data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400 data-[state=active]:border-amber-500/30",
    blue: "data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 data-[state=active]:border-blue-500/30",
    green: "data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 data-[state=active]:border-green-500/30",
    red: "data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400 data-[state=active]:border-red-500/30",
    indigo: "data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-400 data-[state=active]:border-indigo-500/30",
    violet: "data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400 data-[state=active]:border-violet-500/30",
    pink: "data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-400 data-[state=active]:border-pink-500/30",
    cyan: "data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 data-[state=active]:border-cyan-500/30",
    emerald: "data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 data-[state=active]:border-emerald-500/30",
    yellow: "data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400 data-[state=active]:border-yellow-500/30",
  };

  return (
    <TabsTrigger
      ref={ref}
      className={cn(
        "relative overflow-hidden transition-all duration-300 ease-out border border-transparent",
        "data-[state=active]:shadow-md",
        "hover:bg-gray-700/30",
        colorMap[activeColor] || colorMap.amber,
        iconPosition === "top" && "flex flex-col items-center gap-1 py-2",
        className
      )}
      {...props}
    >
      <div className={cn(
        "flex items-center gap-2",
        iconPosition === "top" && "flex-col"
      )}>
        {icon && (
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.div>
        )}
        {children}
      </div>
      
      {/* Active tab glow effect */}
      <motion.div
        className="absolute -z-10 inset-0 opacity-0 data-[state=active]:opacity-100"
        transition={{ duration: 0.3 }}
        layout
      />
    </TabsTrigger>
  );
});
EnhancedTabsTrigger.displayName = "EnhancedTabsTrigger";

interface EnhancedTabsContentProps extends React.ComponentPropsWithoutRef<typeof TabsContent> {
  transition?: "fade" | "slide" | "zoom" | "none";
  transitionDuration?: number;
}

export const EnhancedTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsContent>,
  EnhancedTabsContentProps
>(({ 
  className, 
  transition = "fade", 
  transitionDuration = 0.3,
  ...props 
}, ref) => {
  // Define transition variants
  const transitionVariants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slide: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
    },
    zoom: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
    },
    none: {
      initial: {},
      animate: {},
      exit: {},
    },
  };

  // Get selected transition
  const selectedTransition = transitionVariants[transition];

  return (
    <TabsContent
      ref={ref}
      asChild
      className={cn("outline-none relative", className)}
      {...props}
    >
      <motion.div
        initial={selectedTransition.initial}
        animate={selectedTransition.animate}
        exit={selectedTransition.exit}
        transition={{ duration: transitionDuration }}
      >
        {props.children}
      </motion.div>
    </TabsContent>
  );
});
EnhancedTabsContent.displayName = "EnhancedTabsContent";

// Export with original components
export { Tabs }; 