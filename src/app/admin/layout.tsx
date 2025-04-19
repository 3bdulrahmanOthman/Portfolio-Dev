import { SessionProvider } from "next-auth/react";
import AppSidebar from "@/components/admin/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Metadata } from "next";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Dashboard overview",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <SidebarProvider>
        <AppSidebar />
        {children}
      </SidebarProvider>
    </SessionProvider>
  );
}
