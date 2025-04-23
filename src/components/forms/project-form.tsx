"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { upsertProject } from "@/actions/projects";
import { slugify, cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import AppContentLayout from "../admin/content-layout";
import { ScrollArea } from "../ui/scroll-area";
import { Shell } from "../shell";
import { Icons } from "../icons";
import { StarsBackground } from "../animate-ui/stars-background";
import { ProjectImageUpload } from "../admin/project-image-upload";
import { RichTextEditor } from "../tiptap/rich-text-editor";
import { SidebarTrigger } from "../ui/sidebar";
import { Project, ProjectSchema } from "@/schemas";

interface ProjectFormProps {
  initialData?: Project | null;
}

export default function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isEdit = !!initialData;
  const form = useForm<Project>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: isEdit
      ? {
          ...initialData,
        }
      : {
          title: "",
          slug: "",
          description: "",
          content: "",
          image: "",
          demoUrl: null,
          githubUrl: null,
          featured: false,
        },
  });

  const generateSlug = () => {
    const title = form.getValues("title");
    if (title) {
      form.setValue("slug", slugify(title), {
        shouldValidate: true,
      });
    }
  };

  const handleImageUpload = (url: string) => {
    form.setValue("image", url, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<Project> = (data) => {
    startTransition(async () => {
      const result = await upsertProject(data);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.fieldErrors) {
        for (const [field, errors] of Object.entries(result.fieldErrors)) {
          if (errors?.length) {
            form.setError(field as keyof Project, {
              type: "manual",
              message: errors[0],
            });
          }
        }
        return;
      }

      toast.success(isEdit ? "Project updated." : "Project created.");
      router.push("/admin/projects");
      router.refresh();
    });
  };

  // const onError = (errors: FieldErrors<Project>) => {
  //   console.error("❌ Form Errors:", errors);
  // };

  return (
    <AppContentLayout
      header={
        <>
          <SidebarTrigger className="mr-4" />
          <span className="text-sm">
            {isEdit ? "Edit Project" : "Create New Project"}
          </span>
        </>
      }
    >
      <Shell variant="sidebar">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="h-[calc(100svh-140px)] md:h-[calc(100svh-160px)]">
              <div className="space-y-6 px-6">
                {/* Title & Slug */}
                <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Project title"
                            onChange={(e) => {
                              field.onChange(e);
                              if (!initialData?.slug) generateSlug();
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input {...field} placeholder="project-slug" />
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={generateSlug}
                          >
                            Generate
                          </Button>
                        </div>
                        <FormDescription>
                          Used in URL: /projects/[slug]
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="min-h-24"
                          placeholder="Short project description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="demoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Demo URL</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.value || null)
                            }
                            value={field.value || ""}
                            placeholder="https://example.com"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormDescription>
                          Optional live demo link
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="githubUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub URL</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.value || null)
                            }
                            value={field.value || ""}
                            placeholder="https://github.com/user/repo"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormDescription>Optional GitHub repo</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Featured & Image */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-col h-full">
                        <FormLabel>Featured</FormLabel>
                        <FormControl className="h-full">
                          <StarsBackground
                            onClick={() => field.onChange(!field.value)}
                            className={cn(
                              "relative rounded-lg border-2 p-6 border-dashed transition-colors h-full cursor-pointer",
                              field.value
                                ? "border-ring/70 bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)]"
                                : "bg-none"
                            )}
                          >
                            {field.value && (
                              <Icons.checkCircled className="absolute -bottom-20 -right-10 size-64 rotate-[24deg] opacity-5" />
                            )}
                            <FormDescription>Show on homepage</FormDescription>
                          </StarsBackground>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem className="flex flex-col h-full">
                        <FormLabel>Project Image</FormLabel>
                        <FormControl className="h-full">
                          <ProjectImageUpload
                            value={field.value ?? ""}
                            onChange={handleImageUpload}
                            fileReject={(_, message) =>
                              form.setError("image", { message })
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                {/* Content */}
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          initialContent={field.value}
                          onChange={(val) =>
                            form.setValue("content", val, {
                              shouldValidate: true,
                            })
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>
            {/* Actions */}
            <div className="flex justify-between gap-6 mt-6 px-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/projects")}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Icons.spinner className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : isEdit ? (
                  "Update Project"
                ) : (
                  "Create Project"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Shell>
    </AppContentLayout>
  );
}
