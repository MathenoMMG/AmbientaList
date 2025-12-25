import Link from "next/link";
import { Leaf, ArrowRight, Shield, Zap, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-eco">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">
              AMBIENTALIST
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/dashboard">
              <Button className="gradient-eco text-white border-0">View Demo</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 px-4 relative overflow-hidden">
          <div className="gradient-glow absolute inset-0 -z-10" />
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Intelligent Environmental Auditing
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-foreground tracking-tight mb-6 animate-slide-up">
              Environmental Compliance <br /> 
              <span className="text-primary">Powered by AI</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "100ms" }}>
              Analyze complex documents, detect non-compliance, and stay up-to-date with environmental regulations in seconds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
              <Link href="/dashboard">
                <Button size="lg" className="h-12 px-8 text-lg gap-2 gradient-eco text-white border-0">
                  Get Started <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-card border shadow-soft hover:shadow-medium transition-all">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Multimodal Analysis</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We process PDFs, tables, and facility images to extract structured data automatically.
                </p>
              </div>
              <div className="p-8 rounded-2xl bg-card border shadow-soft hover:shadow-medium transition-all">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Regulatory Memory</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Dynamic contrast against an updated legal database using RAG technology.
                </p>
              </div>
              <div className="p-8 rounded-2xl bg-card border shadow-soft hover:shadow-medium transition-all">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Risk Heatmap</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Instant visualization of compliance and violations with direct expert recommendations.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-card">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="h-5 w-5 text-primary" />
            <span className="font-bold tracking-tight">AMBIENTALIST</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2025 AmbientaList. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
