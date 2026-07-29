"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { Alert } from "@/components/ui/alert";

export function AssignmentForm({ courseId }: { courseId:string }) {
  const [loading,setLoading]=useState(false);const[error,setError]=useState("");
  async function submit(event:React.FormEvent<HTMLFormElement>){event.preventDefault();setLoading(true);setError("");const form=event.currentTarget;const data=Object.fromEntries(new FormData(form));data.dueDate=new Date(String(data.dueDate)).toISOString();const response=await fetch(`/api/courses/${courseId}/assignments`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});const result=await response.json();setLoading(false);if(!response.ok)return setError(result.error||"Could not create assignment");form.reset();window.location.reload();}
  const minDate = new Date(Date.now()+60*60*1000).toISOString().slice(0,16);
  return <form onSubmit={submit} className="space-y-4">{error?<Alert variant="error">{error}</Alert>:null}<div className="space-y-2"><Label htmlFor="assignment-title">Title</Label><Input id="assignment-title" name="title" required /></div><div className="space-y-2"><Label htmlFor="assignment-description">Instructions</Label><Textarea id="assignment-description" name="description" required /></div><div className="space-y-2"><Label htmlFor="dueDate">Due date</Label><Input id="dueDate" name="dueDate" type="datetime-local" min={minDate} required /></div><SubmitButton loading={loading}>Create assignment</SubmitButton></form>;
}
