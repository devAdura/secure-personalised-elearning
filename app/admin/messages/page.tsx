import Link from "next/link";
import { Inbox, Mail } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDateTime } from "@/lib/utils";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

export default async function AdminMessagesPage() {
  const administrator = await requireUser(["ADMIN"]);
  const messages = await db.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 250 });

  return <DashboardShell user={administrator}><div className="space-y-6"><div className="page-heading"><h1>Administrator inbox</h1><p>Review account appeals, support requests, and feedback submitted through SecureLearn.</p></div>{messages.length?<div className="space-y-4">{messages.map((message)=><Card key={message.id}><CardContent className="grid gap-5 p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-start"><div className="min-w-0"><div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><Mail className="h-5 w-5"/></span><div className="min-w-0"><h2 className="font-black text-[#12201c]">{message.subject}</h2><p className="mt-1 text-sm text-muted-foreground">{message.name} · {message.email} · {formatDateTime(message.createdAt)}</p></div></div><p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#405049]">{message.message}</p></div><Link href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`} className={buttonVariants({variant:"outline",size:"sm"})}>Reply by email</Link></CardContent></Card>)}</div>:<div className="empty-premium"><div><span className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-[#eef8f1] text-primary"><Inbox className="h-7 w-7"/></span><h2 className="mt-4 font-black text-[#12201c]">Inbox clear</h2><p className="mt-2 text-sm text-muted-foreground">New support messages and account appeals will appear here.</p></div></div>}</div></DashboardShell>;
}
