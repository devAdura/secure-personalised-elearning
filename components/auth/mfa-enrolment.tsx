"use client";
import { useState } from "react";
import { KeyRound, ShieldCheck, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";

type Setup = { qr: string; secret: string; otpauthUrl: string };

// Authenticator-app (TOTP) enrolment shown on the profile page. Complements the
// existing password + passkey factors with a standard second-factor code.
export function MfaEnrolment({ enabled }: { enabled: boolean }) {
  const [setup, setSetup] = useState<Setup | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function startSetup() {
    setLoading(true); setMessage(null);
    try {
      const res = await fetch("/api/auth/mfa/setup", { method: "POST" });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Could not start setup");
      setSetup(result);
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Could not start setup" });
    } finally { setLoading(false); }
  }

  async function submitCode(path: string, successText: string) {
    setLoading(true); setMessage(null);
    try {
      const res = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Request failed");
      setMessage({ type: "success", text: successText });
      setTimeout(() => window.location.reload(), 900);
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Request failed" });
      setLoading(false);
    }
  }

  return <div className="space-y-4">{message ? <Alert variant={message.type}>{message.text}</Alert> : null}
    <div className="flex items-start gap-4"><div className="rounded-lg bg-emerald-100 p-3 text-emerald-700"><ShieldCheck className="h-6 w-6" /></div><div><p className="font-black text-[#12201c]">Authenticator app (TOTP)</p><p className="mt-1 text-sm leading-6 text-muted-foreground">Add a time-based code from an app such as Google Authenticator, Authy or 1Password as a second step after your password.</p></div></div>

    {enabled ? <div className="space-y-3"><Alert variant="success">Two-factor authentication is <strong>on</strong> for your account.</Alert><div className="space-y-2"><Label htmlFor="mfa-off">Enter a current code to turn it off</Label><Input id="mfa-off" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="123456" value={code} onChange={(e) => setCode(e.target.value)} /></div><Button variant="outline" disabled={loading || code.length !== 6} onClick={() => submitCode("/api/auth/mfa/disable", "Two-factor authentication turned off.")}>Turn off two-factor</Button></div>
    : setup ? <div className="space-y-4"><div className="premium-card-subtle p-4"><p className="flex items-center gap-2 text-sm font-black text-[#12201c]"><Smartphone className="h-4 w-4 text-primary" />Scan this QR code in your authenticator app</p><img src={setup.qr} alt="Authenticator QR code" className="mt-3 h-44 w-44 rounded-md border border-[#d8e5de] bg-white p-2" /><p className="mt-3 text-xs text-muted-foreground">Can&apos;t scan? Enter this key manually:</p><code className="mt-1 block break-all rounded-md bg-white/80 px-3 py-2 text-xs font-black tracking-wider text-[#12201c]">{setup.secret}</code></div><div className="space-y-2"><Label htmlFor="mfa-on">Enter the 6-digit code to confirm</Label><Input id="mfa-on" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="123456" value={code} onChange={(e) => setCode(e.target.value)} /></div><Button disabled={loading || code.length !== 6} onClick={() => submitCode("/api/auth/mfa/enable", "Two-factor authentication enabled.")}><KeyRound className="h-4 w-4" />Verify &amp; enable</Button></div>
    : <Button disabled={loading} onClick={startSetup}><ShieldCheck className="h-4 w-4" />{loading ? "Preparing setup..." : "Set up authenticator app"}</Button>}
  </div>;
}
