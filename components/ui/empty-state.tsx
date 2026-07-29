import type { LucideIcon } from "lucide-react";

export function EmptyState({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description: string; action?: React.ReactNode }) {
  return <div className="rounded-lg border border-dashed bg-card p-10 text-center"><Icon className="mx-auto h-10 w-10 text-muted-foreground" /><h3 className="mt-4 font-semibold">{title}</h3><p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>{action ? <div className="mt-5">{action}</div> : null}</div>;
}
