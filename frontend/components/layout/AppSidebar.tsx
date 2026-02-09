"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  BookOpen,
  FileSearch,
  History,
  Leaf,
  User,
  ChevronRight,
  CalendarDays,
  LogOut,
  Building2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import type { User as SupabaseUser } from '@supabase/supabase-js'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Calendar", href: "/calendar", icon: CalendarDays },
  { name: "Regulations", href: "/regulations", icon: BookOpen },
  { name: "New Audit", href: "/audit/new", icon: FileSearch },
  { name: "History", href: "/history", icon: History },
]

interface AppSidebarProps {
  user: SupabaseUser
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Signed out successfully')
      router.push('/login')
      router.refresh()
    } catch (error) {
      toast.error('Error signing out')
    }
  }

  const switchOrganization = () => {
    router.push('/organizations')
  }

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-eco">
          <Leaf className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <span className="text-lg font-semibold text-sidebar-accent-foreground tracking-tight">
          AMBIENTALIST
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-colors",
                isActive ? "text-sidebar-primary" : "text-sidebar-foreground group-hover:text-sidebar-accent-foreground"
              )} />
              <span className="flex-1">{item.name}</span>
              {isActive && (
                <ChevronRight className="h-4 w-4 text-sidebar-primary" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-sidebar-border p-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full">
            <div className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-sidebar-accent transition-colors cursor-pointer">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent">
                <User className="h-4 w-4 text-sidebar-foreground" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-sidebar-accent-foreground truncate">
                  {user.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-sidebar-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={switchOrganization}>
              <Building2 className="mr-2 h-4 w-4" />
              <span>Switch Organization</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
