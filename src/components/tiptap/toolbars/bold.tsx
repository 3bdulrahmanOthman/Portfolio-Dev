"use client";

import { BoldIcon } from "lucide-react";
import React from "react";

import { useToolbar } from "./toolbar-provider";
import { ButtonProps } from "@/components/ui/button";
import { EditorButton } from "../_components/editor-button";

export const BoldToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useToolbar();
    const isActive = editor?.isActive("bold");
    const canToggle = editor?.can().chain().focus().toggleBold().run();

    return (
      <EditorButton
        className={className}
        icon={children ?? <BoldIcon className="size-4" />}
        isActive={isActive}
        tooltip="Bold"
        onClick={(e) => {
          editor?.chain().focus().toggleBold().run();
          onClick?.(e);
        }}
        disabled={!canToggle}
        ref={ref}
        {...props}
      />
    );
  }
);

BoldToolbar.displayName = "BoldToolbar";
