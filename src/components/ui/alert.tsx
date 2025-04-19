import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const colorMap = {
  default: "blue",
  success: "emerald",
  warning: "amber",
  info: "cyan",
  destructive: "red",
} as const;

type VariantKey = keyof typeof colorMap;

const alertVariants = cva(
  "relative w-full rounded-lg px-4 py-2 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&_svg:not([class*='size-'])]:size-4 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "",
        success: "",
        warning: "",
        info: "",
        destructive: "",
      },
      withBackground: {
        true: "",
        false: "",
      },
      withBorder: {
        true: "",
        false: "",
      },
    },
    compoundVariants: Object.entries(colorMap).flatMap(([variant, color]) => {
      const typedVariant = variant as VariantKey;

      return [
        {
          variant: typedVariant,
          withBorder: true,
          className: `border-${color}-600/50 text-${color}-600 [&>svg]:text-${color}-600 *:data-[slot=alert-description]:text-${color}-600`,
        },
        {
          variant: typedVariant,
          withBackground: true,
          className: `bg-${color}-600/10 text-${color}-700 [&>svg]:text-${color}-700`,
        },
      ];
    }),
    defaultVariants: {
      variant: "default",
      withBackground: false,
      withBorder: false,
    },
  }
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, withBackground, withBorder, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant, withBackground, withBorder }), className)}
        {...props}
      />
    );
  }
);
Alert.displayName = "Alert";

export { Alert };

export const AlertTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h5 className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />
);
AlertTitle.displayName = "AlertTitle";

export const AlertDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <div
    data-slot="alert-description"
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
);
AlertDescription.displayName = "AlertDescription";
