import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Alert({ children, variant = "info" }: { children: React.ReactNode; variant?: "info" | "success" | "error" }) {
  const styles = {
    info: "border-blue-200 bg-blue-50 text-blue-800",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    error: "border-red-200 bg-red-50 text-red-800"
  };
  const Icon = variant === "success" ? CheckCircle2 : AlertCircle;
  return <div role="alert" className={cn("flex gap-3 rounded-lg border p-3 text-sm", styles[variant])}><Icon className="mt-0.5 h-4 w-4 shrink-0" /> <div>{children}</div></div>;
}
