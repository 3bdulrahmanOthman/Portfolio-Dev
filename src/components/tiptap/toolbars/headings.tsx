"use client";

import React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";
import { useToolbar } from "./toolbar-provider";
import { useMediaQuery } from "@/hooks/use-media-query";
import { MobileToolbarGroup, MobileToolbarItem } from "./mobile-toolbar-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";

const levels = [1, 2, 3, 4] as const;

export const HeadingsToolbar = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { editor } = useToolbar();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const activeLevel = levels.find((level) =>
    editor?.isActive("heading", { level })
  );

  if (isMobile) {
    return (
      <MobileToolbarGroup label={activeLevel ? `H${activeLevel}` : "Normal"}>
        <MobileToolbarItem
          onClick={() => editor?.chain().focus().setParagraph().run()}
          active={!editor?.isActive("heading")}
        >
          Normal
        </MobileToolbarItem>
        {levels.map((level) => (
          <MobileToolbarItem
            key={level}
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level }).run()
            }
            active={editor?.isActive("heading", { level })}
            aria-label={`H${level}`}
          >
            H{level}
          </MobileToolbarItem>
        ))}
      </MobileToolbarGroup>
    );
  }

  return (
    <Popover>
      <div className="relative h-full">
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                aria-label="Toggle headings"
                role="combobox"
                variant="ghost"
                size="sm"
                className={
                  (cn("ml-auto", editor?.isActive("heading") && "bg-accent"),
                  className)
                }
                ref={ref}
                {...props}
              >
                {activeLevel ? `H${activeLevel}` : "Normal"}
                <ChevronsUpDown className="ml-auto opacity-50" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>Headings</TooltipContent>
        </Tooltip>

        <PopoverContent align="start" className="w-40 p-0">
          <Command>
            <CommandInput placeholder="Search Heading..." />
            <CommandList asChild>
              <CommandEmpty>No headings found.</CommandEmpty>
              <ScrollArea className="h-[164px]">
                <CommandGroup>
                  <CommandItem
                    key={"normal"}
                    onSelect={() =>
                      editor?.chain().focus().setParagraph().run()
                    }
                    className="py-1"
                  >
                    Normal
                    <Check
                      className={cn(
                        "ml-auto size-4 shrink-0",
                        !editor?.isActive("heading")
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>

                  {levels.map((level) => (
                    <CommandItem
                      key={level}
                      onSelect={() =>
                        editor?.chain().focus().toggleHeading({ level }).run()
                      }
                    >
                      H{level}
                      <Check
                        className={cn(
                          "ml-auto size-4 shrink-0",
                          editor?.isActive("heading", { level })
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
      </div>
    </Popover>
  );
});

HeadingsToolbar.displayName = "HeadingsToolbar";
