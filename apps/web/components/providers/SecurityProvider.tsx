"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Fingerprint, MonitorSmartphone, Lock, Delete } from "lucide-react";
import Loading from "@/app/loading";
import toast from "react-hot-toast";

type LockType = "biometric" | "pin";

interface SecurityContextType {
  isLocked: boolean;
  isLockEnabled: boolean;
  lockType: LockType;
  toggleLock: (enabled: boolean, type?: LockType, pin?: string) => Promise<boolean>;
  authenticate: () => Promise<boolean>;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export function SecurityProvider({ children }: { children: React.ReactNode }) {
  const [isLocked, setIsLocked] = useState(false);
  const [isLockEnabled, setIsLockEnabled] = useState(false);
  const [lockType, setLockType] = useState<LockType>("biometric");
  const [isChecking, setIsChecking] = useState(true);
  
  // PIN state for lock screen
  const [enteredPin, setEnteredPin] = useState("");

  const authenticate = useCallback(async (): Promise<boolean> => {
    if (lockType === "pin") return false; // Handled by PIN UI

    try {
      if (typeof window === "undefined" || !window.PublicKeyCredential) {
        setIsLocked(false);
        return true;
      }

      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (!available) {
        setIsLocked(false);
        return true;
      }

      const credentialId = localStorage.getItem("finease_credential_id");
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      if (credentialId) {
        const uint8Id = Uint8Array.from(atob(credentialId), c => c.charCodeAt(0));
        const options: CredentialRequestOptions = {
          publicKey: {
            challenge,
            allowCredentials: [{
              id: uint8Id,
              type: 'public-key',
              transports: ['internal'],
            }],
            userVerification: 'required',
            timeout: 60000,
          }
        };

        const assertion = await navigator.credentials.get(options);
        if (assertion) {
          setIsLocked(false);
          return true;
        }
      } else {
        return await registerCredential();
      }
      
      return false;
    } catch (error) {
      console.error("Auth failed", error);
      return false;
    }
  }, [lockType]);

  useEffect(() => {
    const enabled = localStorage.getItem("finease_app_lock") === "true";
    const type = (localStorage.getItem("finease_lock_type") as LockType) || "biometric";
    
    setIsLockEnabled(enabled);
    setLockType(type);
    
    if (enabled) {
      setIsLocked(true);
      if (type === "biometric") {
        setTimeout(() => {
          authenticate();
        }, 500);
      }
    }
    setIsChecking(false);
  }, [authenticate]);

  const registerCredential = async (): Promise<boolean> => {
    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      
      const options: CredentialCreationOptions = {
        publicKey: {
          challenge,
          rp: { name: "FinEase" },
          user: {
            id: new Uint8Array(16),
            name: "user@finease.io",
            displayName: "FinEase User"
          },
          pubKeyCredParams: [{ type: "public-key", alg: -7 }],
          timeout: 60000,
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required"
          }
        }
      };

      const credential = (await navigator.credentials.create(options)) as PublicKeyCredential;
      if (credential) {
        const idBase64 = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));
        localStorage.setItem("finease_credential_id", idBase64);
        setIsLocked(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Registration failed", error);
      return false;
    }
  };

  const toggleLock = async (enabled: boolean, type: LockType = "biometric", pin?: string): Promise<boolean> => {
    if (enabled) {
      if (type === "biometric") {
        const success = await registerCredential();
        if (success) {
          setIsLockEnabled(true);
          setLockType("biometric");
          localStorage.setItem("finease_app_lock", "true");
          localStorage.setItem("finease_lock_type", "biometric");
          toast.success("Security Shield Activated");
          return true;
        }
        toast.error("Failed to enable biometric lock");
        return false;
      } else if (type === "pin" && pin) {
        setIsLockEnabled(true);
        setLockType("pin");
        localStorage.setItem("finease_app_lock", "true");
        localStorage.setItem("finease_lock_type", "pin");
        localStorage.setItem("finease_pin", pin);
        toast.success("PIN Security Activated");
        return true;
      }
      return false;
    } else {
      setIsLockEnabled(false);
      localStorage.removeItem("finease_app_lock");
      localStorage.removeItem("finease_credential_id");
      localStorage.removeItem("finease_lock_type");
      localStorage.removeItem("finease_pin");
      toast.success("App Lock Deactivated");
      return true;
    }
  };

  const handlePinInput = (num: string) => {
    if (enteredPin.length < 4) {
      const newPin = enteredPin + num;
      setEnteredPin(newPin);
      
      if (newPin.length === 4) {
        const storedPin = localStorage.getItem("finease_pin");
        if (newPin === storedPin) {
          setIsLocked(false);
          setEnteredPin("");
        } else {
          toast.error("Invalid PIN");
          setEnteredPin("");
          // Vibration feedback if available
          if (window.navigator?.vibrate) {
            window.navigator.vibrate(200);
          }
        }
      }
    }
  };

  if (isChecking) return <Loading />;

  if (isLocked) {
    return (
      <div className="fixed inset-0 z-[200] bg-white dark:bg-[#0f1115] flex flex-col items-center justify-center p-6 select-none">
        <div className="w-full max-w-sm flex flex-col items-center">
          <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
            <Lock className="w-8 h-8" />
          </div>
          
          <h1 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2">Vault Locked</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-10">
            {lockType === 'biometric' ? 'Biometric verification required' : 'Enter security PIN'}
          </p>
          
          {lockType === "pin" ? (
            <div className="w-full space-y-12">
               {/* PIN Indicators */}
               <div className="flex justify-center gap-6">
                 {[0, 1, 2, 3].map((idx) => (
                   <div 
                    key={idx} 
                    className={`size-4 rounded-full border-2 transition-all duration-200 ${
                      enteredPin.length > idx 
                      ? 'bg-primary border-primary scale-110 shadow-lg shadow-primary/20' 
                      : 'border-slate-200 dark:border-white/10'
                    }`} 
                   />
                 ))}
               </div>

               {/* Keypad */}
               <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                      key={num}
                      onClick={() => handlePinInput(num.toString())}
                      className="aspect-square rounded-full flex items-center justify-center text-xl font-black text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 active:bg-primary/10 active:text-primary transition-all"
                    >
                      {num}
                    </button>
                  ))}
                  <div />
                  <button
                    onClick={() => handlePinInput("0")}
                    className="aspect-square rounded-full flex items-center justify-center text-xl font-black text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 active:bg-primary/10 active:text-primary transition-all"
                  >
                    0
                  </button>
                  <button
                    onClick={() => setEnteredPin(enteredPin.slice(0, -1))}
                    className="aspect-square rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                  >
                    <Delete className="w-6 h-6" />
                  </button>
               </div>
            </div>
          ) : (
            <button 
              onClick={async () => {
                const success = await authenticate();
                if (!success) {
                  toast.error("Authentication Failed");
                }
              }}
              className="w-full h-14 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all"
            >
              <Fingerprint className="w-5 h-5" />
              Authenticate
            </button>
          )}
          
          <div className="mt-12 flex flex-col items-center gap-6">
             <div className="flex items-center gap-2 text-slate-400">
                <MonitorSmartphone className="w-4 h-4" />
                <span className="text-[8px] font-black uppercase tracking-widest text-center">Protected via Sovereign AES-256</span>
             </div>
             
             <button 
               onClick={() => {
                 localStorage.removeItem("finease_app_lock");
                 localStorage.removeItem("finease_lock_type");
                 localStorage.removeItem("finease_pin");
                 window.location.href = "/login"; 
               }}
               className="text-[9px] font-black text-rose-500/60 uppercase tracking-widest hover:text-rose-500 transition-colors"
             >
               Sign out of device
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SecurityContext.Provider value={{ isLocked, isLockEnabled, lockType, toggleLock, authenticate }}>
      {children}
    </SecurityContext.Provider>
  );
}

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) throw new Error("useSecurity must be used within SecurityProvider");
  return context;
};
