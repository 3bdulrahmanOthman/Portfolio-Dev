import { getAbout } from "@/actions/about";
import AppContentLayout from "@/components/admin/content-layout";
import { AboutForm } from "@/components/forms/about-form";
import { Shell } from "@/components/shell";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

async function About() {
  const about = await getAbout();

  return (
    <AppContentLayout
      header={
        <>
          <SidebarTrigger className="mr-4" />
          <span className="text-sm">Edit About Page</span>
        </>
      }
    >
      <Shell variant="sidebar">
        <AboutForm initialData={about} />
      </Shell>
    </AppContentLayout>
  );
}

export default About;
