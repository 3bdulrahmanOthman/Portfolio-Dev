"use client";

import { UnderlineIcon } from "lucide-react";
import React from "react";

import { useToolbar } from "./toolbar-provider";
import { ButtonProps } from "@/components/ui/button";
import { EditorButton } from "../_components/editor-button";

export const UnderlineToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useToolbar();
    const isActive = editor?.isActive("underline");
    const canToggle = editor?.can().chain().focus().toggleUnderline().run();

    return (
      <EditorButton
        className={className}
        icon={children ?? <UnderlineIcon className="size-4" />}
        isActive={isActive}
        tooltip="Underline (⌘ + U)"
        onClick={(e) => {
          editor?.chain().focus().toggleUnderline().run();
          onClick?.(e);
        }}
        disabled={!canToggle}
        ref={ref}
        {...props}
      />
    );
  }
);

UnderlineToolbar.displayName = "UnderlineToolbar";
