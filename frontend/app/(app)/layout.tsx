import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppSidebar } from "@/components/layout/AppSidebar"

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar user={user} />
      <main className="pl-64">
        <div className="gradient-glow min-h-screen">
          {children}
        </div>
      </main>
    </div>
  )
}
