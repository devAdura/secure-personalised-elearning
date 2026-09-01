import Link from "next/link";
import { Menu } from "lucide-react";
import { getCurrentUser, dashboardPath } from "@/lib/auth";
import { Logo } from "@/components/layout/logo";
import { buttonVariants } from "@/components/ui/button";
import { LogoutButton } from "@/components/auth/logout-button";

export async function SiteHeader() {
  const user = await getCurrentUser();
  return (
    <header className="safe-top-header sticky top-0 z-40 border-b border-white/70 bg-white/82 shadow-[0_10px_40px_rgba(18,32,28,0.06)] backdrop-blur-xl">
      <div className="page-container flex min-h-16 items-center justify-between gap-2">
        <Logo />
        <nav className="hidden items-center gap-1 rounded-lg border border-[#d8e5de] bg-white/75 p-1 text-sm font-bold md:flex">
          {[
            ["About", "/about"],
            ["Courses", "/courses"],
            ["Assurance", "/assurance"],
            ["Contact", "/contact"]
          ].map(([label, href]) => (
            <Link key={href} href={href} className="rounded-md px-3 py-2 text-[#53625b] transition hover:bg-[#eef8f1] hover:text-[#12201c]">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link className={buttonVariants({ variant: "outline", size: "sm" })} href={dashboardPath(user.role)}>
                Dashboard
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link className={buttonVariants({ variant: "ghost", size: "sm" })} href="/login">
                Login
              </Link>
              <Link className={`${buttonVariants({ size: "sm" })} hidden sm:inline-flex`} href="/register">
                Get Started
              </Link>
            </>
          )}
          <details className="relative md:hidden">
            <summary className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-md border border-[#d8e5de] bg-white text-[#12201c] [&::-webkit-details-marker]:hidden" aria-label="Open navigation">
              <Menu className="h-5 w-5" />
            </summary>
            <div className="premium-card absolute right-0 top-12 grid w-52 gap-1 p-2">
              {[
                ["About", "/about"],
                ["Courses", "/courses"],
                ["Assurance", "/assurance"],
                ["Contact", "/contact"],
                ...(!user ? [["Create account", "/register"]] : [])
              ].map(([label, href]) => (
                <Link key={href} href={href} className="rounded-md px-3 py-2 text-sm font-bold text-[#53625b] hover:bg-[#eef8f1] hover:text-[#12201c]">
                  {label}
                </Link>
              ))}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
