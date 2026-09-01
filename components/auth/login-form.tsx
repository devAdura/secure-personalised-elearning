"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Fingerprint, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
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
  const [mfaChallenge, setMfaChallenge] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState("");
  const [disabledAccount, setDisabledAccount] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const redirectTo = search.get("redirectTo") || "/dashboard";

  async function passwordLogin(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true); setMessage(null); setDisabledAccount(false);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, redirectTo })
      });
      const result = await response.json();
      if (!response.ok) {
        setDisabledAccount(response.status === 403 && result.error === "This account has been disabled by an administrator.");
        return setMessage({ type: "error", text: result.error || "Login failed" });
      }
      if (result.mfaRequired && result.challengeToken) {
        setMfaChallenge(result.challengeToken);
        setMessage(null);
        return;
      }
      window.location.href = result.redirectTo;
    } catch {
      setMessage({ type: "error", text: "SecureLearn could not complete the login request. Check your connection and try again." });
    } finally {
      setLoading(false);
    }
  }

  async function verifyMfa(event: React.FormEvent) {
    event.preventDefault();
    if (!mfaChallenge) return;
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch("/api/auth/mfa/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeToken: mfaChallenge, code: mfaCode })
      });
      const result = await response.json();
      if (!response.ok) return setMessage({ type: "error", text: result.error || "Authenticator verification failed" });
      window.location.href = result.redirectTo;
    } catch {
      setMessage({ type: "error", text: "Authenticator verification could not be completed. Please try again." });
    } finally {
      setLoading(false);
    }
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
    } finally {
      setPasskeyLoading(false);
    }
  }

  if (mfaChallenge) {
    return <form onSubmit={verifyMfa} className="space-y-5">{message ? <Alert variant={message.type}>{message.text}</Alert> : null}<div className="premium-card-subtle p-4"><div className="flex items-start gap-3"><span className="rounded-lg bg-primary/10 p-2 text-primary"><ShieldCheck className="h-5 w-5" /></span><div><p className="font-black text-[#12201c]">Authenticator verification</p><p className="mt-1 text-sm leading-6 text-muted-foreground">Enter the current 6-digit code for {email}. The code refreshes every 30 seconds.</p></div></div></div><div className="space-y-2"><Label htmlFor="mfa-code">Authenticator code</Label><Input id="mfa-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={mfaCode} onChange={(event)=>setMfaCode(event.target.value.replace(/\D/g, "").slice(0, 6))} className="text-center text-xl font-black tracking-[0.35em]" placeholder="000000" /></div><SubmitButton loading={loading} className="w-full">Verify and continue</SubmitButton><Button type="button" variant="ghost" className="w-full" onClick={()=>{setMfaChallenge(null);setMfaCode("");setMessage(null);}}><ArrowLeft className="h-4 w-4" />Use another account</Button></form>;
  }

  return <div className="space-y-5">{message ? <Alert variant={message.type}><p>{message.text}</p>{disabledAccount?<Link href={`/contact?reason=disabled-account&email=${encodeURIComponent(email)}`} className="mt-2 inline-flex font-black underline underline-offset-2">Submit an account appeal</Link>:null}</Alert> : null}<form onSubmit={passwordLogin} className="space-y-4"><div className="space-y-2"><Label htmlFor="email">Email address</Label><div className="input-shell"><Mail /><Input id="email" type="email" autoComplete="username webauthn" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" placeholder="student@example.com" /></div></div><div className="space-y-2"><div className="flex items-center justify-between gap-3"><Label htmlFor="password">Password</Label><Link href="/forgot-password" className="text-xs font-black text-primary hover:underline">Forgot password?</Link></div><div className="input-shell"><LockKeyhole /><Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9" /></div></div><SubmitButton loading={loading} className="w-full">Login securely</SubmitButton></form><div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[#d8e5de]" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 font-black text-muted-foreground">or</span></div></div><Button type="button" variant="outline" className="w-full" disabled={passkeyLoading} onClick={passkeyLogin}><Fingerprint className="h-5 w-5 text-accent" />{passkeyLoading ? "Waiting for device verification..." : "Login with fingerprint/passkey"}</Button><p className="text-center text-xs leading-5 text-muted-foreground">Your device verifies your fingerprint. This platform never receives or stores it.</p></div>;
}
