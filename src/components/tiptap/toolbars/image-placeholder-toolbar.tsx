"use client";

import React, { useCallback } from "react";
import { Image as ImageIcon } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useToolbar } from "./toolbar-provider";

const ImagePlaceholderToolbar = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ className, onClick, children, ...props }, ref) => {
  const { editor } = useToolbar();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (!editor) return;

      editor.chain().focus().insertImagePlaceholder().run();
      onClick?.(e);
    },
    [editor, onClick]
  );

  const isActive = editor?.isActive("image-placeholder");

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          ref={ref}
          variant="ghost"
          size="icon"
          aria-label="Insert Image"
          title="Insert Image"
          className={cn(
            "size-8 p-0 sm:size-9",
            isActive && "bg-accent",
            className
          )}
          onClick={handleClick}
          {...props}
        >
          {children ?? <ImageIcon className="size-4" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <span>Image</span>
      </TooltipContent>
    </Tooltip>
  );
});

ImagePlaceholderToolbar.displayName = "ImagePlaceholderToolbar";

export { ImagePlaceholderToolbar };
