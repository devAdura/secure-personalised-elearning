import { requireUser } from "@/lib/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { CourseForm } from "@/components/forms/course-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export default async function NewCoursePage(){const user=await requireUser(["LECTURER"]);return <DashboardShell user={user}><div className="mx-auto max-w-3xl"><h1 className="text-3xl font-bold">Create a course</h1><p className="mt-2 text-muted-foreground">Start with the course identity, then add materials and assignments.</p><Card className="mt-6"><CardHeader><CardTitle>Course details</CardTitle></CardHeader><CardContent><CourseForm/></CardContent></Card></div></DashboardShell>}
