import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Fingerprint } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Login", description: "Login with email and password or a fingerprint-backed passkey." };

export default function LoginPage() {
  return <main className="gradient-hero grid min-h-screen place-items-center px-4 py-12"><div className="w-full max-w-md"><Link href="/" className="mb-6 flex justify-center"><span className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-white"><Fingerprint className="h-7 w-7" /></span></Link><Card className="shadow-soft"><CardHeader className="text-center"><CardTitle className="text-2xl">Welcome back</CardTitle><CardDescription>Choose password or fingerprint/passkey authentication.</CardDescription></CardHeader><CardContent><Suspense fallback={<p className="text-sm text-muted-foreground">Loading login form…</p>}><LoginForm /></Suspense><p className="mt-6 text-center text-sm text-muted-foreground">New to SecureLearn? <Link href="/register" className="font-semibold text-primary">Create an account</Link></p></CardContent></Card><p className="mt-5 text-center text-xs text-muted-foreground">Demo accounts are listed in the README.</p></div></main>;
}
