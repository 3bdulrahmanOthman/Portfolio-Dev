import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";
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

  // Server-side authorization: middleware only checks that a session exists.
  // The role comes from the JWT, which the auth() jwt callback refreshes from
  // the database, so DB-side role changes apply on the next render.
  if (session?.user?.role !== "admin") {
    redirect("/auth/unauthorized");
  }

  return (
    <SessionProvider session={session}>
      <SidebarProvider>
        <AppSidebar />
        {children}
      </SidebarProvider>
    </SessionProvider>
  );
}
