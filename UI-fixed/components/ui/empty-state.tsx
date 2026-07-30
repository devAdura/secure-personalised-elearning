import type { LucideIcon } from "lucide-react";

export function EmptyState({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description: string; action?: React.ReactNode }) {
  return <div className="empty-premium"><div><span className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-[#eef8f1] text-primary"><Icon className="h-7 w-7" /></span><h3 className="mt-4 text-lg font-black text-[#12201c]">{title}</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>{action ? <div className="mt-5">{action}</div> : null}</div></div>;
}
