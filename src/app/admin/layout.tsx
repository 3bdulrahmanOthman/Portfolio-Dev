import AppSidebar from "@/components/dashboard/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard overview",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      {children}
    </SidebarProvider>
  );
}
