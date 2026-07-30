import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, variant = "default", ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "success" | "warning" | "outline" | "danger" }) {
  const styles = {
    default: "border-primary/15 bg-primary/10 text-primary",
    success: "border-emerald-600/10 bg-emerald-100 text-emerald-800",
    warning: "border-amber-600/10 bg-amber-100 text-amber-800",
    outline: "border-[#d8e5de] bg-white/70 text-[#53625b]",
    danger: "border-red-600/10 bg-red-100 text-red-800"
  };
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-black", styles[variant], className)} {...props} />;
}
