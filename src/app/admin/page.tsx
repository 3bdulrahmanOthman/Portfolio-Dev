import { getRecentActivity } from "@/actions/activity";
import { getCategoryCount } from "@/actions/categories";
import { getProjectCounts } from "@/actions/projects";
import AppContentLayout from "@/components/admin/content-layout";
import ActivityCard from "@/components/admin/overview/activity-card";
import { OverviewCard } from "@/components/admin/overview/overview-card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

async function Admin() {
  const [projectStats, categoryStats, activity] = await Promise.all([
    getProjectCounts(),
    getCategoryCount(),
    getRecentActivity(),
  ]);

  const chartData = projectStats.map((project) => {
    const category = categoryStats.find((c) => c.month === project.month);
    return {
      month: project.month,
      total_projects: project.total_projects,
      total_categories: category?.total_categories || 0,
      featured_projects: project.featured_projects,
    };
  });

  const chartConfig = {
    total_projects: {
      label: "Total Projects",
      color: "var(--chart-1)",
    },
    total_categories: {
      label: "Total Categories",
      color: "var(--chart-2)",
    },
    featured_projects: {
      label: "Featured Projects",
      color: "var(--chart-3)",
    },
  };


  return (
    <AppContentLayout
      header={
        <>
          <SidebarTrigger />
          <h1 className="font-bold">Overview</h1>
        </>
      }
    >
      <section className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-1 border-b">
        {Object.entries(chartConfig).map(([key, config], index, arr) => (
          <OverviewCard
            key={key}
            icon={
              config.label === "Total Projects"
                ? "box"
                : config.label === "Total Categories"
                ? "listTree"
                : "sparkles"
            }
            label={config.label}
            chartData={chartData}
            chartConfig={chartConfig}
            className={index < arr.length - 1 ? "rounded-none border-r" : ""}
          />
        ))}
      </section>

      <aside className="p-2">
        <ActivityCard activity={activity} />
      </aside>
    </AppContentLayout>
  );
}

export default Admin;
