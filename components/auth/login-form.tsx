"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Fingerprint, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { startAuthentication } from "@simplewebauthn/browser";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

export function LoginForm() {
  const search = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passkeyLoading, setPasskeyLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [mfa, setMfa] = useState<{ ticket: string; redirectTo: string } | null>(null);
  const [code, setCode] = useState("");
  const redirectTo = search.get("redirectTo") || "/dashboard";

  async function passwordLogin(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true); setMessage(null);
    const response = await fetch("/api/auth/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, redirectTo })
    });
    const result = await response.json();
    setLoading(false);
    if (!response.ok) return setMessage({ type: "error", text: result.error || "Login failed" });
    if (result.mfaRequired) return setMfa({ ticket: result.ticket, redirectTo: result.redirectTo });
    window.location.href = result.redirectTo;
  }

  async function verifyMfa(event: React.FormEvent) {
    event.preventDefault();
    if (!mfa) return;
    setLoading(true); setMessage(null);
    const response = await fetch("/api/auth/mfa/verify", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticket: mfa.ticket, code, redirectTo: mfa.redirectTo })
    });
    const result = await response.json();
    setLoading(false);
    if (!response.ok) return setMessage({ type: "error", text: result.error || "Verification failed" });
    window.location.href = result.redirectTo;
  }

  async function passkeyLogin() {
    if (!email) return setMessage({ type: "error", text: "Enter your email before using a passkey." });
    setPasskeyLoading(true); setMessage(null);
    try {
      const optionsResponse = await fetch("/api/auth/passkey/authentication-options", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email })
      });
      const options = await optionsResponse.json();
      if (!optionsResponse.ok) throw new Error(options.error || "Could not start passkey login");
      const authentication = await startAuthentication({ optionsJSON: options });
      const verifyResponse = await fetch("/api/auth/passkey/authentication-verify", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, response: authentication, redirectTo })
      });
      const result = await verifyResponse.json();
      if (!verifyResponse.ok) throw new Error(result.error || "Passkey verification failed");
      window.location.href = result.redirectTo;
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Passkey login failed" });
      setPasskeyLoading(false);
    }
  }

  return <div className="space-y-5">{message ? <Alert variant={message.type}>{message.text}</Alert> : null}{mfa ? <form onSubmit={verifyMfa} className="space-y-4"><div className="rounded-lg border border-[#d8e5de] bg-white/90 p-4 shadow-sm"><p className="flex items-center gap-2 text-sm font-black text-[#12201c]"><ShieldCheck className="h-4 w-4 text-primary" />Two-factor authentication</p><p className="mt-1 text-sm leading-6 text-muted-foreground">Enter the 6-digit code from your authenticator app to finish signing in.</p></div><div className="space-y-2"><Label htmlFor="code">Authentication code</Label><Input id="code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} required value={code} onChange={(e) => setCode(e.target.value)} placeholder="123456" autoFocus /></div><SubmitButton loading={loading} className="w-full">Verify and sign in</SubmitButton><Button type="button" variant="ghost" className="w-full" onClick={() => { setMfa(null); setCode(""); setMessage(null); }}>Back to login</Button></form> : <><form onSubmit={passwordLogin} className="space-y-4"><div className="space-y-2"><Label htmlFor="email">Email address</Label><div className="input-shell"><Mail /><Input id="email" type="email" autoComplete="username webauthn" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" placeholder="student@example.com" /></div></div><div className="space-y-2"><Label htmlFor="password">Password</Label><div className="input-shell"><LockKeyhole /><Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9" /></div></div><SubmitButton loading={loading} className="w-full">Login securely</SubmitButton></form><div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[#d8e5de]" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 font-black text-muted-foreground">or</span></div></div><Button type="button" variant="outline" className="w-full" disabled={passkeyLoading} onClick={passkeyLogin}><Fingerprint className="h-5 w-5 text-accent" />{passkeyLoading ? "Waiting for device verification..." : "Login with fingerprint/passkey"}</Button><p className="text-center text-xs leading-5 text-muted-foreground">Your device verifies your fingerprint. This platform never receives or stores it.</p></>}</div>;
}
