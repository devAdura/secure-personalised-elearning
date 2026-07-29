import { db } from "@/lib/db";

export async function getStudentRecommendations(userId: string, take = 4) {
  const enrollments = await db.enrollment.findMany({
    where: { userId },
    include: { course: { select: { category: true } } }
  });
  const categories = [...new Set(enrollments.map((item) => item.course.category))];
  const enrolledCourseIds = enrollments.map((item) => item.courseId);

  const preferred = await db.course.findMany({
    where: {
      isPublished: true,
      id: { notIn: enrolledCourseIds },
      ...(enrollments.length >= 2 && categories.length ? { category: { in: categories } } : { level: "Beginner" })
    },
    include: { lecturer: { select: { name: true } }, _count: { select: { enrollments: true } } },
    take,
    orderBy: { createdAt: "desc" }
  });

  if (preferred.length >= take) return preferred;
  const extras = await db.course.findMany({
    where: { isPublished: true, id: { notIn: [...enrolledCourseIds, ...preferred.map((c) => c.id)] } },
    include: { lecturer: { select: { name: true } }, _count: { select: { enrollments: true } } },
    take: take - preferred.length,
    orderBy: { createdAt: "desc" }
  });
  return [...preferred, ...extras];
}

export async function getContinueLearning(userId: string) {
  const activity = await db.learningActivity.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { course: true }
  });
  if (activity) return activity.course;
  const enrollment = await db.enrollment.findFirst({
    where: { userId }, orderBy: { createdAt: "desc" }, include: { course: true }
  });
  return enrollment?.course ?? null;
}
