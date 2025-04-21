"use client";

import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { MobileToolbarGroup, MobileToolbarItem } from "./mobile-toolbar-group";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToolbar } from "./toolbar-provider";

const ALIGNMENT_OPTIONS = [
  { label: "Left Align", value: "left", icon: <AlignLeft className="size-4" /> },
  { label: "Center Align", value: "center", icon: <AlignCenter className="size-4" /> },
  { label: "Right Align", value: "right", icon: <AlignRight className="size-4" /> },
  { label: "Justify Align", value: "justify", icon: <AlignJustify className="size-4" /> },
];

export const AlignmentToolbar = () => {
  const { editor } = useToolbar();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleAlign = (value: string) => {
    editor?.chain().focus().setTextAlign(value).run();
  };

  const currentAlign = ALIGNMENT_OPTIONS.find((option) =>
    editor?.isActive({ textAlign: option.value })
  ) ?? ALIGNMENT_OPTIONS[0];

  const isDisabled =
    editor?.isActive("image") || editor?.isActive("video") || !editor;

  if (isMobile) {
    return (
      <MobileToolbarGroup label={currentAlign.label}>
        {ALIGNMENT_OPTIONS.map((option) => (
          <MobileToolbarItem
            key={option.value}
            onClick={() => handleAlign(option.value)}
            active={currentAlign.value === option.value}
          >
            <span className="mr-2">{option.icon}</span>
            {option.label}
          </MobileToolbarItem>
        ))}
      </MobileToolbarGroup>
    );
  }

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger disabled={isDisabled} asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 gap-2 font-normal"
            >
              {currentAlign.icon}
              {currentAlign.label}
              <ChevronsUpDown className="size-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>Text Alignment</TooltipContent>
      </Tooltip>
      <DropdownMenuContent loop onCloseAutoFocus={(e) => e.preventDefault()}>
        <DropdownMenuGroup className="w-40">
          {ALIGNMENT_OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => handleAlign(option.value)}
            >
              <span className="mr-2">{option.icon}</span>
              {option.label}
              {currentAlign.value === option.value && (
                <Check className="ml-auto size-4" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
