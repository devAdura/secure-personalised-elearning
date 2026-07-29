import { Fingerprint } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PasskeyEnrolment } from "@/components/auth/passkey-enrolment";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function PasskeySetupPage() {
  const user = await requireUser();
  return <DashboardShell user={user}><div className="mx-auto max-w-2xl"><div className="mb-6"><div className="flex items-center gap-3"><Fingerprint className="h-7 w-7 text-primary" /><h1 className="text-3xl font-bold">Fingerprint/passkey setup</h1></div><p className="mt-2 text-muted-foreground">Connect this account to a device authenticator for secure passwordless login.</p></div><Card><CardHeader><CardTitle>Enrol a trusted device</CardTitle><CardDescription>The exact device prompt depends on your operating system and browser.</CardDescription></CardHeader><CardContent><PasskeyEnrolment existingCount={user.webAuthnCredentials.length} /></CardContent></Card></div></DashboardShell>;
}
