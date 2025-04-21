"use client";

import * as React from "react";

import { DataTable } from "@/components/data-table";
import { DataTableToolbar } from "@/components/data-table-toolbar";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";

import { useDataTable } from "@/hooks/use-data-table";
import { projectsTableColumns } from "./columns";
import { deleteProjects, getProjects } from "@/actions/projects";
import { ProjectTableActionBar } from "./action-bar";
import { DataTableRowAction } from "@/types/data-table";
import AppContentLayout from "../content-layout";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import { Project } from "@/schemas";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface ProjectTableProps {
  promises: Promise<[Awaited<ReturnType<typeof getProjects>>]>;
}

export function ProjectsTable({ promises }: ProjectTableProps) {
  const router = useRouter();
  const [{ data, pageCount }] = React.use(promises);
  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<Project> | null>(null);

  const columns = React.useMemo(
    () =>
      projectsTableColumns({
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
        <div className="w-full flex justify-between gap-4">
          <SidebarTrigger />
          <Button
            size="sm"
            variant={"default"}
            className="h-7 cursor-pointer"
            aria-label="Create new project"
            onClick={() => router.push("/admin/projects/new")}
          >
            <Icons.boxPlus className="size-4" />
            Create Project
          </Button>
        </div>
      }
    >
      <DataTable
        table={table}
        actionBar={<ProjectTableActionBar table={table} />}
      >
        <DataTableToolbar table={table} className="items-center py-1 px-6" />
      </DataTable>

      <ConfirmDeleteDialog
        open={rowAction?.variant === "delete"}
        onOpenChange={() => setRowAction(null)}
        //Updated to support single and multiple row selection
        rows={table
          .getFilteredSelectedRowModel()
          .rows.map((row) => row.original)} //{rowAction?.row.original ? [rowAction.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
        onConfirm={async ({ ids }) => await deleteProjects(ids)}
        label="project"
      />
    </AppContentLayout>
  );
}
