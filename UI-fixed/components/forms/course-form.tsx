"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { Alert } from "@/components/ui/alert";

type InitialCourse = { id?: string; title?: string; description?: string; category?: string; level?: string; thumbnailUrl?: string | null; isPublished?: boolean };

export function CourseForm({ initial = {} }: { initial?: InitialCourse }) {
  const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    const raw = Object.fromEntries(new FormData(event.currentTarget));
    const body = { ...raw, isPublished: raw.isPublished === "on" };
    const response = await fetch(initial.id ? `/api/courses/${initial.id}` : "/api/courses", { method: initial.id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const result = await response.json(); setLoading(false);
    if (!response.ok) return setError(result.error || "Could not save course");
    window.location.href = `/lecturer/courses/${result.course.id}/manage`;
  }
  return <form onSubmit={submit} className="space-y-5">{error ? <Alert variant="error">{error}</Alert> : null}<div className="space-y-2"><Label htmlFor="title">Course title</Label><Input id="title" name="title" defaultValue={initial.title} required /></div><div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" defaultValue={initial.description} required className="min-h-36" /></div><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="category">Category</Label><Input id="category" name="category" defaultValue={initial.category} placeholder="Computer Science" required /></div><div className="space-y-2"><Label htmlFor="level">Level</Label><select id="level" name="level" defaultValue={initial.level || "Beginner"} className="h-11 w-full rounded-md border bg-background px-3 text-sm"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div></div><div className="space-y-2"><Label htmlFor="thumbnailUrl">Thumbnail URL (optional)</Label><Input id="thumbnailUrl" name="thumbnailUrl" type="url" defaultValue={initial.thumbnailUrl || ""} placeholder="https://..." /></div><label className="flex items-center gap-3 rounded-lg border p-4"><input type="checkbox" name="isPublished" defaultChecked={initial.isPublished} className="h-4 w-4" /><span><span className="block text-sm font-medium">Publish this course</span><span className="text-xs text-muted-foreground">Published courses are visible in the student course catalogue.</span></span></label><SubmitButton loading={loading}>{initial.id ? "Update course" : "Create course"}</SubmitButton></form>;
}
