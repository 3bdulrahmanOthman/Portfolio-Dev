import { DataTableSkeleton } from "@/components/data-table-skeleton";
import * as React from "react";
import { SearchParams } from "@/types";
import { getValidFilters } from "@/lib/data-table";
import { categorySearchParamsCache } from "@/schemas";
import { getCategories } from "@/actions/categories";
import { CategoriesTable } from "@/components/admin/categories-table";

interface IndexPageProps {
  searchParams: Promise<SearchParams>;
}

async function Category(props: IndexPageProps) {
  const searchParams = await props.searchParams;
  const search = categorySearchParamsCache.parse(searchParams);

  const validFilters = getValidFilters(search.filters);

  const categories = getCategories({
    ...search,
    filters: validFilters,
  });

  return (
    <React.Suspense
      fallback={
        <DataTableSkeleton columnCount={7} filterCount={2} shrinkZero />
      }
    >
      <CategoriesTable initialData={categories} />
    </React.Suspense>
  );
}

export default Category;
