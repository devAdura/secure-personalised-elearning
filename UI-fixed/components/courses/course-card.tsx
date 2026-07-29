import Link from "next/link";
import { BookOpen, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

type CourseCardProps = {
  course: {
    id: string;
    title: string;
    description: string;
    category: string;
    level: string;
    thumbnailUrl?: string | null;
    lecturer: { name: string };
    _count?: { enrollments: number };
  };
};

export function CourseCard({ course }: CourseCardProps) {
  return <Card className="overflow-hidden transition hover:-translate-y-0.5 hover:shadow-soft"><div className="grid h-36 place-items-center bg-gradient-to-br from-blue-100 via-slate-50 to-emerald-100">{course.thumbnailUrl ? <img src={course.thumbnailUrl} alt={`${course.title} thumbnail`} className="h-full w-full object-cover" /> : <BookOpen className="h-12 w-12 text-primary/50" />}</div><CardContent className="p-5"><div className="flex flex-wrap gap-2"><Badge>{course.category}</Badge><Badge variant="outline">{course.level}</Badge></div><h3 className="mt-3 line-clamp-1 text-lg font-semibold">{course.title}</h3><p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{course.description}</p><div className="mt-4 flex items-center justify-between text-xs text-muted-foreground"><span>{course.lecturer.name}</span>{course._count ? <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{course._count.enrollments}</span> : null}</div><Link href={`/courses/${course.id}`} className={buttonVariants({ className: "mt-5 w-full" })}>Open Course</Link></CardContent></Card>;
}
