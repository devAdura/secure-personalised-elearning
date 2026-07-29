import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function StatCard({ label, value, icon: Icon, note }: { label: string; value: number | string; icon: LucideIcon; note?: string }) {
  return <Card><CardContent className="flex items-start justify-between p-5"><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p>{note ? <p className="mt-1 text-xs text-muted-foreground">{note}</p> : null}</div><span className="rounded-lg bg-primary/10 p-3 text-primary"><Icon className="h-5 w-5" /></span></CardContent></Card>;
}
