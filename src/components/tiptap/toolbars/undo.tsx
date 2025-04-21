"use client";

import { Undo2 } from "lucide-react";
import React from "react";

import { useToolbar } from "./toolbar-provider";
import { ButtonProps } from "@/components/ui/button";
import { EditorButton } from "../_components/editor-button";

const UndoToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useToolbar();
    const canUndo = editor?.can().chain().focus().undo().run();

    return (
      <EditorButton
        className={className}
        icon={children ?? <Undo2 className="size-4" />}
        isActive={false}
        tooltip="Undo"
        onClick={(e) => {
          editor?.chain().focus().undo().run();
          onClick?.(e);
        }}
        disabled={!canUndo}
        ref={ref}
        {...props}
      />
    );
  }
);

UndoToolbar.displayName = "UndoToolbar";

export { UndoToolbar };
