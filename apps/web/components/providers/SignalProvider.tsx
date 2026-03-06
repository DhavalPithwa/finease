"use client";

import { useEffect, createContext, useContext, useState } from "react";
import toast from "react-hot-toast";

interface SignalContextType {
  isSupported: boolean;
  permission: NotificationPermission;
  requestPermission: () => Promise<void>;
}

const SignalContext = createContext<SignalContextType | undefined>(undefined);

export function SignalProvider({ children }: { children: React.ReactNode }) {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && "serviceWorker" in navigator) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) return;

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === "granted") {
        toast.success("Signals enabled. You will receive intelligent reminders.");
      } else if (result === "denied") {
        toast.error("Signals blocked. Enable notifications in settings for reminders.");
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  };

  return (
    <SignalContext.Provider value={{ isSupported, permission, requestPermission }}>
      {children}
    </SignalContext.Provider>
  );
}

export const useSignals = () => {
  const context = useContext(SignalContext);
  if (context === undefined) {
    throw new Error("useSignals must be used within a SignalProvider");
  }
  return context;
};
