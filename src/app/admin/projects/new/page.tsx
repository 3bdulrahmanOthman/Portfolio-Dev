import { getCategories } from "@/actions/categories";
import ProjectForm from "@/components/forms/project-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Project",
  description: "Create a new portfolio project",
};

export default async function NewProjectPage() {
  const categories = await getCategories({
    page: 1,
    perPage: 100,
    sort: [],
    name: "",
    createdAt: [],
    filters: [],
    projects: []
  });

  return <ProjectForm initialCatData={categories.data} />;
}
