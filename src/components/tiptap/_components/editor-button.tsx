"use client";

import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const EditorButton = React.forwardRef<HTMLButtonElement, ButtonProps & {
  icon: React.ReactNode;
  isActive?: boolean;
  tooltip: string;
}>(
  ({ className, icon, isActive, tooltip, ...props }, ref) => {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "size-7 sm:size-8 p-0",
              isActive && "bg-accent",
              className
            )}
            type="button"
            aria-label={tooltip}
            ref={ref}
            {...props}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <span>{tooltip}</span>
        </TooltipContent>
      </Tooltip>
    );
  }
);
EditorButton.displayName = "EditorButton";
