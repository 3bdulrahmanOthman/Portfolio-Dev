import { z } from "zod";
import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";
import { getFiltersStateParser, getSortingStateParser } from "@/lib/parsers";


export const LoginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address. Email is required.",
  }),
  password: z.string().min(1, {
    message: "Please enter your password. Password is required.",
  }),
});

interface UserData {
  password?: string;
  newPassword?: string;
  newPasswordConfirmation?: string;
}

const passwordRequired = (
  data: UserData,
  passwordField: keyof UserData,
  newPasswordField: keyof UserData,
  newPasswordConfirmationField: keyof UserData = "newPasswordConfirmation"
) => {
  const newPasswordEntered = data[newPasswordField] !== undefined;
  const confirmationEntered = data[newPasswordConfirmationField] !== undefined;

  if (newPasswordEntered && !confirmationEntered) {
    return false;
  }

  return !(
    (data[passwordField] && !data[newPasswordField]) ||
    (data[newPasswordField] && !data[passwordField])
  );
};

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(1)),
    newPassword: z.optional(
      z.string().min(6, {
        message:
          "Please enter a new password with at least 6 characters, required",
      })
    ),
    newPasswordConfirmation: z.optional(
      z.string().min(6, {
        message:
          "Please confirm your password with at least 6 characters, required",
      })
    ),
  })
  .refine((data) => passwordRequired(data, "password", "newPassword"), {
    message:
      "Please enter a new password with at least 6 characters, required!",
    path: ["newPassword"],
  })
  .refine((data) => passwordRequired(data, "newPassword", "password"), {
    message: "Please enter your valid password, required!",
    path: ["password"],
  })
  .refine((data) => data.newPassword === data.newPasswordConfirmation, {
    message: "Passwords do not match.",
    path: ["newPasswordConfirmation"],
  });

export const AboutSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
})

export type About = z.infer<typeof AboutSchema>;

export const ContactSchema = z.object({
  id: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  github: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
  content: z.string().min(1, "Content is required"),
})

export type Contact = z.infer<typeof ContactSchema>;

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

export type Project = z.infer<typeof ProjectSchema>;

export const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<Project>().withDefault([
    { id: "createdAt", desc: true },
  ]),
  title: parseAsString.withDefault(""),
  featured: parseAsArrayOf(z.enum(["featured", "standard"])).withDefault([]),
  createdAt: parseAsArrayOf(z.coerce.number()).withDefault([]),
  filters: getFiltersStateParser().withDefault([]),
});

export type GetProjectSchema = Awaited<
  ReturnType<typeof searchParamsCache.parse>
>;