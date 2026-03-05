"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { useAuth } from "@/components/auth/AuthProvider";
import { Home, IndianRupee, Target, TrendingUp, FileText } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const links = [
    { href: "/dashboard", label: "Dashboard", Icon: Home },
    { href: "/transactions", label: "Transact", Icon: IndianRupee },
    { href: "/goals", label: "Goals", Icon: Target },
    { href: "/portfolio", label: "Portfolio", Icon: TrendingUp },
    { href: "/reports", label: "Reports", Icon: FileText },
  ];

  if (!user) return null;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-slate-200 dark:border-border-dark px-6 py-3 flex justify-between items-center z-50">
      {links.map((link) => {
        const isActive = pathname?.startsWith(link.href) || (link.href === '/dashboard' && pathname === '/');
        return (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "flex flex-col items-center gap-1 group transition-colors",
              isActive ? "text-primary" : "text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"
            )}
          >
            <link.Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
