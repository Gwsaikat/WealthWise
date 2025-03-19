import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, agreeToTerms: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    console.log(formData);
  };

  // Password strength indicators
  const passwordStrength = (() => {
    if (!formData.password) return 0;
    let strength = 0;
    if (formData.password.length >= 8) strength += 1;
    if (/[A-Z]/.test(formData.password)) strength += 1;
    if (/[0-9]/.test(formData.password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1;
    return strength;
  })();

  const strengthText = ["Weak", "Fair", "Good", "Strong"];
  const strengthColor = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 shadow-xl">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-2xl font-bold flex items-center justify-center"
              >
                <span className="text-yellow-400">Wealth</span>
                <span className="text-white ml-1">Wise</span>
              </motion.div>
            </Link>
            <h1 className="text-2xl font-bold text-white mt-6">
              Create your account
            </h1>
            <p className="text-gray-400 mt-2">
              Start your financial journey today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-300">
                Full Name
              </Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-yellow-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-yellow-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-yellow-500 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {formData.password && (
                <div className="mt-2">
                  <div className="flex space-x-1 mb-1">
                    {[0, 1, 2, 3].map((index) => (
                      <div
                        key={index}
                        className={`h-1 flex-1 rounded-full ${index < passwordStrength ? strengthColor[passwordStrength - 1] : "bg-gray-600"}`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Password strength:</span>
                    <span
                      className={
                        passwordStrength > 0
                          ? passwordStrength === 4
                            ? "text-green-400"
                            : passwordStrength === 3
                              ? "text-yellow-400"
                              : passwordStrength === 2
                                ? "text-orange-400"
                                : "text-red-400"
                          : "text-gray-400"
                      }
                    >
                      {passwordStrength > 0
                        ? strengthText[passwordStrength - 1]
                        : "None"}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center text-xs">
                      <div
                        className={`w-3 h-3 mr-2 flex items-center justify-center rounded-full ${formData.password.length >= 8 ? "bg-green-500" : "bg-gray-600"}`}
                      >
                        {formData.password.length >= 8 && (
                          <Check className="w-2 h-2 text-white" />
                        )}
                      </div>
                      <span
                        className={
                          formData.password.length >= 8
                            ? "text-green-400"
                            : "text-gray-400"
                        }
                      >
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div
                        className={`w-3 h-3 mr-2 flex items-center justify-center rounded-full ${/[A-Z]/.test(formData.password) ? "bg-green-500" : "bg-gray-600"}`}
                      >
                        {/[A-Z]/.test(formData.password) && (
                          <Check className="w-2 h-2 text-white" />
                        )}
                      </div>
                      <span
                        className={
                          /[A-Z]/.test(formData.password)
                            ? "text-green-400"
                            : "text-gray-400"
                        }
                      >
                        At least one uppercase letter
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div
                        className={`w-3 h-3 mr-2 flex items-center justify-center rounded-full ${/[0-9]/.test(formData.password) ? "bg-green-500" : "bg-gray-600"}`}
                      >
                        {/[0-9]/.test(formData.password) && (
                          <Check className="w-2 h-2 text-white" />
                        )}
                      </div>
                      <span
                        className={
                          /[0-9]/.test(formData.password)
                            ? "text-green-400"
                            : "text-gray-400"
                        }
                      >
                        At least one number
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div
                        className={`w-3 h-3 mr-2 flex items-center justify-center rounded-full ${/[^A-Za-z0-9]/.test(formData.password) ? "bg-green-500" : "bg-gray-600"}`}
                      >
                        {/[^A-Za-z0-9]/.test(formData.password) && (
                          <Check className="w-2 h-2 text-white" />
                        )}
                      </div>
                      <span
                        className={
                          /[^A-Za-z0-9]/.test(formData.password)
                            ? "text-green-400"
                            : "text-gray-400"
                        }
                      >
                        At least one special character
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={handleCheckboxChange}
                className="data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500 mt-1"
              />
              <label
                htmlFor="terms"
                className="text-sm leading-tight text-gray-300"
              >
                I agree to the{" "}
                <a
                  href="#"
                  className="text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium group"
              disabled={!formData.agreeToTerms}
            >
              Create Account
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>

            <div className="text-center text-gray-400 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupForm;
