"use client";

import { useState } from "react";
import { browserSupportsWebAuthn, platformAuthenticatorIsAvailable, startRegistration } from "@simplewebauthn/browser";
import { Fingerprint, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

export function PasskeyEnrolment({ existingCount }: { existingCount: number }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  async function enrol() {
    setLoading(true); setMessage(null);
    try {
      if (!browserSupportsWebAuthn()) throw new Error("This browser does not support WebAuthn/passkeys.");
      const platformAvailable = await platformAuthenticatorIsAvailable();
      if (!platformAvailable) setMessage({ type: "info", text: "No built-in authenticator was detected. Your browser may offer a phone or security key instead." });
      const optionsResponse = await fetch("/api/auth/passkey/register-options", { method: "POST" });
      const options = await optionsResponse.json();
      if (!optionsResponse.ok) throw new Error(options.error || "Could not start passkey setup");
      const registration = await startRegistration({ optionsJSON: options });
      const verifyResponse = await fetch("/api/auth/passkey/register-verify", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(registration)
      });
      const result = await verifyResponse.json();
      if (!verifyResponse.ok) throw new Error(result.error || "Passkey verification failed");
      setMessage({ type: "success", text: "Passkey enrolled successfully. You can now sign in using your device fingerprint, face or screen lock." });
      setTimeout(() => { window.location.href = result.redirectTo || "/dashboard"; }, 800);
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Passkey setup failed" });
    } finally { setLoading(false); }
  }

  return <div className="space-y-5">{message ? <Alert variant={message.type === "info" ? "info" : message.type}>{message.text}</Alert> : null}<div className="rounded-lg border bg-slate-50 p-5"><div className="flex items-start gap-4"><div className="rounded-full bg-emerald-100 p-3 text-emerald-700"><ShieldCheck className="h-6 w-6" /></div><div><h3 className="font-semibold">Privacy-preserving biometric security</h3><p className="mt-1 text-sm text-muted-foreground">The fingerprint scan remains inside your device authenticator. SecureLearn receives a signed cryptographic response and stores only the public credential data needed to verify future logins.</p></div></div></div><div className="flex items-center justify-between rounded-lg border p-4"><div><p className="font-medium">Registered passkeys</p><p className="text-sm text-muted-foreground">{existingCount} credential{existingCount === 1 ? "" : "s"} connected</p></div><Fingerprint className="h-8 w-8 text-primary" /></div><Button size="lg" className="w-full" disabled={loading} onClick={enrol}><Fingerprint className="h-5 w-5" />{loading ? "Follow your device prompt…" : "Enrol fingerprint/passkey"}</Button></div>;
}
