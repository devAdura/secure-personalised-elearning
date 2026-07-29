import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function StatCard({ label, value, icon: Icon, note }: { label: string; value: number | string; icon: LucideIcon; note?: string }) {
  return (
    <Card className="border-white/80 bg-white/90 shadow-[0_18px_50px_rgba(18,32,28,0.08)]">
      <CardContent className="flex min-h-36 items-start justify-between gap-4 p-5">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#176b58]">{label}</p>
          <p className="mt-3 text-4xl font-black leading-none text-[#12201c]">{value}</p>
          {note ? <p className="mt-2 text-xs text-[#68766e]">{note}</p> : null}
        </div>
        <span className="grid h-11 w-11 place-items-center rounded-md bg-[#eef8f1] text-[#176b58]">
          <Icon className="h-5 w-5" />
        </span>
      </CardContent>
    </Card>
  );
}
