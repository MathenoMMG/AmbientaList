import { FileText, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Activity {
  id: string;
  document: string;
  type: string;
  status: "processing" | "completed" | "needs_review";
  date: string;
}

const activities: Activity[] = [
  {
    id: "1",
    document: "Emissions_Report_Q4_2024.pdf",
    type: "CO2 Emissions",
    status: "completed",
    date: "2 hours ago",
  },
  {
    id: "2",
    document: "Discharge_License_Renewal.pdf",
    type: "Discharges",
    status: "processing",
    date: "4 hours ago",
  },
  {
    id: "3",
    document: "Environmental_Impact_Assessment.pdf",
    type: "EIA",
    status: "needs_review",
    date: "1 day ago",
  },
  {
    id: "4",
    document: "Activity_License_2024.pdf",
    type: "Licenses",
    status: "completed",
    date: "2 days ago",
  },
  {
    id: "5",
    document: "Hazardous_Waste_Control.pdf",
    type: "Waste",
    status: "needs_review",
    date: "3 days ago",
  },
];

const statusConfig = {
  processing: {
    label: "Processing",
    variant: "secondary" as const,
    icon: Clock,
    className: "bg-secondary text-secondary-foreground",
  },
  completed: {
    label: "Completed",
    variant: "default" as const,
    icon: CheckCircle2,
    className: "bg-success-light text-success",
  },
  needs_review: {
    label: "Needs Review",
    variant: "destructive" as const,
    icon: AlertCircle,
    className: "bg-warning-light text-warning-foreground",
  },
};

export function ActivityTable() {
  return (
    <div className="rounded-xl border bg-card shadow-soft overflow-hidden">
      <div className="border-b px-6 py-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <p className="text-sm text-muted-foreground">
          Latest processed documents and their status
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-xs font-medium uppercase text-muted-foreground">
              Document
            </TableHead>
            <TableHead className="text-xs font-medium uppercase text-muted-foreground">
              Type
            </TableHead>
            <TableHead className="text-xs font-medium uppercase text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="text-xs font-medium uppercase text-muted-foreground text-right">
              Date
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity, index) => {
            const status = statusConfig[activity.status];
            const StatusIcon = status.icon;
            return (
              <TableRow 
                key={activity.id} 
                className="cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="font-medium text-foreground truncate max-w-[200px]">
                      {activity.document}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">{activity.type}</span>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary"
                    className={cn("gap-1.5 font-medium", status.className)}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {activity.date}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}