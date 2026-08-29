import Image from "next/image";
import { KeyRound, ShieldCheck, UserCircle } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProfileForm } from "@/components/forms/profile-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ProfilePage() {
  const user = await requireUser();
  const profile = await db.user.findUnique({ where: { id: user.id }, select: { avatarDataUrl: true } });
  const avatarDataUrl = profile?.avatarDataUrl || null;
  return <DashboardShell user={user}><div className="mx-auto max-w-4xl"><div className="page-heading mb-6"><h1>Profile</h1><p>Manage your photo, account details, and authentication status.</p></div><div className="grid gap-6 md:grid-cols-[1fr_1.5fr]"><Card><CardContent className="p-6 text-center"><span className="mx-auto grid h-24 w-24 place-items-center overflow-hidden rounded-lg bg-[#eef8f1] text-primary">{avatarDataUrl?<Image src={avatarDataUrl} alt={`${user.name} profile picture`} width={96} height={96} unoptimized className="h-full w-full object-cover"/>:<UserCircle className="h-16 w-16" />}</span><h2 className="mt-4 text-xl font-black text-[#12201c]">{user.name}</h2><Badge className="mt-2">{user.role}</Badge><div className="premium-card-subtle mt-6 space-y-4 p-4 text-left"><div><div className="flex items-center gap-2"><KeyRound className="h-4 w-4 text-accent" /><span className="text-sm font-black text-[#12201c]">Passkey status</span></div><p className="mt-2 text-sm leading-6 text-muted-foreground">{user.webAuthnCredentials.length > 0 ? `${user.webAuthnCredentials.length} passkey credential(s) enrolled` : "No passkey enrolled yet"}</p></div><div className="border-t border-[#d8e5de] pt-4"><div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary"/><span className="text-sm font-black text-[#12201c]">Authenticator MFA</span></div><p className="mt-2 text-sm leading-6 text-muted-foreground">{user.totpEnabled?"Enabled for password sign-ins":"Not enabled"}</p></div></div></CardContent></Card><Card><CardHeader><CardTitle>Basic information</CardTitle></CardHeader><CardContent><ProfileForm name={user.name} email={user.email} avatarDataUrl={avatarDataUrl}/></CardContent></Card></div></div></DashboardShell>;
}
