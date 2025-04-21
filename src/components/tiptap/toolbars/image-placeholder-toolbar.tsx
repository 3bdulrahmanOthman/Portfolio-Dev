"use client";

import React from "react";
import { Image as ImageIcon } from "lucide-react";

import { ButtonProps } from "@/components/ui/button";
import { useToolbar } from "./toolbar-provider";
import { EditorButton } from "../_components/editor-button";

const ImagePlaceholderToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useToolbar();
    const isActive = editor?.isActive("image-placeholder");

    return (
      <EditorButton
        ref={ref}
        className={className}
        icon={children ?? <ImageIcon className="size-4" />}
        isActive={isActive}
        tooltip="Image"
        aria-label="Insert Image"
        title="Insert Image"
        onClick={(e) => {
          e.preventDefault();
          if (!editor) return;

          editor.chain().focus().insertImagePlaceholder().run();
          onClick?.(e);
        }}
        {...props}
      />
    );
  }
);

ImagePlaceholderToolbar.displayName = "ImagePlaceholderToolbar";

export { ImagePlaceholderToolbar };
