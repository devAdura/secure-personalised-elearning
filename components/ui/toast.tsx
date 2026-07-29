"use client";
import { CheckCircle2, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function Toast({ message, type = "success", onClose }: { message: string; type?: "success" | "error"; onClose?: () => void }) {
  const Icon = type === "success" ? CheckCircle2 : XCircle;
  return <div role="status" aria-live="polite" className={cn("fixed bottom-5 right-5 z-50 flex max-w-sm items-start gap-3 rounded-lg border bg-white p-4 shadow-soft", type === "success" ? "border-emerald-200" : "border-red-200")}><Icon className={cn("mt-0.5 h-5 w-5 shrink-0", type === "success" ? "text-emerald-600" : "text-red-600")} /><p className="flex-1 text-sm font-medium">{message}</p>{onClose ? <button type="button" onClick={onClose} aria-label="Close notification"><X className="h-4 w-4 text-muted-foreground" /></button> : null}</div>;
}
