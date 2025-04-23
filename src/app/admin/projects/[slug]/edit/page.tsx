import { getProjectBySlug } from "@/actions/projects"
import ProjectForm from "@/components/forms/project-form"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Edit Project",
  description: "Edit portfolio project",
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const project = await getProjectBySlug((await params).slug);

  if (!project) {
    notFound()
  }

  return <ProjectForm initialData={project} />
}
