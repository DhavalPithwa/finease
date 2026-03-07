import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "ahead" | "behind" | "ontrack" | "default";
  className?: string;
  icon?: ReactNode;
}

export function Badge({
  children,
  variant = "default",
  className,
  icon,
}: BadgeProps) {
  const variants = {
    default:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    ahead: "status-ahead",
    behind: "status-behind",
    ontrack:
      "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  };

  return (
    <span className={cn("status-badge gap-1", variants[variant], className)}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
