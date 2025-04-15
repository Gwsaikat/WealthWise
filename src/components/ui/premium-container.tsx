import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface PremiumContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "subtle" | "glassmorphic" | "gradient" | "dark";
  animation?: "none" | "fade" | "pulse" | "shimmer";
  withBorder?: boolean;
  withShadow?: boolean;
  withFloatingParticles?: boolean;
  particleCount?: number;
  borderGradient?: boolean;
  className?: string;
}

// Create a forwarded ref version of the PremiumContainer
export const PremiumContainer = React.forwardRef<
  HTMLDivElement,
  PremiumContainerProps
>(({
  children,
  variant = "default",
  animation = "none",
  withBorder = true,
  withShadow = true,
  withFloatingParticles = false,
  particleCount = 10,
  borderGradient = false,
  className,
  ...props
}, ref) => {
  const variants = {
    default: "bg-gray-800/80 backdrop-blur-md",
    subtle: "bg-gray-800/50 backdrop-blur-sm",
    glassmorphic: "bg-gray-800/30 backdrop-blur-lg",
    gradient: "bg-gradient-to-br from-gray-800/80 via-gray-800/90 to-gray-800/70 backdrop-blur-md",
    dark: "bg-gray-900/90 backdrop-blur-lg",
  };

  // Get border style
  const borderStyle = withBorder
    ? borderGradient
      ? "border border-transparent bg-gradient-to-r from-gray-700/50 via-gray-600/50 to-gray-700/50 bg-origin-border"
      : "border border-gray-700/50"
    : "";

  // Get shadow style
  const shadowStyle = withShadow
    ? "shadow-lg shadow-black/20"
    : "";

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-xl p-6",
        variants[variant],
        borderStyle,
        shadowStyle,
        className
      )}
      {...props}
    >
      {/* Background effects based on animation type */}
      {animation === "pulse" && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-gray-800/0 via-gray-700/10 to-gray-800/0"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut",
          }}
        />
      )}

      {animation === "shimmer" && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/10 to-transparent"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            repeat: Infinity,
            duration: 5,
            ease: "linear",
          }}
        />
      )}

      {/* Floating particles if enabled */}
      {withFloatingParticles && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: particleCount }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full opacity-0"
              animate={{
                x: [
                  Math.random() * 100 - 50, 
                  Math.random() * 100 - 50, 
                  Math.random() * 100 - 50
                ],
                y: [
                  Math.random() * 100 - 50, 
                  Math.random() * 100 - 50, 
                  Math.random() * 100 - 50
                ],
                scale: [0, Math.random() * 0.3 + 0.1, 0],
                opacity: [0, Math.random() * 0.2, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 15,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 10,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
              }}
            />
          ))}
        </div>
      )}

      {/* Actual content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
});

PremiumContainer.displayName = "PremiumContainer";

// Premium card variation with additional styling specifically for cards
interface PremiumCardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  icon?: React.ReactNode;
  headerClass?: string;
  className?: string;
  variant?: "default" | "subtle" | "glassmorphic" | "gradient" | "dark";
  animation?: "none" | "fade" | "pulse" | "shimmer";
  withBorder?: boolean;
  withShadow?: boolean;
  withFloatingParticles?: boolean;
  particleCount?: number;
  borderGradient?: boolean;
}

export const PremiumCard = React.forwardRef<
  HTMLDivElement,
  PremiumCardProps
>(({
  children,
  title,
  description,
  footer,
  icon,
  headerClass,
  className,
  ...props
}, ref) => {
  return (
    <PremiumContainer 
      ref={ref}
      className={cn("p-0", className)} 
      {...props}
    >
      {(title || description) && (
        <div className={cn("p-6 pb-3 border-b border-gray-700/30", headerClass)}>
          {title && (
            <div className="flex items-center gap-3 mb-1.5">
              {icon && (
                <motion.div 
                  className="text-primary"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {icon}
                </motion.div>
              )}
              <h3 className="text-lg font-semibold text-white">{title}</h3>
            </div>
          )}
          {description && <p className="text-sm text-gray-400">{description}</p>}
        </div>
      )}
      <div className="p-6 pt-4">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 border-t border-gray-700/30">
          {footer}
        </div>
      )}
    </PremiumContainer>
  );
});

PremiumCard.displayName = "PremiumCard"; 