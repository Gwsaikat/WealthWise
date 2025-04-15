import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  CreditCard,
  Calendar,
  RefreshCw,
  Shield,
  Bell,
  Camera,
  Loader2,
  Check,
  X,
  ChevronsUpDown,
  Sparkles,
  Trash2,
  Upload,
  Globe,
  BadgeCheck,
  ArrowRight,
  Copy,
  UserCircle,
  Award,
  Settings,
  ChevronRight,
  Lock,
  Key,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Switch } from "../ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth } from "../../context/AuthContext";
import { useUser } from "../../context/UserContext";
import { getProfile, updateProfile } from "../../lib/database";
import { useToast } from "../ui/use-toast";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Skeleton } from "../ui/skeleton";
import { Alert, AlertDescription } from "../ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { supabase } from "../../lib/supabase";

// Enhanced color palette
const PREMIUM_COLORS = {
  primary: ["#6366F1", "#818CF8", "#A5B4FC", "#C7D2FE", "#E0E7FF"],
  success: ["#10B981", "#34D399", "#6EE7B7", "#A7F3D0", "#D1FAE5"],
  warning: ["#F59E0B", "#FBBF24", "#FCD34D", "#FDE68A", "#FEF3C7"],
  error: ["#EF4444", "#F87171", "#FCA5A5", "#FECACA", "#FEE2E2"],
  purple: ["#8B5CF6", "#A78BFA", "#C4B5FD", "#DDD6FE", "#EDE9FE"],
  cyan: ["#06B6D4", "#22D3EE", "#67E8F9", "#A5F3FC", "#CFFAFE"],
  indigo: ["#4F46E5", "#6366F1", "#818CF8", "#A5B4FC", "#C7D2FE"],
};

// Currency options for the profile settings
const CURRENCY_OPTIONS = [
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "CAD", name: "Canadian Dollar", symbol: "CA$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
];

