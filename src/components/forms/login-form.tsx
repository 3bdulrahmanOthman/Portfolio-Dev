"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState } from "react";
import { useSession } from "next-auth/react";

import { SettingsSchema } from "@/schemas";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/handle-error";
import { settings } from "@/actions/settings";
import { Shell } from "../shell";
import { Icons } from "../icons";
import { Alert, AlertTitle } from "../ui/alert";

type Settings = z.infer<typeof SettingsSchema>;

export default function SettingsForm() {
  const { data, update } = useSession();

  const [status, setStatus] = useState({ error: "", success: "" });
  const [isPending, startTransition] = useTransition();

  const form = useForm<Settings>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      password: undefined,
      newPassword: undefined,
      newPasswordConfirmation: undefined,
      name: data?.user?.name || "",
      email: data?.user?.email || "",
    },
  });

  const onSubmit = async (values: Settings) => {
    setStatus({ error: "", success: "" });

    startTransition(() => {
      settings(values)
        .then(async (res) => {
          if (res.error) return setStatus({ error: res.error, success: "" });
          if (res.success) {
            await update();
            setStatus({ error: "", success: res.success });
          }
        })
        .catch((err) => {
          setStatus({ error: getErrorMessage(err), success: "" });
        });
    });
  };

  return (
    <Shell variant="sidebar" className="px-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="h-[calc(100svh-140px)] md:h-[calc(100svh-160px)] space-y-6"
        >
          <div className="h-full space-y-4">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Name"
                      disabled={isPending}
                      autoComplete="name"
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Email"
                      type="email"
                      disabled={isPending}
                      autoComplete="email"
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Current Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder="Password"
                      disabled={isPending}
                      autoComplete="current-password"
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New Password Field */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder="New Password"
                      disabled={isPending}
                      autoComplete="new-password"
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm New Password Field */}
            <FormField
              control={form.control}
              name="newPasswordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password Confirmation</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder="Confirm New Password"
                      disabled={isPending}
                      autoComplete="new-password"
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Alerts */}
            <div className="space-y-4">
              {status.error && (
                <Alert variant="destructive" withBackground>
                  <Icons.triangleAlert className="size-4" />
                  <AlertTitle>{status.error}</AlertTitle>
                </Alert>
              )}
              {status.success && (
                <Alert variant="success" withBackground>
                  <Icons.checkCircled className="size-4" />
                  <AlertTitle>{status.success}</AlertTitle>
                </Alert>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full mt-auto"
            size="sm"
          >
            {isPending ? (
              <>
                <Icons.spinner className="size-4 text-muted-foreground animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save</span>
            )}
          </Button>
        </form>
      </Form>
    </Shell>
  );
}
