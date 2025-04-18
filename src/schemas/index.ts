import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address. Email is required.",
  }),
  password: z.string().min(1, {
    message: "Please enter your password. Password is required.",
  }),
});


export const AboutSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
})

export const ContactSchema = z.object({
  id: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  github: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
  content: z.string().min(1, "Content is required"),
})

export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  content: z.string().min(1, "Content is required"),
  image: z.string().nullable(),
  demoUrl: z.string().url().nullable(),
  githubUrl: z.string().url().nullable(),
  featured: z.boolean(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
