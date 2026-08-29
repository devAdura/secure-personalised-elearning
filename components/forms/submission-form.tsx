"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { Alert } from "@/components/ui/alert";
import { Toast } from "@/components/ui/toast";

export function SubmissionForm({ assignmentId, existing, isClosed }: { assignmentId:string; existing?: {content:string;fileUrl:string|null} | null; isClosed:boolean }) {
  const[loading,setLoading]=useState(false);const[message,setMessage]=useState<{type:"error"|"success";text:string}|null>(null);
  async function submit(event:React.FormEvent<HTMLFormElement>){event.preventDefault();setLoading(true);setMessage(null);const data=Object.fromEntries(new FormData(event.currentTarget));const response=await fetch(`/api/assignments/${assignmentId}/submit`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});const result=await response.json();setLoading(false);setMessage(response.ok?{type:"success",text:"Assignment submitted successfully."}:{type:"error",text:result.error||"Submission failed"});}
  return <form onSubmit={submit} className="space-y-4">{isClosed?<Alert variant="error">The submission deadline has passed. You can review your work, but no new submission or update can be sent.</Alert>:null}{message?.type==="success"?<Toast message={message.text} onClose={()=>setMessage(null)}/>:null}{message?.type==="error"?<Alert variant="error">{message.text}</Alert>:null}<div className="space-y-2"><Label htmlFor="content">Your response</Label><Textarea id="content" name="content" defaultValue={existing?.content} className="min-h-56" disabled={isClosed} required /></div><div className="space-y-2"><Label htmlFor="fileUrl">File link (Google Drive, OneDrive or repository)</Label><Input id="fileUrl" name="fileUrl" type="url" defaultValue={existing?.fileUrl||""} placeholder="https://..." disabled={isClosed} /></div>{!isClosed?<SubmitButton loading={loading}>{existing?"Update submission":"Submit assignment"}</SubmitButton>:null}</form>;
}
