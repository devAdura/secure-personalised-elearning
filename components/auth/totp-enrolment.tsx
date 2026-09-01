"use client";

import Image from "next/image";
import { useState } from "react";
import { Copy, ExternalLink, ShieldCheck, Smartphone } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SetupData = { secret: string; qrCodeDataUrl: string; uri: string };

async function sendMfaRequest<T>(url: string, fallbackError: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(url, init);
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || fallbackError);
  return result as T;
}

export function TotpEnrolment({ enabled }: { enabled: boolean }) {
  const [setup, setSetup] = useState<SetupData | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  async function startSetup() {
    setLoading(true);
    setMessage(null);
    try {
      setSetup(await sendMfaRequest<SetupData>("/api/auth/mfa/setup", "Could not start authenticator setup", { method: "POST" }));
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Could not start authenticator setup" });
    } finally {
      setLoading(false);
    }
  }

  async function verifySetup() {
    setLoading(true);
    setMessage(null);
    try {
      await sendMfaRequest("/api/auth/mfa/verify-setup", "Verification failed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });
      setMessage({ type: "success", text: "Authenticator MFA is now active." });
      window.location.reload();
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Verification failed" });
    } finally {
      setLoading(false);
    }
  }

  async function disableMfa() {
    setLoading(true);
    setMessage(null);
    try {
      await sendMfaRequest("/api/auth/mfa", "MFA could not be disabled", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });
      window.location.reload();
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "MFA could not be disabled" });
    } finally {
      setLoading(false);
    }
  }

  if (enabled) {
    return <div className="space-y-4">{message ? <Alert variant={message.type}>{message.text}</Alert> : null}<div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4"><ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-700"/><div><p className="font-black text-emerald-900">Authenticator MFA is active</p><p className="mt-1 text-sm leading-6 text-emerald-800">Password sign-ins require a fresh 6-digit code from your authenticator app.</p></div></div><div className="space-y-2"><Label htmlFor="disable-mfa-code">Current authenticator code</Label><Input id="disable-mfa-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={code} onChange={(event)=>setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" /></div><Button variant="destructive" disabled={loading || code.length !== 6} onClick={disableMfa}>{loading ? "Checking code..." : "Disable authenticator MFA"}</Button></div>;
  }

  if (!setup) {
    return <div className="space-y-4">{message ? <Alert variant={message.type}>{message.text}</Alert> : null}<div className="premium-card-subtle p-5"><Smartphone className="h-6 w-6 text-primary"/><p className="mt-3 font-black text-[#12201c]">Add an authenticator app</p><p className="mt-1 text-sm leading-6 text-muted-foreground">Use Google Authenticator or another standards-based TOTP app. SecureLearn stores the shared setup secret in encrypted form.</p></div><Button className="w-full" disabled={loading} onClick={startSetup}><ShieldCheck className="h-5 w-5"/>{loading ? "Preparing secure setup..." : "Set up authenticator app"}</Button></div>;
  }

  return <div className="space-y-4">{message ? <Alert variant={message.type}>{message.text}</Alert> : null}<div className="grid gap-4 sm:grid-cols-[260px_1fr] sm:items-center"><Image src={setup.qrCodeDataUrl} alt="Authenticator setup QR code" width={260} height={260} unoptimized className="mx-auto rounded-lg border border-[#d8e5de] bg-white"/><div><p className="font-black text-[#12201c]">Add SecureLearn to your authenticator</p><p className="mt-1 text-sm leading-6 text-muted-foreground">Scan the QR code from another device, open the authenticator directly on this phone, or enter the key manually.</p><a href={setup.uri} className={buttonVariants({variant:"outline",size:"sm",className:"mt-3 w-full sm:w-auto"})}><ExternalLink className="h-4 w-4"/>Open authenticator app</a><div className="mt-3 flex items-center gap-2 rounded-md border border-[#d8e5de] bg-white p-3"><code className="min-w-0 flex-1 break-all text-xs font-black text-[#12201c]">{setup.secret}</code><Button type="button" size="icon" variant="ghost" title="Copy setup key" aria-label="Copy setup key" onClick={()=>void navigator.clipboard.writeText(setup.secret)}><Copy className="h-4 w-4"/></Button></div></div></div><div className="space-y-2"><Label htmlFor="setup-mfa-code">Verify the current code</Label><Input id="setup-mfa-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={code} onChange={(event)=>setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" /></div><Button className="w-full" disabled={loading || code.length !== 6} onClick={verifySetup}>{loading ? "Verifying..." : "Verify and enable MFA"}</Button></div>;
}
