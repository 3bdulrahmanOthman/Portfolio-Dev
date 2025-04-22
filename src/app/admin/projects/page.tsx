import { ProjectsTable } from "@/components/admin/projects-table";
import { getProjects } from "@/actions/projects";
import { DataTableSkeleton } from "@/components/data-table-skeleton";
import * as React from "react";
import { SearchParams } from "@/types";
import { getValidFilters } from "@/lib/data-table";
import { searchParamsCache } from "@/schemas";

interface IndexPageProps {
  searchParams: Promise<SearchParams>;
}

async function Projects(props: IndexPageProps) {
  const searchParams = await props.searchParams;
  const search = searchParamsCache.parse(searchParams);

  const validFilters = getValidFilters(search.filters);

  const projectData = await getProjects({
    ...search,
    filters: validFilters,
  });

  return (
    <React.Suspense
      fallback={
        <DataTableSkeleton columnCount={7} filterCount={2} shrinkZero />
      }
    >
      <ProjectsTable initialData={projectData} />
    </React.Suspense>
  );
}

export default Projects;
