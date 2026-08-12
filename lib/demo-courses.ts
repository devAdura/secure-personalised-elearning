import { isRuntimeDatabaseConfigured } from "@/lib/database-health";

export type DemoCourse = {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  lecturerId: string;
  thumbnailUrl: string | null;
  isPublished: boolean;
  lecturer: { name: string };
  _count: { enrollments: number; materials: number; assignments: number };
};

export const demoCourses: DemoCourse[] = [
  {
    id: "demo-biometric-assurance",
    title: "Biometric Assurance for Collaborative Learning",
    description:
      "Use passkeys, liveness checks, consent controls, and tamper-evident audit signals to protect high-risk learning actions without storing raw fingerprints.",
    category: "Cybersecurity",
    level: "Intermediate",
    lecturerId: "demo-lecturer-grace",
    thumbnailUrl: null,
    isPublished: true,
    lecturer: { name: "Dr Grace Okafor" },
    _count: { enrollments: 128, materials: 6, assignments: 3 }
  },
  {
    id: "demo-secure-web-apps",
    title: "Secure Web Application Development",
    description:
      "Build full-stack learning tools with validated server APIs, role-aware access control, relational data modeling, and secure deployment defaults.",
    category: "Software Development",
    level: "Intermediate",
    lecturerId: "demo-lecturer-david",
    thumbnailUrl: null,
    isPublished: true,
    lecturer: { name: "Mr David Bello" },
    _count: { enrollments: 94, materials: 5, assignments: 2 }
  },
  {
    id: "demo-data-privacy",
    title: "Data Privacy and Learning Analytics",
    description:
      "Explore privacy-preserving personalization, cohort-level insight, retention windows, and transparent analytics for student support.",
    category: "Data Science",
    level: "Beginner",
    lecturerId: "demo-lecturer-amina",
    thumbnailUrl: null,
    isPublished: true,
    lecturer: { name: "Dr Amina Yusuf" },
    _count: { enrollments: 76, materials: 4, assignments: 2 }
  },
  {
    id: "demo-network-defence",
    title: "Advanced Network Defence",
    description:
      "Practice incident response, defence-in-depth planning, network monitoring, and evidence-led security reporting for institutional systems.",
    category: "Cybersecurity",
    level: "Advanced",
    lecturerId: "demo-lecturer-grace",
    thumbnailUrl: null,
    isPublished: true,
    lecturer: { name: "Dr Grace Okafor" },
    _count: { enrollments: 51, materials: 7, assignments: 4 }
  }
];

export function getDemoCourses(filters: { q?: string; category?: string; level?: string } = {}) {
  const query = filters.q?.trim().toLowerCase();

  return demoCourses.filter((course) => {
    const matchesQuery = query
      ? course.title.toLowerCase().includes(query) || course.description.toLowerCase().includes(query)
      : true;
    const matchesCategory = filters.category ? course.category === filters.category : true;
    const matchesLevel = filters.level ? course.level === filters.level : true;

    return matchesQuery && matchesCategory && matchesLevel;
  });
}

export function getDemoCourseCategories() {
  return [...new Set(demoCourses.map((course) => course.category))]
    .sort((left, right) => left.localeCompare(right))
    .map((category) => ({ category }));
}

export function getDemoCourseById(id: string) {
  return demoCourses.find((course) => course.id === id) ?? null;
}

export { isPrismaConnectionError, isRuntimeDatabaseConfigured } from "@/lib/database-health";

export function isSupabaseDatabaseConfigured() {
  return isRuntimeDatabaseConfigured();
}
