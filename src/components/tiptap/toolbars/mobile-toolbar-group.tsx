"use client";

import { ChevronsUpDown } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

interface MobileToolbarGroupProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export const MobileToolbarGroup: React.FC<MobileToolbarGroupProps> = ({
  label,
  children,
  className,
}) => {

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-max gap-1 px-3 text-sm font-medium sm:h-9 sm:text-base",
            className
          )}
        >
          {label}
          <ChevronsUpDown className="size-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-center text-base font-semibold">
            {label}
          </DrawerTitle>
        </DrawerHeader>
        <DrawerClose className="flex flex-col items-center  gap-2 py-3">
          {children}
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  );
};

type MobileToolbarItemProps = ButtonProps & {
  active?: boolean;
};

export const MobileToolbarItem: React.FC<MobileToolbarItemProps> = ({
  children,
  active,
  onClick,
  className,
  ...props
}) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "h-8 w-full text-start",
        active && "bg-accent text-accent-foreground",
        className
      )}
      onClick={(e) => {
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </Button>
  );
};
