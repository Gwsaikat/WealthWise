import React, { useState } from "react";
import {
  AlertTriangle,
  Info,
  Loader2,
  RefreshCw,
  Shield,
  Smartphone,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../ui/use-toast";
import MfaSetup from "./MfaSetup";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Alert, AlertDescription } from "../ui/alert";

interface MfaManagerProps {
  onUpdate?: () => void;
}

const MfaManager: React.FC<MfaManagerProps> = ({ onUpdate }) => {
  const { user, isMfaEnabled, mfaSetupState, disableMfa } = useAuth();
  const { toast } = useToast();
  
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleToggle = (checked: boolean) => {
    if (checked && !isMfaEnabled) {
      // Enable MFA
      setIsSettingUp(true);
    } else if (!checked && isMfaEnabled) {
      // Disable MFA
      setIsDisabling(true);
    }
  };

  const handleDisableMfa = async () => {
    if (!password) {
      setErrorMessage("Please enter your password to continue");
      return;
    }
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const { success, error } = await disableMfa(password);
      
      if (success) {
        setIsDisabling(false);
        setPassword("");
        toast({
          title: "MFA Disabled",
          description: "Two-factor authentication has been disabled",
        });
        if (onUpdate) {
          onUpdate();
        }
      } else if (error) {
        setErrorMessage(error.message || "Failed to disable two-factor authentication");
        toast({
          title: "Error",
          description: error.message || "Failed to disable two-factor authentication",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error disabling MFA:", err);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupComplete = () => {
    setIsSettingUp(false);
    if (onUpdate) {
      onUpdate();
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-gray-300">Two-Factor Authentication</h4>
          <p className="text-xs text-gray-500">Require a verification code when logging in</p>
        </div>
        <Switch
          id="twoFactorAuth"
          checked={isMfaEnabled}
          onCheckedChange={handleToggle}
          className="data-[state=checked]:bg-yellow-500"
        />
      </div>
      
      {isMfaEnabled && (
        <div className="p-4 rounded-lg bg-gray-700/30 border border-gray-600 mb-4">
          <p className="text-gray-300 flex items-start">
            <Shield className="h-4 w-4 text-yellow-400 mr-2 mt-0.5 shrink-0" />
            <span>Two-factor authentication is enabled</span>
          </p>
          <p className="text-xs text-gray-400 mt-1 ml-6">
            You will need to enter a verification code when logging in to your account
          </p>
          <div className="mt-3 flex space-x-2 ml-6">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 hover:bg-gray-700 text-gray-300"
              onClick={() => setIsSettingUp(true)}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Reconfigure
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              onClick={() => setIsDisabling(true)}
            >
              <X className="h-3.5 w-3.5 mr-1.5" />
              Disable
            </Button>
          </div>
        </div>
      )}
      
      {!isMfaEnabled && (
        <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 mb-4">
          <p className="text-gray-300 flex items-start">
            <Info className="h-4 w-4 text-yellow-400 mr-2 mt-0.5 shrink-0" />
            <span>Protect your account with two-factor authentication</span>
          </p>
          <p className="text-xs text-gray-400 mt-1 ml-6">
            Adding 2FA greatly increases the security of your account and financial data
          </p>
          <div className="mt-3 ml-6">
            <Button
              variant="outline"
              size="sm"
              className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
              onClick={() => setIsSettingUp(true)}
            >
              <Smartphone className="h-3.5 w-3.5 mr-1.5" />
              Set Up 2FA
            </Button>
          </div>
        </div>
      )}
      
      {/* MFA Setup Dialog */}
      <Dialog open={isSettingUp} onOpenChange={setIsSettingUp}>
        <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700 p-0">
          <MfaSetup 
            onComplete={handleSetupComplete} 
            onCancel={() => setIsSettingUp(false)} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Disable MFA Dialog */}
      <Dialog open={isDisabling} onOpenChange={setIsDisabling}>
        <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
              Disable Two-Factor Authentication
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              This will remove the extra security layer from your account
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {errorMessage && (
              <Alert variant="destructive" className="mb-4 bg-red-500/10 border-red-500/50 text-red-300">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            
            <div className="p-4 mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-gray-300">
              <AlertTriangle className="h-5 w-5 text-red-400 float-left mr-3 mt-0.5" />
              <p>Disabling two-factor authentication will make your account more vulnerable to unauthorized access.</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-gray-300">
                Enter your password to confirm
              </Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-700/50 border-gray-600 text-white"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDisabling(false);
                setPassword("");
                setErrorMessage(null);
              }}
              className="border-gray-600 hover:bg-gray-700 text-white"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="bg-red-500 hover:bg-red-600"
              onClick={handleDisableMfa}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Disabling...
                </>
              ) : (
                "Disable 2FA"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MfaManager; 