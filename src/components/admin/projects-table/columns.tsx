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
import { cn, slugify } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Category, Project } from "@/schemas";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export enum CategoriesKeys {
  WEB_DEVELOPMENT = "web-development",
  DASHBOARD = "dashboard",
  LANDING_PAGE = "landing-page",
  CMS_TEMPLATE = "cms-template",
  ECOMMERCE = "ecommerce",
}

export const categoryStyles: Record<CategoriesKeys, string> = {
  [CategoriesKeys.WEB_DEVELOPMENT]: "border-dashed bg-background text-indigo-900 dark:text-indigo-200 border-indigo-200",
  [CategoriesKeys.DASHBOARD]: "border-dashed bg-background text-purple-900 dark:text-purple-200 border-purple-200",
  [CategoriesKeys.LANDING_PAGE]: "border-dashed bg-background text-pink-900 dark:text-pink-200 border-pink-200",
  [CategoriesKeys.CMS_TEMPLATE]: "border-dashed bg-background text-orange-900 dark:text-orange-200 border-orange-200",
  [CategoriesKeys.ECOMMERCE]: "border-dashed bg-background text-lime-900 dark:text-lime-200 border-lime-200",
};


interface ProjectsTableColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<Project> | null>
  >;
  categories: Category[];
}

export function projectsTableColumns({
  setRowAction,
  categories,
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
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
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
      id: "categories",
      accessorKey: "categories",
      header: ({ column }: { column: Column<Project, unknown> }) => (
        <DataTableColumnHeader column={column} title="Categories" />
      ),
      cell: ({ cell }) => {
        const categories = cell.getValue<Project["categories"]>();
        return (
          <div className="flex gap-1">
            {categories?.length ? (
              <>
                <Badge
                  key={categories[0].id}
                  variant="secondary"
                  className={cn("capitalize", categoryStyles[categories[0].slug as CategoriesKeys])}
                >
                  {categories[0].name}
                </Badge>
                {categories.length > 1 && (
                  <HoverCard>
                    <HoverCardTrigger>
                      <Badge variant="outline">+{categories.length - 1}</Badge>
                    </HoverCardTrigger>
                    <HoverCardContent className="flex flex-wrap gap-2 p-2">
                      {categories.map((c: Category, index: number) => (
                        <Badge
                          key={c.id}
                          variant={index === 0 ? "secondary" : "outline"}
                          className={cn("capitalize", categoryStyles[c.slug as CategoriesKeys])}
                        >
                          {c.name}
                        </Badge>
                      ))}
                    </HoverCardContent>
                  </HoverCard>
                )}
              </>
            ) : (
              <span className="text-muted-foreground text-sm italic">None</span>
            )}
          </div>
        );
      },
      enableColumnFilter: true,
      meta: {
        label: "Categories",
        variant: "multiSelect",
        options: categories.map((c) => ({
          label: c.name.charAt(0).toUpperCase() + c.name.slice(1),
          value: c.name,
          count: c.projects?.length,
        })),
        icon: Icons.listTree,
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
                <Link
                  href={`/admin/projects/${slugify(row.original.title)}/edit`}
                >
                  Edit
                </Link>
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


