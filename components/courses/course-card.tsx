import Link from "next/link";
import { BookOpen, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export type CourseListItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  thumbnailUrl?: string | null;
  lecturer: { name: string };
  _count?: { enrollments: number };
};

type CourseCardProps = {
  course: CourseListItem;
};

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="group overflow-hidden hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_26px_70px_rgba(18,32,28,0.13)]">
      <div className="relative grid h-40 place-items-center overflow-hidden bg-[linear-gradient(135deg,#12201c,#176b58_54%,#e0a140)]">
        <div className="absolute inset-0 opacity-35 [background:repeating-radial-gradient(ellipse_at_center,transparent_0_12px,rgba(255,255,255,.35)_13px_15px)]" />
        {course.thumbnailUrl ? <img src={course.thumbnailUrl} alt={`${course.title} thumbnail`} className="relative z-10 h-full w-full object-cover" /> : <BookOpen className="relative z-10 h-12 w-12 text-white/78" />}
        <span className="absolute bottom-3 left-3 z-10 rounded-full border border-white/18 bg-white/14 px-3 py-1 text-xs font-black text-white backdrop-blur-md">
          {course.level}
        </span>
      </div>
      <CardContent className="p-5">
        <div className="flex flex-wrap gap-2">
          <Badge>{course.category}</Badge>
        </div>
        <h3 className="mt-3 line-clamp-1 text-lg font-black text-[#12201c]">{course.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{course.description}</p>
        <div className="mt-4 flex items-center justify-between gap-3 text-xs font-bold text-muted-foreground">
          <span className="truncate">{course.lecturer.name}</span>
          {course._count ? <span className="flex shrink-0 items-center gap-1"><Users className="h-3.5 w-3.5" />{course._count.enrollments}</span> : null}
        </div>
        <Link href={`/courses/${course.id}`} className={buttonVariants({ className: "mt-5 w-full" })}>Open Course</Link>
      </CardContent>
    </Card>
  );
}
