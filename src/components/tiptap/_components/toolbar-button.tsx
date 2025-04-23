"use client";

import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export const ToolbarButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    Icon: LucideIcon;
    isActive?: boolean;
    tooltip: string;
  }
>(({ className, Icon, isActive, tooltip, ...props }, ref) => {
  const button = (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      size="icon"
      className={cn("cursor-pointer size-7 sm:size-8 p-0", className)}
      type="button"
      aria-label={tooltip}
      ref={ref}
      {...props}
    >
      <Icon className="size-4" />
    </Button>
  );

  if (!tooltip) {
    return button;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent>
        <span>{tooltip}</span>
      </TooltipContent>
    </Tooltip>
  );
});
ToolbarButton.displayName = "ToolbarButton";
