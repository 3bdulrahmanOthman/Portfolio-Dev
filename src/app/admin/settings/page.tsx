import AppContentLayout from "@/components/admin/content-layout";
import SettingsForm from "@/components/admin/settings-form";
import React from "react";

function Settings() {
  return (
    <AppContentLayout header={<span>Manage Your Settings</span>}>
      <SettingsForm />
    </AppContentLayout>
  );
}

export default Settings;
