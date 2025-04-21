import { SidebarNavItem } from "@/types";

export interface DashboardConfig {
  sidebarHeader: SidebarNavItem;
  sidebarNav: SidebarNavItem[];
}

export const dashboardConfig: DashboardConfig = {
  sidebarHeader: {
    title: "Abdulrahman",
    icon: "logo",
    items: [
      {
        title: "Go To Home",
        path: "/",
        icon: "home",
      },
      {
        title: "Settings",
        path: "/admin/settings",
        icon: "settings",
      },
      {
        title: "Logout",
        path: "/admin/logout",
        icon: "logout",
      },
    ],
  },
  sidebarNav: [
    {
      title: "Admin",
      items: [
        {
          title: "Overview",
          path: "/admin",
          icon: "dashboard",
          active: true,
        },
        {
          title: "Inbox",
          path: "/admin/inbox",
          icon: "inbox",
        },
      ],
    },
    {
      title: "Workspace",
      items: [
        {
          title: "Projects",
          path: "/admin/projects",
          icon: "box",
          items: [
            {
              title: "All",
              path: "/admin/projects",
              icon: "boxes",
            },
            {
              title: "Add",
              path: "/admin/projects/new",
              icon: "boxPlus",
            },
          ],
        },
      ],
    },
    {
      title: "Info",
      items: [
        {
          title: "About Us",
          path: "/admin/about",
          icon: "info",
        },
        {
          title: "Contact Us",
          path: "/admin/contact",
          icon: "contact",
        },
      ],
    },
  ],
};
