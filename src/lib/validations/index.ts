import * as z from "zod";

export const userSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  role_id: z.string().uuid("Invalid role ID"),
  is_active: z.boolean().default(true),
});

export const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  description: z.string().min(10, "Description is required"),
  status: z.enum(["Active", "Completed", "Upcoming"]),
  budget: z.string().optional(),
  is_featured: z.boolean().default(false),
});

export const programSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  description: z.string().min(10, "Description is required"),
  category: z.string().optional(),
});

export const newsEventSchema = z.object({
  title: z.string().min(3, "Title is required"),
  slug: z.string().min(3, "Slug is required"),
  type: z.enum(["News", "Event", "Notice", "Tender"]),
  content: z.string().min(10, "Content is required"),
  excerpt: z.string().optional(),
  event_location: z.string().optional(),
  is_published: z.boolean().default(true),
});

export const reportSchema = z.object({
  title: z.string().min(3, "Title is required"),
  category: z.enum(["Annual Report", "Audit Report", "Publication", "General"]),
  published_year: z.coerce.number().min(2000).max(2100),
  file_url: z.string().url("Valid URL is required"),
});

export const genericSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
});
