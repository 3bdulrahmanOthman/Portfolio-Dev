"use client";

import * as React from "react";
import { AreaChart, Area, XAxis, CartesianGrid } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

import { getLastMonths } from "@/lib/utils";
import { isSameMonth, subMonths } from "date-fns";

export type Category = {
  id: string;
  name: string;
  slug: string;
  projects: {
    id: string;
    createdAt: string | Date;
  }[];
};

const colors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function TopCategoriesChart({ data }: { data: Category[] }) {
  const months = getLastMonths();

  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {};

    const uniqueCategories = Array.from(
      new Map(data.map((item) => [item.slug, item.name])).entries()
    );

    uniqueCategories.forEach(([slug, name], index) => {
      config[slug] = {
        label: name,
        color: colors[index % colors.length],
      };
    });

    return config satisfies ChartConfig;
  }, [data]);

  const chartData = React.useMemo(() => {
    return months.map((month, index) => {
      const date = subMonths(new Date(), 5 - index);
      const monthData: Record<string, number | string> = { month };

      data.forEach((category) => {
        const count = (category.projects || []).filter((project) =>
          isSameMonth(new Date(project.createdAt), date)
        ).length;

        monthData[category.slug] = count;
      });

      return monthData;
    });
  }, [months, data]);

  return (
    <Card className="border-none">
      <CardHeader className="pb-4">
        <CardTitle>Top Categories</CardTitle>
        <CardDescription>
          Number of projects per category over the last 6 months.
        </CardDescription>
      </CardHeader>
      <CardContent> 
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData} margin={{ top: 0, right: 16, bottom: 0, left: 16 }}>
            <defs>
              {Object.entries(chartConfig).map(([key, config]) => (
                <linearGradient
                  key={key}
                  id={`fill-${key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={config.color}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={config.color}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid vertical={false} strokeDasharray="3 3"/>
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />

            {Object.keys(chartConfig).map((slug) => (
              <Area
                key={slug}
                type="natural"
                dataKey={slug}
                stackId="a"
                stroke={chartConfig[slug].color}
                fill={`url(#fill-${slug})`}
                fillOpacity={0.4}
              />
            ))}

            <ChartLegend content={<ChartLegendContent payload={undefined} />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
