import { Fingerprint, KeyRound, ShieldCheck } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PasskeyEnrolment } from "@/components/auth/passkey-enrolment";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function PasskeySetupPage() {
  const user = await requireUser();
  return <DashboardShell user={user}><div className="mx-auto max-w-5xl space-y-6"><div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]"><section className="premium-card bg-[#12201c] p-7 text-white"><p className="text-xs font-black uppercase text-[#b7f0dc]">Device trust</p><h1 className="mt-3 text-4xl font-semibold leading-none" style={{ fontFamily: "var(--font-editorial), var(--font-sans), serif" }}>Fingerprint/passkey setup</h1><p className="mt-4 text-sm leading-6 text-white/72">Connect this account to a device authenticator for secure passwordless login. The prompt and biometric check are handled by your operating system or browser.</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><div className="rounded-lg border border-white/12 bg-white/8 p-4"><ShieldCheck className="h-5 w-5 text-[#b7f0dc]" /><p className="mt-3 text-sm font-bold text-white/72">Local biometric prompt</p></div><div className="rounded-lg border border-white/12 bg-white/8 p-4"><KeyRound className="h-5 w-5 text-[#f5cb78]" /><p className="mt-3 text-sm font-bold text-white/72">Public key verification</p></div></div></section><Card><CardHeader><div className="mb-3 grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary"><Fingerprint className="h-5 w-5" /></div><CardTitle>Enrol a trusted device</CardTitle><CardDescription>The exact device prompt depends on your operating system and browser.</CardDescription></CardHeader><CardContent><PasskeyEnrolment existingCount={user.webAuthnCredentials.length} /></CardContent></Card></div></div></DashboardShell>;
}
