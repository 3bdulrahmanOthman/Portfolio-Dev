"use client";

import * as React from "react";
import { Check, PlusCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Option } from "@/types/data-table";

interface SelectOptionProps {
  title: string;
  options: Option[];
  value: Set<string>;
  onChange: (values: string[]) => void;
  multiple?: boolean;
  maxDisplay?: number;
  className?: string;
}

export const SelectOption: React.FC<SelectOptionProps> = ({
  title,
  options,
  value,
  onChange,
  multiple = true,
  className,
  maxDisplay = 2,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (option: Option) => {
    const newValues = new Set(value);
    const isSelected = value.has(option.value);

    if (multiple) {
      if (isSelected) {
        newValues.delete(option.value);
      } else {
        newValues.add(option.value);
      }
      onChange(Array.from(newValues));
    } else {
      onChange(isSelected ? [] : [option.value]);
      setOpen(false);
    }
  };

  const handleReset = () => {
    onChange([]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-label={`Select option ${title}`}
          variant="outline"
          className={cn("border-dashed p-3", className)}
        >
          {value.size > 0 ? (
            <div
              role="button"
              aria-label={`Clear ${title} filter`}
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
              className="rounded-sm opacity-70 transition-opacity hover:opacity-100"
            >
              <XCircle />
            </div>
          ) : (
            <PlusCircle />
          )}
          {title}
          {value.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-0.5 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {value.size}
              </Badge>
              <div className="hidden items-center gap-1 lg:flex">
                {value.size > maxDisplay ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {value.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((opt) => value.has(opt.value))
                    .map((opt) => (
                      <Badge
                        key={opt.value}
                        variant="secondary"
                        className="rounded-sm px-1 font-normal"
                      >
                        {opt.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[12.5rem] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup className="max-h-[18.75rem] overflow-y-auto">
              {options.map((opt) => {
                const isSelected = value.has(opt.value);
                return (
                  <CommandItem
                    key={opt.value}
                    onSelect={() => handleSelect(opt)}
                  >
                    <div
                      className={cn(
                        "flex size-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check />
                    </div>
                    {opt.icon && <opt.icon />}
                    <span className="truncate">{opt.label}</span>
                    {opt.count !== undefined && (
                      <span className="ml-auto font-mono text-xs">
                        {opt.count}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {value.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={handleReset}
                    className="justify-center"
                  >
                    Clear Selection
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
