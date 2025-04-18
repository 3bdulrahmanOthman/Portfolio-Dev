import { ProjectsTable } from "@/components/dashboard/projects-table";
import { getProjects } from "@/lib/actions/projects";

function Projects() {
  const promises = Promise.all([getProjects()]);
  
  return <ProjectsTable promises={promises} />
}

export default Projects;
