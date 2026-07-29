import { KeyRound, UserCircle } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProfileForm } from "@/components/forms/profile-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ProfilePage() {
  const user = await requireUser();
  return <DashboardShell user={user}><div className="mx-auto max-w-3xl"><div className="mb-6"><h1 className="text-3xl font-bold">Profile</h1><p className="mt-2 text-muted-foreground">Review account details and biometric-security status.</p></div><div className="grid gap-6 md:grid-cols-[1fr_1.5fr]"><Card><CardContent className="p-6 text-center"><UserCircle className="mx-auto h-20 w-20 text-primary/60" /><h2 className="mt-4 text-xl font-semibold">{user.name}</h2><Badge className="mt-2">{user.role}</Badge><div className="mt-6 rounded-lg bg-slate-50 p-4 text-left"><div className="flex items-center gap-2"><KeyRound className="h-4 w-4 text-accent" /><span className="text-sm font-medium">Passkey status</span></div><p className="mt-2 text-sm text-muted-foreground">{user.webAuthnCredentials.length > 0 ? `${user.webAuthnCredentials.length} passkey credential(s) enrolled` : "No passkey enrolled yet"}</p></div></CardContent></Card><Card><CardHeader><CardTitle>Basic information</CardTitle></CardHeader><CardContent><ProfileForm name={user.name} email={user.email} /></CardContent></Card></div></div></DashboardShell>;
}
