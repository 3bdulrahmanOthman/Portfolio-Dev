"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "../lib/db/prisma";
import { createSafeAction, type ActionState } from "@/lib/utils";
import { Category, CategorySchema, GetCategorySchema } from "@/schemas";
import { auth } from "@/auth";
import { unstable_cache } from "next/cache";
import { format, subMonths } from "date-fns";

type CategoryOutput = ActionState<Category, { success: boolean }>;

/**
 * ✅ Fetch categories with filtering, pagination, sorting
 */
export async function getCategories(input: GetCategorySchema) {
  return await unstable_cache(
    async () => {
      try {
        const offset = (input.page - 1) * input.perPage;

        const where: Prisma.CategoryWhereInput = {
          ...(input.name && {
            name: {
              contains: input.name,
              mode: "insensitive",
            },
          }),

          ...(input.createdAt.length === 2 && {
            createdAt: {
              gte: new Date(input.createdAt[0]),
              lte: new Date(input.createdAt[1]),
            },
          }),
        };

        const orderBy: Prisma.CategoryOrderByWithRelationInput[] =
          input.sort.length > 0
            ? input.sort.map((item) => ({
                [item.id]: item.desc ? "desc" : "asc",
              }))
            : [{ createdAt: "desc" }];

        const [categories, total] = await Promise.all([
          prisma.category.findMany({
            where,
            skip: offset,
            take: input.perPage,
            orderBy,
            include: {
              projects: true,
            },
          }),
          prisma.category.count({ where }),
        ]);

        const pageCount = Math.ceil(total / input.perPage);
        return { data: categories, pageCount };
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        return { data: [], pageCount: 0 };
      }
    },
    [JSON.stringify(input)],
    {
      revalidate: 1,
      tags: ["categories"],
    }
  )();
}

export async function getCategoryCount() {
  return unstable_cache(
    async () => {
      const startDate = subMonths(new Date(), 5);
      const categories = await prisma.category.findMany({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
        select: {
          createdAt: true,
        },
      });

      const monthlyMap: Record<string, number> = {};

      for (let i = 0; i < 6; i++) {
        const date = subMonths(new Date(), i);
        const month = format(date, "MMMM");
        monthlyMap[month] = 0;
      }

      categories.forEach((category) => {
        const month = format(category.createdAt, "MMMM");
        if (monthlyMap[month] !== undefined) {
          monthlyMap[month]++;
        }
      });

      return Object.entries(monthlyMap)
        .reverse()
        .map(([month, count]) => ({
          month,
          total_categories: count,
        }));
    },
    ["category-stats"],
    { revalidate: 3600 }
  )();
}
/**
 * 🔍 Get a category by ID
 */
export async function getCategoryById(id: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { projects: true },
    });
    return category;
  } catch (error) {
    console.error(`Failed to fetch category with id ${id}:`, error);
    throw new Error("Failed to fetch category");
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: { projects: true },
    });
    return category;
  } catch (error) {
    console.error(`Failed to fetch category with slug ${slug}:`, error);
    throw new Error("Failed to fetch category");
  }
} 

/**
 * 🧠 Handler to create or update category
 */
async function handler(data: Category): Promise<CategoryOutput> {
  const session = await auth();

  if (!session || session.user?.role !== "admin") {
    return { error: "Unauthorized" };
  }

  try {
    const { id, projects = [], ...values } = data;

    const existing = await prisma.category.findUnique({
      where: { slug: values.slug },
      include: { projects: true },
    });

    if (existing && existing.id !== id) {
      return {
        fieldErrors: {
          slug: ["Slug is already in use"],
        },
      };
    }

    if (id) {
      await prisma.category.update({
        where: { id },
        data: {
          ...values,
          projects: {
            set: projects.map((p) => ({ id: p.id })),
          },
        },
      });
    } else {
      await prisma.category.create({
        data: {
          ...values,
          projects: {
            connect: projects.map((p) => ({ id: p.id })),
          },
        },
      });
    }

    revalidatePath("/admin/categories");
    revalidatePath("/projects");

    return { data: { success: true } };
  } catch (error) {
    console.error("❌ Category upsert failed:", error);
    return { error: "Failed to save category" };
  }
}



/**
 * 💥 Delete single category
 */
export async function deleteCategory(id: string) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.category.delete({ where: { id } });

    revalidatePath("/admin/categories");
    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete category:", error);
    return {
      error: "Failed to delete category",
    };
  }
}

/**
 * 💣 Bulk delete
 */
export async function deleteCategories(ids: string[]) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.category.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/projects");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete categories:", error);
    return {
      error: "Failed to delete categories",
    };
  }
}

export const upsertCategory = createSafeAction(CategorySchema, handler);
