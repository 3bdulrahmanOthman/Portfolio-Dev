"use client";

import { ListOrdered } from "lucide-react";
import React from "react";

import { useToolbar } from "./toolbar-provider";
import { ButtonProps } from "@/components/ui/button";
import { EditorButton } from "../_components/editor-button";

export const OrderedListToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useToolbar();
    const isActive = editor?.isActive("orderedList");
    const canToggle = editor?.can().chain().focus().toggleOrderedList().run();

    return (
      <EditorButton
        className={className}
        icon={children ?? <ListOrdered className="size-4" />}
        isActive={isActive}
        tooltip="Ordered list"
        onClick={(e) => {
          editor?.chain().focus().toggleOrderedList().run();
          onClick?.(e);
        }}
        disabled={!canToggle}
        ref={ref}
        {...props}
      />
    );
  }
);

OrderedListToolbar.displayName = "OrderedListToolbar";
