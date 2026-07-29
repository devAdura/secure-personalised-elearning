"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { Alert } from "@/components/ui/alert";
import { Toast } from "@/components/ui/toast";

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const [loading,setLoading]=useState(false); const [message,setMessage]=useState<{type:"success"|"error";text:string}|null>(null);
  async function submit(event:React.FormEvent<HTMLFormElement>){event.preventDefault();setLoading(true);setMessage(null);const data=Object.fromEntries(new FormData(event.currentTarget));const response=await fetch("/api/profile",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});const result=await response.json();setLoading(false);setMessage(response.ok?{type:"success",text:"Profile updated successfully."}:{type:"error",text:result.error||"Update failed"});}
  return <form onSubmit={submit} className="space-y-4">{message?.type==="success"?<Toast message={message.text} onClose={()=>setMessage(null)}/>:null}{message?.type==="error"?<Alert variant="error">{message.text}</Alert>:null}<div className="space-y-2"><Label htmlFor="name">Full name</Label><Input id="name" name="name" defaultValue={name} required /></div><div className="space-y-2"><Label>Email address</Label><Input value={email} disabled /><p className="text-xs text-muted-foreground">Email changes are disabled in this prototype to protect credential ownership.</p></div><SubmitButton loading={loading}>Save profile</SubmitButton></form>;
}
