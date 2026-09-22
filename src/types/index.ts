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

interface FooterItem {
  title: string
  items: {
    title: string
    path: string
    external?: boolean
  }[]
}

interface NavItemWithChildren extends NavItem {
  items?: NavItemWithChildren[];
}

type MainNavItem = NavItemWithChildren

type SidebarNavItem = NavItemWithChildren;

interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export type {
  NavItem,
  NavItemWithChildren,
  FooterItem,
  MainNavItem,
  SidebarNavItem,
  SearchParams,
};
