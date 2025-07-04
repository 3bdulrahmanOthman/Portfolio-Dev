import { ProjectsTable } from "@/components/admin/projects-table";
import { getProjects } from "@/actions/projects";
import { DataTableSkeleton } from "@/components/data-table-skeleton";
import * as React from "react";
import { SearchParams } from "@/types";
import { getValidFilters } from "@/lib/data-table";
import { projectSearchParamsCache } from "@/schemas";
import { getCategories } from "@/actions/categories";

interface ProjectPageProps {
  searchParams: Promise<SearchParams>;
}

async function Projects({ searchParams }: ProjectPageProps) {
  const resolvedSearchParams = await searchParams;
  const projects = projectSearchParamsCache.parse(resolvedSearchParams);

  const validProjects = getValidFilters(projects.filters);

  /*const [projects, categories] = [
    projectSearchParamsCache.parse(resolvedSearchParams),
    categorySearchParamsCache.parse(resolvedSearchParams),
  ];
  const [validProjects, validCategories] = [
    getValidFilters(projects.filters),
    getValidFilters(categories.filters),
  ];*/

  const promises = Promise.all([
    getProjects({
      ...projects,
      filters: validProjects,
    }),
    getCategories({
      page: 1,
      perPage: 100,
      sort: [],
      name: "",
      createdAt: [],
      filters: [],
      projects: [],
    }),
  ]);

  return (
    <React.Suspense
      fallback={
        <DataTableSkeleton columnCount={7} filterCount={2} shrinkZero />
      }
    >
      <ProjectsTable promises={promises} />
    </React.Suspense>
  );
}

export default Projects;
