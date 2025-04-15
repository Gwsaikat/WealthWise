import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Check,
  Copy,
  Loader2,
  Shield,
  Smartphone,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import RecoveryCodes from "./RecoveryCodes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface MfaSetupProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

const MfaSetup: React.FC<MfaSetupProps> = ({ onComplete, onCancel }) => {
  const { user, mfaSetupState, setupMfa, completeMfaSetup } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'initial' | 'qrcode' | 'verify' | 'complete'>('initial');
  const [verificationCode, setVerificationCode] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [secretKey, setSecretKey] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [recoveryCodeTab, setRecoveryCodeTab] = useState<'codes' | 'info'>('codes');

  useEffect(() => {
    // If MFA is already set up, go to complete step
    if (mfaSetupState === 'complete') {
      setStep('complete');
    }
  }, [mfaSetupState]);

  const handleStartSetup = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const { success, error, qrCodeUrl, secret, recoveryCodes } = await setupMfa();
      
      if (success && qrCodeUrl && secret) {
        setQrCodeUrl(qrCodeUrl);
        setSecretKey(secret);
        if (recoveryCodes) {
          setRecoveryCodes(recoveryCodes);
        }
        setStep('qrcode');
      } else if (error) {
        setErrorMessage(error.message || "Failed to start MFA setup");
        toast({
          title: "Setup Failed",
          description: error.message || "There was a problem setting up MFA",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("MFA setup error:", err);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6 || !secretKey) {
      setErrorMessage("Please enter a valid 6-digit verification code");
      return;
    }
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const { success, error, recoveryCodes: returnedCodes } = await completeMfaSetup(verificationCode, secretKey);
      
      if (success) {
        if (returnedCodes && returnedCodes.length > 0) {
          setRecoveryCodes(returnedCodes);
        }
        setStep('complete');
        toast({
          title: "MFA Enabled",
          description: "Two-factor authentication has been successfully enabled",
        });
      } else if (error) {
        setErrorMessage(error.message || "Failed to verify code");
        toast({
          title: "Verification Failed",
          description: error.message || "Please check your code and try again",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("MFA verification error:", err);
      setErrorMessage("An unexpected error occurred during verification.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySecret = () => {
    if (secretKey) {
      navigator.clipboard.writeText(secretKey);
      setIsCopied(true);
      toast({
        title: "Copied",
        description: "Secret key copied to clipboard",
      });
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };

  const renderContent = () => {
    switch (step) {
      case 'initial':
        return (
          <>
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center">
                <Shield className="h-5 w-5 mr-2 text-yellow-400" />
                Set Up Two-Factor Authentication
              </CardTitle>
              <CardDescription className="text-gray-400">
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-4">
                <h3 className="text-white font-medium">What is Two-Factor Authentication?</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Two-factor authentication (2FA) adds an extra security layer to your account. 
                  After entering your password, you'll need to provide a code from your authentication app.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-white font-medium">How it works:</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li className="flex">
                    <span className="bg-gray-700 text-yellow-400 h-5 w-5 rounded-full flex items-center justify-center text-xs mr-2 shrink-0">1</span>
                    <span>Set up an authenticator app on your mobile device (like Google Authenticator, Microsoft Authenticator, or Authy)</span>
                  </li>
                  <li className="flex">
                    <span className="bg-gray-700 text-yellow-400 h-5 w-5 rounded-full flex items-center justify-center text-xs mr-2 shrink-0">2</span>
                    <span>Scan the QR code with your app or enter the provided secret key</span>
                  </li>
                  <li className="flex">
                    <span className="bg-gray-700 text-yellow-400 h-5 w-5 rounded-full flex items-center justify-center text-xs mr-2 shrink-0">3</span>
                    <span>Enter the 6-digit verification code to complete the setup</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={onCancel}
                className="border-gray-600 hover:bg-gray-700 text-white"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleStartSetup}
                disabled={isLoading}
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Setting Up...
                  </>
                ) : (
                  <>Start Setup</>
                )}
              </Button>
            </CardFooter>
          </>
        );
        
      case 'qrcode':
        return (
          <>
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center">
                <Smartphone className="h-5 w-5 mr-2 text-yellow-400" />
                Scan QR Code
              </CardTitle>
              <CardDescription className="text-gray-400">
                Scan this QR code with your authenticator app
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {errorMessage && (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/50 text-red-300">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
              
              {qrCodeUrl && (
                <div className="flex justify-center">
                  <div className="p-4 bg-white rounded-lg">
                    <img 
                      src={`https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${encodeURIComponent(qrCodeUrl)}`}
                      alt="QR Code for authenticator app"
                      className="w-48 h-48"
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <p className="text-gray-300 text-sm">If you can't scan the QR code, enter this key manually in your app:</p>
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-700 text-yellow-400 px-3 py-1 rounded font-mono text-sm flex-1 overflow-x-auto">
                    {secretKey}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    onClick={handleCopySecret}
                  >
                    {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2 pt-4">
                <label htmlFor="verification-code" className="block text-sm font-medium text-gray-300">
                  Enter 6-digit code from your app
                </label>
                <Input
                  id="verification-code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').substring(0, 6))}
                  className="bg-gray-700/50 border-gray-600 text-white text-center tracking-widest"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => {
                  setStep('initial');
                  setVerificationCode("");
                  setQrCodeUrl(null);
                  setSecretKey(null);
                }}
                className="border-gray-600 hover:bg-gray-700 text-white"
              >
                Back
              </Button>
              <Button 
                onClick={handleVerifyCode}
                disabled={isLoading || verificationCode.length !== 6}
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>Verify & Enable</>
                )}
              </Button>
            </CardFooter>
          </>
        );
        
      case 'complete':
        return (
          <>
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center">
                <Check className="h-5 w-5 mr-2 text-green-400" />
                Setup Complete
              </CardTitle>
              <CardDescription className="text-gray-400">
                Two-factor authentication is now enabled
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={recoveryCodeTab} onValueChange={(value) => setRecoveryCodeTab(value as 'codes' | 'info')}>
                <TabsList className="grid grid-cols-2 bg-gray-700/50 mx-6 mt-6">
                  <TabsTrigger value="codes" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
                    Recovery Codes
                  </TabsTrigger>
                  <TabsTrigger value="info" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
                    Important Info
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="codes" className="m-0">
                  <div className="px-6 pt-4 pb-6">
                    <Alert className="bg-yellow-500/10 border-yellow-500/30 text-yellow-300 mb-4">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      <AlertDescription>
                        These recovery codes can help you regain access if you lose your device. Save them in a secure place.
                      </AlertDescription>
                    </Alert>
                    
                    {recoveryCodes.length > 0 ? (
                      <RecoveryCodes codes={recoveryCodes} showHeader={false} />
                    ) : (
                      <div className="p-4 bg-gray-700/30 border border-gray-600 rounded-lg">
                        <p className="text-gray-400 text-center">No recovery codes available</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="info" className="m-0">
                  <div className="px-6 pt-4 pb-6 space-y-4">
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                      <h3 className="text-green-400 font-medium flex items-center">
                        <Check className="h-4 w-4 mr-2" />
                        Successfully Enabled
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">
                        You'll now need to enter a verification code when signing in to your account.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-white font-medium">What to know:</h3>
                      <ul className="space-y-2 text-gray-400 text-sm">
                        <li className="flex">
                          <AlertTriangle className="h-4 w-4 text-yellow-400 mr-2 shrink-0 mt-0.5" />
                          <span>Keep your recovery codes in a safe place. You'll need them if you lose access to your device.</span>
                        </li>
                        <li className="flex">
                          <AlertTriangle className="h-4 w-4 text-yellow-400 mr-2 shrink-0 mt-0.5" />
                          <span>Each recovery code can only be used once.</span>
                        </li>
                        <li className="flex">
                          <AlertTriangle className="h-4 w-4 text-yellow-400 mr-2 shrink-0 mt-0.5" />
                          <span>If you change phones, you'll need to reconfigure your authenticator app.</span>
                        </li>
                        <li className="flex">
                          <AlertTriangle className="h-4 w-4 text-yellow-400 mr-2 shrink-0 mt-0.5" />
                          <span>You can disable 2FA from your account settings if needed.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="justify-end">
              <Button 
                onClick={onComplete}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Done
              </Button>
            </CardFooter>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 w-full max-w-md mx-auto">
      {renderContent()}
    </Card>
  );
};

export default MfaSetup; 