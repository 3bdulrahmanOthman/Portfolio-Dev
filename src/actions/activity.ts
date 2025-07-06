import { prisma } from "@/lib/db/prisma";
import { unstable_cache } from "next/cache";

export type ActivityItem = {
  type: "project" | "category" | "about" | "contact";
  action: "created" | "updated";
  id: string;
  name: string;
  date: Date;
};

export async function getRecentActivity(): Promise<ActivityItem[]> {
  return unstable_cache(
    async () => {
      const [projects, categories, about, contact] = await Promise.all([
        prisma.project.findMany({
          orderBy: { updatedAt: "desc" },
          take: 5,
          select: {
            id: true,
            title: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
        prisma.category.findMany({
          orderBy: { updatedAt: "desc" },
          take: 5,
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
        prisma.about.findFirst({
          select: {
            id: true,
            updatedAt: true,
            createdAt: true,
          },
        }),
        prisma.contact.findFirst({
          select: {
            id: true,
            updatedAt: true,
            createdAt: true,
          },
        }),
      ]);

      const activity: ActivityItem[] = [];

      projects.forEach((p) =>
        activity.push({
          id: p.id,
          type: "project",
          name: p.title,
          date: p.updatedAt,
          action: p.createdAt.getTime() !== p.updatedAt.getTime() ? "updated" : "created",
        })
      );

      categories.forEach((c) =>
        activity.push({
          id: c.id,
          type: "category",
          name: c.name,
          date: c.updatedAt,
          action: c.createdAt.getTime() !== c.updatedAt.getTime() ? "updated" : "created",
        })
      );

      if (about)
        activity.push({
          id: about.id,
          type: "about",
          name: "About Page",
          date: about.updatedAt,
          action: about.createdAt.getTime() !== about.updatedAt.getTime() ? "updated" : "created",
        });

      if (contact)
        activity.push({
          id: contact.id,
          type: "contact",
          name: "Contact Page",
          date: contact.updatedAt,
          action: contact.createdAt.getTime() !== contact.updatedAt.getTime() ? "updated" : "created",
        });

      return activity.sort((a, b) => b.date.getTime() - a.date.getTime());
    },
    ["recent-activity"],
    { revalidate: 300 }
  )();
}
