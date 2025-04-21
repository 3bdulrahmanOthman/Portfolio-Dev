"use client";

import { SeparatorHorizontal } from "lucide-react";
import React from "react";

import { useToolbar } from "./toolbar-provider";
import { ButtonProps } from "@/components/ui/button";
import { EditorButton } from "../_components/editor-button";

export const HorizontalRuleToolbar = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ className, onClick, children, ...props }, ref) => {
  const { editor } = useToolbar();

  return (
    <EditorButton
      className={className}
      icon={children ?? <SeparatorHorizontal className="size-4" />}
      tooltip="Horizontal Rule"
      onClick={(e) => {
        editor?.chain().focus().setHorizontalRule().run();
        onClick?.(e);
      }}
      ref={ref}
      {...props}
    />
  );
});

HorizontalRuleToolbar.displayName = "HorizontalRuleToolbar";
