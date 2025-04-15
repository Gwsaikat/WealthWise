import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

// Staggered animation container for children
interface StaggerContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  animate?: boolean;
  as?: React.ElementType;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className,
  delay = 0,
  staggerDelay = 0.05,
  animate = true,
  as: Component = motion.div,
  ...props
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <Component
      variants={containerVariants}
      initial={animate ? "hidden" : false}
      animate={animate ? "visible" : false}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
};

// Staggered animation item
interface StaggerItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  duration?: number;
  springConfig?: { stiffness: number; damping: number };
}

export const StaggerItem: React.FC<StaggerItemProps> = ({
  children,
  className,
  direction = "up",
  distance = 20,
  duration = 0.5,
  springConfig,
  ...props
}) => {
  const getDirectionProps = () => {
    switch (direction) {
      case "up":
        return { y: distance };
      case "down":
        return { y: -distance };
      case "left":
        return { x: distance };
      case "right":
        return { x: -distance };
      default:
        return { y: distance };
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, ...getDirectionProps() },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: springConfig
        ? {
            type: "spring",
            ...springConfig,
            duration,
          }
        : {
            duration,
          },
    },
  };

  return (
    <motion.div
      variants={itemVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Animated section with reveal on scroll
interface RevealSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  duration?: number;
  delay?: number;
  once?: boolean;
}

export const RevealSection: React.FC<RevealSectionProps> = ({
  children,
  className,
  threshold = 0.1,
  direction = "up",
  distance = 50,
  duration = 0.7,
  delay = 0,
  once = true,
  ...props
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = React.useState(false);

  React.useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) observer.unobserve(currentRef);
        } else if (!once) {
          setIsInView(false);
        }
      },
      { threshold }
    );

    observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [threshold, once]);

  const getDirectionProps = () => {
    switch (direction) {
      case "up":
        return { y: distance };
      case "down":
        return { y: -distance };
      case "left":
        return { x: distance };
      case "right":
        return { x: -distance };
      default:
        return { y: distance };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...getDirectionProps() }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...getDirectionProps() }}
      transition={{ duration, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Fancy animated title with text reveal effect
interface AnimatedTitleProps {
  title: string;
  className?: string;
  highlightClassName?: string;
  highlightWords?: string[];
  staggerDelay?: number;
}

export const AnimatedTitle: React.FC<AnimatedTitleProps> = ({
  title,
  className,
  highlightClassName = "text-primary",
  highlightWords = [],
  staggerDelay = 0.03,
}) => {
  const words = title.split(" ");

  return (
    <h2 className={cn("flex flex-wrap", className)}>
      {words.map((word, i) => {
        const isHighlighted = highlightWords.includes(word);
        return (
          <motion.span
            key={i}
            className="inline-block overflow-hidden mr-[0.25em]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * staggerDelay }}
          >
            <motion.span
              className={cn(isHighlighted && highlightClassName, "inline-block")}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ 
                delay: i * staggerDelay,
                duration: 0.5,
                ease: [0.33, 1, 0.68, 1] 
              }}
            >
              {word}
            </motion.span>
          </motion.span>
        );
      })}
    </h2>
  );
};

// Glowing animated button/icon
interface GlowingElementProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  glowOpacity?: number;
  glowSize?: string;
  pulseAnimation?: boolean;
}

export const GlowingElement: React.FC<GlowingElementProps> = ({
  children,
  className,
  glowColor = "rgba(255, 255, 255, 0.5)",
  glowOpacity = 0.5,
  glowSize = "20px",
  pulseAnimation = true,
  ...props
}) => {
  return (
    <motion.div
      className={cn("relative inline-flex items-center justify-center", className)}
      {...props}
    >
      <motion.div
        className="absolute inset-0 rounded-full z-0"
        style={{
          boxShadow: `0 0 ${glowSize} ${glowColor}`,
          opacity: glowOpacity,
        }}
        animate={
          pulseAnimation
            ? {
                opacity: [glowOpacity * 0.7, glowOpacity, glowOpacity * 0.7],
                scale: [0.95, 1.05, 0.95],
              }
            : {}
        }
        transition={
          pulseAnimation
            ? {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }
            : {}
        }
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}; 