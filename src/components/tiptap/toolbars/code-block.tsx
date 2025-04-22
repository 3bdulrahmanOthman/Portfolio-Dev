import { Code } from "lucide-react";
import { EditorButton } from "../_components/editor-button";
import React from "react";
import { ButtonProps } from "@/components/ui/button";
import { useToolbar } from "./toolbar-provider";

export const CodeBlockToolbar = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({children, ...props}, ref) => {
  const { editor } = useToolbar();
  const isActive = editor?.isActive("codeBlock");
  const canToggle = editor?.can().chain().focus().toggleCodeBlock().run();

  return (
    <EditorButton
      ref={ref}
      icon={children ?? <Code className="size-4" />}
      isActive={isActive}
      tooltip="Code Block"
      disabled={!canToggle}
      onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
      {...props}
    />
  );
});

CodeBlockToolbar.displayName = "CodeBlockToolbar";
