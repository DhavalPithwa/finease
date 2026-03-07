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
  const [permission, setPermission] =
    useState<NotificationPermission>("default");

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      "serviceWorker" in navigator
    ) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (typeof window === "undefined") return;

    // Detection for iOS
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);
    const isStandalone =
      "standalone" in window.navigator &&
      (window.navigator as Navigator & { standalone: boolean }).standalone;

    if (!isSupported) {
      if (isIOS && !isStandalone) {
        toast(
          "To enable signals on iOS: \n1. Share (up arrow) \n2. 'Add to Home Screen' \n3. Open from Home Screen",
          {
            duration: 6000,
            icon: "📱",
          },
        );
      } else {
        toast.error("Signals not supported on this browser.");
      }
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === "granted") {
        toast.success(
          "Signals enabled. You will receive intelligent reminders.",
        );
      } else if (result === "denied") {
        if (isIOS) {
          toast.error(
            "Signals blocked. Go to Settings > Notifications > FinEase to enable.",
            { duration: 5000 },
          );
        } else {
          toast.error(
            "Signals blocked. Enable notifications in browser settings.",
          );
        }
      }
    } catch (error: unknown) {
      console.error(
        'Error requesting notification permission:',
        error instanceof Error ? error.message : String(error),
      );
    }
  };

  return (
    <SignalContext.Provider
      value={{ isSupported, permission, requestPermission }}
    >
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
