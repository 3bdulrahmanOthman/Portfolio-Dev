import { Icons } from "@/components/icons";
import { clsx, type ClassValue } from "clsx"
import { LucideProps } from "lucide-react";
import { createElement } from "react";
import { twMerge } from "tailwind-merge"
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
}

export const RenderIcon = ({
  icon,
  ...props
}: {
  icon?: keyof typeof Icons;
} & LucideProps) => {
  const Icon = icon ? Icons[icon] : undefined;
  return Icon ? createElement(Icon, props) : null;
};

export type FieldErrors<T> = {
  [K in keyof T]?: string[]
}

export type ActionState<TInput, TOutput> = {
  fieldErrors?: FieldErrors<TInput>
  error?: string | null
  data?: TOutput
}

export const createSafeAction = <TInput, TOutput>(
  schema: z.Schema<TInput>,
  handler: (validatedData: TInput) => Promise<ActionState<TInput, TOutput>>,
) => {
  return async (data: TInput): Promise<ActionState<TInput, TOutput>> => {
    const validationResult = schema.safeParse(data)

    if (!validationResult.success) {
      return {
        fieldErrors: validationResult.error.flatten().fieldErrors as FieldErrors<TInput>,
      }
    }

    return handler(validationResult.data)
  }
}
