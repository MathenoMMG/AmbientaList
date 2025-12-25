import { ReactNode, useState } from "react";
import { ChevronDown, Check, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComplianceCardProps {
  title: string;
  status: "compliant" | "non_compliant" | "warning";
  description?: string;
  details?: string;
  articleRef?: string;
  expandable?: boolean;
}

const statusConfig = {
  compliant: {
    icon: Check,
    bgColor: "bg-success-light",
    borderColor: "border-success/30",
    iconBg: "bg-success",
    iconColor: "text-success-foreground",
    titleColor: "text-success",
  },
  non_compliant: {
    icon: AlertTriangle,
    bgColor: "bg-destructive-light",
    borderColor: "border-destructive/30",
    iconBg: "bg-destructive",
    iconColor: "text-destructive-foreground",
    titleColor: "text-destructive",
  },
  warning: {
    icon: Info,
    bgColor: "bg-warning-light",
    borderColor: "border-warning/30",
    iconBg: "bg-warning",
    iconColor: "text-warning-foreground",
    titleColor: "text-warning-foreground",
  },
};

export function ComplianceCard({
  title,
  status,
  description,
  details,
  articleRef,
  expandable = false,
}: ComplianceCardProps) {
  const [isExpanded, setIsExpanded] = useState(status === "non_compliant");
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "rounded-lg border-2 overflow-hidden transition-all duration-300",
        config.bgColor,
        config.borderColor
      )}
    >
      <div
        className={cn(
          "flex items-center gap-4 p-4",
          expandable && "cursor-pointer"
        )}
        onClick={() => expandable && setIsExpanded(!isExpanded)}
      >
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full shrink-0",
            config.iconBg
          )}
        >
          <Icon className={cn("h-5 w-5", config.iconColor)} />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className={cn("font-semibold", config.titleColor)}>{title}</h4>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>

        {expandable && (
          <ChevronDown
            className={cn(
              "h-5 w-5 text-muted-foreground transition-transform duration-200",
              isExpanded && "rotate-180"
            )}
          />
        )}
      </div>

      {expandable && isExpanded && (details || articleRef) && (
        <div className="px-4 pb-4 pt-0 border-t border-current/10">
          <div className="pt-4 space-y-3">
            {articleRef && (
              <div className="flex items-start gap-2">
                <span className="text-xs font-medium uppercase text-muted-foreground">
                  Legal Reference:
                </span>
                <span className="text-sm font-medium text-foreground">
                  {articleRef}
                </span>
              </div>
            )}
            {details && (
              <p className="text-sm text-foreground/80 leading-relaxed">
                {details}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
