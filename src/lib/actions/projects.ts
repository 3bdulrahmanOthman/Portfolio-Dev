"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createSafeAction, type ActionState } from "@/lib/utils"
import { ProjectSchema } from "@/schemas"
import { prisma } from '../db/prisma';
import { auth } from "@/auth"


type ProjectInput = z.infer<typeof ProjectSchema>
type ProjectOutput = ActionState<ProjectInput, { success: boolean }>

export async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
    return projects
  } catch (error) {
    console.error("Failed to fetch projects:", error)
    throw new Error("Failed to fetch projects")
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { slug },
    })
    return project
  } catch (error) {
    console.error(`Failed to fetch project with slug ${slug}:`, error)
    throw new Error("Failed to fetch project")
  }
}

export async function getProjectById(id: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id },
    })
    return project
  } catch (error) {
    console.error(`Failed to fetch project with id ${id}:`, error)
    throw new Error("Failed to fetch project")
  }
}

async function handler(data: ProjectInput): Promise<ProjectOutput> {
  const session = await auth()

  if (!session || session.user?.role !== "admin") {
    return {
      error: "Unauthorized",
    }
  }

  try {
    const { id, ...values } = data

    if (!id) {
      const existingProject = await prisma.project.findUnique({
        where: { slug: values.slug },
      })

      if (existingProject) {
        return {
          fieldErrors: {
            slug: ["Slug is already in use"],
          },
        }
      }
    } else {
      const existingProject = await prisma.project.findUnique({
        where: { slug: values.slug },
      })

      if (existingProject && existingProject.id !== id) {
        return {
          fieldErrors: {
            slug: ["Slug is already in use"],
          },
        }
      }
    }

    if (id) {
      await prisma.project.update({
        where: { id },
        data: values,
      })
    } else {
      await prisma.project.create({
        data: values,
      })
    }

    revalidatePath("/projects")
    revalidatePath("/admin/projects")

    return {
      data: { success: true },
    }
  } catch (error) {
    console.error("Failed to save project:", error)
    return {
      error: "Failed to save project",
    }
  }
}

export async function deleteProject(id: string) {
  const session = await auth()

  if (!session || session.user?.role !== "admin") {
    throw new Error("Unauthorized")
  }

  try {
    await prisma.project.delete({
      where: { id },
    })

    revalidatePath("/projects")
    revalidatePath("/admin/projects")

    return { success: true }
  } catch (error) {
    console.error("Failed to delete project:", error)
    throw new Error("Failed to delete project")
  }
}

export const upsertProject = createSafeAction(ProjectSchema, handler)
