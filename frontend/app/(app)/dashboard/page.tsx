import { ClipboardList, AlertTriangle, TrendingUp } from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { ComplianceScore } from "@/components/dashboard/ComplianceScore";
import { ActivityTable } from "@/components/dashboard/ActivityTable";
import { DashboardCalendar } from "@/components/dashboard/DashboardCalendar";

export default function Dashboard() {
  return (
    <div className="p-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          General overview of your organization's environmental compliance
        </p>
      </header>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Compliance Score Card */}
        <div className="lg:col-span-1 rounded-xl border bg-card p-6 shadow-soft flex items-center justify-center animate-slide-up">
          <ComplianceScore score={78} size="md" />
        </div>

        {/* Pending Audits */}
        <KPICard
          title="Pending Audits"
          value={12}
          subtitle="3 urgent this week"
          icon={<ClipboardList className="h-6 w-6" />}
          variant="primary"
          className="animate-slide-up"
          style={{ animationDelay: "50ms" } as React.CSSProperties}
        />

        {/* Critical Issues */}
        <KPICard
          title="Critical Issues"
          value={4}
          subtitle="Require immediate attention"
          icon={<AlertTriangle className="h-6 w-6" />}
          variant="destructive"
          className="animate-slide-up"
          style={{ animationDelay: "100ms" } as React.CSSProperties}
        />

        {/* Trend */}
        <KPICard
          title="Monthly Improvement"
          value="+12%"
          subtitle="vs. last month"
          icon={<TrendingUp className="h-6 w-6" />}
          trend={{ value: 12, positive: true }}
          variant="default"
          className="animate-slide-up"
          style={{ animationDelay: "150ms" } as React.CSSProperties}
        />
      </div>

      {/* Bottom Section: Activity Table + Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: "200ms" }}>
        <div className="lg:col-span-2">
          <ActivityTable />
        </div>
        <div className="lg:col-span-1">
          <DashboardCalendar />
        </div>
      </div>
    </div>
  );
}
