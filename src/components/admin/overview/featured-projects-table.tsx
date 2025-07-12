"use client";

import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getFeaturedProjects } from "@/actions/projects";
import { Icons } from "@/components/icons";
import { StarsBackground } from "@/components/animate-ui/stars-background";

interface FeaturedProjectsTableProps {
  projects: Awaited<ReturnType<typeof getFeaturedProjects>>;
}

export function FeaturedProjectsTable({
  projects,
}: FeaturedProjectsTableProps) {
  const featured = projects.filter((p) => p.featured);

  return (
    <Card className="border-0 rounded-none py-0 pt-4 gap-4 border-t">
      <CardHeader>
        <CardTitle>Featured Projects</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <StarsBackground className="relative bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)] transition-colors">
          <Icons.checkCircled className="absolute -bottom-20 -right-10 size-64 rotate-[24deg] opacity-5" />

          {featured.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No featured projects found.
            </p>
          ) : (
            <Table className="text-sm relative w-full overflow-x-auto">
              <TableHeader>
                <TableRow>
                  <TableHead className="pr-4">Title</TableHead>
                  <TableHead className="pr-4">Slug</TableHead>
                  <TableHead className="pr-4">Created</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {featured.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium pr-4">
                      {project.title}
                    </TableCell>
                    <TableCell className="text-muted-foreground pr-4">
                      {project.slug}
                    </TableCell>
                    <TableCell className="text-muted-foreground pr-4">
                      {format(new Date(project.createdAt), "PPP")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge className="bg-transparent border-dashed border-yellow-200 text-yellow-900 dark:text-yellow-200">
                        Featured
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </StarsBackground>
      </CardContent>
    </Card>
  );
}
