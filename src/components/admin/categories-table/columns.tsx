"use client";

import type { DataTableRowAction } from "@/types/data-table";
import type { Column, ColumnDef } from "@tanstack/react-table";
import * as React from "react";

import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Button } from "@/components/ui/button";
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
import { slugify } from "@/lib/utils";
import { Category } from "@/schemas";
import { Badge } from "@/components/ui/badge";

interface CategoryTableColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<Category> | null>
  >;
}

export function categoriesTableColumns({
  setRowAction,
}: CategoryTableColumnsProps): ColumnDef<Category>[] {
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
      id: "name",
      accessorKey: "name",
      header: ({ column }: { column: Column<Category, unknown> }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ cell }) => <div>{cell.getValue<Category["name"]>()}</div>,
      meta: {
        label: "Name",
        placeholder: "Search names...",
        variant: "text",
        icon: Icons.text,
      },
      enableColumnFilter: true,
    },
    {
      id: "slug",
      accessorKey: "slug",
      header: ({ column }: { column: Column<Category, unknown> }) => (
        <DataTableColumnHeader column={column} title="Slug" />
      ),
      cell: ({ cell }) => (
        <LongText className="w-40">
          {cell.getValue<Category["slug"]>()}
        </LongText>
      ),
      enableColumnFilter: true,
    },
    {
      id: "projects",
      accessorKey: "projects",
      header: ({ column }: { column: Column<Category, unknown> }) => (
        <DataTableColumnHeader column={column} title="Projects" />
      ),
      cell: ({ cell }) => (
        <Badge
          variant="secondary"
          className="w-fit"
        >
          {cell.row.original.projects?.length}
        </Badge>
      ),
      enableColumnFilter: true,
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: ({ column }: { column: Column<Category, unknown> }) => (
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
      id: "updatedAt",
      accessorKey: "updatedAt",
      header: ({ column }: { column: Column<Category, unknown> }) => (
        <DataTableColumnHeader column={column} title="Updated At" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue<Date>()),
      meta: {
        label: "Updated At",
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
                  href={`/admin/categories/${slugify(row.original.name)}/edit`}
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
