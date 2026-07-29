import type { Metadata } from "next";
import Link from "next/link";
import { Fingerprint } from "lucide-react";
import { RegisterForm } from "@/components/auth/register-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Register", description: "Create a secure student or lecturer account." };

export default function RegisterPage() {
  return <main className="gradient-hero grid min-h-screen place-items-center px-4 py-12"><div className="w-full max-w-lg"><Link href="/" className="mb-6 flex justify-center"><span className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-white"><Fingerprint className="h-7 w-7" /></span></Link><Card className="shadow-soft"><CardHeader className="text-center"><CardTitle className="text-2xl">Create your account</CardTitle><CardDescription>Register first, then add fingerprint/passkey security from your device.</CardDescription></CardHeader><CardContent><RegisterForm /><p className="mt-6 text-center text-sm text-muted-foreground">Already registered? <Link href="/login" className="font-semibold text-primary">Login</Link></p></CardContent></Card></div></main>;
}
