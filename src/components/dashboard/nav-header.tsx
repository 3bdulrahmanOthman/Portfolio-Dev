"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { SidebarNavItem } from "@/types";
import { RenderIcon } from "@/lib/utils";
import { Icons } from "../icons";
import { ThemeToggle } from "../theme-toggle";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/actions/logout";


export function NavHeader({ data }: {data: SidebarNavItem }) {
  const router = useRouter();

  const handleSelect = React.useCallback((item: SidebarNavItem) => {
    if (!item?.title) return;

    const title = item.title.toLowerCase();

    if (title === "logout") {
      return logout();
    }

    if (item?.path) {
      router.push(item.path);
    }
  }, [router]);

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center justify-between gap-2 w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className="group data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground p-1 pr-2"
              aria-haspopup="menu"
              aria-expanded="false"
              aria-label="Open navigation menu"
            >
              <div className="flex aspect-square size-7 items-center justify-center rounded-md border border-dashed group-hover:border-muted-foreground transition">
                <RenderIcon icon={data.icon} className="size-4" />
              </div>
              <span className="truncate text-left text-sm font-medium leading-tight ml-2">
                {data.title}
              </span>
              <Icons.chevronsUpDown className="ml-auto size-4 opacity-60" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" sideOffset={4} className="min-w-[180px]">
            <DropdownMenuLabel className="text-xs text-muted-foreground">Panel</DropdownMenuLabel>
            {data.items?.map((item) => (
              <DropdownMenuItem
                key={item.title}
                onClick={() => handleSelect(item)}
                aria-label={item.title}
              >
                <RenderIcon icon={item.icon} className="size-4 text-muted-foreground" />
                <span>{item.title}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
