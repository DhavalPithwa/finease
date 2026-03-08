"use client";

import Link from "next/link";
import {
  Users,
  BarChart3,
  Trash2,
  FileText, // Added FileText as it's used in adminLinks
} from "lucide-react";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { useAuth } from "@/components/auth/AuthProvider";

export function TopNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";

  const userLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/goals", label: "Goals" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/transactions", label: "Transactions" },
    { href: "/reports", label: "Reports" },
  ];

  const adminLinks = [
    { href: "/admin/dashboard", label: "Admin", Icon: BarChart3 },
    { href: "/admin/users", label: "Users", Icon: Users },
    { href: "/admin/purge", label: "Purge", Icon: Trash2 },
    { href: "/admin/reports", label: "Reports", Icon: FileText },
  ];

  const navLinks = isAdmin ? adminLinks : userLinks;

  return (
    <nav className="hidden lg:flex items-center gap-8">
      {navLinks.map((link) => {
        const isActive = pathname?.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "text-[10px] font-black uppercase tracking-widest transition-all",
              isActive
                ? "text-primary"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
