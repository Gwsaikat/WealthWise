import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronRight, Menu, X, Sparkles, Zap, PlusCircle, Wand2 } from "lucide-react";
import { Button } from "../ui/button";

// SEO Optimization Components - For demonstration purposes
// These would normally be implemented with Next.js or React Helmet
const SEOMetaTags = () => {
  return (
    <React.Fragment>
      {/* In production, these tags would be used with proper meta tag implementation */}
      {/* This is just a reference for SEO best practices */}
    </React.Fragment>
  );
};

// Structured data schema for rich search results
const StructuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "WealthWise",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web, iOS, Android",
  "offers": {
    "@type": "Offer",
    "price": "49",
    "priceCurrency": "INR"
  },
  "description": "AI-powered student budgeting tool that simplifies financial management with minimal input required.",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "ratingCount": "10000"
  }
};

// Component to render structured data
const StructuredDataComponent = () => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(StructuredData) }}
    />
  );
};

// Animated 3D geometric shapes component
const GeometricShapes = () => {
  return (
    <div className="absolute inset-0 z-5 overflow-hidden pointer-events-none">
      {/* Cube */}
      <motion.div
        className="absolute w-32 h-32 rounded-lg border border-yellow-500/10 top-[15%] right-[10%]"
        style={{ 
          transformStyle: "preserve-3d",
          perspective: "1000px"
        }}
        animate={{
          rotateX: [0, 25, 0, -25, 0],
          rotateY: [0, 25, 45, 25, 0],
          boxShadow: ["0 0 0px rgba(234, 179, 8, 0.1)", "0 0 20px rgba(234, 179, 8, 0.2)", "0 0 0px rgba(234, 179, 8, 0.1)"]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Sphere */}
      <motion.div
        className="absolute w-24 h-24 rounded-full border border-blue-500/10 top-[65%] left-[15%]"
        animate={{
          scale: [1, 1.1, 1, 0.9, 1],
          boxShadow: ["0 0 0px rgba(59, 130, 246, 0.1)", "0 0 30px rgba(59, 130, 246, 0.2)", "0 0 0px rgba(59, 130, 246, 0.1)"]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Triangle */}
      <motion.div
        className="absolute w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[70px] border-purple-500/10 bottom-[15%] right-[20%]"
        animate={{
          rotate: [0, 15, 0, -15, 0],
          filter: ["drop-shadow(0 0 0px rgba(168, 85, 247, 0.1))", "drop-shadow(0 0 15px rgba(168, 85, 247, 0.2))", "drop-shadow(0 0 0px rgba(168, 85, 247, 0.1))"]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

// Particle component for the floating dust effect
const Particle = ({ index }: { index: number }) => {
  const size = Math.random() * 2 + 1;
  const duration = Math.random() * 15 + 10;
  const initialX = Math.random() * 100;
  const initialY = Math.random() * 100;
  const delay = Math.random() * 5;
  
  return (
    <motion.div
      key={`particle-${index}`}
      className="absolute rounded-full bg-yellow-400/20"
      style={{
        width: size,
        height: size,
        left: `${initialX}%`,
        top: `${initialY}%`,
        boxShadow: `0 0 ${size}px ${size / 2}px rgba(250, 204, 21, 0.1)`,
      }}
      animate={{
        x: [0, Math.random() * 100 - 50, 0],
        y: [0, Math.random() * 100 - 50, 0],
        opacity: [0.1, 0.3, 0.1],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
};

// Spotlight component for the glow effect
const Spotlight = () => {
  const spotlightRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    const moveSpotlight = (e: MouseEvent) => {
      if (!spotlightRef.current) return;
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculate the position relative to window
      const x = clientX / innerWidth;
      const y = clientY / innerHeight;
      
      // Update spotlight position with some dampening to make it smoother
      spotlightRef.current.style.background = `radial-gradient(
        800px circle at ${x * 100}% ${y * 100}%,
        rgba(234, 179, 8, 0.08),
        transparent 40%
      )`;
    };
    
    window.addEventListener("mousemove", moveSpotlight);
    
    return () => {
      window.removeEventListener("mousemove", moveSpotlight);
    };
  }, []);
  
  return <div ref={spotlightRef} className="absolute inset-0 z-10 transition-all duration-300 ease-in-out" />;
};

// Grid lines background effect
const GridLines = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-[0.03]">
      <div className="h-full w-full bg-[linear-gradient(to_right,#4f4f4f_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
    </div>
  );
};

// Pricing card component
const PricingCard = ({ 
  title, 
  price, 
  features, 
  isPopular 
}: { 
  title: string; 
  price: string; 
  features: string[]; 
  isPopular?: boolean; 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`relative p-8 rounded-2xl backdrop-blur-xl border ${
        isPopular 
          ? "bg-yellow-500/10 border-yellow-500/50 shadow-lg shadow-yellow-500/20" 
          : "bg-gray-900/40 border-gray-700/50"
      }`}
    >
      {isPopular && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-4 left-1/2 transform -translate-x-1/2"
        >
          <span className="bg-yellow-500 text-black text-xs font-semibold px-3 py-1 rounded-full">
            Most Popular
          </span>
        </motion.div>
      )}
      
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
        <div className="flex items-baseline justify-center">
          <span className="text-4xl font-bold text-white">{price}</span>
          <span className="text-gray-400 ml-2">/month</span>
        </div>
      </div>
      
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className="flex items-center text-gray-300"
          >
            <Sparkles className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0" />
            {feature}
          </motion.li>
        ))}
      </ul>
      
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          className={`w-full ${
            isPopular
              ? "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900"
              : "bg-gray-800 hover:bg-gray-700 text-white"
          } font-medium py-3 rounded-xl transition-all duration-200`}
        >
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

// Add this SEO component for improved search engine optimization
const SEOMetadata = () => {
  return (
    <React.Fragment>
      {/* These would normally go in your head element using a framework like Next.js or Helmet in React */}
      {/* This is just to demonstrate what would be used for SEO optimization */}
      {/* 
      <title>WealthWise | AI-Powered Student Budgeting Tool</title>
      <meta name="description" content="WealthWise - The smart financial companion designed specifically for students. AI-powered budgeting with minimal input required." />
      <meta name="keywords" content="AI budgeting, student finance, financial planning, budget app, expense tracker, finance AI, student budget tool" />
      
      <meta property="og:title" content="WealthWise | AI-Powered Student Budgeting Tool" />
      <meta property="og:description" content="Manage your student finances effortlessly with AI-powered insights. Minimal input, maximum results." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://wealthwise.app" />
      <meta property="og:image" content="https://wealthwise.app/social-preview.jpg" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="WealthWise | AI-Powered Student Budgeting Tool" />
      <meta name="twitter:description" content="Manage your student finances effortlessly with AI-powered insights. Minimal input, maximum results." />
      <meta name="twitter:image" content="https://wealthwise.app/social-preview.jpg" />
      
      <link rel="canonical" href="https://wealthwise.app" />
      */}
    </React.Fragment>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  // Refs for scroll animations
  const featuresRef = React.useRef(null);
  const featuresInView = useInView(featuresRef, { once: false, amount: 0.3 });
  const featuresControls = useAnimation();
  
  React.useEffect(() => {
    if (featuresInView) {
      featuresControls.start("visible");
    }
  }, [featuresInView, featuresControls]);

  const handleTryDemo = () => {
    navigate("/login");
  };

  const handleGetStarted = () => {
    navigate("/signup");
  };

  const handleLearnMore = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavClick = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const navigateToRegister = () => {
    navigate('/register');
  };

  const navigateToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Add structured data for SEO */}
      <StructuredDataComponent />
      
      {/* Invisible SEO optimizations that would normally be in head */}
      {process.env.NODE_ENV === 'production' && (
        <>
          {/* These would normally be implemented with Next.js Head or React Helmet */}
          {/* This is just for demonstration of what would be included */}
          {/* 
          <title>WealthWise | #1 AI-Powered Student Budget Tool | Manage Finances Effortlessly</title>
          <meta name="description" content="WealthWise is the leading AI-powered student finance app. Manage your budget with minimal input and get smart financial insights tailored for students." />
          <meta name="keywords" content="AI finance tool, student budget app, financial management, AI budgeting, expense tracker, student finance, budget planner" />
          */}
        </>
      )}
      
      {/* Metallic background texture overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMDMwMzAzIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMwYTBhMGEiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-20 z-0"></div>
      
      {/* Grid lines background */}
      <GridLines />
      
      {/* Moving spotlight effect */}
      <Spotlight />
      
      {/* Geometric shapes */}
      <GeometricShapes />
      
      {/* Animated particles */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {Array.from({ length: 120 }).map((_, index) => (
          <Particle key={index} index={index} />
        ))}
      </div>
      
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <motion.div 
          className="absolute -top-[30%] -left-[10%] w-[80%] h-[80%] bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent blur-3xl"
          animate={{ 
            rotate: [0, 5, 0], 
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.5, 0.3]
          }} 
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute top-[20%] right-[5%] w-[50%] h-[60%] bg-gradient-to-bl from-amber-500/5 via-transparent to-transparent blur-3xl" 
          animate={{ 
            rotate: [0, -5, 0], 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2]
          }} 
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute bottom-[10%] left-[20%] w-[40%] h-[40%] bg-gradient-to-tr from-yellow-500/5 via-transparent to-transparent blur-3xl"
          animate={{ 
            rotate: [0, 8, 0], 
            scale: [1, 1.08, 1],
            opacity: [0.1, 0.3, 0.1]
          }} 
          transition={{ 
            duration: 18, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5 
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between relative z-50 bg-black/20 backdrop-blur-sm border-b border-yellow-900/10">
        <Link to="/" className="flex items-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold flex items-center"
          >
            <motion.span 
              className="text-yellow-400"
              animate={{ 
                textShadow: ["0 0 0px rgba(234, 179, 8, 0)", "0 0 10px rgba(234, 179, 8, 0.5)", "0 0 0px rgba(234, 179, 8, 0)"]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Wealth
            </motion.span>
            <span className="ml-1">Wise</span>
          </motion.div>
        </Link>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            className="text-white hover:bg-gray-800/50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md p-6 rounded-b-xl border border-yellow-900 md:hidden z-50"
          >
            <div className="flex flex-col space-y-4">
              {[
                  { name: "Features", id: "features" },
                  { name: "Pricing", id: "pricing" },
                  { name: "Testimonials", id: "testimonials" },
                  { name: "FAQ", id: "faq" },
                  { name: "Contact", id: "contact" },
              ].map((item) => (
                <a
                    key={item.name}
                    href={`#${item.id}`}
                    className="text-gray-300 hover:text-yellow-400 transition-colors py-2 px-4 rounded-lg hover:bg-gray-800/50 flex items-center"
                    onClick={() => handleNavClick(item.id)}
                  >
                    <motion.span
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      className="absolute bottom-0 left-0 h-[1px] bg-yellow-400/50"
                    />
                    <ChevronRight className="h-3 w-3 mr-2 text-yellow-400" />
                    {item.name}
                </a>
              ))}
              <Button
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium w-full mt-2 flex items-center justify-center gap-2"
                onClick={() => {
                    handleTryDemo();
                  setMobileMenuOpen(false);
                }}
              >
                  <Wand2 className="h-4 w-4" /> 
                  Try Demo
              </Button>
            </div>
          </motion.div>
        )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="hidden md:flex items-center space-x-8"
        >
          {[
            { name: "Features", id: "features" },
            { name: "Pricing", id: "pricing" },
            { name: "Testimonials", id: "testimonials" },
            { name: "FAQ", id: "faq" },
            { name: "Contact", id: "contact" },
          ].map((item) => (
            <motion.a
              key={item.name}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.id);
              }}
              className="text-gray-300 hover:text-yellow-400 transition-colors relative"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <span>{item.name}</span>
              <motion.span
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                className="absolute bottom-0 left-0 h-[1px] bg-yellow-400/50"
              />
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="hidden md:block"
        >
          <Button
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium px-6 shadow-lg shadow-yellow-500/20 flex items-center gap-2 relative overflow-hidden group"
            onClick={handleTryDemo}
          >
            <motion.span 
              className="absolute inset-0 bg-white/20"
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "100%", opacity: [0, 0.5, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut"
              }}
            />
            <Wand2 className="h-4 w-4 group-hover:rotate-12 transition-transform" /> 
            <span>Try Demo</span>
          </Button>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-20 pb-24 relative z-20">
        {/* Enhanced background effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Animated gradient orbs */}
          <motion.div 
            className="absolute -top-40 -left-40 w-[40rem] h-[40rem] rounded-full bg-gradient-to-br from-yellow-400/10 via-amber-500/5 to-transparent blur-[8rem]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
              rotate: [0, 45, 0]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute top-20 right-0 w-[30rem] h-[30rem] rounded-full bg-gradient-to-bl from-amber-500/10 via-yellow-400/5 to-transparent blur-[6rem]"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.15, 0.25, 0.15],
              rotate: [0, -30, 0]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          
          {/* Animated tech lines */}
          <div className="absolute inset-0">
            <motion.div 
              className="absolute inset-0 opacity-[0.05]"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"]
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundImage: `linear-gradient(45deg, #fbbf24 1px, transparent 1px), linear-gradient(-45deg, #fbbf24 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
              }}
            />
          </div>

          {/* Floating particles with trails */}
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={`particle-trail-${i}`}
              className="absolute w-1 h-1 bg-yellow-400/30"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                x: [null, Math.random() * window.innerWidth],
                y: [null, Math.random() * window.innerHeight],
              }}
              transition={{
                duration: Math.random() * 20 + 20,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <motion.div
                className="absolute w-12 h-[1px] origin-left bg-gradient-to-r from-yellow-400/30 to-transparent"
                animate={{ scaleX: [0, 1, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="max-w-2xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400/10 via-amber-500/10 to-yellow-400/10 backdrop-blur-sm mb-6 border border-yellow-500/20 relative overflow-hidden group"
            >
              {/* Animated gradient beam */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/20 to-yellow-400/0"
                animate={{
                  x: ['-200%', '200%'],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "linear",
                }}
              />

              {/* Pulsing dot */}
              <motion.div 
                className="relative w-4 h-4"
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.div 
                  className="absolute inset-0 rounded-full bg-yellow-400"
                  animate={{ 
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div 
                  className="absolute inset-0 rounded-full bg-yellow-400"
                  animate={{ 
                    scale: [1, 2],
                    opacity: [0.7, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              </motion.div>

              <span className="ml-2 text-sm font-medium relative z-10 bg-gradient-to-r from-yellow-300 via-amber-500 to-yellow-300 text-transparent bg-clip-text">
                AI-Powered Student Budgeting
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-6"
            >
              <span className="relative inline-block bg-gradient-to-r from-white via-yellow-100 to-white text-transparent bg-clip-text">
                Smart Budgeting
              </span>
              <br />
              <span className="relative mt-2 inline-block">
                Made 
                <motion.span 
                  className="relative ml-3 inline-block bg-gradient-to-r from-yellow-300 via-amber-500 to-yellow-300 text-transparent bg-clip-text"
                  animate={{
                    textShadow: [
                      "0 0 20px rgba(234, 179, 8, 0.2)",
                      "0 0 40px rgba(234, 179, 8, 0.4)",
                      "0 0 20px rgba(234, 179, 8, 0.2)"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Effortless
                  <motion.span 
                    className="absolute -bottom-1 left-0 w-full h-[3px]"
                    style={{
                      background: "linear-gradient(90deg, rgba(234,179,8,0) 0%, rgba(234,179,8,0.7) 50%, rgba(234,179,8,0) 100%)"
                    }}
                    animate={{
                      width: ["0%", "100%"],
                      left: ["0%", "0%"],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-gray-300 text-lg mb-8 max-w-lg leading-relaxed"
            >
              Your AI budgeting friend that requires minimum input. Just enter your income and daily food budget—we'll handle the rest with smart suggestions and automated tracking.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-gray-900 font-medium px-8 py-4 text-lg group shadow-lg shadow-yellow-500/20 transition-all duration-300 hover:scale-105 relative overflow-hidden"
                onClick={handleGetStarted}
              >
                <motion.span 
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0"
                  initial={{ x: "-100%", opacity: 0 }}
                  animate={{ x: "100%", opacity: [0, 0.5, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeInOut"
                  }}
                />
                <motion.span className="flex items-center gap-2 relative z-10">
                  <Zap className="h-5 w-5 text-gray-900" />
                Get Started
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.span>
                </motion.span>
              </Button>

              <Button
                className="border-2 border-yellow-500/30 text-white hover:bg-yellow-500/10 transition-all duration-300 backdrop-blur-sm px-8 py-4 text-lg relative overflow-hidden group"
                onClick={handleLearnMore}
              >
                <motion.span 
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/10 to-yellow-400/0"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10">Learn More</span>
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-12 flex items-center gap-8"
            >
              <div className="flex items-center gap-2">
                <motion.div 
                  className="flex -space-x-2"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-yellow-400/30 bg-gradient-to-br from-yellow-400/20 to-amber-500/20 backdrop-blur-sm"
                    />
                  ))}
          </motion.div>
                <div className="text-sm">
                  <div className="font-semibold text-white">10k+</div>
                  <div className="text-gray-400">Active Users</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <motion.div 
                  className="flex items-center"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                >
                  {[...Array(5)].map((_, i) => (
                    <motion.svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 1,
                        delay: i * 0.1,
                        repeat: Infinity,
                        repeatDelay: 2
                      }}
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </motion.svg>
                  ))}
                </motion.div>
                <div className="text-sm">
                  <div className="font-semibold text-white">4.9/5</div>
                  <div className="text-gray-400">User Rating</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Dashboard UI */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="relative hidden lg:block"
          >
            {/* Premium glass effect container */}
            <motion.div 
              className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 via-amber-500/20 to-yellow-400/20 rounded-lg blur-xl"
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [0.98, 1.02, 0.98],
                background: [
                  "linear-gradient(to right, rgba(234, 179, 8, 0.2), rgba(245, 158, 11, 0.2), rgba(234, 179, 8, 0.2))",
                  "linear-gradient(to right, rgba(245, 158, 11, 0.2), rgba(234, 179, 8, 0.2), rgba(245, 158, 11, 0.2))",
                  "linear-gradient(to right, rgba(234, 179, 8, 0.2), rgba(245, 158, 11, 0.2), rgba(234, 179, 8, 0.2))"
                ]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Decorative elements */}
            <motion.div 
              className="absolute -top-6 -left-6 w-12 h-12 border border-yellow-500/30 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
                rotate: [0, 360]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            <motion.div 
              className="absolute -bottom-8 -right-8 w-16 h-16 border border-yellow-500/30 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
                rotate: [0, -360]
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            <motion.div 
              className="absolute top-1/3 -right-10 w-8 h-24 border border-yellow-500/20 rounded-full"
              animate={{
                x: [0, 10, 0],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Main dashboard container */}
            <div className="relative w-full h-[500px] rounded-lg overflow-hidden border border-yellow-500/20 shadow-[0_0_25px_rgba(0,0,0,0.3),0_0_15px_rgba(234,179,8,0.2)] backdrop-blur-sm transform perspective-[1000px] rotateX-[2deg]">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 to-black/95 rounded-lg">
                {/* Luxury glass effect overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDIwIDAgTCAwIDAgMCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50 mix-blend-overlay"></div>
                
                {/* Dashboard content */}
                <div className="p-6">
                  {/* Window controls */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      {[
                        { color: "bg-red-500" },
                        { color: "bg-yellow-500" },
                        { color: "bg-green-500" }
                      ].map((button, index) => (
                        <motion.div 
                          key={index}
                          className={`h-3 w-3 rounded-full ${button.color}`}
                          whileHover={{ scale: 1.2 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      <motion.div 
                        className="h-2 w-2 rounded-full bg-yellow-400"
                        animate={{
                          opacity: [0.5, 1, 0.5],
                          scale: [0.8, 1.2, 0.8],
                          boxShadow: [
                            "0 0 0px rgba(234, 179, 8, 0)",
                            "0 0 8px rgba(234, 179, 8, 0.6)",
                            "0 0 0px rgba(234, 179, 8, 0)"
                          ]
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      <motion.div 
                        className="text-xs text-gray-400 font-medium tracking-wide"
                        initial={{ opacity: 0.7 }}
                        whileHover={{ 
                          opacity: 1,
                          color: "#F0F0F0",
                          textShadow: "0 0 8px rgba(234, 179, 8, 0.5)"
                        }}
                      >
                        WealthWise Dashboard
                      </motion.div>
                    </div>
                  </div>

                  {/* Dashboard cards grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    {/* Monthly Budget Card */}
                    <motion.div 
                      className="bg-gray-800/80 p-4 rounded-lg border border-yellow-500/20 backdrop-blur-sm relative overflow-hidden group"
                      whileHover={{ 
                        y: -5,
                        boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.5)",
                        borderColor: "rgba(234, 179, 8, 0.3)"
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {/* Animated gradient background */}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-amber-500/5 to-yellow-500/5"
                        animate={{
                          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                        }}
                        transition={{
                          duration: 15,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                      
                      <div className="relative z-10">
                        <div className="text-sm text-gray-400 mb-2 flex items-center">
                          <motion.div 
                            className="w-1 h-1 bg-yellow-400 rounded-full mr-2"
                            animate={{ 
                              scale: [1, 1.5, 1],
                              opacity: [0.5, 1, 0.5]
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                          Monthly Budget
                      </div>
                        <motion.div 
                          className="text-2xl font-bold text-white relative group-hover:text-yellow-50"
                          whileHover={{
                            y: -2,
                            x: 2,
                            textShadow: "0 3px 10px rgba(234, 179, 8, 0.3)"
                          }}
                        >
                          ₹12,500
                        </motion.div>
                        <div className="mt-2 text-xs text-green-400 flex items-center group-hover:text-green-300">
                          <motion.div
                            animate={{
                              x: [0, 3, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            <ArrowRight className="h-3 w-3 rotate-45 mr-1" />
                          </motion.div>
                          28 days left
                      </div>
                      </div>
                    </motion.div>

                    {/* Daily Food Card */}
                    <motion.div 
                      className="bg-gray-800/80 p-4 rounded-lg border border-yellow-500/20 backdrop-blur-sm relative overflow-hidden group"
                      whileHover={{ 
                        y: -5,
                        boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.5)",
                        borderColor: "rgba(234, 179, 8, 0.3)"
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {/* Animated gradient background */}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-l from-yellow-500/5 via-amber-500/5 to-yellow-500/5"
                        animate={{
                          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                        }}
                        transition={{
                          duration: 15,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                      
                      <div className="relative z-10">
                        <div className="text-sm text-gray-400 mb-2 flex items-center">
                          <motion.div 
                            className="w-1 h-1 bg-yellow-400 rounded-full mr-2"
                            animate={{ 
                              scale: [1, 1.5, 1],
                              opacity: [0.5, 1, 0.5]
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 0.5
                            }}
                          />
                          Daily Food
                    </div>
                        <motion.div 
                          className="text-2xl font-bold text-white relative group-hover:text-yellow-50"
                          whileHover={{
                            y: -2,
                            x: 2,
                            textShadow: "0 3px 10px rgba(234, 179, 8, 0.3)"
                          }}
                        >
                          ₹300
                        </motion.div>
                        <div className="mt-2 text-xs text-green-400 flex items-center group-hover:text-green-300">
                          <motion.div
                            animate={{
                              x: [0, 3, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            <ArrowRight className="h-3 w-3 rotate-45 mr-1" />
                          </motion.div>
                          ₹120 under budget
                      </div>
                      </div>
                    </motion.div>
                    </div>

                  {/* Category Distribution */}
                  <div className="bg-gray-800/60 rounded-lg border border-yellow-500/20 backdrop-blur-sm p-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-sm text-gray-300 font-medium">Category Distribution</div>
                      <div className="flex items-center space-x-2">
                        <motion.div 
                          className="h-2 w-2 rounded-full bg-yellow-400"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        <span className="text-xs text-gray-500">Real-time</span>
                      </div>
                        </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        {[
                          { name: "Food", percent: 35, color: "bg-yellow-400" },
                          { name: "Transport", percent: 25, color: "bg-green-400" },
                          { name: "Entertainment", percent: 20, color: "bg-blue-400" },
                          { name: "Study", percent: 20, color: "bg-purple-400" }
                        ].map((category, index) => (
                          <motion.div
                            key={category.name}
                            className="relative"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-400">{category.name}</span>
                              <span className="text-sm text-white">{category.percent}%</span>
                      </div>
                            <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
                              <motion.div
                                className={`h-full ${category.color}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${category.percent}%` }}
                                transition={{ duration: 1, delay: index * 0.2 }}
                              >
                                {/* Removing the white animation beam effect */}
                                {/* 
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
                                  animate={{
                                    x: ['-100%', '100%']
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "linear",
                                    delay: index * 0.2
                                  }}
                                />
                                */}
                              </motion.div>
                      </div>
                          </motion.div>
                        ))}
                  </div>

                      <div className="flex items-center justify-center">
                        <div className="relative w-32 h-32">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke="rgba(234, 179, 8, 0.1)"
                              strokeWidth="8"
                            />
                            <motion.circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke="rgba(234, 179, 8, 0.6)"
                              strokeWidth="8"
                              strokeLinecap="round"
                              strokeDasharray="283"
                              initial={{ strokeDashoffset: 283 }}
                              animate={{ strokeDashoffset: 70 }}
                              transition={{ duration: 2, ease: "easeInOut" }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                              className="text-2xl font-bold text-yellow-400"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.5 }}
                            >
                              75%
                            </motion.div>
                      </div>
                    </div>
                        </div>
                        </div>
                      </div>

                  {/* AI Recommendations */}
                  <motion.div 
                    className="bg-gray-800/80 p-6 rounded-lg border border-yellow-500/20 backdrop-blur-sm relative overflow-hidden group mb-6"
                    whileHover={{ 
                      y: -2,
                      boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.5)",
                      borderColor: "rgba(234, 179, 8, 0.3)"
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div 
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Sparkles className="h-4 w-4 text-yellow-400" />
                      </motion.div>
                      <span className="text-sm font-medium text-gray-300">AI Recommendations</span>
                        </div>

                    <div className="space-y-3">
                      {[
                        "Save ₹1,250 for semester-end trip",
                        "Reduce weekly coffee expense by ₹100",
                        "Set aside ₹500 for upcoming textbooks"
                      ].map((recommendation, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/30 group/item"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ 
                            backgroundColor: "rgba(234, 179, 8, 0.1)",
                            borderColor: "rgba(234, 179, 8, 0.3)"
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                            <span className="text-sm text-gray-300 group-hover/item:text-white transition-colors">
                              {recommendation}
                            </span>
                        </div>
                          <motion.button
                            className="p-1.5 rounded-full bg-gray-700/50 text-gray-400 hover:bg-yellow-500/20 hover:text-yellow-400 transition-colors"
                            whileHover={{ scale: 1.1 }}
                          >
                            <PlusCircle className="h-4 w-4" />
                          </motion.button>
                        </motion.div>
                      ))}
                      </div>
                  </motion.div>

                  {/* Quick Actions */}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {["Add Expense", "Set Budget", "View Report"].map((action, index) => (
                        <motion.button
                          key={action}
                          className="px-4 py-2 text-sm rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 hover:bg-yellow-400/20 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {action}
                        </motion.button>
                      ))}
                    </div>
                    <motion.button
                      className="text-sm text-yellow-400 flex items-center gap-1 hover:gap-2 transition-all"
                      whileHover={{ x: 3 }}
                    >
                      View Details
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div
        id="features"
        ref={featuresRef}
        className="container mx-auto px-6 py-20 relative z-20"
      >
        <div className="text-center mb-16 relative">
          {/* Subtle highlight beam behind section title */}
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-24 bg-yellow-400/5 blur-3xl rounded-full"
            animate={{
              opacity: [0.3, 0.7, 0.3],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={featuresControls}
            variants={{
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-amber-500 to-yellow-300"
          >
            Smart Financial Management
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={featuresControls}
            variants={{
              visible: { opacity: 1, y: 0, transition: { delay: 0.2 } }
            }}
            className="text-gray-300 max-w-2xl mx-auto"
          >
            Powerful tools to help you manage your finances, track investments,
            and plan for the future.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "AI Budget Creator",
              description: "Just enter basic info and our AI generates a complete student budget customized to your needs.",
              icon: <Wand2 className="h-5 w-5" />,
              color: "from-yellow-400/20 to-yellow-500/5"
            },
            {
              title: "Expense Tracking",
              description: "Automatically categorizes your spending and shows where your money goes each month.",
              icon: <ArrowRight className="h-5 w-5" />,
              color: "from-blue-400/20 to-blue-500/5"
            },
            {
              title: "Smart Notifications",
              description: "Get alerts when you're approaching spending limits or when it's time to pay fees.",
              icon: <div className="h-5 w-5 rounded-full border-2 border-purple-400 flex items-center justify-center">
                <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
              </div>,
              color: "from-purple-400/20 to-purple-500/5"
            },
            {
              title: "Financial Insights",
              description: "Our AI analyzes your spending patterns to provide personalized savings opportunities.",
              icon: <Sparkles className="h-5 w-5" />,
              color: "from-green-400/20 to-green-500/5"
            },
            {
              title: "Goal Setting",
              description: "Set saving goals for tuition, textbooks, or travel and track your progress automatically.",
              icon: <div className="h-5 w-5 flex items-center justify-center">
                <div className="h-4 w-4 border-2 border-red-400 rounded-sm flex items-center justify-center">
                  <div className="h-2 w-2 bg-red-400"></div>
                </div>
              </div>,
              color: "from-red-400/20 to-red-500/5"
            },
            {
              title: "Semester Planning",
              description: "Plan your finances semester by semester with forecasting for upcoming expenses.",
              icon: <div className="h-5 w-5 flex items-center justify-center">
                <div className="h-3 w-3 border-2 border-teal-400 transform rotate-45"></div>
              </div>,
              color: "from-teal-400/20 to-teal-500/5"
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={featuresControls}
              variants={{
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  transition: { delay: 0.1 * index, duration: 0.5 }
                }
              }}
              whileHover={{
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="relative group"
            >
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-yellow-400/10 to-purple-500/10 opacity-0 group-hover:opacity-100 blur-xl transition duration-500"></div>
              <div className="relative p-6 bg-gray-900/90 backdrop-blur-sm border border-gray-800/60 rounded-xl overflow-hidden">
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-30 group-hover:opacity-40 transition-opacity duration-500`}></div>
                
                {/* Feature content */}
                <div className="relative z-10">
                  <div className="mb-4 p-3 inline-flex rounded-lg bg-gray-800/80 text-yellow-400 group-hover:scale-110 group-hover:bg-yellow-400/20 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-amber-500 to-yellow-300 group-hover:opacity-90 transition-opacity duration-300">{feature.title}</h3>
                  <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-6 py-24 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Simple <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-500">Pricing</span> for Everyone
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg"
          >
            Choose the plan that works best for your financial goals
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Student Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
            className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-800 relative overflow-hidden"
          >
            {/* Background glow effect */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-yellow-400/5 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Student Plan</h3>
                  <p className="text-gray-400">For students on a budget</p>
                </div>
                <div className="bg-yellow-400/10 rounded-full p-3">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-white">₹49</span>
                  <span className="text-gray-400 ml-2">/month</span>
                </div>
                <div className="text-xs text-yellow-400 mt-1">Billed monthly, cancel anytime</div>
              </div>
              
              <ul className="space-y-4 mb-8">
                {[
                  "AI Budget Generator",
                  "Expense Tracking",
                  "Basic Financial Insights",
                  "Email Support",
                  "Mobile App Access"
                ].map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center text-gray-300"
                  >
                    <svg className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </motion.li>
                ))}
              </ul>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3 px-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-lg transition-colors duration-300"
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>
          
          {/* Professional Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
            className="bg-gradient-to-br from-yellow-500/20 via-amber-500/10 to-yellow-500/5 backdrop-blur-xl rounded-2xl p-8 border border-yellow-500/30 relative overflow-hidden"
          >
            {/* Background glow effect */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-yellow-400/10 rounded-full blur-3xl" />
            
            <div className="absolute top-0 right-0">
              <div className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                RECOMMENDED
              </div>
            </div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Professional Plan</h3>
                  <p className="text-gray-400">For professionals and working adults</p>
                </div>
                <div className="bg-yellow-400/20 rounded-full p-3">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-white">₹199</span>
                  <span className="text-gray-400 ml-2">/month</span>
                </div>
                <div className="text-xs text-yellow-400 mt-1">Billed monthly, cancel anytime</div>
              </div>
              
              <ul className="space-y-4 mb-8">
                {[
                  "Everything in Student Plan",
                  "Advanced AI Financial Insights",
                  "Income & Investment Tracking",
                  "Premium Support 24/7",
                  "Advanced Goal Planning",
                  "Customizable Categories",
                  "Multiple Account Management"
                ].map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center text-gray-300"
                  >
                    <svg className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </motion.li>
                ))}
              </ul>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3 px-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-gray-900 font-medium rounded-lg transition-colors duration-300"
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-24 relative z-20">
        <div className="relative rounded-2xl overflow-hidden border border-yellow-900/20 backdrop-blur-sm">
          {/* Background effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
              className="absolute -top-[40%] -right-[10%] w-[80%] h-[80%] bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent blur-3xl"
              animate={{ 
                rotate: [0, 5, 0], 
                scale: [1, 1.05, 1],
                opacity: [0.3, 0.5, 0.3]
              }} 
              transition={{ 
                duration: 20, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            />
          </div>
          
          {/* Grid lines overlay */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="h-full w-full bg-[linear-gradient(to_right,#4f4f4f_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
          </div>
          
          <div className="relative py-16 px-6 md:px-12 lg:px-24 z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.h2 
                className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-amber-500 to-yellow-300"
          initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                Ready to Take Control of Your Student Finances?
              </motion.h2>
              
              <motion.p 
                className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Join thousands of students who are managing their money smarter with WealthWise.
                No complicated spreadsheets or financial knowledge required.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
          <Button
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium px-8 py-6 text-lg shadow-lg shadow-yellow-500/20 transition-all duration-300 hover:scale-105 relative overflow-hidden group"
                  onClick={handleGetStarted}
                >
                  <motion.span 
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: "-100%", opacity: 0 }}
                    animate={{ x: "100%", opacity: [0, 0.5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.span className="flex items-center gap-2">
                    Get Started for Free
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </motion.span>
          </Button>
        </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section - for SEO and credibility */}
      <section id="testimonials" className="py-20 relative z-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              What <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-500">Students Say</span> About Us
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 text-lg"
            >
              See why thousands of students are using WealthWise to manage their finances
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                quote: "WealthWise completely changed how I manage my money. The AI suggestions help me save without even thinking about it!",
                author: "Priya S.",
                role: "Engineering Student",
                image: "https://randomuser.me/api/portraits/women/32.jpg"
              },
              {
                quote: "As a first-year student, I had no idea how to budget. WealthWise made it simple with minimal input required from me.",
                author: "Rahul M.",
                role: "Business Student",
                image: "https://randomuser.me/api/portraits/men/45.jpg"
              },
              {
                quote: "The AI predictions are surprisingly accurate! It helped me save enough for my semester abroad without any stress.",
                author: "Ananya K.",
                role: "Arts Student",
                image: "https://randomuser.me/api/portraits/women/68.jpg"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                className="bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-xl p-6 relative"
              >
                <div className="absolute -top-4 -left-4">
                  <div className="text-4xl text-yellow-500">"</div>
                </div>
                <p className="text-gray-300 mb-6">{testimonial.quote}</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-yellow-500/20">
                    <img src={testimonial.image} alt={testimonial.author} className="w-full h-full object-cover" />
            </div>
            <div>
                    <h4 className="font-semibold text-white">{testimonial.author}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - important for SEO */}
      <section id="faq" className="py-20 relative z-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-500">Questions</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 text-lg"
            >
              Got questions about WealthWise? We've got answers.
            </motion.p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "How does the AI budgeting work?",
                answer: "Our AI analyzes thousands of student budgets to create personalized recommendations. Just enter your income and basic expenses—the AI handles the rest, suggesting optimal allocations and identifying savings opportunities."
              },
              {
                question: "Is my financial data secure?",
                answer: "Absolutely. WealthWise uses bank-level encryption to protect your data. We never sell your information and you can delete your data anytime. Your privacy is our priority."
              },
              {
                question: "Do I need to connect my bank account?",
                answer: "No, it's optional. WealthWise works perfectly well with manual entries. If you do connect your accounts, tracking becomes automatic, but it's completely your choice."
              },
              {
                question: "How is WealthWise different from other budgeting apps?",
                answer: "WealthWise is specifically designed for students, with AI that understands student spending patterns. Our minimal input approach means you spend less time managing finances and more time focusing on your studies."
              },
              {
                question: "Can I try WealthWise before paying?",
                answer: "Yes! We offer a 14-day free trial with full access to all features. No credit card required until you decide to continue."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                className="bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-yellow-500/30 transition-colors duration-300"
              >
                <h3 className="text-xl font-semibold text-yellow-400 mb-3">{faq.question}</h3>
                <p className="text-gray-300">{faq.answer}</p>
              </motion.div>
            ))}
            </div>
        </div>
      </section>

      {/* Contact/Newsletter Section */}
      <section id="contact" className="py-20 relative z-20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-yellow-900/20 relative overflow-hidden">
            {/* Background decorative elements */}
            <motion.div 
              className="absolute -top-24 -right-24 w-48 h-48 bg-yellow-400/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-3xl font-bold mb-4"
                >
                  Stay Updated with <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-500">AI-Powered</span> Budgeting Tips
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-gray-300 mb-6"
                >
                  Get the latest financial advice, AI budgeting tricks, and exclusive offers delivered straight to your inbox.
                </motion.p>
                
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  {/* Premium Subscribe Input & Button */}
                  <div className="relative group">
                    {/* Animated glow effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-300"></div>
                    
                    <div className="relative flex items-stretch bg-gray-900/80 rounded-2xl p-1.5 overflow-hidden shadow-[0_15px_25px_-10px_rgba(0,0,0,0.3)]">
                      <input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="w-full bg-gray-800/50 backdrop-blur-md border-0 rounded-l-xl px-6 py-4 text-white font-medium placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-0"
                      />
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 font-semibold rounded-xl py-3 px-8 whitespace-nowrap flex items-center gap-2 text-base shadow-inner shadow-white/10"
                      >
                        Subscribe
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M13.75 6.75L19.25 12L13.75 17.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M19 12H4.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </motion.button>
            </div>
                  </div>
                  
                  <p className="text-xs text-gray-400 ml-3">
                    We respect your privacy. Unsubscribe anytime.
                  </p>
                </motion.form>
              </div>
              
              <div className="md:w-1/2">
                <div className="space-y-6">
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-xl font-semibold flex items-center gap-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400/70 to-amber-500/70 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-black" />
                    </div>
                    <span>Get in Touch</span>
                  </motion.h3>
                  
                  {/* Simplified Contact Icons */}
                  <div className="flex justify-center gap-12 mt-6">
                    {/* Email Icon */}
                    <motion.a
                      href="mailto:support@wealthwise.app"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                      whileHover={{ scale: 1.1, translateY: -5 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400/20 to-amber-500/30 backdrop-blur-sm flex items-center justify-center shadow-lg border border-yellow-500/20">
                        <svg className="w-8 h-8 text-yellow-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 8L10.8906 13.2604C11.5624 13.7083 12.4376 13.7083 13.1094 13.2604L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </motion.a>
                    
                    {/* Call Icon */}
                    <motion.a
                      href="tel:+91800WEALTHWISE"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                      whileHover={{ scale: 1.1, translateY: -5 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400/20 to-amber-500/30 backdrop-blur-sm flex items-center justify-center shadow-lg border border-yellow-500/20">
                        <svg className="w-8 h-8 text-yellow-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 5.5C3 14.0604 9.93959 21 18.5 21C18.8862 21 19.2691 20.9859 19.6483 20.9581C20.0834 20.9262 20.3009 20.9103 20.499 20.7963C20.663 20.7019 20.8185 20.536 20.922 20.3714C21.0499 20.1672 21.0805 19.9348 21.1418 19.4702L21.8403 14.9496C21.8845 14.6236 21.9067 14.4606 21.8683 14.3321C21.8345 14.2214 21.7707 14.1214 21.6828 14.0415C21.5827 13.9497 21.4349 13.9099 21.1392 13.8304L16.3774 12.5168C16.0393 12.4275 15.8702 12.3829 15.7282 12.4107C15.6047 12.4344 15.4893 12.4862 15.391 12.5606C15.2791 12.645 15.1955 12.7748 15.0284 13.0345L13.5162 15.3604C10.9345 14.024 8.97603 12.0655 7.63963 9.48387L9.96553 7.97162C10.2252 7.80448 10.355 7.72092 10.4394 7.60905C10.5138 7.51071 10.5656 7.39528 10.5893 7.27185C10.6171 7.1298 10.5725 6.96074 10.4832 6.62257L9.16964 1.86078C9.09008 1.56512 9.05031 1.41729 8.95852 1.31718C8.87862 1.22929 8.77858 1.16554 8.66788 1.13175C8.53937 1.09328 8.37638 1.11545 8.05042 1.15979L3.52976 1.8583C3.06518 1.91957 2.83289 1.95021 2.62868 2.07807C2.4641 2.18155 2.29814 2.337 2.20375 2.50105C2.08968 2.69907 2.07383 2.91662 2.04194 3.35172C2.01413 3.73086 2 4.11376 2 4.5C2 4.83333 2.01413 5.16583 2.04194 5.49417C2.07383 5.92838 2.08968 6.14549 2.20375 6.34304C2.29814 6.50687 2.4641 6.66211 2.62868 6.76543C2.83289 6.89322 3.06518 6.92392 3.52976 6.98532L8.05031 7.68394C8.37626 7.72829 8.53925 7.75046 8.66776 7.71198C8.77847 7.6782 8.87851 7.61444 8.9584 7.52655C9.05021 7.42646 9.08997 7.27861 9.16953 6.98294L9.86810 2.46234C9.92934 1.99776 9.95996 1.76547 9.87211 1.56683C9.76863 1.40225 9.61317 1.23629 9.44913 1.14191C9.25157 1.02784 9.03447 1.01199 8.60026 0.980097C8.22193 0.952286 7.83903 0.938156 7.50569 0.938156C7.16176 0.938156 6.82884 0.952286 6.5009 0.980097C6.06581 1.01199 5.84828 1.02784 5.65064 1.14191C5.48659 1.23629 5.33114 1.40225 5.22766 1.56683C5.09986 1.77104 5.06917 2.00335 5.00779 2.46796L4.30786 7.00031" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </motion.a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced SEO-optimized footer */}
      <footer className="relative bg-black border-t border-yellow-900/10 pt-16 pb-10 z-20">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-1 sm:col-span-2">
              <Link to="/" className="flex items-center mb-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-2xl font-bold flex items-center"
                >
                  <motion.span 
                    className="text-yellow-400"
                    animate={{ 
                      textShadow: ["0 0 0px rgba(234, 179, 8, 0)", "0 0 10px rgba(234, 179, 8, 0.5)", "0 0 0px rgba(234, 179, 8, 0)"]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    Wealth
                  </motion.span>
                  <span className="ml-1">Wise</span>
                </motion.div>
              </Link>
              
              <motion.p 
                className="text-gray-400 mb-6 max-w-md"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                The smart financial companion designed specifically for students. Simplifying budgeting with AI-powered insights and minimal input.
              </motion.p>
              
              {/* SEO-optimized highlights */}
              <div className="mb-6 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-yellow-400/20 flex items-center justify-center">
                    <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="text-sm text-gray-300">#1 AI Budgeting Tool for Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-yellow-400/20 flex items-center justify-center">
                    <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="text-sm text-gray-300">10,000+ Students Trust Us</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-yellow-400/20 flex items-center justify-center">
                    <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="text-sm text-gray-300">Ultra-Fast AI-Driven Insights</span>
                </div>
              </div>
              
              
              <div className="flex space-x-4">
                {[
                  { icon: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z", label: "Twitter" },
                  { icon: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M2 4a2 2 0 114 0 2 2 0 01-4 0z", label: "LinkedIn" },
                  { icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z", label: "Instagram" },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-300 hover:text-yellow-400 hover:bg-gray-800 transition-all duration-300 border border-gray-700/50"
                    whileHover={{ 
                      y: -5,
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                      borderColor: "rgba(234, 179, 8, 0.5)"
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d={social.icon} />
                    </svg>
                  </motion.a>
                ))}
              </div>
            </div>
            
            <div className="col-span-1">
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                {["About", "Careers", "Blog", "Partners"].map(item => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 flex items-center">
                      <motion.span
                        initial={{ width: 0 }}
                        whileHover={{ width: 15 }}
                        className="inline-block h-[1px] bg-yellow-400/50 mr-2"
                      />
                      {item}
                  </a>
                </li>
                ))}
              </ul>
            </div>
            
            <div className="col-span-1">
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-3">
                {["Documentation", "Help Center", "Guides", "API"].map(item => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 flex items-center">
                      <motion.span
                        initial={{ width: 0 }}
                        whileHover={{ width: 15 }}
                        className="inline-block h-[1px] bg-yellow-400/50 mr-2"
                      />
                      {item}
                  </a>
                </li>
                ))}
              </ul>
            </div>
            
            <div className="col-span-1">
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-3">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(item => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 flex items-center">
                      <motion.span
                        initial={{ width: 0 }}
                        whileHover={{ width: 15 }}
                        className="inline-block h-[1px] bg-yellow-400/50 mr-2"
                      />
                      {item}
                  </a>
                </li>
                ))}
              </ul>
            </div>
          </div>

          {/* SEO optimized app downloads and ratings section */}
          <div className="border-t border-gray-800 pt-8 pb-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-white font-semibold mb-4">Download Our App</h3>
                <div className="flex flex-wrap gap-4">
                  <a 
                    href="#" 
                    className="flex items-center bg-gray-800 hover:bg-gray-700 rounded-lg px-4 py-2 transition-colors duration-300"
                    rel="nofollow"
                  >
                    <div className="mr-3">
                      <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.5564 12.4814C17.5691 11.3262 18.0031 10.2199 18.7751 9.36C18.031 8.30323 16.8674 7.62457 15.6011 7.5C14.2591 7.36133 12.9471 8.30323 12.2662 8.30323C11.5651 8.30323 10.4897 7.5251 9.39698 7.55001C7.79497 7.60065 6.34468 8.51388 5.58345 9.9C3.96868 12.7274 5.20517 16.8575 6.75548 19.087C7.52414 20.1855 8.42249 21.4087 9.58345 21.3581C10.7089 21.3026 11.1429 20.6099 12.4697 20.6099C13.7811 20.6099 14.1897 21.3581 15.3674 21.3277C16.5857 21.3026 17.3563 20.2299 18.1001 19.1222C18.6995 18.2899 19.1539 17.3647 19.4697 16.3855C18.5197 15.9582 17.5591 15.1855 17.5564 12.4814Z"/>
                        <path d="M14.8134 6.05001C15.5002 5.18323 15.8379 4.0666 15.7626 2.93752C14.6611 3.04488 13.6514 3.57792 12.9339 4.42752C12.226 5.26167 11.8833 6.36635 11.9532 7.48752C13.055 7.49056 14.1246 6.96752 14.8134 6.05001Z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Download on the</div>
                      <div className="text-white font-medium">App Store</div>
                    </div>
              </a>
              <a
                    href="#" 
                    className="flex items-center bg-gray-800 hover:bg-gray-700 rounded-lg px-4 py-2 transition-colors duration-300"
                    rel="nofollow"
                  >
                    <div className="mr-3">
                      <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.00977 3.9147L12.5208 12.1483L3.00977 20.6853C2.85114 20.5267 2.73308 20.3275 2.66638 20.1068C2.5997 19.8861 2.58642 19.6514 2.62777 19.4249V5.1751C2.58642 4.94858 2.5997 4.71388 2.66638 4.49321C2.73308 4.27253 2.85114 4.0733 3.00977 3.9147Z"/>
                        <path d="M16.6097 8.50469L6.18359 2.44941L6.18359 2.44941C6.35691 2.34484 6.55201 2.27547 6.75654 2.24598C6.96107 2.21648 7.17 2.22746 7.36954 2.27813L19.3634 7.3414L16.6097 8.50469Z"/>
                        <path d="M16.6097 15.8953L19.3637 17.0584L7.36977 22.1216C7.17024 22.1724 6.9613 22.1835 6.75676 22.154C6.55219 22.1246 6.35707 22.0551 6.18359 21.9506L16.6097 15.8953Z"/>
                        <path d="M3.00977 20.6853L12.5208 12.1483L16.6097 15.8953L6.18359 21.9506C6.00891 21.8445 5.85916 21.701 5.7468 21.5301C5.63445 21.3591 5.56243 21.1651 5.53638 20.9635C5.46393 20.8715 3.00977 20.6853 3.00977 20.6853Z"/>
                        <path d="M3.00977 3.9147C3.00977 3.9147 5.46393 3.72856 5.53638 3.63652C5.56266 3.43518 5.63482 3.24142 5.74723 3.07076C5.85964 2.9001 6.00938 2.75694 6.18359 2.65117L16.6097 8.70469L12.5208 12.1483L3.00977 3.9147Z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">GET IT ON</div>
                      <div className="text-white font-medium">Google Play</div>
                    </div>
              </a>
            </div>
          </div>
              
              <div>
                <h3 className="text-white font-semibold mb-4">User Rating</h3>
                <div className="flex items-center">
                  <div className="flex mr-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
        </div>
                  <div>
                    <div className="text-white font-medium">4.9 out of 5</div>
                    <div className="text-sm text-gray-400">Based on 10,000+ reviews</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Final footer with copyright and additional meta links */}
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap gap-6 mb-4 md:mb-0">
              <a href="#" className="text-gray-500 hover:text-gray-300 text-sm">Sitemap</a>
              <a href="#" className="text-gray-500 hover:text-gray-300 text-sm">Accessibility</a>
              <a href="#" className="text-gray-500 hover:text-gray-300 text-sm">Do Not Sell My Info</a>
            </div>
            
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} WealthWise. All rights reserved.
            </p>
          </div>
        </div>
        
        {/* This would be uncommented in production */}
        {/* <StructuredDataScript /> */}
      </footer>
    </div>
  );
};

export default LandingPage;
