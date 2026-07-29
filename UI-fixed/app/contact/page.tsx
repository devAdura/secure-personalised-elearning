import type { Metadata } from "next";
import { Mail, MessageCircle } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ContactForm } from "@/components/forms/contact-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Contact", description: "Contact the SecureLearn academic project team." };

export default function ContactPage() {
  return <><SiteHeader /><main className="section-padding"><div className="page-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr]"><div><p className="font-semibold text-primary">Contact</p><h1 className="mt-2 text-4xl font-bold">Send the project team a message</h1><p className="mt-4 leading-7 text-muted-foreground">Use this form for project enquiries, demonstration feedback or technical questions. Messages are saved securely for the administrator to review.</p><div className="mt-8 space-y-4"><div className="flex gap-3"><Mail className="mt-1 h-5 w-5 text-primary" /><div><p className="font-medium">Academic enquiries</p><p className="text-sm text-muted-foreground">Ask about architecture, security and implementation.</p></div></div><div className="flex gap-3"><MessageCircle className="mt-1 h-5 w-5 text-primary" /><div><p className="font-medium">Prototype feedback</p><p className="text-sm text-muted-foreground">Report usability issues or suggest improvements.</p></div></div></div></div><Card><CardHeader><CardTitle>Contact form</CardTitle></CardHeader><CardContent><ContactForm /></CardContent></Card></div></main><SiteFooter /></>;
}
