"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma";
import { revalidatePath } from "next/cache";
import { createSafeAction, type ActionState } from "@/lib/utils";
import { ProjectSchema } from "@/schemas";
import { auth } from "@/auth";
import { GetProjectSchema, Project } from '../validations/index';
import { unstable_cache } from "next/cache";

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
    },
  )();
}

export async function getProjectBySlug(slug: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { slug },
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
    return {
      error: "Unauthorized",
    };
  }

  try {
    const { id, ...values } = data;

    if (!id) {
      const existingProject = await prisma.project.findUnique({
        where: { slug: values.slug },
      });

      if (existingProject) {
        return {
          fieldErrors: {
            slug: ["Slug is already in use"],
          },
        };
      }
    } else {
      const existingProject = await prisma.project.findUnique({
        where: { slug: values.slug },
      });

      if (existingProject && existingProject.id !== id) {
        return {
          fieldErrors: {
            slug: ["Slug is already in use"],
          },
        };
      }
    }

    if (id) {
      await prisma.project.update({
        where: { id },
        data: values,
      });
    } else {
      await prisma.project.create({
        data: values,
      });
    }

    revalidatePath("/projects");
    revalidatePath("/admin/projects");

    return {
      data: { success: true },
    };
  } catch (error) {
    console.error("Failed to save project:", error);
    return {
      error: "Failed to save project",
    };
  }
}


export async function updateProjects(data: {
  ids: string[];
  featured: boolean;
}) {
  try {
    const { ids, featured } = data;

    if (!ids.length) {
      return {
        data: null,
        error: "No project IDs provided",
      };
    }

    await prisma.project.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        featured,
      },
    });

    revalidatePath("/projects");
    revalidatePath("/admin/projects");

    return {
      data: { success: true },
    };
  } catch (error) {
    console.error("Failed to save project:", error);
    return {
      error: "Failed to save project",
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
