import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, CreditCard, LineChart, BarChart, Sparkles, TrendingUp, 
  Wallet, BarChart3, PieChart, Calculator, Braces, Globe, Star, Coins } from "lucide-react";
import { useUser } from "../../../context/UserContext";

const ICONS = [DollarSign, CreditCard, LineChart, TrendingUp, Wallet, BarChart3, PieChart, Calculator];

const FINANCIAL_QUOTES = [
  "The best investment you can make is in yourself.",
  "Financial freedom is a mental, emotional and educational process.",
  "It's not how much money you make, but how much money you keep.",
  "Do not save what is left after spending, but spend what is left after saving.",
  "The price of anything is the amount of life you exchange for it.",
  "A budget tells us what we can't afford, but it doesn't keep us from buying it.",
  "An investment in knowledge pays the best interest.",
  "Money is a terrible master but an excellent servant.",
  "Time is more valuable than money. You can get more money, but you cannot get more time.",
  "The stock market is filled with individuals who know the price of everything, but the value of nothing."
];

interface AdvancedPreloaderProps {
  duration?: number;
  onComplete?: () => void;
}

const AdvancedPreloader: React.FC<AdvancedPreloaderProps> = ({ 
  duration = 4500, 
  onComplete 
}) => {
  const { currency } = useUser();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [counter, setCounter] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  
  // Use the correct currency format based on user's location
  const getFormattedAmount = (amount: number) => {
    // For users in India, use INR
    const currencyCode = currency?.code || 'INR';
    const locale = currency?.locale || 'en-IN';
    
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    
    return formatter.format(amount);
  };
  
  // Generate random positions for particles
  const particles = Array.from({ length: 50 }).map(() => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 6 + 2,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 2,
  }));

  // Generate data for the bars visualization
  const dataVisualizationBars = Array.from({ length: 12 }).map(() => ({
    height: 10 + Math.random() * 30,
    color: `hsl(${Math.random() * 40 + 30}, 90%, 60%)`,
  }));
  
  // Simulate market data for holographic animation
  const marketData = Array.from({ length: 24 }).map((_, i) => {
    const value = 50 + Math.sin(i * 0.3) * 30 + Math.random() * 10;
    return {
      value,
      x: (i / 23) * 100,
      y: 100 - (value / 100) * 80,
    };
  });

  useEffect(() => {
    let startTime = Date.now();
    let timer: number;
    let counterTimer: number;
    let quoteTimer: NodeJS.Timeout;
    
    // Animate progress bar
    const animate = () => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = Math.min(100, (elapsedTime / duration) * 100);
      setProgress(newProgress);
      
      if (newProgress < 100) {
        timer = window.requestAnimationFrame(animate);
      } else {
        // Start fade out when progress is complete
        setTimeout(() => {
          setIsVisible(false);
          if (onComplete) setTimeout(onComplete, 600);
        }, 800);
      }
    };
    
    // Animate counter
    const animateCounter = () => {
      setCounter(prev => {
        const elapsedTime = Date.now() - startTime;
        const percent = Math.min(1, elapsedTime / duration);
        
        // Use easeOutExpo for the counter animation
        const easeOutExpo = 1 - Math.pow(2, -10 * percent);
        return Math.floor(easeOutExpo * 1000000);
      });
      
      if (Date.now() - startTime < duration) {
        counterTimer = window.requestAnimationFrame(animateCounter);
      }
    };
    
    // Rotate through financial quotes
    quoteTimer = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % FINANCIAL_QUOTES.length);
    }, 3000);
    
    timer = window.requestAnimationFrame(animate);
    counterTimer = window.requestAnimationFrame(animateCounter);
    
    return () => {
      window.cancelAnimationFrame(timer);
      window.cancelAnimationFrame(counterTimer);
      clearInterval(quoteTimer);
    };
  }, [duration, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900/95 backdrop-blur-lg overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Background radial gradient */}
          <div className="absolute inset-0 bg-gradient-radial from-black via-gray-900 to-black opacity-70"></div>
          
          {/* Grid lines for 3D effect */}
          <div className="absolute inset-0 overflow-hidden" style={{ perspective: "1000px" }}>
            <motion.div 
              className="absolute w-full h-full grid grid-cols-12 grid-rows-12"
              style={{ 
                transform: "rotateX(60deg)", 
                transformStyle: "preserve-3d",
                top: "-20%"
              }}
              animate={{
                y: [0, 5, 0],
                rotateX: [60, 65, 60],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div 
                  key={`grid-row-${i}`}
                  className="w-full h-px bg-yellow-500/10"
                  animate={{
                    opacity: [0.05, 0.2, 0.05],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.1,
                  }}
                />
              ))}
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div 
                  key={`grid-col-${i}`}
                  className="h-full w-px bg-yellow-500/10"
                  animate={{
                    opacity: [0.05, 0.2, 0.05],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.1,
                  }}
                />
              ))}
            </motion.div>
          </div>
          
          {/* Animated Background Particles */}
          {particles.map((particle, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full bg-yellow-400/30"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
              }}
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0.5],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut",
              }}
            />
          ))}
          
          {/* Holographic Market Data Line */}
          <div className="absolute bottom-20 left-20 right-20 h-40 overflow-hidden opacity-30">
            <motion.svg 
              viewBox="0 0 100 100" 
              className="w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              {/* Creating the line path */}
              <motion.path
                d={`M ${marketData.map(point => `${point.x},${point.y}`).join(' L ')}`}
                fill="none"
                stroke="url(#marketGradient)"
                strokeWidth="0.5"
                strokeLinecap="round"
                animate={{
                  y: [0, -5, 0, 5, 0],
                  x: [0, 2, 0, -2, 0],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              {/* Gradient for the line */}
              <defs>
                <linearGradient id="marketGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FACC15" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#FFFF00" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#FACC15" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              
              {/* Add glowing dots at each data point */}
              {marketData.map((point, i) => (
                <motion.circle
                  key={`market-point-${i}`}
                  cx={point.x}
                  cy={point.y}
                  r="0.7"
                  fill="#FFFF00"
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    r: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.svg>
          </div>
          
          {/* Data Visualization Bars */}
          <div className="absolute top-40 right-20 flex h-32 items-end space-x-1 opacity-30">
            {dataVisualizationBars.map((bar, i) => (
              <motion.div
                key={`bar-${i}`}
                className="w-2 rounded-t-sm"
                style={{ backgroundColor: bar.color }}
                initial={{ height: 0 }}
                animate={{
                  height: [bar.height * 0.5, bar.height, bar.height * 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
          
          {/* Glowing circle background effect */}
          <motion.div
            className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-yellow-400/10 to-amber-500/10"
            animate={{ 
              scale: [1, 1.2, 1],
              boxShadow: [
                "0 0 30px 10px rgba(250, 204, 21, 0.1)",
                "0 0 70px 20px rgba(250, 204, 21, 0.2)",
                "0 0 30px 10px rgba(250, 204, 21, 0.1)"
              ]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* 3D Animated Coin */}
          <motion.div 
            className="absolute top-20 left-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 2, delay: 1 }}
          >
            <motion.div
              className="relative w-16 h-16 rounded-full bg-gradient-to-r from-yellow-300 to-amber-500 flex items-center justify-center"
              animate={{
                rotateY: [0, 360],
                scaleX: [1, 0.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <DollarSign className="text-gray-900 w-8 h-8" />
            </motion.div>
          </motion.div>
          
          {/* Logo/Brand with reveal animation */}
          <motion.div 
            className="relative z-10 mb-12 flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="relative flex items-center justify-center w-28 h-28 mb-4"
            >
              {/* Animated outer ring */}
              <motion.div
                className="absolute w-full h-full rounded-full border-4 border-yellow-400/50"
                animate={{ 
                  rotate: 360,
                  boxShadow: [
                    "0 0 10px 2px rgba(250, 204, 21, 0.3)",
                    "0 0 20px 4px rgba(250, 204, 21, 0.5)",
                    "0 0 10px 2px rgba(250, 204, 21, 0.3)"
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Second animated ring */}
              <motion.div
                className="absolute w-[90%] h-[90%] rounded-full border-2 border-dashed border-amber-400/70"
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Central logo */}
              <motion.div
                className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20"
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Wallet className="w-8 h-8 text-gray-900" />
              </motion.div>
              
              {/* Orbiting financial icons */}
              {ICONS.map((Icon, index) => {
                const angle = (index / ICONS.length) * Math.PI * 2;
                const radius = 60; // Distance from center
                
                return (
                  <motion.div
                    key={`icon-${index}`}
                    className="absolute w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/80 backdrop-blur-sm border border-gray-700"
                    initial={{ 
                      x: Math.cos(angle) * radius, 
                      y: Math.sin(angle) * radius,
                      opacity: 0
                    }}
                    animate={{ 
                      x: [
                        Math.cos(angle) * radius,
                        Math.cos(angle + Math.PI * 2) * radius
                      ],
                      y: [
                        Math.sin(angle) * radius,
                        Math.sin(angle + Math.PI * 2) * radius
                      ],
                      opacity: [0, 1, 1, 0],
                      scale: [0.8, 1, 1, 0.8]
                    }}
                    transition={{ 
                      duration: 8,
                      times: [0, 0.1, 0.9, 1],
                      repeat: Infinity,
                      delay: index * 0.2
                    }}
                  >
                    <Icon className="w-4 h-4 text-yellow-400" />
                  </motion.div>
                );
              })}
            </motion.div>
            
            {/* Logo Text */}
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 to-amber-600 bg-clip-text text-transparent">
                Wealth Wise
              </h1>
              <motion.p 
                className="text-gray-400 text-sm mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                Your financial future, reimagined
              </motion.p>
            </motion.div>
          </motion.div>
          
          {/* Financial Quote */}
          <motion.div
            className="mb-8 relative h-8 w-80 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={`quote-${quoteIndex}`}
                className="absolute text-center text-gray-300 text-sm italic"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                "{FINANCIAL_QUOTES[quoteIndex]}"
              </motion.p>
            </AnimatePresence>
          </motion.div>
          
          {/* Counter */}
          <motion.div
            className="mb-8 text-2xl font-semibold bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {getFormattedAmount(counter)}
          </motion.div>
          
          {/* Progress bar */}
          <motion.div 
            className="relative w-64 h-1.5 bg-gray-700 rounded-full overflow-hidden mb-4"
            initial={{ opacity: 0, scaleX: 0.8 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"
              style={{ width: `${progress}%` }}
              animate={{
                boxShadow: [
                  "0 0 5px 0px rgba(250, 204, 21, 0.5)",
                  "0 0 12px 3px rgba(250, 204, 21, 0.7)",
                  "0 0 5px 0px rgba(250, 204, 21, 0.5)"
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
          
          {/* Loading text */}
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <p className="text-sm text-gray-400">Loading your financial dashboard</p>
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="h-4 w-4 text-yellow-400" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdvancedPreloader; 