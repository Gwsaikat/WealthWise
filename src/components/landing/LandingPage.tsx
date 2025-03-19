import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Menu, X } from "lucide-react";
import { Button } from "../ui/button";

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGetTemplate = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white overflow-hidden relative">
      {/* Background rays */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[30%] -left-[10%] w-[80%] h-[80%] bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent blur-3xl transform rotate-12" />
        <div className="absolute top-[20%] right-[5%] w-[50%] h-[60%] bg-gradient-to-bl from-blue-500/5 via-transparent to-transparent blur-3xl transform -rotate-12" />
        <div className="absolute bottom-[10%] left-[20%] w-[40%] h-[40%] bg-gradient-to-tr from-purple-500/5 via-transparent to-transparent blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between relative z-50">
        <Link to="/" className="flex items-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold flex items-center"
          >
            <span className="text-yellow-400">Wealth</span>
            <span className="ml-1">Wise</span>
          </motion.div>
        </Link>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white hover:bg-gray-800/50"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-md p-6 rounded-b-xl border border-gray-800 md:hidden"
          >
            <div className="flex flex-col space-y-4">
              {[
                "Company",
                "Careers",
                "Pricing",
                "Blog",
                "Change Log",
                "Contact Us",
              ].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className="text-gray-300 hover:text-yellow-400 transition-colors py-2 px-4 rounded-lg hover:bg-gray-800/50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <Button
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium w-full mt-2"
                onClick={() => {
                  handleGetTemplate();
                  setMobileMenuOpen(false);
                }}
              >
                Get Template
              </Button>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="hidden md:flex items-center space-x-8"
        >
          {[
            "Company",
            "Careers",
            "Pricing",
            "Blog",
            "Change Log",
            "Contact Us",
          ].map((item) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="text-gray-300 hover:text-yellow-400 transition-colors"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {item}
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
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium px-6 shadow-lg shadow-yellow-500/20"
            onClick={handleGetTemplate}
          >
            Get Template
          </Button>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-20 pb-24">
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
              className="inline-flex items-center px-3 py-1 rounded-full bg-gray-800 mb-6"
            >
              <div className="h-2 w-2 rounded-full bg-yellow-400 mr-2"></div>
              <span className="text-sm font-medium">
                Financial Growth Using AI
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Wealth Management <br />
              Made Easy
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-gray-300 text-lg mb-8 max-w-lg"
            >
              Manage all your financial profiles in one place. Track your
              investments, schedule payments, and optimize your wealth strategy
              with AI insights.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex space-x-4"
            >
              <Button
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium px-6 group shadow-lg shadow-yellow-500/20 transition-all duration-300 hover:scale-105"
                size="lg"
                onClick={handleGetStarted}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                className="border-gray-700 text-white hover:bg-gray-800/70 hover:border-yellow-400/50 transition-all duration-300"
                size="lg"
                onClick={handleLearnMore}
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full h-[500px] rounded-lg overflow-hidden border border-gray-800 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                      <div className="text-xs text-gray-400">
                        WealthWise Dashboard
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="text-sm text-gray-400 mb-2">
                        Total Assets
                      </div>
                      <div className="text-xl font-bold text-white">
                        $124,500
                      </div>
                      <div className="mt-2 text-xs text-green-400 flex items-center">
                        <ArrowRight className="h-3 w-3 rotate-45 mr-1" /> +12.4%
                      </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="text-sm text-gray-400 mb-2">
                        Monthly Savings
                      </div>
                      <div className="text-xl font-bold text-white">$2,850</div>
                      <div className="mt-2 text-xs text-green-400 flex items-center">
                        <ArrowRight className="h-3 w-3 rotate-45 mr-1" /> +5.2%
                      </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg col-span-2">
                      <div className="text-sm text-gray-400 mb-2">
                        Investment Portfolio
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-xl font-bold text-white">
                          $78,350
                        </div>
                        <div className="text-xs text-green-400">+8.7%</div>
                      </div>
                      <div className="mt-3 flex items-center space-x-1">
                        <div className="h-2 w-1/4 bg-blue-500 rounded-full"></div>
                        <div className="h-2 w-1/4 bg-purple-500 rounded-full"></div>
                        <div className="h-2 w-1/6 bg-yellow-500 rounded-full"></div>
                        <div className="h-2 w-1/3 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="mt-2 flex justify-between text-xs text-gray-400">
                        <span>Stocks</span>
                        <span>Bonds</span>
                        <span>Crypto</span>
                        <span>Real Estate</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-sm font-medium">
                        AI Recommendations
                      </div>
                      <div className="text-xs text-yellow-400">View All</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center p-2 bg-gray-700/50 rounded">
                        <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        </div>
                        <div className="text-xs">
                          Increase retirement contribution by 2%
                        </div>
                      </div>
                      <div className="flex items-center p-2 bg-gray-700/50 rounded">
                        <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center mr-2">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        </div>
                        <div className="text-xs">
                          Rebalance portfolio to reduce risk
                        </div>
                      </div>
                    </div>
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
        className="container mx-auto px-6 py-20 bg-gray-900/50"
      >
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Smart Financial Management
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-gray-300 max-w-2xl mx-auto"
          >
            Powerful tools to help you manage your finances, track investments,
            and plan for the future.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "AI-Powered Insights",
              description:
                "Get personalized financial recommendations based on your spending habits and goals.",
              icon: "✨",
            },
            {
              title: "Investment Tracking",
              description:
                "Monitor your portfolio performance and get real-time updates on your investments.",
              icon: "📈",
            },
            {
              title: "Budget Automation",
              description:
                "Set up automatic budgeting rules and get notified when you're approaching limits.",
              icon: "💰",
            },
            {
              title: "Goal Planning",
              description:
                "Create financial goals and track your progress with visual dashboards.",
              icon: "🎯",
            },
            {
              title: "Expense Analysis",
              description:
                "Understand your spending patterns with detailed categorization and insights.",
              icon: "📊",
            },
            {
              title: "Secure Banking",
              description:
                "Connect your accounts securely and manage all your finances in one place.",
              icon: "🔒",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.8 }}
              className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-yellow-500/50 transition-colors group"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-yellow-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto border border-gray-700"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to take control of your finances?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already managing their wealth more
            effectively with WealthWise.
          </p>
          <Button
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium px-8 py-6 text-lg group shadow-lg shadow-yellow-500/20 transition-all duration-300 hover:scale-105"
            onClick={() => navigate("/signup")}
          >
            Get Started Today
            <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer id="contact-us" className="bg-gray-950 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#company"
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#careers"
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#company"
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    Press
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#blog"
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#resources"
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#resources"
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    Guides
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#legal"
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#legal"
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    Terms
                  </a>
                </li>
                <li>
                  <a
                    href="#legal"
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-1 group"
                  >
                    <span>Twitter</span>
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-1 group"
                  >
                    <span>LinkedIn</span>
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-1 group"
                  >
                    <span>Instagram</span>
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              © 2023 WealthWise. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a
                href="#legal"
                className="text-gray-400 hover:text-yellow-400 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#legal"
                className="text-gray-400 hover:text-yellow-400 transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#legal"
                className="text-gray-400 hover:text-yellow-400 transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
