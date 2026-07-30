import Link from "next/link";
import { Logo } from "@/components/layout/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/70 bg-white/92">
      <div className="page-container grid gap-8 py-10 md:grid-cols-[1.2fr_0.8fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
            A secure collaborative e-learning prototype integrating passkeys, assurance scoring, privacy controls, and personalised course recommendations.
          </p>
        </div>
        <div>
          <h3 className="font-black text-[#12201c]">Platform</h3>
          <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
            <Link href="/courses">Courses</Link>
            <Link href="/assurance">Assurance center</Link>
            <Link href="/about">About the project</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <div className="premium-card-subtle p-4">
          <h3 className="font-black text-[#12201c]">Biometric privacy</h3>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Fingerprint verification stays device-side where supported. SecureLearn stores public credential metadata and audit evidence, not raw prints.
          </p>
        </div>
      </div>
      <div className="border-t border-white/70 py-5 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} SecureLearn. Final year Computer Science project.</div>
    </footer>
  );
}
