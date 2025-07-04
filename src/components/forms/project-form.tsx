"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Project, ProjectSchema, Category } from "@/schemas";
import { upsertProject } from "@/actions/projects";
import { slugify, cn } from "@/lib/utils";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shell } from "@/components/shell";
import { Icons } from "@/components/icons";
import { ProjectImageUpload } from "@/components/admin/project-image-upload";
import { RichTextEditor } from "@/components/tiptap/rich-text-editor";
import { SidebarTrigger } from "@/components/ui/sidebar";
import AppContentLayout from "@/components/admin/content-layout";
import { StarsBackground } from "@/components/animate-ui/stars-background";
import { SelectOption } from "../select-option";

interface ProjectFormProps {
  initialData?: Project;
  initialCatData: Category[];
}

export default function ProjectForm({
  initialData,
  initialCatData,
}: ProjectFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isEdit = !!initialData;
  console.log("Initial Data:", initialData);
  console.log("Initial Data Categories:", initialData?.categories?.map((cat: Category) => cat.id));
  console.log("Initial Category Products Count:", initialData?.categories?.map((cat: Category) => cat.projects?.length));

  const form = useForm<Project>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: isEdit ? {
      ...initialData,
      categories: initialData?.categories?.map((cat: Category) => cat.id),
    } : {
      title: "",
      slug: "",
      description: "",
      content: "",
      image: "",
      demoUrl: null,
      githubUrl: null,
      featured: false,
      categories: [],
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
    console.log("Submitting data:", data.categories);
    startTransition(async () => {
      const result = await upsertProject(data);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.fieldErrors) {
        for (const [field, errors] of Object.entries(result.fieldErrors)) {
          if (errors?.length) {
            form.setError(field, {
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

  return (
    <AppContentLayout
      header={
        <>
          <SidebarTrigger className="mr-4" />
          <h1 className="font-bold text-lg">
            {isEdit ? "Edit Project" : "Create New Project"}
          </h1>
        </>
      }
    >
      <Shell variant="sidebar">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="h-[calc(100svh-140px)] md:h-[calc(100svh-160px)] px-6">
              <div className="space-y-6">
                {/* Title & Slug */}
                <div className="grid md:grid-cols-2 gap-6 items-start">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              if (!initialData?.slug) generateSlug();
                            }}
                            placeholder="My Awesome Project"
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
                            <Input {...field} placeholder="awesome-project" />
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
                          Used in /projects/[slug]
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
                          placeholder="Short project description"
                          className="min-h-24"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Links */}
                <div className="grid md:grid-cols-2 gap-6">
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
                            placeholder="https://demo.example.com"
                          />
                        </FormControl>
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
                            placeholder="https://github.com/user/project"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="categories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categories</FormLabel>
                      <FormControl>
                        <SelectOption
                          className="w-full justify-start"
                          title="Categories"
                          options={initialCatData.map((cat) => ({
                            label: cat.name,
                            value: cat.id ?? "",
                            count: cat.projects?.length ?? 0,
                          }))}
                          value={new Set(field.value)}
                          onChange={(id) => field.onChange(id)}
                          multiple
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Featured & Image */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="h-full flex flex-col">
                        <FormLabel>Featured</FormLabel>
                        <FormControl className="h-full">
                          <StarsBackground
                            onClick={() => field.onChange(!field.value)}
                            className={cn(
                              "relative border-2 p-6 rounded-lg border-dashed h-full cursor-pointer transition-colors",
                              field.value
                                ? "border-ring/70 bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)]"
                                : "bg-none"
                            )}
                          >
                            {field.value && (
                              <Icons.checkCircled className="absolute -bottom-20 -right-10 size-64 rotate-[24deg] opacity-5" />
                            )}
                            <FormDescription>
                              Mark as homepage featured
                            </FormDescription>
                          </StarsBackground>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem className="h-full flex flex-col">
                        <FormLabel>Project Image</FormLabel>
                        <FormControl>
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

            {/* Submit */}
            <div className="flex justify-between items-center px-6 mt-6">
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
                    <Icons.spinner className="animate-spin mr-2" />
                    Saving...
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
