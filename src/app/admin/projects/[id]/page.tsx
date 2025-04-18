import { getProjectById } from "@/lib/actions/projects"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Edit Project",
  description: "Edit your portfolio project",
}

interface EditProjectPageProps {
  params: {
    projectId: string
  }
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const project = await getProjectById(params.projectId).catch(() => null)

  if (!project) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
        <p className="text-muted-foreground mt-2">Update your portfolio project</p>
      </div>
    </div>
  )
}
