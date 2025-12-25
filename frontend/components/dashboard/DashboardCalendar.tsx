"use client"

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { enUS } from "date-fns/locale";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Clock, AlertCircle } from "lucide-react";

// Sample data (subset of main calendar)
const upcomingEvents = [
  {
    id: 1,
    title: "Discharge License Renewal",
    date: new Date(2025, 0, 15),
    type: "critical",
  },
  {
    id: 2,
    title: "ISO 14001 Audit",
    date: new Date(2025, 0, 20),
    type: "warning",
  },
  {
    id: 3,
    title: "Emissions Report",
    date: new Date(2025, 0, 5),
    type: "completed",
  },
];

export function DashboardCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const eventDates = upcomingEvents.map((e) => e.date);

  return (
    <Card className="h-full shadow-soft border-0 flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Calendar</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <div className="flex justify-center border-b pb-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md"
            locale={enUS}
            modifiers={{
              hasEvent: eventDates,
            }}
            modifiersStyles={{
              hasEvent: {
                fontWeight: "bold",
                color: "var(--primary)",
                textDecoration: "underline",
              },
            }}
          />
        </div>
        
        <div className="flex-1">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Upcoming Deadlines</h4>
          <div className="space-y-3">
            {upcomingEvents.slice(0, 3).map((event) => (
              <div key={event.id} className="flex items-center gap-3 text-sm">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  event.type === "critical" ? "bg-destructive" :
                  event.type === "warning" ? "bg-warning" : "bg-success"
                )} />
                <span className="flex-1 truncate font-medium text-foreground">
                  {event.title}
                </span>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {format(event.date, "MMM d")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
