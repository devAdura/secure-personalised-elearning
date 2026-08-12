import type { Metadata } from "next";
import { BookOpen, Database, Search, ShieldCheck, Users } from "lucide-react";
import { db } from "@/lib/db";
import { getDemoCourseCategories, getDemoCourses, isPrismaConnectionError, isRuntimeDatabaseConfigured } from "@/lib/demo-courses";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CourseCard, type CourseListItem } from "@/components/courses/course-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Alert } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = { title: "Courses", description: "Browse secure collaborative e-learning courses." };

export default async function CoursesPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; level?: string }> }) {
  const filters = await searchParams;
  const q = filters.q || "";
  const category = filters.category || "";
  const level = filters.level || "";
  let isDemoMode = false;
  let courses: CourseListItem[];
  let categories: { category: string }[];

  if (!isRuntimeDatabaseConfigured()) {
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

  return <><SiteHeader/><main className="min-h-[70vh]"><section className="route-hero"><div className="page-container route-hero-grid"><div className="route-copy"><p className="kicker">Course catalogue</p><h1>Find the right secured learning path.</h1><p>Browse published courses, compare learning levels, then sign in as a student to enrol, access materials, submit assignments, and join course discussions.</p>{isDemoMode?<div className="mt-5 max-w-3xl"><Alert><strong>Demo catalogue active.</strong> Supabase is not reachable, so SecureLearn is showing offline sample courses. Reactivate the Supabase project, set `DATABASE_URL` and `DIRECT_URL`, then run the migrations and seed script to use live course records.</Alert></div>:null}<form className="filter-shell mt-7"><label className="input-shell"><Search/><input name="q" defaultValue={q} className="select-control pl-9" placeholder="Search courses"/></label><select name="category" defaultValue={category} className="select-control"><option value="">All categories</option>{categories.map((c)=><option key={c.category} value={c.category}>{c.category}</option>)}</select><select name="level" defaultValue={level} className="select-control"><option value="">All levels</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select><button className={buttonVariants()}>Filter</button></form></div><aside className="hero-terminal premium-card"><div className="terminal-row"><span>Catalogue state</span><strong>{isDemoMode?"Demo records":"Supabase live"}</strong></div><div className="terminal-row"><span>Visible courses</span><strong>{courses.length}</strong></div><div className="terminal-row"><span>Filters active</span><strong>{[q,category,level].filter(Boolean).length}</strong></div><div className="absolute bottom-4 left-4 right-4 z-10 grid gap-3 sm:grid-cols-3"><div className="rounded-lg border border-white/15 bg-white/10 p-3 backdrop-blur-md"><ShieldCheck className="h-5 w-5 text-[#b7f0dc]"/><p className="mt-2 text-xs font-bold text-white/75">Protected content</p></div><div className="rounded-lg border border-white/15 bg-white/10 p-3 backdrop-blur-md"><Users className="h-5 w-5 text-[#f5cb78]"/><p className="mt-2 text-xs font-bold text-white/75">Collaborative flow</p></div><div className="rounded-lg border border-white/15 bg-white/10 p-3 backdrop-blur-md"><Database className="h-5 w-5 text-white"/><p className="mt-2 text-xs font-bold text-white/75">Live-ready data</p></div></div></aside></div></section><section className="page-container py-10">{courses.length?<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{courses.map((course)=><CourseCard key={course.id} course={course}/>)}</div>:<EmptyState icon={BookOpen} title="No matching courses" description="Try a broader keyword or remove one of the filters."/>}</section></main><SiteFooter/></>;
}
