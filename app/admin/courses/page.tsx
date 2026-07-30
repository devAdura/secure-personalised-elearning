import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DeleteCourseButton } from "@/components/forms/delete-course-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminCoursesPage(){const admin=await requireUser(["ADMIN"]);const courses=await db.course.findMany({include:{lecturer:{select:{name:true,email:true}},_count:{select:{enrollments:true,assignments:true,materials:true}}},orderBy:{createdAt:"desc"}});return <DashboardShell user={admin}><div className="space-y-6"><div className="page-heading"><h1>Course management</h1><p>Review all courses and remove inappropriate platform content.</p></div><div className="space-y-4">{courses.map(course=><Card key={course.id} className="hover:-translate-y-0.5 hover:border-primary/25"><CardContent className="flex flex-col justify-between gap-5 p-6 lg:flex-row lg:items-center"><div><div className="flex flex-wrap gap-2"><Badge>{course.category}</Badge><Badge variant={course.isPublished?"success":"warning"}>{course.isPublished?"Published":"Draft"}</Badge></div><Link href={`/courses/${course.id}`} className="mt-3 block text-xl font-black text-[#12201c] hover:text-primary">{course.title}</Link><p className="mt-1 text-sm text-muted-foreground">Lecturer: {course.lecturer.name} ({course.lecturer.email})</p><p className="mt-2 text-xs text-muted-foreground">{course._count.enrollments} students - {course._count.materials} materials - {course._count.assignments} assignments - Created {formatDate(course.createdAt)}</p></div><DeleteCourseButton courseId={course.id} endpoint={`/api/admin/courses/${course.id}`} redirectTo="/admin/courses"/></CardContent></Card>)}{!courses.length?<div className="empty-premium">No courses found.</div>:null}</div></div></DashboardShell>}
