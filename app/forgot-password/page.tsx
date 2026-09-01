import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, KeyRound, MailCheck, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { PasswordResetForm } from "@/components/auth/password-reset-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Recover access to your SecureLearn account with a one-time email code.",
  robots: { index: false, follow: false }
};

export default function ForgotPasswordPage() {
  return <main className="auth-shell"><div className="page-container auth-grid"><section className="auth-story"><Logo/><p className="kicker mt-10">Account recovery</p><h1>Recover access without weakening security.</h1><p>A short-lived code confirms access to your registered email before SecureLearn accepts a new password.</p><div className="auth-signal-list"><div className="flex gap-3"><MailCheck className="mt-1 h-5 w-5 text-primary"/><div><p className="font-black text-[#12201c]">Private email verification</p><p className="text-sm leading-6 text-muted-foreground">Codes expire after 10 minutes and can only be used once.</p></div></div><div className="flex gap-3"><ShieldCheck className="mt-1 h-5 w-5 text-primary"/><div><p className="font-black text-[#12201c]">Session protection</p><p className="text-sm leading-6 text-muted-foreground">Existing sessions close after a successful password change.</p></div></div></div><Link href="/login" className="mt-8 inline-flex items-center gap-2 text-sm font-black text-primary"><ArrowLeft className="h-4 w-4"/>Back to login</Link></section><aside className="auth-card premium-card"><Card className="auth-panel border-0 shadow-none"><CardHeader><div className="mb-4 grid h-12 w-12 place-items-center rounded-lg bg-primary text-white"><KeyRound className="h-6 w-6"/></div><CardTitle className="text-2xl">Reset your password</CardTitle><CardDescription>Enter the email used for your SecureLearn account.</CardDescription></CardHeader><CardContent><PasswordResetForm/></CardContent></Card></aside></div></main>;
}
