import { Bell } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDateTime } from "@/lib/utils";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { NotificationReadButton } from "@/components/forms/notification-read-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default async function NotificationsPage(){const user=await requireUser();const notifications=await db.notification.findMany({where:{userId:user.id},orderBy:{createdAt:"desc"},take:100});return <DashboardShell user={user}><div className="mx-auto max-w-4xl space-y-6"><div><h1 className="text-3xl font-bold">Notifications</h1><p className="mt-2 text-muted-foreground">Course updates, assignment reminders and security alerts.</p></div>{notifications.length?<div className="space-y-3">{notifications.map(item=><Card key={item.id} className={item.isRead?"opacity-70":"border-primary/30"}><CardContent className="flex items-start gap-4 p-5"><span className="rounded-full bg-primary/10 p-2 text-primary"><Bell className="h-5 w-5"/></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold">{item.title}</h2>{!item.isRead?<Badge>New</Badge>:null}</div><p className="mt-1 text-sm text-muted-foreground">{item.message}</p><p className="mt-2 text-xs text-muted-foreground">{formatDateTime(item.createdAt)}</p></div>{!item.isRead?<NotificationReadButton id={item.id}/>:null}</CardContent></Card>)}</div>:<div className="rounded-lg border border-dashed p-12 text-center"><Bell className="mx-auto h-10 w-10 text-muted-foreground"/><h2 className="mt-4 font-semibold">No notifications</h2><p className="mt-2 text-sm text-muted-foreground">New course and security updates will appear here.</p></div>}</div></DashboardShell>}
