"use client";

import { FileText, Download, Share2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ComplianceCard } from "@/components/analysis/ComplianceCard";
import { ChatInput } from "@/components/analysis/ChatInput";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function AuditDetail() {
  return (
    <div className="h-[calc(100vh-0px)] flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/history">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-semibold text-foreground">
                  Emissions_Report_Q4_2024.pdf
                </h1>
                <Badge variant="secondary" className="bg-success-light text-success">
                  Analysis Complete
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Uploaded 2 hours ago • 24 pages analyzed
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </header>

      {/* Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Document Viewer */}
        <div className="w-1/2 border-r bg-muted/30 flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <div className="mx-auto w-24 h-24 rounded-2xl bg-secondary flex items-center justify-center">
              <FileText className="h-12 w-12 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Document Viewer</h3>
              <p className="text-sm text-muted-foreground mt-1">
                PDF Document Preview
              </p>
            </div>
            <div className="w-full max-w-md mx-auto aspect-[3/4] rounded-lg bg-card border shadow-soft flex items-center justify-center">
              <p className="text-muted-foreground text-sm">
                PDF Preview Area
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - Analysis Results */}
        <div className="w-1/2 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Report Header */}
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Compliance Report
              </h2>
              <p className="text-muted-foreground mt-1">
                Automatic analysis based on current regulations
              </p>
            </div>

            <Separator />

            {/* Compliance Cards */}
            <div className="space-y-4">
              <ComplianceCard
                title="Discharge Permit"
                status="compliant"
                description="Documentation complete and valid"
              />

              <ComplianceCard
                title="CO2 Emissions"
                status="non_compliant"
                description="Non-compliance detected"
                expandable
                articleRef="Act 34/2007, Art. 7.2.b"
                details="Reported emission levels (456 t/year) exceed the limit of 400 t/year established for Category B facilities. A reduction plan must be submitted within 30 business days according to the established protocol."
              />

              <ComplianceCard
                title="Preventive Recommendation"
                status="warning"
                description="Activity license expiring soon"
                expandable
                details="The current activity license expires on 03/15/2025. It is recommended to start the renewal process at least 60 days in advance to avoid operational interruptions."
              />

              <ComplianceCard
                title="Waste Management"
                status="compliant"
                description="Complies with all requirements"
              />

              <ComplianceCard
                title="Emergency Plan"
                status="compliant"
                description="Documentation up to date"
              />
            </div>
          </div>

          {/* Chat Input */}
          <div className="border-t bg-card/50 backdrop-blur-sm p-4">
            <ChatInput />
          </div>
        </div>
      </div>
    </div>
  );
}