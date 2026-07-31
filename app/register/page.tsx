import type { Metadata } from "next";
import Link from "next/link";
import { Fingerprint, GraduationCap, ShieldCheck, Sparkles, Users } from "lucide-react";
import { RegisterForm } from "@/components/auth/register-form";
import { Logo } from "@/components/layout/logo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Register", description: "Create a secure student or lecturer account." };

export default function RegisterPage() {
  return (
    <main className="auth-shell">
      <div className="page-container auth-grid">
        <section className="auth-story">
          <Logo />
          <p className="kicker mt-10">Account onboarding</p>
          <h1>Create a protected learning identity.</h1>
          <p>
            Register as a student or lecturer, then enrol a passkey so collaborative learning actions can be bound to a trusted device.
          </p>
          <div className="signal-grid mt-8 max-w-3xl">
            {[
              { icon: GraduationCap, label: "Student", value: "Learn, submit, discuss" },
              { icon: Users, label: "Lecturer", value: "Publish, assess, guide" },
              { icon: ShieldCheck, label: "Security", value: "Passkey-ready" }
            ].map(({ icon: Icon, label, value }) => (
              <article key={label} className="signal-card">
                <Icon className="h-5 w-5 text-primary" />
                <span className="mt-4 block">{label}</span>
                <strong className="text-base">{value}</strong>
              </article>
            ))}
          </div>
          <ul className="auth-signal-list">
            <li><Fingerprint className="mt-1 h-4 w-4" /><span>Biometric verification is requested after account creation through the device authenticator.</span></li>
            <li><Sparkles className="mt-1 h-4 w-4" /><span>Personalised course recommendations improve as learner activity grows.</span></li>
          </ul>
        </section>
        <aside className="auth-card premium-card">
          <Card className="auth-panel border-0 shadow-none">
            <CardHeader>
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-lg bg-primary text-white">
                <Fingerprint className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl">Create your account</CardTitle>
              <CardDescription>Register first, then add fingerprint/passkey security from your device.</CardDescription>
            </CardHeader>
            <CardContent>
              <RegisterForm />
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Already registered? <Link href="/login" className="font-black text-primary">Login</Link>
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}
