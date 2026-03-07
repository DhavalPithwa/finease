import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatWidgetProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: ReactNode;
  iconBg?: string;
  iconColor?: string;
  className?: string;
}

export function StatWidget({
  label,
  value,
  subValue,
  icon,
  iconBg = "bg-primary/10",
  iconColor = "text-primary",
  className,
}: StatWidgetProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 p-4 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl shadow-sm",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div
            className={cn("p-2 rounded-lg flex-shrink-0", iconBg, iconColor)}
          >
            {icon}
          </div>
        )}
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            {label}
          </h4>
          {subValue && (
            <p className="text-xs text-slate-500 font-medium">{subValue}</p>
          )}
        </div>
      </div>
      <div className="text-xl font-bold text-slate-900 dark:text-white">
        {value}
      </div>
    </div>
  );
}
