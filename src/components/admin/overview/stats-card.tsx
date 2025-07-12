"use client";

import React from "react";
import { Area, AreaChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn, getLastMonths, RenderIcon } from "@/lib/utils";
import { getProjectStats } from "@/actions/projects";
import { isSameMonth, subMonths } from "date-fns";
import { getCategoryStats } from "@/actions/categories";

interface StatsChartProps {
  title: string;
  label: string;
  color: string;
  data: Awaited<ReturnType<typeof getProjectStats | typeof getCategoryStats>>;
  className?: string;
}

export function StatsCard({
  title,
  label,
  color,
  data,
  className,
}: StatsChartProps) {
  const configKey = label.toLowerCase().replace(/\s+/g, "_");

  const chartData = React.useMemo(() => {
    const months = getLastMonths();
    return months.map((month, index) => {
      const date = subMonths(new Date(), 5 - index);
      const count = data.filter((p) =>
        isSameMonth(new Date(p.createdAt), date)
      ).length;
      return {
        month,
        [configKey]: count,
      };
    });
  }, [data, configKey]);

  const chartConfig: ChartConfig = {
    [configKey]: {
      label,
      color,
    },
  };

  // const total = chartData.reduce((acc, cur) => acc + cur.total_projects, 0);

  return (
    <Card className={cn("border-0 p-0 rounded-none", className)}>
      <CardContent className="flex justify-between gap-2 p-2">
        <div className="flex items-center gap-2">
          <div
            className="flex aspect-square size-10 items-center justify-center rounded-md border border-dashed"
            style={{ borderColor: color }}
          >
            <RenderIcon
              icon={
                configKey.includes("project")
                  ? "box"
                  : configKey.includes("category")
                  ? "listTree"
                  : "sparkles"
              }
              className="size-6"
              style={{ color }}
            />
          </div>
          <div>
            <CardTitle className="text-xs font-medium md:text-sm">{title}</CardTitle>
            <CardDescription>{data.length}</CardDescription>
          </div>
        </div>

        <ChartContainer config={chartConfig} className="w-36 h-12">
          <AreaChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              hide
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <defs>
              <linearGradient
                id={`fill-${configKey}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              dataKey={configKey}
              type="natural"
              fill={`url(#fill-${configKey})`}
              fillOpacity={0.4}
              stroke={color}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
