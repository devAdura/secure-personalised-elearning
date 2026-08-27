"use client";
import { useState } from "react";
import { Bell, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Toast } from "@/components/ui/toast";

// Client-side notification row. Read state is held locally and updated
// optimistically so marking-as-read reveals an "Undo" toast that survives
// (a full page refresh would unmount the toast before it could be used).
export function NotificationItem({ id, title, message, createdAtLabel, isRead }: { id: string; title: string; message: string; createdAtLabel: string; isRead: boolean }) {
  const [read, setRead] = useState(isRead);
  const [busy, setBusy] = useState(false);
  const [showUndo, setShowUndo] = useState(false);

  async function update(next: boolean, offerUndo: boolean) {
    setBusy(true);
    setRead(next);
    try {
      const res = await fetch(`/api/notifications/${id}/read`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ read: next }) });
      if (!res.ok) throw new Error();
      setShowUndo(offerUndo);
    } catch {
      setRead(!next);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className={read ? "opacity-70" : "border-primary/30"}>
      <CardContent className="flex items-start gap-4 p-5">
        <span className="rounded-lg bg-primary/10 p-2 text-primary"><Bell className="h-5 w-5" /></span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2"><h2 className="font-black text-[#12201c]">{title}</h2>{!read ? <Badge>New</Badge> : null}</div>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{message}</p>
          <p className="mt-2 text-xs text-muted-foreground">{createdAtLabel}</p>
        </div>
        {!read ? <Button variant="ghost" size="sm" disabled={busy} onClick={() => update(true, true)}><Check className="h-4 w-4" />Mark read</Button> : null}
      </CardContent>
      {showUndo ? <Toast message="Notification marked as read." action={{ label: "Undo", onClick: () => { setShowUndo(false); update(false, false); } }} onClose={() => setShowUndo(false)} /> : null}
    </Card>
  );
}
