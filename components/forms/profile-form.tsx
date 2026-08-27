"use client";
import { useRef, useState } from "react";
import { ImagePlus, Trash2, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { Alert } from "@/components/ui/alert";
import { Toast } from "@/components/ui/toast";

// Resizes the chosen image to a 256x256 JPEG data URL entirely in the browser,
// so only a small, sanitised raster payload is ever sent to the server.
function resizeToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read-failed"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("decode-failed"));
      img.onload = () => {
        const size = 256;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("no-canvas"));
        const scale = Math.max(size / img.width, size / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function ProfileForm({ name, email, avatarUrl }: { name: string; email: string; avatarUrl?: string | null }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [avatar, setAvatar] = useState<string | null>(avatarUrl ?? null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
      setMessage({ type: "error", text: "Please choose a PNG, JPEG or WebP image." });
      return;
    }
    try {
      setAvatar(await resizeToDataUrl(file));
      setMessage(null);
    } catch {
      setMessage({ type: "error", text: "That image could not be processed. Please try another file." });
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    const form = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch("/api/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, avatarUrl: avatar ?? "" }) });
    const result = await response.json();
    setLoading(false);
    setMessage(response.ok ? { type: "success", text: "Profile updated successfully." } : { type: "error", text: result.error || "Update failed" });
  }

  return <form onSubmit={submit} className="space-y-4">{message?.type === "success" ? <Toast message={message.text} onClose={() => setMessage(null)} /> : null}{message?.type === "error" ? <Alert variant="error">{message.text}</Alert> : null}
    <div className="space-y-2">
      <Label>Profile photo</Label>
      <div className="flex items-center gap-4">
        <span className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-lg bg-[#eef8f1] text-primary">{avatar ? <img src={avatar} alt="Profile photo preview" className="h-full w-full object-cover" /> : <UserCircle className="h-12 w-12" />}</span>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}><ImagePlus className="h-4 w-4" />{avatar ? "Change photo" : "Upload photo"}</Button>
          {avatar ? <Button type="button" variant="ghost" size="sm" onClick={() => setAvatar(null)}><Trash2 className="h-4 w-4" />Remove</Button> : null}
        </div>
        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={onFile} />
      </div>
      <p className="text-xs text-muted-foreground">PNG, JPEG or WebP. Images are resized to a small square before saving.</p>
    </div>
    <div className="space-y-2"><Label htmlFor="name">Full name</Label><Input id="name" name="name" defaultValue={name} required /></div>
    <div className="space-y-2"><Label>Email address</Label><Input value={email} disabled /><p className="text-xs text-muted-foreground">Email changes are disabled in this prototype to protect credential ownership.</p></div>
    <SubmitButton loading={loading}>Save profile</SubmitButton></form>;
}
