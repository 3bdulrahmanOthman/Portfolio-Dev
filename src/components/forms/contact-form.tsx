"use client";

import { useTransition } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Contact, ContactSchema } from "@/schemas";
import { getContact, upsertContact } from "@/actions/contact";

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
import { TextEditor } from "../tiptap/text-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface ContactFormProps {
  initialData: Awaited<ReturnType<typeof getContact>>;
}

export function ContactForm({ initialData }: ContactFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<Contact>({
    resolver: zodResolver(ContactSchema),
    defaultValues: initialData ?? {
      email: "",
      phone: "",
      github: "",
      linkedin: "",
      twitter: "",
      content: "",
    },
  });

  const onSubmit: SubmitHandler<Contact> = (values) => {
    startTransition(() => {
      upsertContact({
        ...values,
        updatedAt: new Date(),
      }).then((res) => {
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("Contact page updated");
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Phone"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Tabs defaultValue="github">
              <TabsList>
                <TabsTrigger value="github">GitHub</TabsTrigger>
                <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
                <TabsTrigger value="twitter">Twitter</TabsTrigger>
              </TabsList>

              <TabsContent value="github">
                {/* GitHub */}
                <FormField
                  control={form.control}
                  name="github"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="GitHub URL"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="linkedin">
                {/* LinkedIn */}
                <FormField
                  control={form.control}
                  name="linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="LinkedIn URL"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="twitter">
                {/* Twitter */}
                <FormField
                  control={form.control}
                  name="twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Twitter URL"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
            {/* Content */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <TextEditor
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
