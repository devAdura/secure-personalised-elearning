import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Alert({ children, variant = "info" }: { children: React.ReactNode; variant?: "info" | "success" | "error" }) {
  const styles = {
    info: "border-sky-200 bg-sky-50/90 text-sky-900",
    success: "border-emerald-200 bg-emerald-50/90 text-emerald-900",
    error: "border-red-200 bg-red-50/90 text-red-900"
  };
  const Icon = variant === "success" ? CheckCircle2 : AlertCircle;
  return <div role="alert" className={cn("flex gap-3 rounded-lg border p-4 text-sm leading-6 shadow-sm", styles[variant])}><Icon className="mt-0.5 h-4 w-4 shrink-0" /> <div>{children}</div></div>;
}
