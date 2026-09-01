"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Bell,
  BookOpen,
  FileText,
  Fingerprint,
  GraduationCap,
  Home,
  Inbox,
  Menu,
  Radar,
  Settings,
  ShieldCheck,
  Users
} from "lucide-react";
import type { Role } from "@prisma/client";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/components/auth/logout-button";
import { Logo } from "@/components/layout/logo";

const roleLinks: Record<Role, { href: string; label: string; icon: typeof Home }[]> = {
  STUDENT: [
    { href: "/dashboard/student", label: "Dashboard", icon: Home },
    { href: "/assurance", label: "Assurance", icon: Radar },
    { href: "/courses", label: "Browse Courses", icon: BookOpen },
    { href: "/notifications", label: "Notifications", icon: Bell },
    { href: "/profile", label: "Profile", icon: Settings },
    { href: "/passkey-setup", label: "Security & MFA", icon: Fingerprint }
  ],
  LECTURER: [
    { href: "/dashboard/lecturer", label: "Dashboard", icon: Home },
    { href: "/assurance", label: "Assurance", icon: Radar },
    { href: "/lecturer/courses", label: "Manage Courses", icon: BookOpen },
    { href: "/lecturer/submissions", label: "Submissions", icon: FileText },
    { href: "/courses", label: "Course Directory", icon: GraduationCap },
    { href: "/notifications", label: "Notifications", icon: Bell },
    { href: "/profile", label: "Profile", icon: Settings },
    { href: "/passkey-setup", label: "Security & MFA", icon: Fingerprint }
  ],
  ADMIN: [
    { href: "/dashboard/admin", label: "Dashboard", icon: Home },
    { href: "/assurance", label: "Assurance", icon: Radar },
    { href: "/admin/users", label: "User Management", icon: Users },
    { href: "/admin/courses", label: "Course Management", icon: BookOpen },
    { href: "/admin/security-logs", label: "Security Logs", icon: ShieldCheck },
    { href: "/admin/messages", label: "Administrator Inbox", icon: Inbox },
    { href: "/notifications", label: "Notifications", icon: Bell },
    { href: "/profile", label: "Profile", icon: Settings },
    { href: "/passkey-setup", label: "Security & MFA", icon: Fingerprint }
  ]
};

export function DashboardShell({ user, children }: { user: { name: string; email: string; role: Role; avatarDataUrl?: string | null }; children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const links = roleLinks[user.role];
  const primaryMobileLinks = links.slice(0, 4);
  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/70 bg-white/80 shadow-[0_24px_80px_rgba(18,32,28,0.08)] backdrop-blur-xl lg:block">
        <div className="flex h-16 items-center border-b border-white/70 px-6">
          <Logo />
        </div>
        <div className="p-4">
          <div className="mb-5 rounded-lg border border-emerald-900/10 bg-[#eef8f1] p-4 shadow-sm">
            <div className="flex items-center gap-3">
              {user.avatarDataUrl ? (
                <Image src={user.avatarDataUrl} alt={`${user.name} profile photo`} width={40} height={40} className="h-10 w-10 shrink-0 rounded-full object-cover" unoptimized />
              ) : null}
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-[#12201c]">{user.name}</p>
                <p className="truncate text-xs text-[#68766e]">{user.email}</p>
              </div>
            </div>
            <p className="mt-3 inline-flex rounded-full bg-white px-2.5 py-1 text-xs font-black uppercase tracking-[0.16em] text-[#176b58]">{user.role}</p>
          </div>
          <nav className="space-y-1">
            {roleLinks[user.role].map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold text-[#53625b] transition hover:-translate-y-0.5 hover:bg-white hover:text-[#12201c] hover:shadow-sm"
                )}
              >
                <span className="grid h-8 w-8 place-items-center rounded-md bg-white text-[#176b58] shadow-sm transition group-hover:bg-[#12201c] group-hover:text-white">
                  <Icon className="h-4 w-4" />
                </span>
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
      <div className="lg:pl-72">
        <header className="safe-top-header sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-white/70 bg-white/90 px-4 shadow-[0_10px_35px_rgba(18,32,28,0.05)] backdrop-blur-xl sm:px-6">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#176b58]">SecureLearn command center</p>
            <p className="mt-1 hidden truncate text-sm text-[#68766e] sm:block">Biometric assurance, collaboration, and adaptive learning.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/assurance" className="hidden rounded-md border border-[#d8e5de] bg-white px-3 py-2 text-sm font-bold text-[#12201c] shadow-sm sm:inline-flex">
              <Radar className="mr-2 h-4 w-4 text-[#176b58]" />
              Assurance
            </Link>
            <Link href="/notifications" aria-label="Notifications" className="rounded-md border border-[#d8e5de] bg-white p-2 hover:bg-[#eef8f1]">
              <Bell className="h-5 w-5" />
            </Link>
            <LogoutButton />
          </div>
        </header>
        <main className="p-4 pb-28 sm:p-6 sm:pb-28 lg:p-8 lg:pb-8">{children}</main>
        {mobileMenuOpen?<><button type="button" aria-label="Close navigation menu" className="fixed inset-0 z-40 bg-[#12201c]/35 lg:hidden" onClick={()=>setMobileMenuOpen(false)}/><section className="fixed inset-x-3 z-50 max-h-[70dvh] overflow-y-auto rounded-lg border border-[#d8e5de] bg-white p-3 shadow-[0_24px_80px_rgba(18,32,28,0.24)] lg:hidden" style={{bottom:"calc(4.75rem + env(safe-area-inset-bottom))"}} aria-label="All workspace navigation"><div className="mb-3 flex items-center justify-between px-1"><div><p className="text-sm font-black text-[#12201c]">Workspace navigation</p><p className="text-xs text-muted-foreground">{user.role.charAt(0)+user.role.slice(1).toLowerCase()} account</p></div></div><div className="grid grid-cols-2 gap-2">{links.map(({href,label,icon:Icon})=><Link key={href} href={href} onClick={()=>setMobileMenuOpen(false)} aria-current={pathname===href?"page":undefined} className={cn("flex min-h-16 items-center gap-3 rounded-md border px-3 py-2 text-xs font-black",pathname===href?"border-primary/30 bg-primary/10 text-primary":"border-[#d8e5de] bg-white text-[#405049]")}><Icon className="h-5 w-5 shrink-0"/><span>{label}</span></Link>)}</div></section></>:null}
        <nav className="mobile-bottom-nav fixed inset-x-0 bottom-0 z-[60] grid grid-cols-5 border-t border-[#d8e5de] bg-white/95 px-1 pt-2 shadow-[0_-10px_35px_rgba(18,32,28,0.08)] backdrop-blur-xl lg:hidden">
          {primaryMobileLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} aria-current={pathname===href?"page":undefined} className={cn("flex min-w-0 flex-col items-center gap-1 px-1 py-1 text-center text-[10px] font-bold leading-tight",pathname===href?"text-primary":"text-[#68766e]")}>
              <Icon className="h-5 w-5" />
              <span className="line-clamp-2">{label}</span>
            </Link>
          ))}
          <button type="button" aria-expanded={mobileMenuOpen} onClick={()=>setMobileMenuOpen((open)=>!open)} className={cn("flex min-w-0 flex-col items-center gap-1 px-1 py-1 text-[10px] font-bold leading-tight",mobileMenuOpen?"text-primary":"text-[#68766e]")}><Menu className="h-5 w-5"/><span>More</span></button>
        </nav>
      </div>
    </div>
  );
}
