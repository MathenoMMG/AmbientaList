"use client"

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Clock, CalendarDays } from "lucide-react";
import { enUS } from "date-fns/locale";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const events = [
  {
    id: 1,
    title: "Discharge License Renewal",
    date: new Date(2025, 0, 15), // Jan 15, 2025
    type: "critical",
    description: "Deadline to submit annual documentation.",
  },
  {
    id: 2,
    title: "ISO 14001 Internal Audit",
    date: new Date(2025, 0, 20), // Jan 20, 2025
    type: "warning",
    description: "Prepare waste management reports.",
  },
  {
    id: 3,
    title: "Monthly Emissions Report",
    date: new Date(2025, 0, 5), // Jan 5, 2025
    type: "completed",
    description: "Submitted to administration.",
  },
  {
    id: 4,
    title: "B-Wing Filter Maintenance",
    date: new Date(2025, 1, 10), // Feb 10, 2025
    type: "info",
    description: "Scheduled with external provider.",
  },
];

const typeConfig = {
  critical: {
    label: "Critical",
    icon: AlertCircle,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  warning: {
    label: "Pending",
    icon: Clock,
    className: "bg-warning-light text-warning-foreground border-warning/20",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "bg-success-light text-success border-success/20",
  },
  info: {
    label: "Informative",
    icon: CalendarDays,
    className: "bg-secondary text-secondary-foreground border-secondary",
  },
};

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Filter events for the selected date
  const selectedDateEvents = events.filter(
    (event) =>
      date &&
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
  );

  // Get all dates that have events for the calendar modifiers
  const eventDates = events.map((e) => e.date);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Compliance Calendar
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your deadlines, renewals, and scheduled audits
        </p>
      </header>

      <div className="grid md:grid-cols-12 gap-8">
        {/* Calendar Column */}
        <div className="md:col-span-4 lg:col-span-3">
          <Card className="shadow-soft border-0">
            <CardContent className="p-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border shadow-sm w-full"
                locale={enUS}
                modifiers={{
                  hasEvent: eventDates,
                }}
                modifiersStyles={{
                  hasEvent: {
                    fontWeight: "bold",
                    textDecoration: "underline",
                    color: "var(--primary)",
                  },
                }}
              />
            </CardContent>
          </Card>

          {/* Legend */}
          <div className="mt-6 space-y-3">
            <h3 className="text-sm font-medium text-foreground">Legend</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(typeConfig).map(([key, config]) => (
                <div key={key} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className={cn("w-2 h-2 rounded-full", config.className.split(" ")[0].replace("bg-", "bg-"))} />
                  {config.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Events Column */}
        <div className="md:col-span-8 lg:col-span-9 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              {date ? (
                <>
                  Events for <span className="text-primary">{format(date, "MMMM d, yyyy", { locale: enUS })}</span>
                </>
              ) : (
                "Select a date"
              )}
            </h2>
            {selectedDateEvents.length > 0 && (
              <Badge variant="outline" className="ml-2">
                {selectedDateEvents.length} events
              </Badge>
            )}
          </div>

          <div className="grid gap-4">
            {selectedDateEvents.length > 0 ? (
              selectedDateEvents.map((event) => {
                const config = typeConfig[event.type as keyof typeof typeConfig];
                const Icon = config.icon;

                return (
                  <Card key={event.id} className="animate-slide-up hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg", config.className)}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-base font-medium">
                            {event.title}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {format(event.date, "EEEE, MMMM d", { locale: enUS })}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary" className={cn("capitalize", config.className)}>
                        {config.label}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {event.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-12 border-2 border-dashed rounded-xl bg-secondary/20">
                <CalendarDays className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-foreground">No events scheduled</h3>
                <p className="text-muted-foreground">
                  There are no tasks or deadlines for this day.
                </p>
              </div>
            )}
          </div>

          {/* Upcoming List */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold mb-4">Upcoming Deadlines (General)</h3>
            <div className="space-y-3">
              {events
                .filter((e) => e.date >= new Date())
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .slice(0, 3)
                .map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-2 h-2 rounded-full", typeConfig[event.type as keyof typeof typeConfig].className.split(" ")[0])} />
                      <span className="font-medium text-sm">{event.title}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {format(event.date, "MMM d", { locale: enUS })}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}