"use client";

import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from "lucide-react";
import { ToolbarButton } from "../_components/toolbar-button";
import { Editor } from "@tiptap/react";

const ALIGNMENT_OPTIONS = [
  { label: "Left Align", value: "left", icon: AlignLeft },
  { label: "Center Align", value: "center", icon: AlignCenter },
  { label: "Right Align", value: "right", icon: AlignRight },
  { label: "Justify Align", value: "justify", icon: AlignJustify },
];

interface AlignmentToolbarProps {
  editor: Editor | null;
}

export const AlignmentToolbar = ({ editor }: AlignmentToolbarProps) => {
  const handleAlign = (value: string) => {
    editor?.chain().focus().setTextAlign(value).run();
  };

  const currentAlign =
    ALIGNMENT_OPTIONS.find((option) =>
      editor?.isActive({ textAlign: option.value })
    ) ?? ALIGNMENT_OPTIONS[0];

  const isDisabled =
    editor?.isActive("image") || editor?.isActive("video") || !editor;

  return (
    <div className="flex gap-0.5">
      {ALIGNMENT_OPTIONS.map((option) => (
        <ToolbarButton
          key={option.value}
          Icon={option.icon}
          tooltip={option.label}
          isActive={currentAlign.value === option.value}
          onClick={() => handleAlign(option.value)}
          disabled={isDisabled}
        />
      ))}
    </div>
  );
};
