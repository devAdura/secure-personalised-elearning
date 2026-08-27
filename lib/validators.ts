import { z } from "zod";

// User-facing validation messages are written in plain language (no "string",
// no schema jargon) so the errors surfaced by `apiError` read clearly for
// students, lecturers and visitors.

const emailField = z.string().trim().toLowerCase().email("Please enter a valid email address.");

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name (at least 2 characters).").max(80, "Your name is too long (80 characters maximum)."),
  email: emailField,
  password: z
    .string()
    .min(8, "Your password must be at least 8 characters.")
    .max(128, "Your password is too long (128 characters maximum).")
    .regex(/[A-Z]/, "Include at least one uppercase letter.")
    .regex(/[0-9]/, "Include at least one number."),
  role: z.enum(["STUDENT", "LECTURER"])
});

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Please enter your password."),
  redirectTo: z.string().optional()
});

// Profile photos are stored as small base64 image data URLs (no external image
// service). Cap the decoded size and restrict to raster formats — SVG is
// rejected to avoid script-bearing images.
const MAX_AVATAR_BYTES = 300 * 1024;
const avatarField = z
  .string()
  .refine((value) => value === "" || /^data:image\/(png|jpe?g|webp);base64,/.test(value), "Please choose a PNG, JPEG or WebP image.")
  .refine((value) => {
    if (value === "") return true;
    const base64 = value.slice(value.indexOf(",") + 1);
    return Math.floor((base64.length * 3) / 4) <= MAX_AVATAR_BYTES;
  }, "That photo is too large. Please choose an image under 300 KB.")
  .optional();

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name (at least 2 characters).").max(80, "Your name is too long (80 characters maximum)."),
  // Empty string clears the photo; the route converts it to null before saving.
  avatarUrl: avatarField
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name (at least 2 characters).").max(80, "Your name is too long (80 characters maximum)."),
  email: emailField,
  subject: z.string().trim().min(3, "Please add a short subject (at least 3 characters).").max(120, "Your subject is too long (120 characters maximum)."),
  message: z.string().trim().min(10, "Please enter a message of at least 10 characters.").max(2000, "Your message is too long (2000 characters maximum).")
});

export const courseSchema = z.object({
  title: z.string().trim().min(3, "Please enter a course title (at least 3 characters).").max(140, "The title is too long (140 characters maximum)."),
  description: z.string().trim().min(20, "Please write a description of at least 20 characters.").max(4000, "The description is too long (4000 characters maximum)."),
  category: z.string().trim().min(2, "Please enter a category (at least 2 characters).").max(80, "The category is too long (80 characters maximum)."),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  thumbnailUrl: z.union([z.string().url("Enter a valid image link (starting with http:// or https://)."), z.literal("")]).optional(),
  isPublished: z.boolean().optional().default(false)
});

export const materialSchema = z.object({
  title: z.string().trim().min(3, "Please enter a material title (at least 3 characters).").max(140, "The title is too long (140 characters maximum)."),
  content: z.string().trim().min(10, "Please add material content (at least 10 characters).").max(8000, "The content is too long (8000 characters maximum)."),
  fileUrl: z.union([z.string().url("Enter a valid link (starting with http:// or https://)."), z.literal("")]).optional()
});

export const assignmentSchema = z.object({
  title: z.string().trim().min(3, "Please enter an assignment title (at least 3 characters).").max(140, "The title is too long (140 characters maximum)."),
  description: z.string().trim().min(10, "Please add instructions (at least 10 characters).").max(5000, "The instructions are too long (5000 characters maximum)."),
  dueDate: z.coerce.date().refine((date) => date > new Date(), "The due date must be in the future.")
});

export const submissionSchema = z.object({
  content: z.string().trim().min(3, "Please write your response (at least 3 characters).").max(10000, "Your response is too long (10000 characters maximum)."),
  fileUrl: z.union([z.string().url("Enter a valid link (starting with http:// or https://)."), z.literal("")]).optional()
});

export const discussionSchema = z.object({
  content: z.string().trim().min(2, "Please write a message (at least 2 characters).").max(2000, "Your message is too long (2000 characters maximum)."),
  parentId: z.string().cuid().nullable().optional()
});

export const reviewSchema = z.object({
  grade: z.coerce.number({ invalid_type_error: "Please enter a grade." }).min(0, "The grade cannot be below 0.").max(100, "The grade cannot be above 100."),
  feedback: z.string().trim().max(3000, "Your feedback is too long (3000 characters maximum).").optional().default("")
});

// Multi-factor authentication (TOTP) codes are always six digits.
export const mfaCodeSchema = z.object({
  code: z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit code from your authenticator app.")
});

export const mfaVerifySchema = z.object({
  ticket: z.string().min(1, "Your login session expired. Please sign in again."),
  code: z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit code from your authenticator app."),
  redirectTo: z.string().optional()
});
