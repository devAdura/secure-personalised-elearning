"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { Alert } from "@/components/ui/alert";
import { Toast } from "@/components/ui/toast";

export function SubmissionForm({ assignmentId, existing }: { assignmentId:string; existing?: {content:string;fileUrl:string|null} | null }) {
  const[loading,setLoading]=useState(false);const[message,setMessage]=useState<{type:"error"|"success";text:string}|null>(null);
  async function submit(event:React.FormEvent<HTMLFormElement>){event.preventDefault();setLoading(true);setMessage(null);const data=Object.fromEntries(new FormData(event.currentTarget));const response=await fetch(`/api/assignments/${assignmentId}/submit`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});const result=await response.json();setLoading(false);setMessage(response.ok?{type:"success",text:"Assignment submitted successfully."}:{type:"error",text:result.error||"Submission failed"});}
  return <form onSubmit={submit} className="space-y-4">{message?.type==="success"?<Toast message={message.text} onClose={()=>setMessage(null)}/>:null}{message?.type==="error"?<Alert variant="error">{message.text}</Alert>:null}<div className="space-y-2"><Label htmlFor="content">Your response</Label><Textarea id="content" name="content" defaultValue={existing?.content} className="min-h-56" required /></div><div className="space-y-2"><Label htmlFor="fileUrl">File link (Google Drive, OneDrive or repository)</Label><Input id="fileUrl" name="fileUrl" type="url" defaultValue={existing?.fileUrl||""} placeholder="https://..." /></div><SubmitButton loading={loading}>{existing?"Update submission":"Submit assignment"}</SubmitButton></form>;
}
