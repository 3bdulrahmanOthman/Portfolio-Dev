import { Icons } from "@/components/icons";

interface NavItem {
  title: string;
  path?: string;
  active?: boolean;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  badge?: string;
  label?: string;
  description?: string;
}

interface NavItemWithChildren extends NavItem {
  items?: NavItemWithChildren[];
}

type SidebarNavItem = NavItemWithChildren;


export type {
  NavItem,
  NavItemWithChildren,
  SidebarNavItem,
};
