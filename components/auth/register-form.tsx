"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerSchema } from "@/lib/validators";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { Alert } from "@/components/ui/alert";

type RegisterInput = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "STUDENT" }
  });

  async function submit(data: RegisterInput) {
    setServerError("");
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) return setServerError(result.error || "Registration failed");
    window.location.href = "/passkey-setup?new=1";
  }

  return <form onSubmit={handleSubmit(submit)} className="space-y-4">{serverError ? <Alert variant="error">{serverError}</Alert> : null}<div className="space-y-2"><Label htmlFor="name">Full name</Label><Input id="name" autoComplete="name" placeholder="Your full name" {...register("name")} />{errors.name ? <p className="text-xs text-red-600">{errors.name.message}</p> : null}</div><div className="space-y-2"><Label htmlFor="email">Email address</Label><Input id="email" type="email" autoComplete="email" placeholder="you@example.com" {...register("email")} />{errors.email ? <p className="text-xs text-red-600">{errors.email.message}</p> : null}</div><div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" autoComplete="new-password" {...register("password")} /><p className="text-xs text-muted-foreground">At least 8 characters, one uppercase letter and one number.</p>{errors.password ? <p className="text-xs text-red-600">{errors.password.message}</p> : null}</div><div className="space-y-2"><Label htmlFor="role">Account role</Label><select id="role" className="h-11 w-full rounded-md border bg-background px-3 text-sm" {...register("role")}><option value="STUDENT">Student</option><option value="LECTURER">Lecturer</option></select>{errors.role ? <p className="text-xs text-red-600">{errors.role.message}</p> : null}</div><SubmitButton loading={isSubmitting} className="w-full">Create account</SubmitButton><p className="text-xs text-muted-foreground">Admin accounts are created by database seed or an existing administrator, not public registration.</p></form>;
}
