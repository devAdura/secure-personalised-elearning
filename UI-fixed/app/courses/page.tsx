import type { Metadata } from "next";
import { Search } from "lucide-react";
import { db } from "@/lib/db";
import { getDemoCourseCategories, getDemoCourses, isPrismaConnectionError, isSupabaseDatabaseConfigured } from "@/lib/demo-courses";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CourseCard, type CourseListItem } from "@/components/courses/course-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Alert } from "@/components/ui/alert";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = { title: "Courses", description: "Browse secure collaborative e-learning courses." };

export default async function CoursesPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; level?: string }> }) {
  const filters = await searchParams;
  const q = filters.q || "";
  const category = filters.category || "";
  const level = filters.level || "";
  let isDemoMode = false;
  let courses: CourseListItem[];
  let categories: { category: string }[];

  if (!isSupabaseDatabaseConfigured()) {
    isDemoMode = true;
    courses = getDemoCourses({ q, category, level });
    categories = getDemoCourseCategories();
  } else {
  try {
    [courses, categories] = await Promise.all([
      db.course.findMany({
        where: {
          isPublished: true,
          ...(q ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }] } : {}),
          ...(category ? { category } : {}),
          ...(level ? { level } : {})
        },
        include: { lecturer: { select: { name: true } }, _count: { select: { enrollments: true } } },
        orderBy: { createdAt: "desc" }
      }),
      db.course.findMany({ where: { isPublished: true }, distinct: ["category"], select: { category: true }, orderBy: { category: "asc" } })
    ]);
  } catch (error) {
    if (!isPrismaConnectionError(error)) throw error;
    isDemoMode = true;
    courses = getDemoCourses({ q, category, level });
    categories = getDemoCourseCategories();
  }
  }

  return <><SiteHeader/><main className="min-h-[70vh]"><section className="gradient-hero py-14"><div className="page-container"><p className="font-semibold text-primary">Course catalogue</p><h1 className="mt-2 text-4xl font-bold">Find your next course</h1><p className="mt-3 max-w-2xl text-muted-foreground">Browse published courses, then log in as a student to enrol and access materials, assignments and discussions.</p>{isDemoMode?<div className="mt-5 max-w-3xl"><Alert><strong>Demo catalogue active.</strong> Supabase is not reachable, so SecureLearn is showing offline sample courses. Reactivate the Supabase project, set `DATABASE_URL` and `DIRECT_URL`, then run the migrations and seed script to use live course records.</Alert></div>:null}<form className="mt-7 grid max-w-4xl gap-3 rounded-xl border bg-white p-3 shadow-sm md:grid-cols-[1fr_190px_170px_auto]"><label className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/><input name="q" defaultValue={q} className="h-10 w-full rounded-md border pl-9 pr-3 text-sm" placeholder="Search courses"/></label><select name="category" defaultValue={category} className="h-10 rounded-md border px-3 text-sm"><option value="">All categories</option>{categories.map((c)=><option key={c.category} value={c.category}>{c.category}</option>)}</select><select name="level" defaultValue={level} className="h-10 rounded-md border px-3 text-sm"><option value="">All levels</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select><button className="h-10 rounded-md bg-primary px-5 text-sm font-semibold text-white">Filter</button></form></div></section><section className="page-container py-10">{courses.length?<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{courses.map((course)=><CourseCard key={course.id} course={course}/>)}</div>:<EmptyState icon={BookOpen} title="No matching courses" description="Try a broader keyword or remove one of the filters."/>}</section></main><SiteFooter/></>;
}
