import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  Lock,
  CreditCard,
  FileText,
  HelpCircle,
  LogOut,
  AlertTriangle,
  Database,
  Download,
  Upload,
  Share2,
  Moon,
  Sun,
  Globe,
  Bell,
  RefreshCw,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  Check,
  X,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Slider } from "../ui/slider";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Alert, AlertDescription } from "../ui/alert";
import MfaManager from "../auth/MfaManager";

// Timeout options (in minutes)
const AUTO_LOGOUT_OPTIONS = [
  { value: "5", label: "5 minutes" },
  { value: "15", label: "15 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "60", label: "1 hour" },
  { value: "never", label: "Never" },
];

interface SettingsProps {
  isLoading?: boolean;
}

const Settings: React.FC<SettingsProps> = ({ isLoading = false }) => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState("");
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [settings, setSettings] = useState({
    theme: "dark",
    language: "en",
    autoLogoutTime: "30",
    enableNotifications: true,
    enableSoundEffects: true,
    enableAnimations: true,
    dataSharing: false,
    backupFrequency: "weekly",
    twoFactorAuth: false,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  // Handle switch change
  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings({ ...settings, [name]: checked });
  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setSettings({ ...settings, [name]: value });
  };

  // Handle password change
  const handlePasswordChange = () => {
    if (!settings.currentPassword) {
      toast({
        title: "Error",
        description: "Please enter your current password",
        variant: "destructive",
      });
      return;
    }
    
    if (!settings.newPassword) {
      toast({
        title: "Error",
        description: "Please enter a new password",
        variant: "destructive",
      });
      return;
    }
    
    if (settings.newPassword !== settings.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    // Password change would be implemented here in a real app
    toast({
      title: "Success",
      description: "Password changed successfully",
    });
    
    // Reset password fields
    setSettings({
      ...settings,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  // Handle export data
  const handleExportData = () => {
    // In a real app, this would initiate a data export process
    toast({
      title: "Export Started",
      description: "Your data is being prepared for export",
    });
    
    // Simulate export process
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Your data has been exported successfully",
      });
    }, 2000);
  };

  // Handle account deletion
  const handleDeleteAccount = () => {
    if (confirmDeleteAccount !== "DELETE") {
      toast({
        title: "Error",
        description: "Please type DELETE to confirm account deletion",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would initiate account deletion
    toast({
      title: "Account Deletion",
      description: "Your account deletion request has been submitted",
      variant: "destructive",
    });
    
    setIsOpenDeleteDialog(false);
    setConfirmDeleteAccount("");
    
    // Simulate account deletion and logout
    setTimeout(() => {
      signOut();
    }, 3000);
  };

  // Handle theme toggle
  const handleThemeToggle = (theme: string) => {
    setSettings({ ...settings, theme });
    
    // In a real app, this would update the theme in the app context/localStorage
    toast({
      title: "Theme Changed",
      description: `Theme set to ${theme === 'dark' ? 'dark' : 'light'} mode`,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Settings</CardTitle>
          <CardDescription className="text-gray-400">
            Manage your application settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6 bg-gray-700/50">
              <TabsTrigger value="general" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
                <SettingsIcon className="h-4 w-4 mr-2" /> General
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
                <Lock className="h-4 w-4 mr-2" /> Security
              </TabsTrigger>
              <TabsTrigger value="data" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
                <Database className="h-4 w-4 mr-2" /> Data
              </TabsTrigger>
              <TabsTrigger value="help" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
                <HelpCircle className="h-4 w-4 mr-2" /> Help
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-0 space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-300 flex items-center">
                  <Sun className="h-4 w-4 mr-2 text-gray-400" />
                  Appearance
                </h4>
                <div className="pl-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Theme</span>
                    <div className="flex bg-gray-700 rounded-lg p-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleThemeToggle("light")}
                        className={`flex items-center mr-1 rounded-md ${
                          settings.theme === "light"
                            ? "bg-gray-600 text-white"
                            : "text-gray-400 hover:text-white hover:bg-gray-600/50"
                        }`}
                      >
                        <Sun className="h-4 w-4 mr-1.5" />
                        Light
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleThemeToggle("dark")}
                        className={`flex items-center rounded-md ${
                          settings.theme === "dark"
                            ? "bg-gray-600 text-white"
                            : "text-gray-400 hover:text-white hover:bg-gray-600/50"
                        }`}
                      >
                        <Moon className="h-4 w-4 mr-1.5" />
                        Dark
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <Label htmlFor="enableAnimations" className="text-gray-400 cursor-pointer">
                      Enable Animations
                    </Label>
                    <Switch
                      id="enableAnimations"
                      checked={settings.enableAnimations}
                      onCheckedChange={(checked) => handleSwitchChange("enableAnimations", checked)}
                      className="data-[state=checked]:bg-yellow-500"
                    />
                  </div>
                </div>
              </div>
              
              <Separator className="bg-gray-700" />
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-300 flex items-center">
                  <Bell className="h-4 w-4 mr-2 text-gray-400" />
                  Notifications
                </h4>
                <div className="pl-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="enableNotifications" className="text-gray-400 cursor-pointer">
                      Enable Notifications
                    </Label>
                    <Switch
                      id="enableNotifications"
                      checked={settings.enableNotifications}
                      onCheckedChange={(checked) => handleSwitchChange("enableNotifications", checked)}
                      className="data-[state=checked]:bg-yellow-500"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <Label htmlFor="enableSoundEffects" className="text-gray-400 cursor-pointer">
                      Sound Effects
                    </Label>
                    <Switch
                      id="enableSoundEffects"
                      checked={settings.enableSoundEffects}
                      onCheckedChange={(checked) => handleSwitchChange("enableSoundEffects", checked)}
                      className="data-[state=checked]:bg-yellow-500"
                    />
                  </div>
                </div>
              </div>
              
              <Separator className="bg-gray-700" />
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-300 flex items-center">
                  <Globe className="h-4 w-4 mr-2 text-gray-400" />
                  Language
                </h4>
                <div className="pl-6">
                  <Select
                    value={settings.language}
                    onValueChange={(value) => handleSelectChange("language", value)}
                  >
                    <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white w-full">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="mt-0 space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-300 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  Automatic Logout
                </h4>
                <div className="pl-6">
                  <Select
                    value={settings.autoLogoutTime}
                    onValueChange={(value) => handleSelectChange("autoLogoutTime", value)}
                  >
                    <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white w-full">
                      <SelectValue placeholder="Select logout time" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {AUTO_LOGOUT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator className="bg-gray-700" />
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-300 flex items-center">
                  <Smartphone className="h-4 w-4 mr-2 text-gray-400" />
                  Two-Factor Authentication
                </h4>
                <div className="pl-6 space-y-4">
                  <MfaManager />
                </div>
              </div>
              
              <Separator className="bg-gray-700" />
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-300 flex items-center">
                  <Lock className="h-4 w-4 mr-2 text-gray-400" />
                  Change Password
                </h4>
                <div className="pl-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-gray-400">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={settings.currentPassword}
                        onChange={handleInputChange}
                        className="bg-gray-700/50 border-gray-600 text-white pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-gray-400">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={settings.newPassword}
                      onChange={handleInputChange}
                      className="bg-gray-700/50 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-400">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={settings.confirmPassword}
                      onChange={handleInputChange}
                      className="bg-gray-700/50 border-gray-600 text-white"
                    />
                  </div>
                  <Button
                    onClick={handlePasswordChange}
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                  >
                    Change Password
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="data" className="mt-0 space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-300 flex items-center">
                  <Share2 className="h-4 w-4 mr-2 text-gray-400" />
                  Data Sharing
                </h4>
                <div className="pl-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300">Anonymous Usage Data</p>
                      <p className="text-xs text-gray-500">Help improve the app by sharing anonymous usage statistics</p>
                    </div>
                    <Switch
                      id="dataSharing"
                      checked={settings.dataSharing}
                      onCheckedChange={(checked) => handleSwitchChange("dataSharing", checked)}
                      className="data-[state=checked]:bg-yellow-500"
                    />
                  </div>
                </div>
              </div>
              
              <Separator className="bg-gray-700" />
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-300 flex items-center">
                  <RefreshCw className="h-4 w-4 mr-2 text-gray-400" />
                  Data Backup
                </h4>
                <div className="pl-6 space-y-4">
                  <div className="space-y-3">
                    <Label htmlFor="backupFrequency" className="text-gray-400">Backup Frequency</Label>
                    <Select
                      value={settings.backupFrequency}
                      onValueChange={(value) => handleSelectChange("backupFrequency", value)}
                    >
                      <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white w-full">
                        <SelectValue placeholder="Select backup frequency" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="manual">Manual Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      className="bg-gray-700/30 border-gray-600 hover:bg-gray-700 text-white"
                      onClick={handleExportData}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-gray-700/30 border-gray-600 hover:bg-gray-700 text-white"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Import Data
                    </Button>
                  </div>
                </div>
              </div>
              
              <Separator className="bg-gray-700" />
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-300 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                  Danger Zone
                </h4>
                <div className="pl-6">
                  <div className="p-4 rounded-lg bg-red-900/10 border border-red-900/30">
                    <h5 className="font-medium text-red-400">Delete Account</h5>
                    <p className="text-sm text-gray-400 mt-1 mb-3">
                      This action cannot be undone. All your data will be permanently removed.
                    </p>
                    
                    <Dialog open={isOpenDeleteDialog} onOpenChange={setIsOpenDeleteDialog}>
                      <DialogTrigger asChild>
                        <Button
                          variant="destructive"
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Delete Account
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-800 border border-gray-700">
                        <DialogHeader>
                          <DialogTitle className="text-white">Delete Account</DialogTitle>
                          <DialogDescription className="text-gray-400">
                            This action cannot be undone. It will permanently delete your account and remove all your data.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="py-4">
                          <Alert variant="destructive" className="bg-red-900/20 border-red-900/40 text-red-400">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            <AlertDescription>
                              All your financial data, goals, and settings will be lost.
                            </AlertDescription>
                          </Alert>
                          
                          <div className="mt-4 space-y-2">
                            <Label htmlFor="confirmDelete" className="text-gray-300">
                              Type <span className="font-mono font-bold">DELETE</span> to confirm
                            </Label>
                            <Input
                              id="confirmDelete"
                              value={confirmDeleteAccount}
                              onChange={(e) => setConfirmDeleteAccount(e.target.value)}
                              className="bg-gray-700/50 border-gray-600 text-white"
                            />
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setIsOpenDeleteDialog(false)}
                            className="border-gray-600 hover:bg-gray-700"
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleDeleteAccount}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete Account
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="help" className="mt-0 space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-300">Frequently Asked Questions</h4>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="faq-1" className="border-gray-700">
                    <AccordionTrigger className="text-gray-300 hover:text-white hover:no-underline py-3">
                      How do I create a new budget?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400 pb-3">
                      To create a new budget, navigate to the Expenses tab and click on "Add Expense" to start tracking your spending categories.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="faq-2" className="border-gray-700">
                    <AccordionTrigger className="text-gray-300 hover:text-white hover:no-underline py-3">
                      Can I export my financial data?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400 pb-3">
                      Yes! You can export your data by going to Settings → Data → Export Data. This will download all your financial records in a CSV format.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="faq-3" className="border-gray-700">
                    <AccordionTrigger className="text-gray-300 hover:text-white hover:no-underline py-3">
                      How secure is my financial information?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400 pb-3">
                      WealthWise uses state-of-the-art encryption to protect your data. We use Supabase for authentication and database services which ensures that your information is secure and only accessible by you.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="faq-4" className="border-gray-700">
                    <AccordionTrigger className="text-gray-300 hover:text-white hover:no-underline py-3">
                      How do I change my currency preferences?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400 pb-3">
                      You can change your currency settings by navigating to Profile → Preferences → Currency Settings. Select your preferred currency from the dropdown menu and save changes.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              
              <Separator className="bg-gray-700" />
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-300">Support</h4>
                <div className="space-y-2">
                  <p className="text-gray-400">
                    Need help or have questions? Contact our support team.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      className="bg-gray-700/30 border-gray-600 hover:bg-gray-700 text-white"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email Support
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-gray-700/30 border-gray-600 hover:bg-gray-700 text-white"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Documentation
                    </Button>
                  </div>
                </div>
              </div>
              
              <Separator className="bg-gray-700" />
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-300">About WealthWise</h4>
                <div className="space-y-2">
                  <p className="text-gray-400">
                    Version 1.0.0
                  </p>
                  <p className="text-gray-400">
                    WealthWise is an AI-powered student budgeting tool designed to make financial management simple and effective.
                  </p>
                  <p className="text-gray-400 mt-2">
                    © 2023 WealthWise. All rights reserved.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings; 