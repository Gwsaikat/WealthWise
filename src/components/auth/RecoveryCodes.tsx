import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Check,
  Copy,
  Download,
  Loader2,
  SaveIcon,
  Shield,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";

interface RecoveryCodesProps {
  codes?: string[];
  onClose?: () => void;
  showHeader?: boolean;
}

const RecoveryCodes: React.FC<RecoveryCodesProps> = ({ 
  codes: initialCodes, 
  onClose, 
  showHeader = true 
}) => {
  const { getRecoveryCodes } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(!initialCodes);
  const [codes, setCodes] = useState<string[]>(initialCodes || []);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  useEffect(() => {
    if (!initialCodes) {
      fetchRecoveryCodes();
    }
  }, [initialCodes]);

  const fetchRecoveryCodes = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const { success, error, recoveryCodes } = await getRecoveryCodes();
      
      if (success && recoveryCodes && recoveryCodes.length > 0) {
        setCodes(recoveryCodes);
      } else if (error) {
        setErrorMessage(error.message || "Failed to retrieve recovery codes");
        toast({
          title: "Error",
          description: error.message || "Failed to retrieve recovery codes",
          variant: "destructive",
        });
      } else {
        setErrorMessage("No recovery codes found");
      }
    } catch (err) {
      console.error("Error fetching recovery codes:", err);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAll = () => {
    if (codes.length) {
      navigator.clipboard.writeText(codes.join('\n'));
      setIsCopied(true);
      toast({
        title: "Copied",
        description: "Recovery codes copied to clipboard",
      });
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };

  const handleDownload = () => {
    if (codes.length) {
      const content = 
`WealthWise Recovery Codes
IMPORTANT: Keep these codes in a safe place. Each code can only be used once.
Generated: ${new Date().toLocaleString()}

${codes.join('\n')}

If you lose access to your authenticator device, you can use one of these codes to sign in.`;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'wealthwise-recovery-codes.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setIsDownloaded(true);
      toast({
        title: "Downloaded",
        description: "Recovery codes saved to file",
      });
      
      // Reset the downloaded state after 2 seconds
      setTimeout(() => {
        setIsDownloaded(false);
      }, 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
        <CardContent className="pt-6 flex justify-center items-center h-48">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 text-yellow-400 animate-spin mb-2" />
            <p className="text-gray-400">Loading recovery codes...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 recovery-codes-container">
      {showHeader && (
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center">
            <Shield className="h-5 w-5 mr-2 text-yellow-400" />
            Recovery Codes
          </CardTitle>
          <CardDescription className="text-gray-400">
            Use these codes if you lose access to your authenticator app
          </CardDescription>
        </CardHeader>
      )}
      
      <CardContent className="space-y-4">
        {errorMessage ? (
          <Alert variant="destructive" className="bg-red-500/10 border-red-500/50 text-red-300">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : (
          <>
            <Alert className="bg-yellow-500/10 border-yellow-500/30 text-yellow-300">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <AlertDescription>
                Save these recovery codes in a secure location. Each code can only be used once.
              </AlertDescription>
            </Alert>
            
            <div className="p-4 bg-gray-700/50 rounded-md">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-sm">
                {codes.map((code, index) => (
                  <div 
                    key={index} 
                    className="flex items-center py-1 px-2 rounded-sm hover:bg-gray-600/50"
                  >
                    <span className="text-gray-500 mr-2">{index + 1}.</span>
                    <span className="text-yellow-400">{code}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator className="bg-gray-700" />
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-300">Instructions:</h4>
              <ul className="text-sm text-gray-400 space-y-1 list-disc pl-5">
                <li>Store these codes somewhere safe but accessible.</li>
                <li>Each code can only be used once.</li>
                <li>These codes allow you to sign in if you lose your authenticator device.</li>
                <li>Treat these codes with the same level of security as your password.</li>
              </ul>
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
          onClick={handleCopyAll}
          disabled={codes.length === 0}
        >
          {isCopied ? (
            <>
              <Check className="h-4 w-4 mr-1.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-1.5" />
              Copy All
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
          onClick={handleDownload}
          disabled={codes.length === 0}
        >
          {isDownloaded ? (
            <>
              <Check className="h-4 w-4 mr-1.5" />
              Downloaded
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-1.5" />
              Download
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
          onClick={handlePrint}
          disabled={codes.length === 0}
        >
          <SaveIcon className="h-4 w-4 mr-1.5" />
          Print
        </Button>
        
        {onClose && (
          <Button
            className="ml-auto bg-yellow-500 hover:bg-yellow-600 text-gray-900"
            onClick={onClose}
          >
            I've Saved My Codes
          </Button>
        )}
      </CardFooter>
      
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .recovery-codes-container,
            .recovery-codes-container * {
              visibility: visible;
            }
            .recovery-codes-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              background: white !important;
              color: black !important;
            }
            .recovery-codes-container button {
              display: none;
            }
          }
        `}
      </style>
    </Card>
  );
};

export default RecoveryCodes; 