import { KeyRound, UserCircle } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProfileForm } from "@/components/forms/profile-form";
import { MfaEnrolment } from "@/components/auth/mfa-enrolment";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ProfilePage() {
  const user = await requireUser();
  return <DashboardShell user={user}><div className="mx-auto max-w-4xl"><div className="page-heading mb-6"><h1>Profile</h1><p>Review account details and biometric-security status.</p></div><div className="grid gap-6 md:grid-cols-[1fr_1.5fr]"><Card><CardContent className="p-6 text-center"><span className="mx-auto grid h-24 w-24 place-items-center overflow-hidden rounded-lg bg-[#eef8f1] text-primary">{user.avatarUrl ? <img src={user.avatarUrl} alt={`${user.name} profile photo`} className="h-full w-full object-cover" /> : <UserCircle className="h-16 w-16" />}</span><h2 className="mt-4 text-xl font-black text-[#12201c]">{user.name}</h2><Badge className="mt-2">{user.role}</Badge><div className="premium-card-subtle mt-6 p-4 text-left"><div className="flex items-center gap-2"><KeyRound className="h-4 w-4 text-accent" /><span className="text-sm font-black text-[#12201c]">Passkey status</span></div><p className="mt-2 text-sm leading-6 text-muted-foreground">{user.webAuthnCredentials.length > 0 ? `${user.webAuthnCredentials.length} passkey credential(s) enrolled` : "No passkey enrolled yet"}</p></div></CardContent></Card><Card><CardHeader><CardTitle>Basic information</CardTitle></CardHeader><CardContent><ProfileForm name={user.name} email={user.email} avatarUrl={user.avatarUrl} /></CardContent></Card></div><Card className="mt-6"><CardHeader><CardTitle>Two-factor authentication</CardTitle></CardHeader><CardContent><MfaEnrolment enabled={user.totpEnabled} /></CardContent></Card></div></DashboardShell>;
}
