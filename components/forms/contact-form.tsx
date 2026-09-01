"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { Alert } from "@/components/ui/alert";

export function ContactForm({ initialEmail = "", initialSubject = "" }: { initialEmail?: string; initialSubject?: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [formVersion, setFormVersion] = useState(0);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Message could not be submitted");
      form.reset();
      setFormVersion((version) => version + 1);
      setMessage({ type: "success", text: "Your message has been sent to the administrator." });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Message could not be submitted. Please try again."
      });
    } finally {
      setLoading(false);
    }
  }

  return <form onSubmit={submit} className="space-y-4">{message ? <Alert variant={message.type}>{message.text}</Alert> : null}<div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" name="name" required /></div><div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" defaultValue={initialEmail} required /></div></div><div className="space-y-2"><Label htmlFor="subject">Subject</Label><Input id="subject" name="subject" defaultValue={initialSubject} required /></div><div className="space-y-2"><Label htmlFor="message">Message</Label><Textarea key={formVersion} id="message" name="message" minLength={10} required /><p className="text-xs text-muted-foreground">For an account appeal, explain what happened and why access should be restored. Never include a password or authenticator code.</p></div><SubmitButton loading={loading}>Send to administrator</SubmitButton></form>;
}
