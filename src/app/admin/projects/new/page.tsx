import ProjectForm from "@/components/forms/project-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create Project",
  description: "Create a new portfolio project",
}

export default function NewProjectPage() {
  return <ProjectForm />
}
