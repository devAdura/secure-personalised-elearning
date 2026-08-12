import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, CalendarClock, Download, FileText, Fingerprint, LockKeyhole, MessagesSquare, ShieldCheck, Users } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getDemoCourseById, isPrismaConnectionError, isRuntimeDatabaseConfigured, type DemoCourse } from "@/lib/demo-courses";
import { canAccessCourse } from "@/lib/permissions";
import { formatDate } from "@/lib/utils";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { EnrolButton } from "@/components/courses/enrol-button";
import { ActivityTracker } from "@/components/courses/activity-tracker";
import { DiscussionBoard } from "@/components/courses/discussion-board";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

type CourseSummary = DemoCourse;

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  let isDemoMode = false;
  let summary: CourseSummary | null = null;

  if (!isRuntimeDatabaseConfigured()) {
    summary = getDemoCourseById(id);
    isDemoMode = Boolean(summary);
  } else {
  try {
    summary = await db.course.findUnique({
      where: { id },
      include: {
        lecturer: { select: { name: true } },
        _count: { select: { enrollments: true, materials: true, assignments: true } }
      }
    });
  } catch (error) {
    if (!isPrismaConnectionError(error)) throw error;
    summary = getDemoCourseById(id);
    isDemoMode = Boolean(summary);
  }
  }

  if (!summary || (!summary.isPublished && user?.role !== "ADMIN" && summary.lecturerId !== user?.id)) notFound();

  let hasAccess = false;
  if (!isDemoMode && user) {
    try {
      hasAccess = await canAccessCourse(user.id, user.role, id);
    } catch (error) {
      if (!isPrismaConnectionError(error)) throw error;
    }
  }

  const course =
    !isDemoMode && hasAccess
      ? await db.course.findUnique({
          where: { id },
          include: {
            materials: { orderBy: { createdAt: "desc" } },
            assignments: {
              orderBy: { dueDate: "asc" },
              include: { submissions: user?.role === "STUDENT" ? { where: { studentId: user.id } } : false }
            },
            discussions: {
              where: { parentId: null },
              orderBy: { createdAt: "desc" },
              include: {
                author: { select: { name: true, role: true } },
                replies: {
                  orderBy: { createdAt: "asc" },
                  include: { author: { select: { name: true, role: true } }, replies: { include: { author: { select: { name: true, role: true } } } } }
                }
              }
            }
          }
        })
      : null;
  const studentNotEnrolled = !isDemoMode && user?.role === "STUDENT" && !hasAccess;

  return (
    <>
      <SiteHeader />
      <main className="min-h-[70vh]">
        <section className="route-hero">
          <div className="page-container route-hero-grid">
            <div className="route-copy">
              <div className="flex flex-wrap gap-2">
                <Badge>{summary.category}</Badge>
                <Badge variant="outline">{summary.level}</Badge>
                {summary.isPublished ? <Badge variant="success">Published</Badge> : <Badge variant="warning">Draft</Badge>}
              </div>
              <h1 className="mt-5">{summary.title}</h1>
              <p>{summary.description}</p>
              {isDemoMode ? (
                <div className="mt-5 max-w-3xl">
                  <Alert><strong>Demo course preview.</strong> Live course records are unavailable because Supabase is not reachable. Reactivate the Supabase project and apply the migrations to enrol, unlock materials, and join discussions.</Alert>
                </div>
              ) : null}
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="rounded-full border border-[#d8e5de] bg-white/78 px-3 py-2 font-bold"><Users className="mr-2 inline h-4 w-4 text-primary" />{summary._count.enrollments} students</span>
                <span className="rounded-full border border-[#d8e5de] bg-white/78 px-3 py-2 font-bold"><BookOpen className="mr-2 inline h-4 w-4 text-primary" />{summary._count.materials} materials</span>
                <span className="rounded-full border border-[#d8e5de] bg-white/78 px-3 py-2 font-bold"><FileText className="mr-2 inline h-4 w-4 text-primary" />{summary._count.assignments} assignments</span>
              </div>
              <p className="mt-4 text-sm font-bold text-muted-foreground">Lecturer: {summary.lecturer.name}</p>
              <div className="route-actions">
                {studentNotEnrolled ? <EnrolButton courseId={id} /> : !isDemoMode && !user ? <Link href={`/login?redirectTo=/courses/${id}`} className={buttonVariants()}>Login to enrol</Link> : null}
              </div>
            </div>
            <aside className="hero-terminal premium-card">
              <div className="terminal-row"><span>Access model</span><strong>{hasAccess ? "Unlocked" : "Protected"}</strong></div>
              <div className="terminal-row"><span>Identity proof</span><strong>{user ? "Session verified" : "Login required"}</strong></div>
              <div className="terminal-row"><span>Course source</span><strong>{isDemoMode ? "Demo preview" : "Supabase"}</strong></div>
              <div className="absolute bottom-4 left-4 right-4 z-10 rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                <Fingerprint className="h-7 w-7 text-[#b7f0dc]" />
                <p className="mt-3 text-sm font-bold leading-6 text-white/75">Learning materials, assignments, and discussions stay behind an enrolment and role check.</p>
              </div>
            </aside>
          </div>
        </section>
        {hasAccess && course && user ? (
          <section className="page-container py-10">
            <ActivityTracker courseId={id} />
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" />Learning materials</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {course.materials.length ? course.materials.map((material) => (
                      <article key={material.id} className="record-item p-4">
                        <h3 className="font-black text-[#12201c]">{material.title}</h3>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{material.content}</p>
                        {material.fileUrl ? <a href={material.fileUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-black text-primary"><Download className="h-4 w-4" />Open resource</a> : null}
                      </article>
                    )) : <p className="text-sm text-muted-foreground">No materials have been added yet.</p>}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><MessagesSquare className="h-5 w-5 text-primary" />Course discussion</CardTitle>
                  </CardHeader>
                  <CardContent><DiscussionBoard courseId={id} currentUserId={user.id} canModerate={user.role === "ADMIN" || summary.lecturerId === user.id} posts={course.discussions as never} /></CardContent>
                </Card>
              </div>
              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Assignments</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {course.assignments.length ? course.assignments.map((assignment) => (
                      <div key={assignment.id} className="record-item p-4">
                        <h3 className="font-black text-[#12201c]">{assignment.title}</h3>
                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{assignment.description}</p>
                        <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><CalendarClock className="h-4 w-4" />Due {formatDate(assignment.dueDate)}</p>
                        {user.role === "STUDENT" ? <Link href={`/courses/${id}/submit/${assignment.id}`} className={buttonVariants({ size: "sm", variant: assignment.submissions?.length ? "outline" : "default", className: "mt-4 w-full" })}>{assignment.submissions?.length ? "View or update submission" : "Submit assignment"}</Link> : null}
                      </div>
                    )) : <p className="text-sm text-muted-foreground">No assignments yet.</p>}
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        ) : (
          <section className="page-container py-12">
            <Card className="mx-auto max-w-2xl">
              <CardContent className="p-8 text-center">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-lg bg-[#eef8f1] text-primary">
                  <LockKeyhole className="h-8 w-8" />
                </span>
                <h2 className="mt-5 text-2xl font-black text-[#12201c]">Course content is protected</h2>
                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                  {isDemoMode ? "This sample course is available for browsing while Supabase is offline. Connect Supabase to enrol and open live materials, assignments and discussions." : "Students must enrol before viewing materials, assignments and discussions. Course lecturers and administrators have authorised access."}
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <Badge variant="outline"><ShieldCheck className="mr-1 h-3.5 w-3.5" />Role checked</Badge>
                  <Badge variant="outline"><Fingerprint className="mr-1 h-3.5 w-3.5" />Passkey ready</Badge>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
