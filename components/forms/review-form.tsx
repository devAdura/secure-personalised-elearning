"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { Alert } from "@/components/ui/alert";

export function ReviewForm({ submissionId, grade, feedback }: {submissionId:string;grade:number|null;feedback:string|null}){
 const[loading,setLoading]=useState(false);const[message,setMessage]=useState<{type:"success"|"error";text:string}|null>(null);
 async function submit(event:React.FormEvent<HTMLFormElement>){event.preventDefault();setLoading(true);setMessage(null);const data=Object.fromEntries(new FormData(event.currentTarget));const response=await fetch(`/api/submissions/${submissionId}/review`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});const result=await response.json();setLoading(false);setMessage(response.ok?{type:"success",text:"Grade and feedback saved."}:{type:"error",text:result.error||"Review failed"});}
 return <form onSubmit={submit} className="space-y-3">{message?<Alert variant={message.type}>{message.text}</Alert>:null}<div className="space-y-2"><Label>Grade (%)</Label><Input name="grade" type="number" min="0" max="100" step="0.5" defaultValue={grade??""} required /></div><div className="space-y-2"><Label>Feedback</Label><Textarea name="feedback" defaultValue={feedback??""} /></div><SubmitButton loading={loading} size="sm">Save review</SubmitButton></form>;
}
