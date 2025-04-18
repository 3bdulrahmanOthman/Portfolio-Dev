"use client";

import type { DataTableRowAction } from "@/types/data-table";
import type { Column, ColumnDef } from "@tanstack/react-table";
import * as React from "react";

import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/format";
import { Icons } from "@/components/icons";

import LongText from "@/components/long-text";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Project } from '@/lib/validations/index';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


interface ProjectsTableColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<Project> | null>
  >;
}

export function projectsTableColumns({
  setRowAction,
}: ProjectsTableColumnsProps): ColumnDef<Project>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      size: 32,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "title",
      accessorKey: "title",
      header: ({ column }: { column: Column<Project, unknown> }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ cell }) => <div>{cell.getValue<Project["title"]>()}</div>,
      meta: {
        label: "Title",
        placeholder: "Search titles...",
        variant: "text",
        icon: Icons.text,
      },
      enableColumnFilter: true,
    },
    {
      id: "description",
      accessorKey: "description",
      header: ({ column }: { column: Column<Project, unknown> }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      cell: ({ cell }) => (
        <LongText className="w-40">
          {cell.getValue<Project["description"]>()}
        </LongText>
      ),
      enableColumnFilter: true,
    },
    {
      id: "demoUrl",
      accessorKey: "demoUrl",
      header: ({ column }: { column: Column<Project, unknown> }) => (
        <DataTableColumnHeader column={column} title="Links" />
      ),
      cell: ({ row }) => {
        const { demoUrl, githubUrl } = row.original;

        return (
          <div className="flex items-center gap-2">
            <TooltipProvider>
              {demoUrl && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Visit live demo"
                      className={cn(
                        buttonVariants({ size: "icon", variant: "ghost" }),
                        "text-muted-foreground hover:text-primary"
                      )}
                    >
                      <Icons.globe className="size-4" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Live Demo</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {githubUrl && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="View GitHub repository"
                      className={cn(
                        buttonVariants({ size: "icon", variant: "ghost" }),
                        "text-muted-foreground hover:text-primary"
                      )}
                    >
                      <Icons.gitHub className="size-4" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>GitHub Repo</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </TooltipProvider>
          </div>
        );
      },
    },
    {
      id: "featured",
      accessorKey: "featured",
      header: ({ column }: { column: Column<Project, unknown> }) => (
        <DataTableColumnHeader column={column} title="Featured" />
      ),
      cell: ({ cell }) => {
        const isFeatured = cell.getValue<Project["featured"]>();
        return (
          <Badge variant={isFeatured ? "default" : "secondary"}>
            <span className="capitalize">
              {isFeatured ? "Featured" : "Standard"}
            </span>
          </Badge>
        );
      },
      meta: {
        label: "Featured",
        variant: "multiSelect",
        options: [
          { label: "Featured", value: "featured" },
          { label: "Standard", value: "standard" },
        ],
        icon: Icons.circleDashed,
      },
      enableColumnFilter: true,
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: ({ column }: { column: Column<Project, unknown> }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue<Date>()),
      meta: {
        label: "Created At",
        variant: "dateRange",
        icon: Icons.calendar,
      },
      enableColumnFilter: true,
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="flex size-8 p-0 data-[state=open]:bg-muted"
              >
                <Icons.ellipsis className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem asChild>
                <Link href={`/admin/projects/${row.original.id}`}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, variant: "delete" })}
              >
                Delete
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 40,
    },
  ];
}
