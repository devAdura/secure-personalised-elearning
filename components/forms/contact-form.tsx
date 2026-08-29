"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { Alert } from "@/components/ui/alert";

export function ContactForm() {
  const [loading, setLoading] = useState(false); const [message, setMessage] = useState<{type:"success"|"error";text:string}|null>(null);
  async function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); setLoading(true); setMessage(null); const form = event.currentTarget; const data = Object.fromEntries(new FormData(form)); const response = await fetch("/api/contact", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data)}); const result = await response.json(); setLoading(false); if(!response.ok) return setMessage({type:"error",text:result.error}); form.reset(); setMessage({type:"success",text:"Message received. Thank you for contacting the project team."}); }
  return <form onSubmit={submit} className="space-y-4">{message ? <Alert variant={message.type}>{message.text}</Alert>:null}<div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" name="name" required /></div><div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required /></div></div><div className="space-y-2"><Label htmlFor="subject">Subject</Label><Input id="subject" name="subject" required /></div><div className="space-y-2"><Label htmlFor="message">Message</Label><Textarea id="message" name="message" minLength={10} required /><p className="text-xs text-muted-foreground">Please include enough detail for the team to understand your request.</p></div><SubmitButton loading={loading}>Send message</SubmitButton></form>;
}
