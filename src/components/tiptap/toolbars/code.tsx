import { Code2 } from "lucide-react";
import { EditorButton } from "../_components/editor-button";
import { useToolbar } from "./toolbar-provider";
import { ButtonProps } from "@/components/ui/button";
import React from "react";

export const CodeToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(({children, ...props}, ref) => {
  const { editor } = useToolbar();
  const isActive = editor?.isActive("code");
  const canToggle = editor?.can().chain().focus().toggleCode().run();

  return (
    <EditorButton
      ref={ref}
      icon={children ?? <Code2 className="size-4" />}
      isActive={isActive}
      tooltip="Code"
      disabled={!canToggle}
      onClick={() => editor?.chain().focus().toggleCode().run()}
      {...props}
    />
  );
});
CodeToolbar.displayName = "CodeToolbar";