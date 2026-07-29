"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { Alert } from "@/components/ui/alert";

export function MaterialForm({ courseId }: { courseId: string }) {
  const [loading,setLoading]=useState(false); const [error,setError]=useState("");
  async function submit(event:React.FormEvent<HTMLFormElement>){event.preventDefault();setLoading(true);setError("");const form=event.currentTarget;const data=Object.fromEntries(new FormData(form));const response=await fetch(`/api/courses/${courseId}/materials`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});const result=await response.json();setLoading(false);if(!response.ok)return setError(result.error||"Could not add material");form.reset();window.location.reload();}
  return <form onSubmit={submit} className="space-y-4">{error?<Alert variant="error">{error}</Alert>:null}<div className="space-y-2"><Label htmlFor="material-title">Title</Label><Input id="material-title" name="title" required /></div><div className="space-y-2"><Label htmlFor="material-content">Learning content</Label><Textarea id="material-content" name="content" required /></div><div className="space-y-2"><Label htmlFor="material-file">File or resource URL</Label><Input id="material-file" name="fileUrl" type="url" placeholder="https://..." /></div><SubmitButton loading={loading}>Add material</SubmitButton></form>;
}
