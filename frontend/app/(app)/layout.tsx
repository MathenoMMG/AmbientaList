import { AppSidebar } from "@/components/layout/AppSidebar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="pl-64">
        <div className="gradient-glow min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
