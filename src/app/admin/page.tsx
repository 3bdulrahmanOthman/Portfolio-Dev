import { getRecentActivity } from "@/actions/activity";
import { getCategoryStats, getTopCategoriesStats } from "@/actions/categories";
import { getFeaturedProjects, getProjectStats } from "@/actions/projects";
import AppContentLayout from "@/components/admin/content-layout";
import ActivityCard from "@/components/admin/overview/activity-card";
import { FeaturedProjectsTable } from "@/components/admin/overview/featured-projects-table";
import { StatsCard } from "@/components/admin/overview/stats-card";
import { TopCategoriesChart } from "@/components/admin/overview/top-category-chart";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

async function Admin() {
  const [projects, categories, activity, topCategories, featuredProjects] =
    await Promise.all([
      getProjectStats(),
      getCategoryStats(),
      getRecentActivity(),
      getTopCategoriesStats(),
      getFeaturedProjects(),
    ]);
  return (
    <AppContentLayout
      header={
        <>
          <SidebarTrigger />
          <h1 className="font-bold">Overview</h1>
        </>
      }
    >
      <ScrollArea className="h-[calc(100svh-80px)] md:h-[calc(100svh-40px)]">
        <section className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-1 border-b">
          <StatsCard
            title="Total Projects"
            label="Projects"
            color="var(--chart-1)"
            data={projects}
            className="border-r"
          />

          <StatsCard
            title="Featured Projects"
            label="Featured"
            color="var(--chart-3)"
            data={projects.filter((p) => p.featured)}
            className="border-r"
          />

          <StatsCard
            title="Total Categories"
            label="Categories"
            color="var(--chart-2)"
            data={categories}
          />
        </section>
        <div className="flex flex-col gap-4 lg:flex-row divide-y lg:divide-y-0 lg:divide-x">
          <section className="w-full lg:w-2/3">
            <TopCategoriesChart data={topCategories} />
            <FeaturedProjectsTable projects={featuredProjects} />
          </section>

          <aside className="w-full lg:w-1/3">
            <ActivityCard activity={activity} />
          </aside>
        </div>
      </ScrollArea>
    </AppContentLayout>
  );
}

export default Admin;
