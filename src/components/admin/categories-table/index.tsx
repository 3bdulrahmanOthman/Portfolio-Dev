"use client";

import * as React from "react";

import { DataTable } from "@/components/data-table";
import { DataTableToolbar } from "@/components/data-table-toolbar";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";

import { useDataTable } from "@/hooks/use-data-table";
import { DataTableRowAction } from "@/types/data-table";
import AppContentLayout from "../content-layout";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import { Category } from "@/schemas";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { deleteCategories, getCategories } from "@/actions/categories";
import { categoriesTableColumns } from "./columns";
import { CategoriesTableActionBar } from "./action-bar";

interface CategoriesTableProps {
  initialData: Promise<Awaited<ReturnType<typeof getCategories>>>;
}

export function CategoriesTable({ initialData }: CategoriesTableProps) {
  const { data, pageCount } = React.use(initialData);

  const router = useRouter();
  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<Category> | null>(null);

  const columns = React.useMemo(
    () =>
      categoriesTableColumns({
        setRowAction,
      }),
    [setRowAction]
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow) => originalRow.id ?? "",
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <AppContentLayout
      header={
        <>
          <SidebarTrigger />
          <Button
            size="sm"
            variant={"default"}
            className="h-7 cursor-pointer ml-auto"
            aria-label="Create new category"
            onClick={() => router.push("/admin/categories/new")}
          >
            <Icons.boxPlus className="size-4" />
            Create Category
          </Button>
        </>
      }
    >
      <DataTable
        table={table}
        actionBar={
          <CategoriesTableActionBar table={table} />
        }
      >
        <DataTableToolbar table={table} className="items-center py-1 px-6" />
      </DataTable>

      <ConfirmDeleteDialog
        open={rowAction?.variant === "delete"}
        onOpenChange={() => setRowAction(null)}
        rows={rowAction?.row.original ? [rowAction.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
        onConfirm={async ({ ids }) => await deleteCategories(ids)}
        label="category"
      />
    </AppContentLayout>
  );
}
