'use client';

import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from "lucide-react";
import { useToolbar } from "./toolbar-provider";
import { EditorButton } from "../_components/editor-button";

const ALIGNMENT_OPTIONS = [
  { label: "Left Align", value: "left", icon: <AlignLeft className="size-4" /> },
  { label: "Center Align", value: "center", icon: <AlignCenter className="size-4" /> },
  { label: "Right Align", value: "right", icon: <AlignRight className="size-4" /> },
  { label: "Justify Align", value: "justify", icon: <AlignJustify className="size-4" /> },
];

export const AlignmentToolbar = () => {
  const { editor } = useToolbar();

  const handleAlign = (value: string) => {
    editor?.chain().focus().setTextAlign(value).run();
  };

  const currentAlign = ALIGNMENT_OPTIONS.find((option) =>
    editor?.isActive({ textAlign: option.value })
  ) ?? ALIGNMENT_OPTIONS[0];

  const isDisabled =
    editor?.isActive("image") || editor?.isActive("video") || !editor;

  return (
    <div className="flex gap-1">
      {ALIGNMENT_OPTIONS.map((option) => (
        <EditorButton
          key={option.value}
          icon={option.icon}
          tooltip={option.label}
          isActive={currentAlign.value === option.value}
          onClick={() => handleAlign(option.value)}
          disabled={isDisabled}
        />
      ))}
    </div>
  );
};
