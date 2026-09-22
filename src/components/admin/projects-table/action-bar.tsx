"use client";

import { SelectTrigger } from "@radix-ui/react-select";
import type { Table } from "@tanstack/react-table";
import { CheckCircle2, Download, Trash2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from "@/components/data-table-action-bar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { exportTableToCSV } from "@/lib/export";
import { deleteProjects, updateProjects } from "@/actions/projects";
import { Category, ProjectWithCategories as Project } from "@/schemas";
import { Icons } from "@/components/icons";

type Action = "update-featured" | "update-category" | "export" | "delete";

interface ProjectTableActionBarProps {
  table: Table<Project>;
  categories: Omit<Category, "projects">[];
}

export function ProjectTableActionBar({
  table,
  categories,
}: ProjectTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;
  const [isPending, startTransition] = React.useTransition();
  const [currentAction, setCurrentAction] = React.useState<Action | null>(null);

  const getIsActionPending = React.useCallback(
    (action: Action) => isPending && currentAction === action,
    [isPending, currentAction]
  );

  // Runtime contract of updateProjects: `featured` takes a boolean,
  // `categories` takes a single category id.
  const onProjectFieldUpdate = (
    field: "featured" | "categories",
    value: boolean | string
  ) => {
    if (!rows.length) return toast.error("No rows selected");

    const actionType =
      field === "featured" ? "update-featured" : "update-category";
    setCurrentAction(actionType);

    startTransition(() => {
      updateProjects({
        ids: rows.map((row) => row.original.id),
        ...(field === "featured"
          ? { featured: value as boolean }
          : { categories: value as string }),
      }).then(({ error }) => {
        if (error) return toast.error(error);

        const label =
          field === "featured"
            ? `Projects marked as ${value ? "Featured" : "Standard"}`
            : "Projects category updated";

        toast.success(label);
      });
    });
  };

  const onProjectExport = React.useCallback(() => {
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

  const onProjectDelete = React.useCallback(() => {
    if (!rows.length) return toast.error("No rows selected");
    setCurrentAction("delete");
    startTransition(() => {
      deleteProjects(
        rows.map((row) => row.original.id as string)
      ).then(({ error }) => {
        if (error) {
          toast.error(error);
          return;
        }
        toast.success("Projects deleted");
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
        {/* Featured Status */}
        <Select
          onValueChange={(val) =>
            onProjectFieldUpdate("featured", val === "true")
          }
        >
          <SelectTrigger asChild>
            <DataTableActionBarAction
              size="icon"
              tooltip="Update Featured Status"
              isPending={getIsActionPending("update-featured")}
            >
              <CheckCircle2 />
            </DataTableActionBarAction>
          </SelectTrigger>
          <SelectContent align="center">
            <SelectGroup>
              <SelectItem value="true">Featured</SelectItem>
              <SelectItem value="false">Standard</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Update Categories */}
        <Select
          onValueChange={(categoryId) =>
            onProjectFieldUpdate("categories", categoryId === "__clear__" ? "" : categoryId)
          }
        >
          <SelectTrigger asChild>
            <DataTableActionBarAction
              size="icon"
              tooltip="Update Category"
              isPending={getIsActionPending("update-category")}
            >
              <Icons.listTree />
            </DataTableActionBarAction>
          </SelectTrigger>
          <SelectContent align="center">
            <SelectGroup>
              {categories.map((cat) => (
                <SelectItem key={cat.id ?? ""} value={cat.id ?? ""}>
                  {cat.name}
                </SelectItem>
              ))}
              {/* <SelectItem value="__clear__">Clear Category</SelectItem> */}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Export */}
        <DataTableActionBarAction
          size="icon"
          tooltip="Export Projects"
          isPending={getIsActionPending("export")}
          onClick={onProjectExport}
        >
          <Download />
        </DataTableActionBarAction>

        {/* Delete */}
        <DataTableActionBarAction
          size="icon"
          tooltip="Delete Projects"
          isPending={getIsActionPending("delete")}
          onClick={onProjectDelete}
        >
          <Trash2 />
        </DataTableActionBarAction>
      </div>
    </DataTableActionBar>
  );
}
