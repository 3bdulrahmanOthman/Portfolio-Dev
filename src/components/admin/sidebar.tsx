import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavGroup } from "./nav-group";
import { NavHeader } from "./nav-header";
import { dashboardConfig } from "@/config/dashboard";

const AppSidebar = () => {
  return (
    <Sidebar collapsible="offcanvas" variant="floating">
      <SidebarHeader>
        <NavHeader data={dashboardConfig.sidebarHeader} />
      </SidebarHeader>
      <SidebarContent>
        {dashboardConfig.sidebarNav.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
