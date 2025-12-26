import { cn } from "@/lib/utils";

interface ComplianceScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function ComplianceScore({ score, size = "md", showLabel = true }: ComplianceScoreProps) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const getColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getStrokeColor = (score: number) => {
    if (score >= 80) return "stroke-success";
    if (score >= 60) return "stroke-warning";
    return "stroke-destructive";
  };

  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-32 h-32",
    lg: "w-40 h-40",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-3xl",
    lg: "text-4xl",
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={cn("relative", sizeClasses[size])}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="8"
            className="stroke-secondary"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            className={cn("transition-all duration-1000 ease-out", getStrokeColor(score))}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-bold", textSizes[size], getColor(score))}>
            {score}%
          </span>
        </div>
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-muted-foreground">
          Global Compliance Score
        </span>
      )}
    </div>
  );
}
