"use client";

import { Strikethrough } from "lucide-react";
import React from "react";

import { ButtonProps } from "@/components/ui/button";
import { EditorButton } from "../_components/editor-button";
import { useToolbar } from "./toolbar-provider";

export const StrikeThroughToolbar = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ className, onClick, children, ...props }, ref) => {
  const { editor } = useToolbar();
  const isActive = editor?.isActive("strike");
  const canToggle = editor?.can().chain().focus().toggleStrike().run();

  return (
    <EditorButton
      className={className}
      icon={children ?? <Strikethrough className="size-4" />}
      isActive={isActive}
      tooltip="Strikethrough (⌘ + ⇧ + X)"
      onClick={(e) => {
        editor?.chain().focus().toggleStrike().run();
        onClick?.(e);
      }}
      disabled={!canToggle}
      ref={ref}
      {...props}
    />
  );
});

StrikeThroughToolbar.displayName = "StrikeThroughToolbar";
