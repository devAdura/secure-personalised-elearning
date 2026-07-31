import Link from "next/link";
import {
  Bell,
  BookOpen,
  FileText,
  Fingerprint,
  GraduationCap,
  Home,
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
    { href: "/passkey-setup", label: "Passkey Security", icon: Fingerprint }
  ],
  LECTURER: [
    { href: "/dashboard/lecturer", label: "Dashboard", icon: Home },
    { href: "/assurance", label: "Assurance", icon: Radar },
    { href: "/lecturer/courses", label: "Manage Courses", icon: BookOpen },
    { href: "/lecturer/submissions", label: "Submissions", icon: FileText },
    { href: "/courses", label: "Course Directory", icon: GraduationCap },
    { href: "/notifications", label: "Notifications", icon: Bell },
    { href: "/profile", label: "Profile", icon: Settings },
    { href: "/passkey-setup", label: "Passkey Security", icon: Fingerprint }
  ],
  ADMIN: [
    { href: "/dashboard/admin", label: "Dashboard", icon: Home },
    { href: "/assurance", label: "Assurance", icon: Radar },
    { href: "/admin/users", label: "User Management", icon: Users },
    { href: "/admin/courses", label: "Course Management", icon: BookOpen },
    { href: "/admin/security-logs", label: "Security Logs", icon: ShieldCheck },
    { href: "/notifications", label: "Notifications", icon: Bell },
    { href: "/profile", label: "Profile", icon: Settings },
    { href: "/passkey-setup", label: "Passkey Security", icon: Fingerprint }
  ]
};

export function DashboardShell({ user, children }: { user: { name: string; email: string; role: Role }; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/70 bg-white/80 shadow-[0_24px_80px_rgba(18,32,28,0.08)] backdrop-blur-xl lg:block">
        <div className="flex h-16 items-center border-b border-white/70 px-6">
          <Logo />
        </div>
        <div className="p-4">
          <div className="mb-5 rounded-lg border border-emerald-900/10 bg-[#eef8f1] p-4 shadow-sm">
            <p className="text-sm font-black text-[#12201c]">{user.name}</p>
            <p className="truncate text-xs text-[#68766e]">{user.email}</p>
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
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/70 bg-white/90 px-4 shadow-[0_10px_35px_rgba(18,32,28,0.05)] backdrop-blur-xl sm:px-6">
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
        <main className="pb-24 p-4 sm:p-6 lg:p-8 lg:pb-8">{children}</main>
        <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-white/70 bg-white/95 p-2 backdrop-blur-xl lg:hidden">
          {roleLinks[user.role].slice(0, 5).map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex flex-col items-center gap-1 px-2 py-1 text-[10px] font-bold text-[#68766e]">
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
