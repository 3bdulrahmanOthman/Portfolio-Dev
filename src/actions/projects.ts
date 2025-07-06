"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "../lib/db/prisma";
import { revalidatePath } from "next/cache";
import { createSafeAction, type ActionState } from "@/lib/utils";
import { Category, GetProjectSchema, Project, ProjectSchema } from "@/schemas";
import { auth } from "@/auth";
import { unstable_cache } from "next/cache";
import { format, subMonths } from "date-fns";

type ProjectOutput = ActionState<Project, { success: boolean }>;

export async function getProjects(input: GetProjectSchema) {
  return await unstable_cache(
    async () => {
      try {
        const offset = (input.page - 1) * input.perPage;

        const where: Prisma.ProjectWhereInput = {
          ...(input.title && {
            title: {
              contains: input.title,
              mode: "insensitive",
            },
          }),

          ...(input.featured.length === 1 && {
            featured: input.featured[0] === "featured",
          }),

          ...(input.createdAt.length === 2 && {
            createdAt: {
              gte: new Date(input.createdAt[0]),
              lte: new Date(input.createdAt[1]),
            },
          }),

          ...(input.categories.length > 0 && {
            categories: {
              some: {
                name: {
                  in: input.categories,
                  mode: "insensitive",
                },
              },
            },
          }),
        };

        const orderBy: Prisma.ProjectOrderByWithRelationInput[] =
          input.sort.length > 0
            ? input.sort.map((item) => ({
                [item.id]: item.desc ? "desc" : "asc",
              }))
            : [{ createdAt: "desc" }];

        const [projects, total] = await Promise.all([
          prisma.project.findMany({
            where,
            skip: offset,
            take: input.perPage,
            orderBy,
            include: { categories: true },
          }),
          prisma.project.count({ where }),
        ]);

        const pageCount = Math.ceil(total / input.perPage);
        return { data: projects, pageCount };
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        return { data: [], pageCount: 0 };
      }
    },
    [JSON.stringify(input)],
    {
      revalidate: 1,
      tags: ["projects"],
    }
  )();
}

export async function getProjectCounts() {
  return unstable_cache(
    async () => {
      const startDate = subMonths(new Date(), 5); // last 6 months
      const projects = await prisma.project.findMany({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
        select: {
          createdAt: true,
          featured: true,
        },
      });

      const monthlyMap: Record<
        string,
        { total: number; featured: number }
      > = {};

      for (let i = 0; i < 6; i++) {
        const date = subMonths(new Date(), i);
        const month = format(date, "MMMM");
        monthlyMap[month] = { total: 0, featured: 0 };
      }

      projects.forEach((project) => {
        const month = format(project.createdAt, "MMMM");
        if (monthlyMap[month]) {
          monthlyMap[month].total += 1;
          if (project.featured) monthlyMap[month].featured += 1;
        }
      });

      const result = Object.entries(monthlyMap)
        .reverse()
        .map(([month, data]) => ({
          month,
          total_projects: data.total,
          featured_projects: data.featured,
        }));

      return result;
    },
    ["project-stats"],
    { revalidate: 3600 }
  )();
}

export async function getProjectBySlug(slug: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { slug },
      include: { categories: true },
    });
    return project;
  } catch (error) {
    console.error(`Failed to fetch project with slug ${slug}:`, error);
    throw new Error("Failed to fetch project");
  }
}

export async function getProjectById(id: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: { categories: true },
    });
    return project;
  } catch (error) {
    console.error(`Failed to fetch project with id ${id}:`, error);
    throw new Error("Failed to fetch project");
  }
}

async function handler(data: Project): Promise<ProjectOutput> {
  const session = await auth();

  if (!session || session.user?.role !== "admin") {
    return { error: "Unauthorized" };
  }

  try {
    const { id, categories = [], ...values } = data;

    // Validate slug uniqueness
    const existing = await prisma.project.findUnique({
      where: { slug: values.slug },
      include: { categories: true },
    });
    if (existing && existing.id !== id) {
      return {
        fieldErrors: {
          slug: ["Slug is already in use"],
        },
      };
    }

    const categoryConnect = categories.map((id: Category["id"]) => ({ id }));

    if (id) {
      await prisma.project.update({
        where: { id },
        data: {
          ...values,
          categories: {
            set: categoryConnect,
          },
        },
      });
    } else {
      await prisma.project.create({
        data: {
          ...values,
          categories: {
            connect: categoryConnect,
          },
        },
      });
    }

    revalidatePath("/projects");
    revalidatePath("/admin/projects");

    return { data: { success: true } };
  } catch (error) {
    console.error("❌ Failed to save project:", error);
    return { error: "Failed to save project" };
  }
}

export async function updateProjects(data: {
  ids: string[];
  featured?: boolean;
  categories?: string; // categoryId
}) {
  const session = await auth();

  if (!session || session.user?.role !== "admin") {
    return { error: "Unauthorized", data: null };
  }

  try {
    const { ids, featured, categories } = data;

    if (!ids.length) {
      return {
        data: null,
        error: "No project IDs provided",
      };
    }

    // ⚠️ Prisma does NOT support relation updates in updateMany.
    // So we need to loop through each project if category is being updated
    if (typeof categories === "string") {
      await Promise.all(
        ids.map((id) =>
          prisma.project.update({
            where: { id },
            data: {
              categories: {
                set: categories ? [{ id: categories }] : [],
              },
            },
          })
        )
      );
    }

    // ⚡ If featured is present, use updateMany
    if (typeof featured === "boolean") {
      await prisma.project.updateMany({
        where: {
          id: { in: ids },
        },
        data: {
          featured,
        },
      });
    }

    revalidatePath("/projects");
    revalidatePath("/admin/projects");

    return {
      data: { success: true },
    };
  } catch (error) {
    console.error("Failed to update projects:", error);
    return {
      error: "Failed to update projects",
    };
  }
}

export async function deleteProject(id: string) {
  const session = await auth();

  if (!session || session.user?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.project.delete({
      where: { id },
    });

    revalidatePath("/projects");
    revalidatePath("/admin/projects");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete project:", error);
    return {
      error: "Failed to delete project",
    };
  }
}

export async function deleteProjects(ids: string[]) {
  const session = await auth();

  if (!session || session.user?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.project.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    revalidatePath("/projects");
    revalidatePath("/admin/projects");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete projects:", error);
    return {
      error: "Failed to delete projects",
    };
  }
}

export const upsertProject = createSafeAction(ProjectSchema, handler);
