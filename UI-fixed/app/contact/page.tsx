import type { Metadata } from "next";
import { Mail, MessageCircle, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ContactForm } from "@/components/forms/contact-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Contact", description: "Contact the SecureLearn academic project team." };

export default function ContactPage() {
  return <><SiteHeader /><main><section className="route-hero"><div className="page-container route-hero-grid"><div className="route-copy"><p className="kicker">Contact</p><h1>Send a precise message to the project team.</h1><p>Use this form for project enquiries, demonstration feedback, or technical questions. Messages are saved securely for administrator review.</p><div className="auth-signal-list"><div className="flex gap-3"><Mail className="mt-1 h-5 w-5 text-primary" /><div><p className="font-black text-[#12201c]">Academic enquiries</p><p className="text-sm leading-6 text-muted-foreground">Ask about architecture, security, and implementation.</p></div></div><div className="flex gap-3"><MessageCircle className="mt-1 h-5 w-5 text-primary" /><div><p className="font-black text-[#12201c]">Prototype feedback</p><p className="text-sm leading-6 text-muted-foreground">Report usability issues or suggest improvements.</p></div></div></div></div><aside className="hero-terminal premium-card"><div className="terminal-row"><span>Message scope</span><strong>Project review</strong></div><div className="terminal-row"><span>Visibility</span><strong>Admin queue</strong></div><div className="terminal-row"><span>Privacy</span><strong>Secure storage</strong></div><div className="absolute bottom-4 left-4 right-4 z-10 rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur-md"><ShieldCheck className="h-6 w-6 text-[#b7f0dc]" /><p className="mt-3 text-sm font-bold leading-6 text-white/75">Please avoid sending sensitive biometric data, passwords, or private credentials through contact messages.</p></div></aside></div></section><section className="page-container py-10"><Card className="mx-auto max-w-3xl"><CardHeader><CardTitle>Contact form</CardTitle></CardHeader><CardContent><ContactForm /></CardContent></Card></section></main><SiteFooter /></>;
}
