"use client";

import { useCallback, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showErrorToast } from "@/lib/handle-error";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/password-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Icons } from "../icons";
import { LoginSchema } from "@/schemas";
import { login } from "@/lib/actions/login";

type LoginFormValues = z.infer<typeof LoginSchema>;

export default function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "admin@mail.com",
      password: "123456",
    },
    mode: "onSubmit",
  });

  const onSubmit = useCallback(
    (values: LoginFormValues) => {
      startTransition(async () => {
        const result = await login(values, callbackUrl);

        if (result?.error) {
          return showErrorToast(result.error);  
        }
      });
    },
    [callbackUrl]
  );

  return (
    <Card className="w-full border-border/10">
      <CardHeader className="flex flex-col items-center">
        <Icons.shieldAlert className="size-16 text-primary" />
        <CardTitle className="text-2xl">Admin Login</CardTitle>
        <CardDescription>
          Welcome back! Please sign in to continue
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="email">Email</Label>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="password">Password</Label>
                  <FormControl>
                    <PasswordInput
                      id="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting || isPending}
            >
              {form.formState.isSubmitting || isPending ? (
                <>
                  <Icons.spinner className="mr-2 size-4 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
