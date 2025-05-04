import AppContentLayout from "@/components/admin/content-layout";
import SettingsForm from "@/components/forms/settings-form";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

function Settings() {
  return (
    <AppContentLayout
      header={
        <>
          <SidebarTrigger />
          <h1 className="font-bold">Manage your settings</h1>
        </>
      }
    >
      <SettingsForm />
    </AppContentLayout>
  );
}

export default Settings;
