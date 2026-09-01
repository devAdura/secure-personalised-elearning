import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Fingerprint, KeyRound, ShieldCheck, Sparkles } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { Logo } from "@/components/layout/logo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Login", description: "Login with email and password or a fingerprint-backed passkey." };

export default function LoginPage() {
  return (
    <main className="auth-shell">
      <div className="page-container auth-grid">
        <section className="auth-story">
          <Logo />
          <p className="kicker mt-10">Secure session entry</p>
          <h1>Return to your biometric learning workspace.</h1>
          <p>
            Sign in with password or a device-backed passkey, then continue into protected courses, discussions, assignments, and assurance workflows.
          </p>
          <ul className="auth-signal-list">
            {[
              { icon: ShieldCheck, text: "HTTP-only sessions, role-aware routing, and auditable authentication events." },
              { icon: Fingerprint, text: "Fingerprint checks remain on the device while SecureLearn verifies cryptographic proof." },
              { icon: Sparkles, text: "Personal recommendations and course recovery pick up after authentication." }
            ].map(({ icon: Icon, text }) => (
              <li key={text}>
                <Icon className="mt-1 h-4 w-4" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            {[
              ["Passkey", "Device prompt"],
              ["Session", "Signed cookie"],
              ["Access", "Role verified"]
            ].map(([label, value]) => (
              <div key={label} className="premium-card-subtle p-4">
                <span className="text-xs font-black uppercase text-primary">{label}</span>
                <strong className="mt-2 block text-lg text-[#12201c]">{value}</strong>
              </div>
            ))}
          </div>
        </section>
        <aside className="auth-card premium-card">
          <Card className="auth-panel border-0 shadow-none">
            <CardHeader>
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-lg bg-primary text-white">
                <KeyRound className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>Choose password or fingerprint/passkey authentication.</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<p className="rounded-lg bg-[#eef8f1] p-4 text-sm text-muted-foreground">Preparing secure login...</p>}>
                <LoginForm />
              </Suspense>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                New to SecureLearn? <Link href="/register" className="font-black text-primary">Create an account</Link>
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}
