"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, PlusCircle, RefreshCw, Trash2, X } from "lucide-react";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useToolbar } from "./toolbar-provider";
import { getUrlFromString } from "@/lib/tiptap-utils";
import { PopoverClose } from "@radix-ui/react-popover";

const linkSchema = z.object({
  href: z.string().url({ message: "Enter a valid URL" }),
});

type LinkFormValues = z.infer<typeof linkSchema>;

export const LinkToolbar = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, ...props }, ref) => {
  const { editor } = useToolbar();
  const form = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: { href: "" },
  });

  const [open, setOpen] = React.useState(false);

  const isTextSelected = !!editor?.state.selection?.content()?.size;

  const resetForm = () => {
    const existingHref = editor?.getAttributes("link")?.href || "";
    form.reset({ href: existingHref });
  };

  const handleSubmit = (data: LinkFormValues) => {
    const url = getUrlFromString(data.href);
    if (!url) return;
    editor?.chain().focus().setLink({ href: url }).run();
    setOpen(false);
  };

  const handleRemoveLink = () => {
    editor?.chain().focus().unsetLink().run();
    form.reset();
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) resetForm();
  };

  const canInsertLink = editor?.can().chain().setLink({ href: "" }).run();

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild disabled={!canInsertLink || !isTextSelected}>
            <Button
              ref={ref}
              variant="ghost"
              size="icon"
              className={cn(
                "size-7",
                editor?.isActive("link") && "bg-accent",
                className
              )}
              aria-label="Toolbar Link"
              type="button"
              {...props}
            >
              <Link />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Insert or edit link</TooltipContent>
      </Tooltip>

      <PopoverContent className="p-2" sideOffset={8} align="start">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex items-center gap-2"
          >
            <FormField
              control={form.control}
              name="href"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Link</FormLabel>
                  <FormDescription>
                    Attach a link to the selected text
                  </FormDescription> */}
                  <FormControl>
                    <Input
                      autoFocus
                      placeholder="https://example.com"
                      className="h-7 rounded-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" size="icon" className="cursor-pointer size-7">
              {editor?.isActive("link") ? <RefreshCw /> : <PlusCircle />}
              <span className="sr-only">
                {editor?.isActive("link") ? "Update" : "Apply"}
              </span>
            </Button>

            {editor?.isActive("link") && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="cursor-pointer !text-destructive size-7"
                onClick={handleRemoveLink}
              >
                <Trash2 />
                <span className="sr-only">Remove</span>
              </Button>
            )}

            <PopoverClose className="cursor-pointer p-0" asChild>
              <Button variant="ghost" size="icon" className="size-7">
                <X />
                <span className="sr-only">close</span>
              </Button>
            </PopoverClose>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
});

LinkToolbar.displayName = "LinkToolbar";
