"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";

type Step = "request" | "confirm" | "complete";

export function PasswordResetForm() {
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [challengeToken, setChallengeToken] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  async function requestCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch("/api/auth/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const result = await response.json();
      if (!response.ok) return setMessage({ type: "error", text: result.error || "Reset code could not be sent" });
      setChallengeToken(result.challengeToken);
      setStep("confirm");
      setMessage({ type: "success", text: result.message });
    } catch {
      setMessage({ type: "error", text: "The reset request could not be completed. Check your connection and try again." });
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const password = String(data.get("password") || "");
    const confirmPassword = String(data.get("confirmPassword") || "");
    if (password !== confirmPassword) return setMessage({ type: "error", text: "The two passwords do not match." });

    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch("/api/auth/password-reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, challengeToken, code, password })
      });
      const result = await response.json();
      if (!response.ok) return setMessage({ type: "error", text: result.error || "Password could not be reset" });
      setStep("complete");
      setMessage(null);
    } catch {
      setMessage({ type: "error", text: "The password change could not be completed. Check your connection and try again." });
    } finally {
      setLoading(false);
    }
  }

  if (step === "complete") {
    return <div className="space-y-5 text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-emerald-100 text-emerald-700"><CheckCircle2 className="h-7 w-7" /></span><div><h2 className="text-xl font-black text-[#12201c]">Password changed</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Your previous sessions have been closed. Sign in again with your new password.</p></div><Link href="/login" className="inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-black text-white">Return to login</Link></div>;
  }

  if (step === "confirm") {
    return <form onSubmit={resetPassword} className="space-y-4">{message ? <Alert variant={message.type}>{message.text}</Alert> : null}<div className="space-y-2"><Label htmlFor="reset-code">Email verification code</Label><Input id="reset-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={code} onChange={(event)=>setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} className="text-center text-xl font-black tracking-[0.3em]" placeholder="000000" /></div><div className="space-y-2"><Label htmlFor="new-password">New password</Label><Input id="new-password" name="password" type="password" autoComplete="new-password" minLength={8} required /></div><div className="space-y-2"><Label htmlFor="confirm-password">Confirm new password</Label><Input id="confirm-password" name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required /></div><p className="text-xs leading-5 text-muted-foreground">Use at least 8 characters, including an uppercase letter and a number.</p><SubmitButton loading={loading} className="w-full" disabled={code.length !== 6}>Change password</SubmitButton><Button type="button" variant="ghost" className="w-full" onClick={()=>{setStep("request");setCode("");setChallengeToken("");setMessage(null);}}><ArrowLeft className="h-4 w-4" />Request another code</Button></form>;
  }

  return <form onSubmit={requestCode} className="space-y-4">{message ? <Alert variant={message.type}>{message.text}</Alert> : null}<div className="space-y-2"><Label htmlFor="recovery-email">Account email</Label><div className="input-shell"><Mail /><Input id="recovery-email" type="email" autoComplete="email" required value={email} onChange={(event)=>setEmail(event.target.value)} className="pl-9" placeholder="you@example.com" /></div></div><p className="text-sm leading-6 text-muted-foreground">We will send a one-time code to the email attached to an active SecureLearn account.</p><SubmitButton loading={loading} className="w-full">Send reset code</SubmitButton><p className="text-center text-xs leading-5 text-muted-foreground">Account disabled? <Link href="/contact?reason=disabled-account" className="font-black text-primary">Appeal to the administrator</Link></p></form>;
}
