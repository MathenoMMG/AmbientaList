import { DropZone } from "@/components/upload/DropZone";

export default function NewAudit() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          New Audit
        </h1>
        <p className="text-muted-foreground mt-2">
          Upload your documents to start the environmental compliance analysis
        </p>
      </header>

      {/* Upload Zone */}
      <div className="animate-slide-up">
        <DropZone />
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-4 mt-8">
        <div className="rounded-lg border bg-card p-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="text-3xl mb-2">📄</div>
          <h3 className="font-medium text-foreground mb-1">Automatic Analysis</h3>
          <p className="text-sm text-muted-foreground">
            AI-powered extraction and analysis of all documentation
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4 animate-slide-up" style={{ animationDelay: "150ms" }}>
          <div className="text-3xl mb-2">⚡</div>
          <h3 className="font-medium text-foreground mb-1">Fast Results</h3>
          <p className="text-sm text-muted-foreground">
            Get your compliance report in minutes
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <div className="text-3xl mb-2">🔒</div>
          <h3 className="font-medium text-foreground mb-1">100% Secure</h3>
          <p className="text-sm text-muted-foreground">
            Your documents are encrypted and protected
          </p>
        </div>
      </div>
    </div>
  );
}
