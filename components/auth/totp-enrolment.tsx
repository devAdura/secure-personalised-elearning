"use client";

import Image from "next/image";
import { useState } from "react";
import { Copy, ShieldCheck, Smartphone } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SetupData = { secret: string; qrCodeDataUrl: string };

export function TotpEnrolment({ enabled }: { enabled: boolean }) {
  const [setup, setSetup] = useState<SetupData | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  async function startSetup() {
    setLoading(true);
    setMessage(null);
    const response = await fetch("/api/auth/mfa/setup", { method: "POST" });
    const result = await response.json();
    setLoading(false);
    if (!response.ok) return setMessage({ type: "error", text: result.error || "Could not start authenticator setup" });
    setSetup(result);
  }

  async function verifySetup() {
    setLoading(true);
    setMessage(null);
    const response = await fetch("/api/auth/mfa/verify-setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });
    const result = await response.json();
    setLoading(false);
    if (!response.ok) return setMessage({ type: "error", text: result.error || "Verification failed" });
    setMessage({ type: "success", text: "Authenticator MFA is now active." });
    window.location.reload();
  }

  async function disableMfa() {
    setLoading(true);
    setMessage(null);
    const response = await fetch("/api/auth/mfa", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });
    const result = await response.json();
    setLoading(false);
    if (!response.ok) return setMessage({ type: "error", text: result.error || "MFA could not be disabled" });
    window.location.reload();
  }

  if (enabled) {
    return <div className="space-y-4">{message ? <Alert variant={message.type}>{message.text}</Alert> : null}<div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4"><ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-700"/><div><p className="font-black text-emerald-900">Authenticator MFA is active</p><p className="mt-1 text-sm leading-6 text-emerald-800">Password sign-ins require a fresh 6-digit code from your authenticator app.</p></div></div><div className="space-y-2"><Label htmlFor="disable-mfa-code">Current authenticator code</Label><Input id="disable-mfa-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={code} onChange={(event)=>setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" /></div><Button variant="destructive" disabled={loading || code.length !== 6} onClick={disableMfa}>{loading ? "Checking code..." : "Disable authenticator MFA"}</Button></div>;
  }

  if (!setup) {
    return <div className="space-y-4">{message ? <Alert variant={message.type}>{message.text}</Alert> : null}<div className="premium-card-subtle p-5"><Smartphone className="h-6 w-6 text-primary"/><p className="mt-3 font-black text-[#12201c]">Add an authenticator app</p><p className="mt-1 text-sm leading-6 text-muted-foreground">Use any standards-based TOTP app. SecureLearn generates the QR code locally and stores the shared secret encrypted.</p></div><Button className="w-full" disabled={loading} onClick={startSetup}><ShieldCheck className="h-5 w-5"/>{loading ? "Preparing secure setup..." : "Set up authenticator app"}</Button></div>;
  }

  return <div className="space-y-4">{message ? <Alert variant={message.type}>{message.text}</Alert> : null}<div className="grid gap-4 sm:grid-cols-[260px_1fr] sm:items-center"><Image src={setup.qrCodeDataUrl} alt="Authenticator setup QR code" width={260} height={260} unoptimized className="rounded-lg border border-[#d8e5de] bg-white"/><div><p className="font-black text-[#12201c]">Scan this code</p><p className="mt-1 text-sm leading-6 text-muted-foreground">Open your authenticator app, add an account, then scan the QR code. You can also enter this key manually.</p><div className="mt-3 flex items-center gap-2 rounded-md border border-[#d8e5de] bg-white p-3"><code className="min-w-0 flex-1 break-all text-xs font-black text-[#12201c]">{setup.secret}</code><Button type="button" size="icon" variant="ghost" title="Copy setup key" aria-label="Copy setup key" onClick={()=>void navigator.clipboard.writeText(setup.secret)}><Copy className="h-4 w-4"/></Button></div></div></div><div className="space-y-2"><Label htmlFor="setup-mfa-code">Verify the current code</Label><Input id="setup-mfa-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={code} onChange={(event)=>setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" /></div><Button className="w-full" disabled={loading || code.length !== 6} onClick={verifySetup}>{loading ? "Verifying..." : "Verify and enable MFA"}</Button></div>;
}
