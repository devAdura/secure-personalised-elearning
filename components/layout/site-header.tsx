import Link from "next/link";
import { Menu } from "lucide-react";
import { getCurrentUser, dashboardPath } from "@/lib/auth";
import { Logo } from "@/components/layout/logo";
import { buttonVariants } from "@/components/ui/button";
import { LogoutButton } from "@/components/auth/logout-button";

export async function SiteHeader() {
  const user = await getCurrentUser();
  return <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur"><div className="page-container flex h-16 items-center justify-between"><Logo /><nav className="hidden items-center gap-6 text-sm font-medium md:flex"><Link href="/about">About</Link><Link href="/courses">Courses</Link><Link href="/contact">Contact</Link></nav><div className="flex items-center gap-2">{user ? <><Link className={buttonVariants({ variant: "outline", size: "sm" })} href={dashboardPath(user.role)}>Dashboard</Link><LogoutButton /></> : <><Link className={buttonVariants({ variant: "ghost", size: "sm" })} href="/login">Login</Link><Link className={buttonVariants({ size: "sm" })} href="/register">Get Started</Link></>}<Menu className="h-5 w-5 md:hidden" aria-label="Menu" /></div></div></header>;
}
