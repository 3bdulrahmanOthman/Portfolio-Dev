"use client";

import { useTransition } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { About, AboutSchema } from "@/schemas";
import { getAbout, upsertAbout } from "@/actions/about";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Icons } from "@/components/icons";
import { RichTextEditor } from "../tiptap/rich-text-editor";

interface AboutFormProps {
  initialData: Awaited<ReturnType<typeof getAbout>>;
}

export function AboutForm({ initialData }: AboutFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<About>({
    resolver: zodResolver(AboutSchema),
    defaultValues: initialData ?? {
      title: "",
      content: "",
    },
  });

  const onSubmit: SubmitHandler<About> = (values) => {
    startTransition(() => {
      upsertAbout(values).then((res) => {
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("About page updated");
          router.refresh();
        }
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ScrollArea className="h-[calc(100svh-140px)] md:h-[calc(100svh-160px)] px-6">
          <div className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="About Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
        <div className="flex justify-end gap-4 mt-6 px-6">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Icons.spinner className="animate-spin size-4" />
                <span className="ml-2">Saving...</span>
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
