import { getCategories } from "@/actions/categories";
import { getProjectBySlug } from "@/actions/projects";
import ProjectForm from "@/components/forms/project-form";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Project",
  description: "Edit portfolio project",
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [project, categories] = await Promise.all([
    getProjectBySlug((await params).slug),
    getCategories({
      page: 1,
      perPage: 100,
      sort: [],
      name: "",
      createdAt: [],
      filters: [],
      projects: []
    }),
  ]);

  if (!project) {
    notFound();
  }

  return <ProjectForm initialData={project} initialCatData={categories.data} />;
}
