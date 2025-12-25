import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
  variant?: "default" | "primary" | "warning" | "destructive";
  className?: string;
  children?: ReactNode;
  style?: React.CSSProperties;
}

export function KPICard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = "default",
  className,
  children,
  style,
}: KPICardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card p-6 shadow-soft transition-all duration-300 hover:shadow-medium",
        className
      )}
      style={style}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <span
              className={cn(
                "text-3xl font-bold tracking-tight",
                variant === "primary" && "text-primary",
                variant === "warning" && "text-warning",
                variant === "destructive" && "text-destructive",
                variant === "default" && "text-foreground"
              )}
            >
              {value}
            </span>
            {trend && (
              <span
                className={cn(
                  "text-sm font-medium",
                  trend.positive ? "text-success" : "text-destructive"
                )}
              >
                {trend.positive ? "+" : ""}{trend.value}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-lg",
              variant === "primary" && "bg-accent text-accent-foreground",
              variant === "warning" && "bg-warning-light text-warning",
              variant === "destructive" && "bg-destructive-light text-destructive",
              variant === "default" && "bg-secondary text-secondary-foreground"
            )}
          >
            {icon}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
