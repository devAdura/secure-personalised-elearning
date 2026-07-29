"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Fingerprint, LockKeyhole, Mail } from "lucide-react";
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

  return <div className="space-y-5">{message ? <Alert variant={message.type}>{message.text}</Alert> : null}<form onSubmit={passwordLogin} className="space-y-4"><div className="space-y-2"><Label htmlFor="email">Email address</Label><div className="relative"><Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" /><Input id="email" type="email" autoComplete="username webauthn" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" placeholder="student@example.com" /></div></div><div className="space-y-2"><Label htmlFor="password">Password</Label><div className="relative"><LockKeyhole className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" /><Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9" /></div></div><SubmitButton loading={loading} className="w-full">Login securely</SubmitButton></form><div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">or</span></div></div><Button type="button" variant="outline" className="w-full" disabled={passkeyLoading} onClick={passkeyLogin}><Fingerprint className="h-5 w-5 text-accent" />{passkeyLoading ? "Waiting for device verification…" : "Login with fingerprint/passkey"}</Button><p className="text-center text-xs text-muted-foreground">Your device verifies your fingerprint. This platform never receives or stores it.</p></div>;
}
