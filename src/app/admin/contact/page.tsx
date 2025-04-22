import { getContact } from "@/actions/contact";
import AppContentLayout from "@/components/admin/content-layout";
import { ContactForm } from "@/components/forms/contact-form";
import { Shell } from "@/components/shell";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

async function Contact() {
  const contact = await getContact();

  return (
    <AppContentLayout
      header={
        <>
          <SidebarTrigger className="mr-4" />
          <span className="text-sm">Edit Contact Page</span>
        </>
      }
    >
      <Shell variant="sidebar">
        <ContactForm initialData={contact} />
      </Shell>
    </AppContentLayout>
  );
}

export default Contact;
