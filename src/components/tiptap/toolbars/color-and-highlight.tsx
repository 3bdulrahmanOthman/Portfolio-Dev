"use client";
/* eslint-disable */
// @ts-nocheck
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useToolbar } from "./toolbar-provider";
import type { Extension } from "@tiptap/core";
import type { ColorOptions } from "@tiptap/extension-color";
import type { HighlightOptions } from "@tiptap/extension-highlight";
import {
  Check,
  CheckIcon,
  ChevronDownIcon,
  ChevronsUpDown,
} from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { MobileToolbarGroup, MobileToolbarItem } from "./mobile-toolbar-group";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

type TextStylingExtensions =
  | Extension<ColorOptions, any>
  | Extension<HighlightOptions, any>;

const TEXT_COLORS = [
  { name: "Default", color: "var(--editor-text-default)" },
  { name: "Gray", color: "var(--editor-text-gray)" },
  { name: "Brown", color: "var(--editor-text-brown)" },
  { name: "Orange", color: "var(--editor-text-orange)" },
  { name: "Yellow", color: "var(--editor-text-yellow)" },
  { name: "Green", color: "var(--editor-text-green)" },
  { name: "Blue", color: "var(--editor-text-blue)" },
  { name: "Purple", color: "var(--editor-text-purple)" },
  { name: "Pink", color: "var(--editor-text-pink)" },
  { name: "Red", color: "var(--editor-text-red)" },
];

const HIGHLIGHT_COLORS = [
  { name: "Default", color: "var(--editor-highlight-default)" },
  { name: "Gray", color: "var(--editor-highlight-gray)" },
  { name: "Brown", color: "var(--editor-highlight-brown)" },
  { name: "Orange", color: "var(--editor-highlight-orange)" },
  { name: "Yellow", color: "var(--editor-highlight-yellow)" },
  { name: "Green", color: "var(--editor-highlight-green)" },
  { name: "Blue", color: "var(--editor-highlight-blue)" },
  { name: "Purple", color: "var(--editor-highlight-purple)" },
  { name: "Pink", color: "var(--editor-highlight-pink)" },
  { name: "Red", color: "var(--editor-highlight-red)" },
];

interface ColorHighlightItemProps {
  name: string;
  color: string;
  isActive: boolean;
  onSelect: () => void;
  isHighlight?: boolean;
}

const ColorHighlightItem = ({
  name,
  color,
  isActive,
  onSelect,
  isHighlight,
}: ColorHighlightItemProps) => (
  <CommandItem key={name} onSelect={onSelect}>
    <div className="flex items-center space-x-2">
      <Badge
        variant={"outline"}
        className="size-5 rounded-sm"
        style={isHighlight ? { backgroundColor: color } : { color }}
      >
        A
      </Badge>
      <span>{name}</span>
    </div>
    <Check
      className={cn(
        "ml-auto size-4 shrink-0",
        isActive ? "opacity-100" : "opacity-0"
      )}
    />
  </CommandItem>
);

export const ColorHighlightToolbar = () => {
  const { editor } = useToolbar();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const currentColor = editor?.getAttributes("textStyle").color;
  const currentHighlight = editor?.getAttributes("highlight").color;

  const handleSetColor = (color: string) => {
    editor
      ?.chain()
      .focus()
      .setColor(color === currentColor ? "" : color)
      .run();
  };

  const handleSetHighlight = (color: string) => {
    editor
      ?.chain()
      .focus()
      .setHighlight(color === currentHighlight ? { color: "" } : { color })
      .run();
  };

  const isDisabled =
    !editor?.can().chain().setHighlight().run() ||
    !editor?.can().chain().setColor("").run();

  if (isMobile) {
    return (
      <div className="flex gap-1">
        <MobileToolbarGroup label="Color">
          {TEXT_COLORS.map(({ name, color }) => (
            <MobileToolbarItem
              key={name}
              onClick={() => handleSetColor(color)}
              active={currentColor === color}
            >
              <div className="flex items-center space-x-2">
                <Badge
                  variant={"outline"}
                  className="size-5 rounded-sm"
                  style={{ color }}
                >
                  A
                </Badge>
                <span>{name}</span>
              </div>
            </MobileToolbarItem>
          ))}
        </MobileToolbarGroup>

        <MobileToolbarGroup label="Highlight">
          {HIGHLIGHT_COLORS.map(({ name, color }) => (
            <MobileToolbarItem
              key={name}
              onClick={() => handleSetHighlight(color)}
              active={currentHighlight === color}
            >
              <div className="flex items-center space-x-2">
                <Badge
                  variant={"outline"}
                  className="size-5 rounded-sm"
                  style={{ backgroundColor: color }}
                >
                  A
                </Badge>
                <span>{name}</span>
              </div>
            </MobileToolbarItem>
          ))}
        </MobileToolbarGroup>
      </div>
    );
  }

  return (
    <Popover>
      <div className="relative h-full">
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger disabled={isDisabled} asChild>
              <Button
                aria-label="Toggle colors"
                role="combobox"
                variant="ghost"
                size="sm"
                className="ml-auto h-8"
              >
                <span
                  className="text-md"
                  style={{
                    color: currentColor,
                  }}
                >
                  A
                </span>
                <ChevronsUpDown className="ml-auto opacity-50" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>Text Color & Highlight</TooltipContent>
        </Tooltip>

        <PopoverContent align="center" className="w-44 p-0">
          <Command>
            <CommandInput placeholder="Search color..." />
            <CommandList asChild>
              <CommandEmpty>No colors found.</CommandEmpty>
              <ScrollArea className="h-72">
                <CommandGroup heading="Color">
                  {TEXT_COLORS.map(({ name, color }) => (
                    <ColorHighlightItem
                      key={name}
                      name={name}
                      color={color}
                      isActive={currentColor === color}
                      onSelect={() => handleSetColor(color)}
                    />
                  ))}
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Background">
                  {HIGHLIGHT_COLORS.map(({ name, color }) => (
                    <ColorHighlightItem
                      key={name}
                      name={name}
                      color={color}
                      isActive={currentHighlight === color}
                      onSelect={() => handleSetHighlight(color)}
                      isHighlight
                    />
                  ))}
                </CommandGroup>
              </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
      </div>
    </Popover>
  );
};
