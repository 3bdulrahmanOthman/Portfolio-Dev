import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create Project",
  description: "Create a new portfolio project",
}

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Project</h1>
        <p className="text-muted-foreground mt-2">Add a new project to your portfolio</p>
      </div>
    </div>
  )
}
