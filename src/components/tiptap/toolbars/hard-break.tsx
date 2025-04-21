"use client";

import { WrapText } from "lucide-react";
import React from "react";

import { useToolbar } from "./toolbar-provider";
import { ButtonProps } from "@/components/ui/button";
import { EditorButton } from "../_components/editor-button";

export const HardBreakToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useToolbar();

    return (
      <EditorButton
        className={className}
        icon={children ?? <WrapText className="size-4" />}
        tooltip="Hard break"
        onClick={(e) => {
          editor?.chain().focus().setHardBreak().run();
          onClick?.(e); 
        }}
        ref={ref}
        {...props}
      />
    );
  }
);

HardBreakToolbar.displayName = "HardBreakToolbar";