// Enhanced badges for user achievements with better visuals
const USER_BADGES = [
  { 
    id: 1, 
    name: "Budget Master", 
    description: "Stayed under budget for 3 consecutive months", 
    icon: <Sparkles className="h-4 w-4" />, 
    unlocked: true,
    color: "from-violet-500 to-purple-600",
    accentColor: "from-violet-300 to-purple-400",
    bgColor: "from-violet-900/20 to-purple-900/20",
  },
  { 
    id: 2, 
    name: "Saving Star", 
    description: "Reached a savings goal within the target timeline", 
    icon: <Award className="h-4 w-4" />, 
    unlocked: true,
    color: "from-amber-500 to-yellow-600",
    accentColor: "from-amber-300 to-yellow-400",
    bgColor: "from-amber-900/20 to-yellow-900/20",
  },
  { 
    id: 3, 
    name: "Financial Guru", 
    description: "Added expenses consistently for 30 days", 
    icon: <BadgeCheck className="h-4 w-4" />, 
    unlocked: false,
    color: "from-emerald-500 to-green-600",
    accentColor: "from-emerald-300 to-green-400", 
    bgColor: "from-emerald-900/20 to-green-900/20",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

const floatVariants = {
  float: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const pulseVariants = {
  pulse: {
    scale: [1, 1.02, 1],
    opacity: [0.95, 1, 0.95],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const glowVariants = {
  initial: { opacity: 0 },
  glow: {
    opacity: [0.1, 0.3, 0.1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

interface ProfileProps {
  isLoading?: boolean;
}

// Update the profileData type to include our UI fields that aren't in the database
interface ExtendedProfileData extends Partial<Profile> {
  email?: string;
  phone?: string; // UI-only field
  address?: string; // UI-only field
  currency_preference?: string;
  dark_mode?: boolean;
  notify_expenses?: boolean;
  notify_goals?: boolean;
  notify_insights?: boolean;
}

const Profile: React.FC<ProfileProps> = ({ isLoading: externalLoading = false }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { currency, updateUserCurrency } = useUser();
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState<ExtendedProfileData>({
    full_name: "",
    avatar_url: "",
    email: user?.email || "",
    phone: "", // UI-only field
    address: "", // UI-only field
    currency_preference: currency?.code || "USD",
    dark_mode: true,
    notify_expenses: true,
    notify_goals: true,
    notify_insights: true,
  });
  const [badges, setBadges] = useState(USER_BADGES);
  
  // Mouse position for hover effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  // Fetch user profile
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const profile = await getProfile(user.id);
      
      if (profile) {
        setProfileData({
          ...profileData,
          ...profile,
          email: user.email,
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle switch changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    setProfileData({ ...profileData, [name]: checked });
  };

  // Handle currency change
  const handleCurrencyChange = (value: string) => {
    setProfileData({ ...profileData, currency_preference: value });
  };

  // Save profile changes
  const handleSaveWithCurrency = async () => {
    if (!user?.id) return;
    setSaving(true);
    
    try {
      // Extract database fields from profileData (omitting UI-only fields)
      const profileUpdateData: Partial<Profile> = {
        full_name: profileData.full_name,
        avatar_url: profileData.avatar_url,
        // Don't include phone, address, currency_preference as they're not in Profile type
      };
      
      // Update profile in database
      const { data: updatedProfile, error: profileError } = await supabase
        .from("profiles")
        .update(profileUpdateData)
        .eq("id", user.id)
        .select()
        .single();
        
      if (profileError) throw profileError;
      
      // Handle currency update separately through context
      if (profileData.currency_preference && 
          profileData.currency_preference !== currency?.code) {
        const currencyLocale = getCurrencyLocale(profileData.currency_preference);
        setCurrency({
          code: profileData.currency_preference,
          locale: currencyLocale || "en-US"
        });
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
        variant: "success",
      });
      
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Replace the original saveChanges with our new function
  const saveChanges = handleSaveWithCurrency;

  // Upload profile picture (placeholder)
  const uploadProfilePicture = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Profile picture uploads will be available in the next update",
    });
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
      onMouseMove={handleMouseMove}
    >
      <motion.div variants={itemVariants} className="relative overflow-hidden">
        <div className="absolute -inset-[150px] bg-gradient-to-r from-violet-500/10 via-blue-500/5 to-cyan-500/10 blur-3xl opacity-30 -z-10"></div>
        <Card className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 shadow-lg overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <motion.div variants={itemVariants} className="flex items-center">
                <div className="relative mr-4">
                  <motion.div 
                    variants={glowVariants} 
                    initial="initial" 
                    animate="glow" 
                    className="absolute inset-0 rounded-full bg-indigo-500/30 blur-md -z-10"
                  />
                  <Avatar className="h-16 w-16 ring-2 ring-indigo-500/30 ring-offset-2 ring-offset-gray-800 shadow-lg shadow-indigo-500/20">
                    <AvatarImage src={user?.user_metadata?.avatar_url || ""} />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                      {profileData.full_name ? profileData.full_name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <motion.div 
                    whileHover={{ scale: 1.1, backgroundColor: PREMIUM_COLORS.indigo[0] }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute bottom-0 right-0 bg-gray-700 rounded-full p-1 border border-gray-600 cursor-pointer shadow-lg"
                    onClick={uploadProfilePicture}
                  >
                    <Camera className="h-3.5 w-3.5 text-gray-200" />
                  </motion.div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {profileData.full_name || "Set your name"}
                  </h3>
                  <p className="text-gray-400 flex items-center mt-1">
                    <Mail className="h-4 w-4 mr-1.5" />
                    {profileData.email}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {badges
                      .filter(badge => badge.unlocked)
                      .map(badge => (
                        <Badge
                          key={badge.id}
                          className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border-yellow-500/30"
                        >
                          {badge.icon}
                          <span className="ml-1">{badge.name}</span>
                        </Badge>
                      ))}
                  </div>
                </div>
              </motion.div>
              {!editing ? (
                <Button
                  onClick={() => setEditing(true)}
                  variant="outline"
                  className="border-gray-600 bg-gray-700/30 hover:bg-gray-700/70 text-white"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => setEditing(false)}
                    variant="outline"
                    className="border-gray-600 bg-gray-700/30 hover:bg-gray-700/70 text-white"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={saveChanges}
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                    disabled={saving}
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loading || externalLoading ? (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                  <Skeleton className="w-24 h-24 rounded-full bg-gray-700" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-1/3 bg-gray-700" />
                    <Skeleton className="h-4 w-1/4 bg-gray-700" />
                  </div>
                </div>
                <div className="grid gap-4 pt-4">
                  <Skeleton className="h-10 w-full bg-gray-700" />
                  <Skeleton className="h-10 w-full bg-gray-700" />
                  <Skeleton className="h-10 w-full bg-gray-700" />
                </div>
              </div>
            ) : (
              <>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-3 mb-6 bg-gray-700/50">
                    <TabsTrigger value="personal" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
                      <User className="h-4 w-4 mr-2" /> Personal
                    </TabsTrigger>
                    <TabsTrigger value="preferences" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
                      <ChevronsUpDown className="h-4 w-4 mr-2" /> Preferences
                    </TabsTrigger>
                    <TabsTrigger value="badges" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
                      <Sparkles className="h-4 w-4 mr-2" /> Badges
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="mt-0 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name" className="text-gray-300">Full Name</Label>
                        <Input
                          id="full_name"
                          name="full_name"
                          value={profileData.full_name || ""}
                          onChange={handleInputChange}
                          disabled={!editing}
                          placeholder="Enter your full name"
                          className="bg-gray-700/50 border-gray-600 placeholder:text-gray-500 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-300">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          value={profileData.email || ""}
                          disabled={true}
                          className="bg-gray-700/50 border-gray-600 placeholder:text-gray-500 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={profileData.phone || ""}
                          onChange={handleInputChange}
                          disabled={!editing}
                          placeholder="Enter your phone number"
                          className="bg-gray-700/50 border-gray-600 placeholder:text-gray-500 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-gray-300">Address</Label>
                        <Input
                          id="address"
                          name="address"
                          value={profileData.address || ""}
                          onChange={handleInputChange}
                          disabled={!editing}
                          placeholder="Enter your address"
                          className="bg-gray-700/50 border-gray-600 placeholder:text-gray-500 text-white"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="preferences" className="mt-0 space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-300 flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-gray-400" />
                        Currency Setting
                      </h4>
                      <div className="pl-6">
                        <div className="space-y-2">
                          <Label htmlFor="currency_preference" className="text-gray-400">Preferred Currency</Label>
                          <Select
                            value={profileData.currency_preference}
                            onValueChange={handleCurrencyChange}
                            disabled={!editing}
                          >
                            <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white w-full">
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              {CURRENCY_OPTIONS.map((curr) => (
                                <SelectItem key={curr.code} value={curr.code}>
                                  <div className="flex items-center">
                                    <span className="mr-2">{curr.symbol}</span>
                                    <span>{curr.name}</span>
                                    <span className="ml-1 text-gray-400">({curr.code})</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-gray-700" />

                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-300 flex items-center">
                        <Bell className="h-4 w-4 mr-2 text-gray-400" />
                        Notification Settings
                      </h4>
                      <div className="space-y-3 pl-6">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notify_expenses" className="text-gray-400 cursor-pointer">
                            Expense Alerts
                          </Label>
                          <Switch
                            id="notify_expenses"
                            checked={profileData.notify_expenses}
                            onCheckedChange={(checked) => handleSwitchChange("notify_expenses", checked)}
                            disabled={!editing}
                            className="data-[state=checked]:bg-yellow-500"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notify_goals" className="text-gray-400 cursor-pointer">
                            Goal Updates
                          </Label>
                          <Switch
                            id="notify_goals"
                            checked={profileData.notify_goals}
                            onCheckedChange={(checked) => handleSwitchChange("notify_goals", checked)}
                            disabled={!editing}
                            className="data-[state=checked]:bg-yellow-500"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notify_insights" className="text-gray-400 cursor-pointer">
                            Financial Insights
                          </Label>
                          <Switch
                            id="notify_insights"
                            checked={profileData.notify_insights}
                            onCheckedChange={(checked) => handleSwitchChange("notify_insights", checked)}
                            disabled={!editing}
                            className="data-[state=checked]:bg-yellow-500"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-gray-700" />

                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-300 flex items-center">
                        <RefreshCw className="h-4 w-4 mr-2 text-gray-400" />
                        Appearance
                      </h4>
                      <div className="space-y-3 pl-6">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="dark_mode" className="text-gray-400 cursor-pointer">
                            Dark Mode
                          </Label>
                          <Switch
                            id="dark_mode"
                            checked={profileData.dark_mode}
                            onCheckedChange={(checked) => handleSwitchChange("dark_mode", checked)}
                            disabled={!editing}
                            className="data-[state=checked]:bg-yellow-500"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="badges" className="mt-0">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-300">Your Achievements</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {badges.map((badge) => (
                          <div
                            key={badge.id}
                            className={`p-4 rounded-lg border flex items-start space-x-3 ${
                              badge.unlocked
                                ? "bg-yellow-500/10 border-yellow-500/30"
                                : "bg-gray-800/50 border-gray-700 opacity-60"
                            }`}
                          >
                            <div className={`p-2 rounded-full ${badge.unlocked ? "bg-yellow-500/20" : "bg-gray-700"}`}>
                              {badge.icon}
                            </div>
                            <div>
                              <h5 className={`font-medium ${badge.unlocked ? "text-yellow-400" : "text-gray-400"}`}>
                                {badge.name}
                                {!badge.unlocked && " (Locked)"}
                              </h5>
                              <p className="text-sm text-gray-400">{badge.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Profile; 