import AppContentLayout from "@/components/admin/content-layout";
import SettingsForm from "@/components/forms/settings-form";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

function Settings() {
  return (
    <AppContentLayout
      header={
        <div className="flex justify-between gap-4">
          <SidebarTrigger />
          <span className="text-sm">Manage your settings</span>
        </div>
      }
    >
      <SettingsForm />
    </AppContentLayout>
  );
}

export default Settings;
