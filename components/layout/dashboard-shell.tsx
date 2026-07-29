import Link from "next/link";
import { Bell, BookOpen, Fingerprint, Home, LogOut, Settings, ShieldCheck, Users, FileText, MessageSquare, GraduationCap } from "lucide-react";
import type { Role } from "@prisma/client";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/logo";
import { LogoutButton } from "@/components/auth/logout-button";

const roleLinks: Record<Role, { href: string; label: string; icon: typeof Home }[]> = {
  STUDENT: [
    { href: "/dashboard/student", label: "Dashboard", icon: Home },
    { href: "/courses", label: "Browse Courses", icon: BookOpen },
    { href: "/notifications", label: "Notifications", icon: Bell },
    { href: "/profile", label: "Profile", icon: Settings },
    { href: "/passkey-setup", label: "Passkey Security", icon: Fingerprint }
  ],
  LECTURER: [
    { href: "/dashboard/lecturer", label: "Dashboard", icon: Home },
    { href: "/lecturer/courses", label: "Manage Courses", icon: BookOpen },
    { href: "/lecturer/submissions", label: "Submissions", icon: FileText },
    { href: "/courses", label: "Course Directory", icon: GraduationCap },
    { href: "/notifications", label: "Notifications", icon: Bell },
    { href: "/profile", label: "Profile", icon: Settings },
    { href: "/passkey-setup", label: "Passkey Security", icon: Fingerprint }
  ],
  ADMIN: [
    { href: "/dashboard/admin", label: "Dashboard", icon: Home },
    { href: "/admin/users", label: "User Management", icon: Users },
    { href: "/admin/courses", label: "Course Management", icon: BookOpen },
    { href: "/admin/security-logs", label: "Security Logs", icon: ShieldCheck },
    { href: "/notifications", label: "Notifications", icon: Bell },
    { href: "/profile", label: "Profile", icon: Settings },
    { href: "/passkey-setup", label: "Passkey Security", icon: Fingerprint }
  ]
};

export function DashboardShell({ user, children }: { user: { name: string; email: string; role: Role }; children: React.ReactNode }) {
  return <div className="min-h-screen bg-slate-50"><aside className="fixed inset-y-0 left-0 hidden w-72 border-r bg-white lg:block"><div className="flex h-16 items-center border-b px-6"><Logo /></div><div className="p-4"><div className="mb-5 rounded-lg bg-primary/5 p-4"><p className="font-semibold">{user.name}</p><p className="truncate text-xs text-muted-foreground">{user.email}</p><p className="mt-2 text-xs font-semibold text-primary">{user.role}</p></div><nav className="space-y-1">{roleLinks[user.role].map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={cn("flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100")}><Icon className="h-4 w-4" />{label}</Link>)}</nav></div></aside><div className="lg:pl-72"><header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white/95 px-4 backdrop-blur sm:px-6"><div><p className="text-sm font-medium text-muted-foreground">Secure collaborative learning</p></div><div className="flex items-center gap-3"><Link href="/notifications" aria-label="Notifications" className="rounded-full p-2 hover:bg-muted"><Bell className="h-5 w-5" /></Link><LogoutButton /></div></header><main className="p-4 sm:p-6 lg:p-8">{children}</main><nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t bg-white p-2 lg:hidden">{roleLinks[user.role].slice(0, 4).map(({ href, label, icon: Icon }) => <Link key={href} href={href} className="flex flex-col items-center gap-1 px-2 py-1 text-[10px] text-muted-foreground"><Icon className="h-5 w-5" />{label}</Link>)}</nav></div></div>;
}
