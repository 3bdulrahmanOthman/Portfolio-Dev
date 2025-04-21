import React from "react";
import { EditorButton } from "../_components/editor-button";
import { useToolbar } from "./toolbar-provider";
import { ButtonProps } from "@/components/ui/button";
import { List } from "lucide-react";

export const BulletListToolbar = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({children, ...props}, ref) => {
  const { editor } = useToolbar();
  const isActive = editor?.isActive("bulletList");
  const canToggle = editor?.can().chain().focus().toggleBulletList().run();

  return (
    <EditorButton
      ref={ref}
      icon={children ?? <List className="size-4" />}
      isActive={isActive}
      tooltip="Bullet list"
      disabled={!canToggle}
      onClick={() => editor?.chain().focus().toggleBulletList().run()}
      {...props}
    />
  );
});
BulletListToolbar.displayName = "BulletListToolbar";
