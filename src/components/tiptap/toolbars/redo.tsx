"use client";

import { Redo2 } from "lucide-react";
import React from "react";

import { useToolbar } from "./toolbar-provider";
import { ButtonProps } from "@/components/ui/button";
import { EditorButton } from "../_components/editor-button";

export const RedoToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useToolbar();
    const canRedo = editor?.can().chain().focus().redo().run();

    return (
      <EditorButton
        className={className}
        icon={children ?? <Redo2 className="size-4" />}
        isActive={false} // Redo doesn’t have a toggled state
        tooltip="Redo"
        onClick={(e) => {
          editor?.chain().focus().redo().run();
          onClick?.(e);
        }}
        disabled={!canRedo}
        ref={ref}
        {...props}
      />
    );
  }
);

RedoToolbar.displayName = "RedoToolbar";
