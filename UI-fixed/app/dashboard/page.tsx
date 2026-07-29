import { redirect } from "next/navigation";
import { requireUser, dashboardPath } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await requireUser();
  redirect(dashboardPath(user.role));
}
