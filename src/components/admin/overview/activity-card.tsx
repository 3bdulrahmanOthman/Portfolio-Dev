import { getRecentActivity } from "@/actions/activity";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import React from "react";

const ActivityCard = ({
  activity,
}: {
  activity: Awaited<ReturnType<typeof getRecentActivity>>;
}) => {
  if (!activity || activity.length === 0) {
    return (
      <Card className="border-0 p-0">
        <CardHeader className="px-2">
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>No recent activity found.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const typeColor: Record<string, string> = {
    project:
      "border-dashed bg-background text-indigo-900 dark:text-indigo-200 border-indigo-200",
    category:
      "border-dashed bg-background text-purple-900 dark:text-purple-200 border-purple-200",
    about:
      "border-dashed bg-background text-pink-900 dark:text-pink-200 border-pink-200",
    contact:
      "border-dashed bg-background text-orange-900 dark:text-orange-200 border-orange-200",
  };

  return (
    <Card className="border-0 p-0 gap-4">
      <CardHeader className="px-2 pt-6">
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Here you can find the latest changes made to your content.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-96 lg:pr-4">
          <ul className="space-y-3">  
            <React.Suspense
              fallback={
                <ul className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <li
                      key={`skeleton-${i}`}
                      className="border p-3 rounded-md flex justify-between items-center"
                    >
                      <div className="flex items-center gap-4 w-full">
                        <Skeleton className="h-5 w-20 rounded-full" />
                        <div className="flex flex-col gap-1 w-full">
                          <Skeleton className="h-4 w-[80%]" />
                          <Skeleton className="h-3 w-[40%]" />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              }
            >
              {activity.map((item) => (
                <li
                  key={`${item.type}-${item.id}`}
                  className="border p-3 rounded-md flex justify-between items-center"
                >
                  <div className="flex items-center gap-2">
                    <Badge className={typeColor[item.type]}>{item.type}</Badge>
                    <div>
                      <p className="text-sm">
                        {item.action === "created" ? "Created" : "Updated"}{" "}
                        <span className="capitalize">{item.type}</span>:{" "}
                        <span className="text-primary">{item.name}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(item.date))} ago
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </React.Suspense>
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
