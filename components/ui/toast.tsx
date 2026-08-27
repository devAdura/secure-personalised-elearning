"use client";
import { CheckCircle2, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function Toast({ message, type = "success", action, onClose }: { message: string; type?: "success" | "error"; action?: { label: string; onClick: () => void }; onClose?: () => void }) {
  const Icon = type === "success" ? CheckCircle2 : XCircle;
  return <div role="status" aria-live="polite" className={cn("fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-3 rounded-lg border bg-white p-4 shadow-soft", type === "success" ? "border-emerald-200" : "border-red-200")}><Icon className={cn("h-5 w-5 shrink-0", type === "success" ? "text-emerald-600" : "text-red-600")} /><p className="flex-1 text-sm font-medium">{message}</p>{action ? <button type="button" onClick={action.onClick} className="shrink-0 text-sm font-black text-primary hover:underline">{action.label}</button> : null}{onClose ? <button type="button" onClick={onClose} aria-label="Close notification"><X className="h-4 w-4 text-muted-foreground" /></button> : null}</div>;
}
