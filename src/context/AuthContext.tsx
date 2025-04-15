import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Define the shape of the authentication context
type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: Error | null;
  isMfaEnabled: boolean;
  mfaSetupState: 'not-setup' | 'in-progress' | 'complete';
  signIn: (email: string, password: string) => Promise<{
    success: boolean;
    error: Error | null;
    needsVerification: boolean;
    requiresMfa?: boolean;
    mfaTicket?: string;
  }>;
  signUp: (email: string, password: string, userData?: Record<string, any>) => Promise<{
    success: boolean;
    error: Error | null;
  }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{
    success: boolean;
    error: Error | null;
  }>;
  verifyMfaCode: (code: string, ticket: string) => Promise<{
    success: boolean;
    error: Error | null;
  }>;
  setupMfa: () => Promise<{
    success: boolean;
    error: Error | null;
    qrCodeUrl?: string;
    secret?: string;
    recoveryCodes?: string[];
  }>;
  completeMfaSetup: (code: string, secret: string) => Promise<{
    success: boolean;
    error: Error | null;
    recoveryCodes?: string[];
  }>;
  disableMfa: (password: string) => Promise<{
    success: boolean;
    error: Error | null;
  }>;
  getRecoveryCodes: () => Promise<{
    success: boolean;
    error: Error | null;
    recoveryCodes?: string[];
  }>;
  verifyRecoveryCode: (code: string) => Promise<{
    success: boolean;
    error: Error | null;
  }>;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component to wrap the application
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isMfaEnabled, setIsMfaEnabled] = useState(false);
  const [mfaSetupState, setMfaSetupState] = useState<'not-setup' | 'in-progress' | 'complete'>('not-setup');

  // Effect to listen for auth state changes
  useEffect(() => {
    setIsLoading(true);
    
    // Check active session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setError(error);
      
      // Check if MFA is enabled for the user
      if (session?.user) {
        checkMfaStatus(session.user);
      }
      
      setIsLoading(false);
    });
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Check if MFA is enabled when user state changes
      if (session?.user) {
        checkMfaStatus(session.user);
      } else {
        setIsMfaEnabled(false);
        setMfaSetupState('not-setup');
      }
      
      setIsLoading(false);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Helper function to check if MFA is enabled for a user
  const checkMfaStatus = async (user: User) => {
    try {
      // In a real app, you would fetch this from your MFA configuration table
      // For this example, we'll check user metadata or make an API call
      const { data, error } = await supabase
        .from('user_mfa')
        .select('enabled, setup_completed')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error('Error checking MFA status:', error);
        setIsMfaEnabled(false);
        setMfaSetupState('not-setup');
        return;
      }
      
      if (data) {
        setIsMfaEnabled(data.enabled);
        setMfaSetupState(data.setup_completed ? 'complete' : 'in-progress');
      } else {
        setIsMfaEnabled(false);
        setMfaSetupState('not-setup');
      }
    } catch (error) {
      console.error('Error checking MFA status:', error);
      setIsMfaEnabled(false);
      setMfaSetupState('not-setup');
    }
  };
  
  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      // Check if the user's email is verified
      if (data.user && !data.user.email_confirmed_at) {
        // User hasn't verified their email
        // Sign them out and return an error
        await supabase.auth.signOut();
        
        return { 
          success: false, 
          error: new Error("Email not verified. Please check your email for a verification link."),
          needsVerification: true 
        };
      }
      
      // Check if MFA is enabled for this user
      if (data.user) {
        const { data: mfaData, error: mfaError } = await supabase
          .from('user_mfa')
          .select('enabled')
          .eq('user_id', data.user.id)
          .single();
        
        if (!mfaError && mfaData && mfaData.enabled) {
          // In a real implementation, you would get a ticket from your MFA service
          // For this example, we'll generate a placeholder ticket
          const mfaTicket = `mfa-${data.user.id}-${Date.now()}`;
          
          // Sign the user out until they complete MFA verification
          await supabase.auth.signOut();
          
          return {
            success: false,
            error: null,
            needsVerification: false,
            requiresMfa: true,
            mfaTicket
          };
        }
      }
      
      return { success: true, error: null, needsVerification: false };
    } catch (error) {
      console.error('Error signing in:', error);
      setError(error as Error);
      return { success: false, error: error as Error, needsVerification: false };
    } finally {
      setIsLoading(false);
    }
  };

  // Verify MFA code
  const verifyMfaCode = async (code: string, ticket: string) => {
    try {
      setIsLoading(true);
      
      // In a real implementation, you would validate the code against your MFA service
      // For this example, we'll parse the user ID from the ticket and validate
      
      if (!ticket.startsWith('mfa-')) {
        throw new Error('Invalid MFA ticket');
      }
      
      const parts = ticket.split('-');
      if (parts.length < 3) {
        throw new Error('Invalid MFA ticket format');
      }
      
      const userId = parts[1];
      
      // For demo purposes, we'll accept any 6-digit code
      // In a real app, you would verify against TOTP algorithm
      if (!/^\d{6}$/.test(code)) {
        throw new Error('Invalid MFA code format. Please enter a 6-digit code.');
      }
      
      // Mock verification (in a real app, you'd verify with actual TOTP logic)
      const isCodeValid = true; // Simplified for demo
      
      if (!isCodeValid) {
        throw new Error('Invalid MFA code');
      }
      
      // Re-authenticate the user after successful MFA
      // This would use a special endpoint in a real implementation
      // For the demo, we'll fetch the user's email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('email')
        .eq('user_id', userId)
        .single();
      
      if (userError || !userData) {
        throw new Error('Failed to complete authentication');
      }
      
      // This is a simplified example - in a real app,
      // you would use a session extension or token mechanism
      // Do not store passwords client-side in a real application
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Error verifying MFA code:', error);
      return { success: false, error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Setup MFA for a user
  const setupMfa = async () => {
    try {
      setIsLoading(true);
      
      if (!user) {
        throw new Error('You must be signed in to set up MFA');
      }
      
      // Generate a secret key (in a real app, you would use a proper TOTP library)
      const secret = generateSecretKey();
      
      // Generate recovery codes
      const recoveryCodes = generateRecoveryCodes();
      
      // Create a QR code URL (in a real app, you would generate a proper TOTP QR code)
      const qrCodeUrl = `otpauth://totp/WealthWise:${user.email}?secret=${secret}&issuer=WealthWise`;
      
      // Create or update the user's MFA record
      const { error } = await supabase
        .from('user_mfa')
        .upsert({
          user_id: user.id,
          secret_key: secret,
          enabled: false,
          setup_completed: false,
          recovery_codes: recoveryCodes,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        throw error;
      }
      
      setMfaSetupState('in-progress');
      
      return { 
        success: true, 
        error: null,
        qrCodeUrl,
        secret,
        recoveryCodes
      };
    } catch (error) {
      console.error('Error setting up MFA:', error);
      return { success: false, error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Complete MFA setup by verifying the first code
  const completeMfaSetup = async (code: string, secret: string) => {
    try {
      setIsLoading(true);
      
      if (!user) {
        throw new Error('You must be signed in to complete MFA setup');
      }
      
      // Verify the code (in a real app, you would verify against TOTP algorithm)
      if (!/^\d{6}$/.test(code)) {
        throw new Error('Invalid code format. Please enter a 6-digit code.');
      }
      
      // Mock verification (in a real app, you'd verify with actual TOTP logic)
      const isCodeValid = true; // Simplified for demo
      
      if (!isCodeValid) {
        throw new Error('Invalid verification code');
      }
      
      // Fetch recovery codes
      const { data, error: fetchError } = await supabase
        .from('user_mfa')
        .select('recovery_codes')
        .eq('user_id', user.id)
        .single();
        
      if (fetchError) {
        throw fetchError;
      }
      
      // Update the user's MFA record
      const { error } = await supabase
        .from('user_mfa')
        .update({
          enabled: true,
          setup_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      setIsMfaEnabled(true);
      setMfaSetupState('complete');
      
      return { 
        success: true, 
        error: null,
        recoveryCodes: data?.recovery_codes || []
      };
    } catch (error) {
      console.error('Error completing MFA setup:', error);
      return { success: false, error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Disable MFA
  const disableMfa = async (password: string) => {
    try {
      setIsLoading(true);
      
      if (!user) {
        throw new Error('You must be signed in to disable MFA');
      }
      
      // Verify the user's password before allowing MFA disable
      // This is a security measure to prevent unauthorized disabling
      try {
        // Re-authenticate the user to confirm password
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: user.email as string,
          password
        });
        
        if (signInError) {
          throw new Error('Incorrect password');
        }
      } catch (error) {
        throw new Error('Failed to verify password');
      }
      
      // Update the user's MFA record
      const { error } = await supabase
        .from('user_mfa')
        .update({
          enabled: false,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      setIsMfaEnabled(false);
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Error disabling MFA:', error);
      return { success: false, error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to generate a random secret key
  const generateSecretKey = () => {
    // In a real app, use a proper TOTP library for this
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  
  // Helper function to generate random recovery codes
  const generateRecoveryCodes = () => {
    // In a real app, use a more secure method for generating recovery codes
    const codes = [];
    for (let i = 0; i < 10; i++) {
      let code = '';
      for (let j = 0; j < 10; j++) {
        code += Math.floor(Math.random() * 10).toString();
      }
      codes.push(code);
    }
    return codes;
  };
  
  // Sign up function
  const signUp = async (email: string, password: string, userData?: Record<string, any>) => {
    try {
      setIsLoading(true);
      
      // Register the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: userData
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        // Create a user profile in the profiles table
        const { error: profileError } = await supabase.from('profiles').insert([
          { 
            user_id: data.user.id,
            full_name: userData?.full_name || '',
            avatar_url: null,
            updated_at: new Date().toISOString()
          }
        ]);
        
        if (profileError) {
          console.error('Error creating user profile:', profileError);
          // We don't throw here as the authentication was successful
          // The profile can be created later if needed
        }
      }
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Error signing up:', error);
      setError(error as Error);
      return { success: false, error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sign out function
  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        throw error;
      }
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Error resetting password:', error);
      setError(error as Error);
      return { success: false, error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get recovery codes for the user
  const getRecoveryCodes = async () => {
    try {
      setIsLoading(true);
      
      if (!user) {
        throw new Error('You must be signed in to get recovery codes');
      }
      
      // Fetch recovery codes
      const { data, error } = await supabase
        .from('user_mfa')
        .select('recovery_codes')
        .eq('user_id', user.id)
        .single();
        
      if (error) {
        throw error;
      }
      
      return { 
        success: true, 
        error: null,
        recoveryCodes: data?.recovery_codes || []
      };
    } catch (error) {
      console.error('Error getting recovery codes:', error);
      return { success: false, error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Verify a recovery code
  const verifyRecoveryCode = async (code: string) => {
    try {
      setIsLoading(true);
      
      if (!user) {
        throw new Error('You must be signed in to verify a recovery code');
      }
      
      // Fetch recovery codes
      const { data, error } = await supabase
        .from('user_mfa')
        .select('recovery_codes')
        .eq('user_id', user.id)
        .single();
        
      if (error) {
        throw error;
      }
      
      // Check if the code is in the list of recovery codes
      const recoveryCodes = data?.recovery_codes || [];
      if (!recoveryCodes.includes(code)) {
        throw new Error('Invalid recovery code');
      }
      
      // Remove the used code and update the list
      const updatedCodes = recoveryCodes.filter(c => c !== code);
      
      // Update the user's MFA record
      const { error: updateError } = await supabase
        .from('user_mfa')
        .update({
          recovery_codes: updatedCodes,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
        
      if (updateError) {
        throw updateError;
      }
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Error verifying recovery code:', error);
      return { success: false, error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Value object to provide to consumers
  const value = {
    user,
    session,
    isLoading,
    error,
    isMfaEnabled,
    mfaSetupState,
    signIn,
    signUp,
    signOut,
    resetPassword,
    verifyMfaCode,
    setupMfa,
    completeMfaSetup,
    disableMfa,
    getRecoveryCodes,
    verifyRecoveryCode
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 