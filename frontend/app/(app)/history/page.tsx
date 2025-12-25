import { Search, Filter, FileText, ChevronRight, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const audits = [
  {
    id: "1",
    document: "Emissions_Report_Q4_2024.pdf",
    date: "2024-12-20",
    status: "completed",
    complianceScore: 78,
    issues: 2,
  },
  {
    id: "2",
    document: "Environmental_Impact_Assessment.pdf",
    date: "2024-12-18",
    status: "needs_review",
    complianceScore: 65,
    issues: 4,
  },
  {
    id: "3",
    document: "Activity_License_2024.pdf",
    date: "2024-12-15",
    status: "completed",
    complianceScore: 95,
    issues: 0,
  },
  {
    id: "4",
    document: "Hazardous_Waste_Control.pdf",
    date: "2024-12-12",
    status: "completed",
    complianceScore: 88,
    issues: 1,
  },
  {
    id: "5",
    document: "Environmental_Emergency_Plan.pdf",
    date: "2024-12-10",
    status: "processing",
    complianceScore: null,
    issues: null,
  },
];

const statusConfig = {
  processing: {
    label: "Processing",
    icon: Clock,
    className: "bg-secondary text-secondary-foreground",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "bg-success-light text-success",
  },
  needs_review: {
    label: "Needs Review",
    icon: AlertCircle,
    className: "bg-warning-light text-warning-foreground",
  },
};

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-destructive";
};

export default function AuditHistory() {
  return (
    <div className="p-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Audit History
        </h1>
        <p className="text-muted-foreground mt-1">
          Complete record of all audits performed
        </p>
      </header>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search audits..."
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Audits List */}
      <div className="grid gap-4">
        {audits.map((audit, index) => {
          const status = statusConfig[audit.status as keyof typeof statusConfig];
          const StatusIcon = status.icon;

          return (
            <Link
              key={audit.id}
              href={`/audit/${audit.id}`}
              className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-soft hover:shadow-medium transition-all duration-300 group animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary group-hover:bg-accent transition-colors">
                <FileText className="h-6 w-6 text-muted-foreground group-hover:text-accent-foreground transition-colors" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                  {audit.document}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  <Badge variant="secondary" className={cn("gap-1.5", status.className)}>
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(audit.date).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              {audit.complianceScore !== null && (
                <div className="text-right">
                  <div className={cn("text-2xl font-bold", getScoreColor(audit.complianceScore))}>
                    {audit.complianceScore}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {audit.issues === 0 ? "No issues" : `${audit.issues} issues`}
                  </div>
                </div>
              )}

              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}