"use client";

import { ItalicIcon } from "lucide-react";
import React from "react";

import { useToolbar } from "./toolbar-provider";
import { ButtonProps } from "@/components/ui/button";
import { EditorButton } from "../_components/editor-button";

export const ItalicToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useToolbar();
    const isActive = editor?.isActive("italic");
    const canToggle = editor?.can().chain().focus().toggleItalic().run();

    return (
      <EditorButton
        className={className}
        icon={children ?? <ItalicIcon className="size-4" />}
        isActive={isActive}
        tooltip="Italic (⌘ + I)"
        onClick={(e) => {
          editor?.chain().focus().toggleItalic().run();
          onClick?.(e);
        }}
        disabled={!canToggle}
        ref={ref}
        {...props}
      />
    );
  }
);

ItalicToolbar.displayName = "ItalicToolbar";
