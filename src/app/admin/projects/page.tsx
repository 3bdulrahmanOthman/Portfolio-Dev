import { ProjectsTable } from "@/components/dashboard/projects-table";
import { getProjects } from "@/lib/actions/projects";
import { DataTableSkeleton } from "@/components/data-table-skeleton";
import * as React from "react";
import { searchParamsCache } from "@/lib/validations/index";
import { SearchParams } from "@/types";
import { getValidFilters } from "@/lib/data-table";

interface IndexPageProps {
  searchParams: Promise<SearchParams>;
}

async function Projects(props: IndexPageProps) {
  const searchParams = await props.searchParams;
  const search = searchParamsCache.parse(searchParams);

  const validFilters = getValidFilters(search.filters);

  const promises = Promise.all([
    getProjects({
      ...search,
      filters: validFilters,
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
