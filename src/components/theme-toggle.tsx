"use client";

import { useCallback } from "react";
import { useTheme } from "next-themes";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { RenderIcon } from "@/lib/utils";
import { Icons } from "@/components/icons";

type ThemeOption = {
  value: "light" | "dark" | "system";
  label: string;
  icon: keyof typeof Icons;
};

const THEME_OPTIONS: ThemeOption[] = [
  { value: "light",  label: "Light",  icon: "sun"    },
  { value: "dark",   label: "Dark",   icon: "moon"   },
  { value: "system", label: "System", icon: "laptop" },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const handleSelect = useCallback((value: ThemeOption["value"]) => {
    setTheme(value);
  }, [setTheme]);

  const currentIcon = THEME_OPTIONS.find(opt => opt.value === theme)?.icon ?? "laptop";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          aria-label="Select theme"
        >
          <RenderIcon icon={currentIcon} className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {THEME_OPTIONS.map(({ value, label, icon }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => handleSelect(value)}
          >
            <RenderIcon icon={icon} className="size-4 sidebar-accent-foreground mr-2" />
            <span>{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
