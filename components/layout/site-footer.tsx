import Link from "next/link";
import { Logo } from "@/components/layout/logo";

export function SiteFooter() {
  return <footer className="border-t bg-white"><div className="page-container grid gap-8 py-10 md:grid-cols-3"><div><Logo /><p className="mt-4 max-w-sm text-sm text-muted-foreground">A secure collaborative e-learning prototype using password authentication, passkeys and personalised recommendations.</p></div><div><h3 className="font-semibold">Platform</h3><div className="mt-3 grid gap-2 text-sm text-muted-foreground"><Link href="/courses">Courses</Link><Link href="/about">About the project</Link><Link href="/contact">Contact</Link></div></div><div><h3 className="font-semibold">Privacy-first biometrics</h3><p className="mt-3 text-sm text-muted-foreground">Fingerprint verification stays on your device. The platform stores only WebAuthn public credential data.</p></div></div><div className="border-t py-5 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} SecureLearn. Final year Computer Science project.</div></footer>;
}
