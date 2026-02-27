import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Wallet, Search } from "lucide-react";
import { UserMenu } from "@/components/auth/UserMenu";


const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "FinEase - Financial Command Center",
  description: "Comprehensive wealth management for modern investors",
  manifest: "/manifest.json",
};

import { AuthProvider } from "@/components/auth/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-body bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased`}>
        <AuthProvider>
          <header className="glass-header">

          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/20 text-white">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">FinEase</span>
              </div>
              <div className="hidden md:flex relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  placeholder="Search assets..." 
                  className="bg-slate-100 dark:bg-slate-900 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary transition-all w-64"
                />
              </div>
            </div>
            
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/" className="text-sm font-bold text-primary">Dashboard</Link>
              <Link href="#" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">Goals</Link>
              <Link href="#" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">Accounts</Link>
            </nav>

            <div className="flex items-center gap-4">
              <UserMenu />
            </div>

          </div>
        </header>
        <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}

