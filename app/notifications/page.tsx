import { Bell } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDateTime } from "@/lib/utils";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { NotificationItem } from "@/components/forms/notification-item";

export default async function NotificationsPage(){const user=await requireUser();const notifications=await db.notification.findMany({where:{userId:user.id},orderBy:{createdAt:"desc"},take:100});return <DashboardShell user={user}><div className="mx-auto max-w-4xl space-y-6"><div className="page-heading"><h1>Notifications</h1><p>Course updates, assignment reminders and security alerts.</p></div>{notifications.length?<div className="space-y-3">{notifications.map(item=><NotificationItem key={item.id} id={item.id} title={item.title} message={item.message} createdAtLabel={formatDateTime(item.createdAt)} isRead={item.isRead}/>)}</div>:<div className="empty-premium"><div><span className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-[#eef8f1] text-primary"><Bell className="h-7 w-7"/></span><h2 className="mt-4 font-black text-[#12201c]">No notifications</h2><p className="mt-2 text-sm text-muted-foreground">New course and security updates will appear here.</p></div></div>}</div></DashboardShell>}
