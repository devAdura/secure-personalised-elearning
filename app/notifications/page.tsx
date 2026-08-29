import { Bell } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDateTime } from "@/lib/utils";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { NotificationReadButton } from "@/components/forms/notification-read-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default async function NotificationsPage(){const user=await requireUser();const notifications=await db.notification.findMany({where:{userId:user.id},orderBy:{createdAt:"desc"},take:100});return <DashboardShell user={user}><div className="mx-auto max-w-4xl space-y-6"><div className="page-heading"><h1>Notifications</h1><p>Course updates, assignment reminders and security alerts.</p></div>{notifications.length?<div className="space-y-3">{notifications.map(item=><Card key={item.id} className={item.isRead?"opacity-80":"border-primary/30"}><CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start"><span className="rounded-lg bg-primary/10 p-2 text-primary"><Bell className="h-5 w-5"/></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-black text-[#12201c]">{item.title}</h2>{!item.isRead?<Badge>New</Badge>:null}</div><p className="mt-1 text-sm leading-6 text-muted-foreground">{item.message}</p><p className="mt-2 text-xs text-muted-foreground">{formatDateTime(item.createdAt)}</p></div><NotificationReadButton id={item.id} isRead={item.isRead}/></CardContent></Card>)}</div>:<div className="empty-premium"><div><span className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-[#eef8f1] text-primary"><Bell className="h-7 w-7"/></span><h2 className="mt-4 font-black text-[#12201c]">No notifications</h2><p className="mt-2 text-sm text-muted-foreground">New course and security updates will appear here.</p></div></div>}</div></DashboardShell>}
