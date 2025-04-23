"use client";

import { ChevronsUpDown } from "lucide-react";
import { Button, ButtonProps, buttonVariants } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface MobileToolbarGroupProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const MobileToolbarGroup: React.FC<MobileToolbarGroupProps> = ({
  label,
  description,
  children,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
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
      <DrawerContent
        aria-hidden={!isOpen}
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      >
        <DrawerHeader className="text-center">
          <DrawerTitle>{label}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col p-4">{children}</div>
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
    <DrawerClose
      className={cn(
        buttonVariants({ variant: "ghost", size: "sm" }),
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
    </DrawerClose>
  );
};
