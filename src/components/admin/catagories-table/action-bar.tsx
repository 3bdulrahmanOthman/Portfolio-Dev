"use client";

import type { Table } from "@tanstack/react-table";
import { Download, Trash2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from "@/components/data-table-action-bar";

import { Separator } from "@/components/ui/separator";
import { exportTableToCSV } from "@/lib/export";
import { Category } from "@/schemas";
import { deleteCategories } from "@/actions/categories";

type Action = "update-category" | "export" | "delete";

interface CategoriesTableActionBarProps {
  table: Table<Category>;
}

export function CategoriesTableActionBar({
  table,
}: CategoriesTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;
  const [isPending, startTransition] = React.useTransition();
  const [currentAction, setCurrentAction] = React.useState<Action | null>(null);

  const getIsActionPending = React.useCallback(
    (action: Action) => isPending && currentAction === action,
    [isPending, currentAction]
  );

  const onCategoryExport = React.useCallback(() => {
    if (!rows.length) return toast.error("No rows selected");
    setCurrentAction("export");
    startTransition(() => {
      exportTableToCSV(table, {
        excludeColumns: ["select", "actions"],
        onlySelected: true,
      });
      toast.success("Exported successfully");
    });
  }, [table, rows]);

  const onCategoryDelete = React.useCallback(() => {
    if (!rows.length) return toast.error("No rows selected");
    setCurrentAction("delete");
    startTransition(() => {
      deleteCategories(
        rows.map((row) => row.original.id as string)
      ).then(({ error }) => {
        if (error) {
          toast.error(error);
          return;
        }
        toast.success("Categories deleted");
        table.toggleAllRowsSelected(false);
      });
    });
  }, [rows, table]);

  return (
    <DataTableActionBar table={table} visible={rows.length > 0}>
      <DataTableActionBarSelection table={table} />
      <Separator
        orientation="vertical"
        className="hidden data-[orientation=vertical]:h-5 sm:block"
      />
      <div className="flex items-center gap-1.5">
        {/* Export */}
        <DataTableActionBarAction
          size="icon"
          tooltip="Export Categories"
          isPending={getIsActionPending("export")}
          onClick={onCategoryExport}
        >
          <Download />
        </DataTableActionBarAction>

        {/* Delete */}
        <DataTableActionBarAction
          size="icon"
          tooltip="Delete Categories"
          isPending={getIsActionPending("delete")}
          onClick={onCategoryDelete}
        >
          <Trash2 />
        </DataTableActionBarAction>
      </div>
    </DataTableActionBar>
  );
}
