"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Category, CategorySchema } from "@/schemas";
import { slugify } from "@/lib/utils";

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
import { Button } from "@/components/ui/button";
import { Shell } from "@/components/shell";
import { Icons } from "@/components/icons";
import { SidebarTrigger } from "@/components/ui/sidebar";
import AppContentLayout from "@/components/admin/content-layout";
import { upsertCategory } from "@/actions/categories";

export default function CategoryForm({
  initialData,
}: {
  initialData?: Category;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isEdit = !!initialData;

  const form = useForm<Category>({
    resolver: zodResolver(CategorySchema),
    defaultValues: isEdit
      ? {
          ...initialData,
          projects:
            initialData.projects?.map((project) => ({
              id: typeof project === "string" ? project : project.id,
            })) ?? [],
        }
      : {
          name: "",
          slug: "",
          projects: [],
        },
  });

  const generateSlug = () => {
    const name = form.getValues("name");
    if (name) {
      form.setValue("slug", slugify(name), {
        shouldValidate: true,
      });
    }
  };

  const onSubmit = (data: Category) => {
    startTransition(async () => {
      try {
        const result = await upsertCategory(data);

        if (result.error) {
          toast.error(result.error);
          return;
        }

        if (result.fieldErrors) {
          for (const [field, errors] of Object.entries(result.fieldErrors)) {
            if (errors?.length) {
              form.setError(field as keyof Category, {
                type: "manual",
                message: errors[0],
              });
            }
          }
          return;
        }

        toast.success(isEdit ? "Category updated." : "Category created.");
        router.push("/admin/categories");
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? `: ${error.message}` : "An error occurred."
        );
      }
    });
  };

  return (
    <AppContentLayout
      header={
        <>
          <SidebarTrigger className="mr-4" />
          <h1 className="font-bold text-lg">
            {isEdit ? "Edit Category" : "Create New Category"}
          </h1>
        </>
      }
    >
      <Shell variant="sidebar">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="h-[calc(100svh+60px)] md:h-[calc(100svh+30px)] space-y-6 px-6"
          >
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        if (!initialData?.slug) generateSlug();
                      }}
                      placeholder="My Awesome Category"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slug */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input {...field} placeholder="awesome-category" />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generateSlug}
                    >
                      Generate
                    </Button>
                  </div>
                  <FormDescription>Used in /categories/[slug]</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit buttons */}
            <div className="h-full flex justify-between items-center mt-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/categories")}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" className="cursor-pointer" disabled={isPending}>
                {isPending ? (
                  <>
                    <Icons.spinner className="animate-spin mr-2" />
                    Saving...
                  </>
                ) : isEdit ? (
                  "Update Category"
                ) : (
                  "Create Category"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Shell>
    </AppContentLayout>
  );
}
