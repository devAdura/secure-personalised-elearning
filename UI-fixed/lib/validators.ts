import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(128).regex(/[A-Z]/, "Include an uppercase letter").regex(/[0-9]/, "Include a number"),
  role: z.enum(["STUDENT", "LECTURER"])
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
  redirectTo: z.string().optional()
});

export const profileSchema = z.object({ name: z.string().trim().min(2).max(80) });

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email(),
  subject: z.string().trim().min(3).max(120),
  message: z.string().trim().min(10).max(2000)
});

export const courseSchema = z.object({
  title: z.string().trim().min(3).max(140),
  description: z.string().trim().min(20).max(4000),
  category: z.string().trim().min(2).max(80),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  thumbnailUrl: z.union([z.string().url(), z.literal("")]).optional(),
  isPublished: z.boolean().optional().default(false)
});

export const materialSchema = z.object({
  title: z.string().trim().min(3).max(140),
  content: z.string().trim().min(10).max(8000),
  fileUrl: z.union([z.string().url(), z.literal("")]).optional()
});

export const assignmentSchema = z.object({
  title: z.string().trim().min(3).max(140),
  description: z.string().trim().min(10).max(5000),
  dueDate: z.coerce.date().refine((date) => date > new Date(), "Due date must be in the future")
});

export const submissionSchema = z.object({
  content: z.string().trim().min(3).max(10000),
  fileUrl: z.union([z.string().url(), z.literal("")]).optional()
});

export const discussionSchema = z.object({
  content: z.string().trim().min(2).max(2000),
  parentId: z.string().cuid().nullable().optional()
});

export const reviewSchema = z.object({
  grade: z.coerce.number().min(0).max(100),
  feedback: z.string().trim().max(3000).optional().default("")
});
