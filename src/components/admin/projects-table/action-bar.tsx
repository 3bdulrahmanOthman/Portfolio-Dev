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
import { Project } from "@/schemas";

type Action = "update-featured" | "export" | "delete";

interface ProjectTableActionBarProps {
  table: Table<Project>;
}

export function ProjectTableActionBar({ table }: ProjectTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;
  const [isPending, startTransition] = React.useTransition();
  const [currentAction, setCurrentAction] = React.useState<Action | null>(null);

  const getIsActionPending = React.useCallback(
    (action: Action) => isPending && currentAction === action,
    [isPending, currentAction]
  );

  const onProjectUpdate = React.useCallback(
    ({ field, value }: { field: "featured"; value: boolean }) => {
      if (!rows.length) return toast.error("No rows selected");
      setCurrentAction("update-featured");
      startTransition(async () => {
        const { error } = await updateProjects({
          ids: rows.map((row) => row.original.id as string),
          [field]: value,
        });

        if (error) {
          toast.error(error);
          return;
        }
        toast.success(`Projects marked as ${value ? "Featured" : "Standard"}`);
      });
    },
    [rows]
  );

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
    startTransition(async () => {
      const { error } = await deleteProjects(
        rows.map((row) => row.original.id as string)
      );

      if (error) {
        toast.error(error);
        return;
      }
      toast.success("Projects deleted");
      table.toggleAllRowsSelected(false);
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
        <Select
          onValueChange={(val) =>
            onProjectUpdate({
              field: "featured",
              value: val === "true",
            })
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

        <DataTableActionBarAction
          size="icon"
          tooltip="Export Projects"
          isPending={getIsActionPending("export")}
          onClick={onProjectExport}
        >
          <Download />
        </DataTableActionBarAction>

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
