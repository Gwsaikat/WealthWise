import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Github, AlertTriangle, Mail, Lock, Shield, KeyRound, ChevronsRight } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { useAuth } from "../../context/AuthContext";
import { Alert, AlertDescription } from "../ui/alert";
import { toast } from "../ui/use-toast";
import { supabase } from "../../lib/supabase";

const LoginForm = () => {
  const navigate = useNavigate();
  const { signIn, verifyMfaCode, verifyRecoveryCode } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);

  // New states for MFA
  const [requiresMfa, setRequiresMfa] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaTicket, setMfaTicket] = useState("");

  // New state for recovery code
  const [usingRecoveryCode, setUsingRecoveryCode] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setErrorMessage(null);
    setNeedsVerification(false);
    
    try {
      console.log("Attempting login with:", email);
      const { success, error, needsVerification, requiresMfa, mfaTicket } = await signIn(email, password);
      
      if (success) {
        console.log("Login successful, redirecting...");
        // No need to do anything, the user will be redirected automatically
        // through the auth state change in the protected route
        toast({
          title: "Login successful",
          description: "Welcome back!",
          variant: "default",
        });
      } else if (requiresMfa && mfaTicket) {
        console.log("MFA verification required");
        setRequiresMfa(true);
        setMfaTicket(mfaTicket);
        // Keep email/password in state in case we need to re-authenticate
      } else if (needsVerification) {
        console.log("Email needs verification");
        setNeedsVerification(true);
        setErrorMessage("Please verify your email before logging in.");
        toast({
          title: "Verification required",
          description: "Please check your email for a verification link",
          variant: "default",
        });
      } else if (error) {
        console.error("Login error:", error);
        setErrorMessage(error.message || "Failed to sign in.");
        toast({
          title: "Login failed",
          description: error.message || "Please check your credentials",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage("An unexpected error occurred. Please try again.");
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (usingRecoveryCode) {
      if (!recoveryCode || recoveryCode.length < 8) {
        setErrorMessage("Please enter a valid recovery code");
        return;
      }
    } else {
      if (!mfaCode || mfaCode.length !== 6) {
        setErrorMessage("Please enter a valid 6-digit code");
        return;
      }
    }
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      let success, error;
      
      if (usingRecoveryCode) {
        // Verify with recovery code
        ({ success, error } = await verifyRecoveryCode(recoveryCode));
      } else {
        // Verify with MFA code
        ({ success, error } = await verifyMfaCode(mfaCode, mfaTicket));
      }
      
      if (success) {
        // Re-authenticate with the credentials we saved
        // This is a simplified version - in a real app you'd handle this more securely
        const { success: reAuthSuccess, error: reAuthError } = await signIn(email, password);
        
        if (reAuthSuccess) {
          toast({
            title: "Verification successful",
            description: "Welcome back!",
            variant: "default",
          });
        } else if (reAuthError) {
          throw reAuthError;
        }
      } else if (error) {
        throw error;
      }
    } catch (err) {
      console.error("Verification error:", err);
      setErrorMessage((err as Error).message || "Failed to verify code");
      toast({
        title: "Verification failed",
        description: (err as Error).message || "Please check your code and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Render MFA verification form if MFA is required
  if (requiresMfa) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-black flex items-center justify-center p-4">
        {/* Animated background elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.1, 1],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gradient-to-bl from-yellow-400/20 to-transparent rounded-full blur-3xl"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 shadow-2xl"
          >
            <div className="text-center mb-8">
              <Link to="/" className="inline-block">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-3xl font-bold flex items-center justify-center"
                >
                  <motion.span
                    animate={{ textShadow: ["0 0 8px #FCD34D", "0 0 0px #FCD34D"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    className="text-yellow-400"
                  >
                    Wealth
                  </motion.span>
                  <span className="text-white ml-1">Wise</span>
                </motion.div>
              </Link>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-center mt-6"
              >
                {usingRecoveryCode ? (
                  <KeyRound className="h-10 w-10 text-yellow-400 mr-2" />
                ) : (
                  <Shield className="h-10 w-10 text-yellow-400 mr-2" />
                )}
                <h1 className="text-2xl font-bold text-white">
                  {usingRecoveryCode ? "Recovery Code" : "Two-Factor Authentication"}
                </h1>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-400 mt-2"
              >
                {usingRecoveryCode 
                  ? "Enter your recovery code to sign in" 
                  : "Enter the 6-digit code from your authenticator app"
                }
              </motion.p>
            </div>

            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
              >
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/50 text-red-300">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <form onSubmit={handleVerifyMfa} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <Label htmlFor={usingRecoveryCode ? "recovery-code" : "mfa-code"} className="text-gray-300">
                  {usingRecoveryCode ? "Recovery Code" : "Authentication Code"}
                </Label>
                {usingRecoveryCode ? (
                  <Input
                    id="recovery-code"
                    type="text"
                    placeholder="Enter your recovery code"
                    value={recoveryCode}
                    onChange={(e) => setRecoveryCode(e.target.value.trim())}
                    className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-yellow-500/50 focus-visible:border-yellow-400/50 transition-all duration-200 font-mono"
                    required
                    autoFocus
                  />
                ) : (
                  <Input
                    id="mfa-code"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    placeholder="000000"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/[^0-9]/g, '').substring(0, 6))}
                    className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-yellow-500/50 focus-visible:border-yellow-400/50 transition-all duration-200 text-center text-2xl tracking-widest"
                    required
                    autoFocus
                  />
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-medium group shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Verifying...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Verify <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </motion.div>

              <div className="text-center mt-4 space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setUsingRecoveryCode(!usingRecoveryCode);
                    setMfaCode("");
                    setRecoveryCode("");
                    setErrorMessage(null);
                  }}
                  className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors flex items-center justify-center mx-auto"
                >
                  {usingRecoveryCode ? (
                    <>Use authenticator app instead</>
                  ) : (
                    <>Lost access to your authenticator? Use a recovery code</>
                  )}
                  <ChevronsRight className="h-4 w-4 ml-1" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRequiresMfa(false);
                    setMfaCode("");
                    setMfaTicket("");
                    setRecoveryCode("");
                    setUsingRecoveryCode(false);
                  }}
                  className="text-sm text-gray-400 hover:text-white transition-colors block mx-auto"
                >
                  Back to login
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Render normal login form
  return (
    <div className="min-h-screen relative overflow-hidden bg-black flex items-center justify-center p-4">
      {/* Animated background elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.1, 0.3, 0.1],
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.1, 1],
          rotate: [360, 180, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gradient-to-bl from-yellow-400/20 to-transparent rounded-full blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 shadow-2xl"
        >
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-3xl font-bold flex items-center justify-center"
              >
                <motion.span
                  animate={{ textShadow: ["0 0 8px #FCD34D", "0 0 0px #FCD34D"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                  className="text-yellow-400"
                >
                  Wealth
                </motion.span>
                <span className="text-white ml-1">Wise</span>
              </motion.div>
            </Link>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-white mt-6"
            >
              Welcome back
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-400 mt-2"
            >
              Sign in to your account to continue
            </motion.p>
          </div>

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/50 text-red-300">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-yellow-500/50 focus-visible:border-yellow-400/50 transition-all duration-200"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-gray-300">
                  Password
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-yellow-500/50 focus-visible:border-yellow-400/50 transition-all duration-200 pr-10"
                  required
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center space-x-2"
            >
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-300"
              >
                Remember me
              </label>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-medium group shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-900 border-t-transparent"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center text-gray-400 text-sm"
            >
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
              >
                Sign up
              </Link>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-8 pt-6 border-t border-gray-700/50"
          >
            <div className="text-center text-sm text-gray-500 mb-4">
              Or continue with
            </div>
            <div className="grid grid-cols-3 gap-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="w-full border border-gray-700/50 bg-gray-800/50 text-white hover:bg-yellow-500/10 hover:border-yellow-500/50 hover:text-yellow-400 group transition-all duration-300"
                >
                  <motion.div
                    whileHover={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <svg className="h-5 w-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </motion.div>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="w-full border border-gray-700/50 bg-gray-800/50 text-white hover:bg-blue-500/10 hover:border-blue-500/50 hover:text-blue-400 group transition-all duration-300"
                >
                  <motion.div
                    whileHover={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <svg
                      className="h-5 w-5 transition-transform group-hover:scale-110"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </motion.div>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="w-full border border-gray-700/50 bg-gray-800/50 text-white hover:bg-purple-500/10 hover:border-purple-500/50 hover:text-purple-400 group transition-all duration-300"
                >
                  <motion.div
                    whileHover={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Github className="h-5 w-5 transition-transform group-hover:scale-110" />
                  </motion.div>
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {needsVerification && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4"
            >
              <div className="flex items-start">
                <div className="bg-blue-500/20 p-2 rounded-full mr-3">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-blue-300">Email Verification Required</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Your account needs to be verified. Please check your email for a verification link.
                  </p>
                  <div className="mt-3 flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                      onClick={() => {
                        // Redirect to signup page
                        navigate("/signup");
                      }}
                    >
                      Back to Sign Up
                    </Button>
                    <Button
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                      onClick={async () => {
                        try {
                          setIsLoading(true);
                          // Send another verification email
                          await supabase.auth.signInWithOtp({
                            email,
                          });
                          toast({
                            title: "Verification email sent",
                            description: "Check your inbox for a new verification link",
                          });
                        } catch (err) {
                          console.error("Error resending verification:", err);
                          toast({
                            title: "Failed to resend verification",
                            description: "Please try again later",
                            variant: "destructive",
                          });
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                    >
                      Resend Verification Email
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginForm;
