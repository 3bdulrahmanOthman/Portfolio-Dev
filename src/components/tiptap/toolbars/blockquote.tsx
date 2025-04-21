"use client";

import { TextQuote } from "lucide-react";
import React from "react";
import { useToolbar } from "./toolbar-provider";
import { EditorButton } from "../_components/editor-button";
import { ButtonProps } from "@/components/ui/button";

export const BlockquoteToolbar = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ className, children, onClick }, ref) => {
  const { editor } = useToolbar();
  const isActive = editor?.isActive("blockquote");
  const canToggle = editor?.can().chain().focus().toggleBlockquote().run();

  return (
    <EditorButton
      ref={ref}
      icon={children ?? <TextQuote className="size-4" />}
      isActive={isActive}
      tooltip="Blockquote"
      onClick={(e) => {
        editor?.chain().focus().toggleBlockquote().run();
        onClick?.(e);
      }}
      className={className}
      disabled={!canToggle}
    />
  );
});

BlockquoteToolbar.displayName = "BlockquoteToolbar";
