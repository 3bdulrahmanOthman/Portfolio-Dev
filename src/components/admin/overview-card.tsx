"use client";

import { Area, AreaChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React from "react";
import { Icons } from "../icons";
import { cn, RenderIcon } from "@/lib/utils";

interface ChartDataPoint {
  //month: string;
  [key: string]: number | string;
}

interface OverviewChartProps {
  icon: keyof typeof Icons;
  label: string;
  chartData: ChartDataPoint[];
  chartConfig: ChartConfig;
  className?: string;
}

export function OverviewCard({
  icon,
  label,
  chartData,
  chartConfig,
  className,
}: OverviewChartProps) {
  const dataKey = label.toLowerCase().replace(/\s+/g, "_");
  const total = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + Number(curr[dataKey] || 0), 0),
    [chartData, dataKey]
  );

  return (
    <Card className={cn("border-0 p-0 gap-0", className)}>
      <CardContent className="flex justify-between gap-2 p-2">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              `flex aspect-square size-10 items-center justify-center rounded-md border border-dashed`
            )}
            style={{
              borderColor: chartConfig[dataKey].color,
            }}
          > 
            <RenderIcon
              icon={icon}
              className="size-6"
              style={{
                color: chartConfig[dataKey].color,
              }}
            />
          </div>
          <div>
            <CardTitle>{label}</CardTitle>
            <CardDescription>{total}</CardDescription>
          </div>
        </div>

        <ChartContainer config={chartConfig} className="w-36 h-12">
          <AreaChart
            accessibilityLayer
            data={chartData}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <defs>
              <linearGradient
                id={`fill-${dataKey}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={chartConfig[dataKey].color}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={chartConfig[dataKey].color}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey={dataKey}
              type="natural"
              fill={`url(#fill-${dataKey})`}
              fillOpacity={0.4}
              stroke={chartConfig[dataKey].color}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
