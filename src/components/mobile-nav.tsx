"use client";

import * as React from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

import type { MainNavItem } from "@/types";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Icons } from "@/components/icons";

interface MobileNavProps {
  items?: MainNavItem[];
}

export function MobileNav({ items = [] }: MobileNavProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const segment = useSelectedLayoutSegment();
  const [open, setOpen] = React.useState(false);

  if (isDesktop) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-5 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
        >
          <Icons.menu aria-hidden="true" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="group px-1 pl-1 pr-0 pt-3">
        <div className="w-full px-7">
          <Link
            href="/"
            className="flex w-max px-2 aspect-square size-7 items-center justify-center rounded-md border border-dashed group-hover:border-muted-foreground transition"
            onClick={() => setOpen(false)}
          >
            <Icons.logo className="mr-2 size-4" aria-hidden="true" />
            <span className="truncate text-left text-sm font-medium leading-tight ml-2">
              {siteConfig.name}
            </span>
            <span className="sr-only">Home</span>
          </Link>
        </div>

        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <nav className="pl-1 pr-7 space-y-2">
            {items.map((item) =>
              item.items && item.items.length > 0 ? (
                <>
                  <Accordion type="single" collapsible>
                    <AccordionItem value={item.title}>
                      <AccordionTrigger className="text-sm capitalize">
                        {item.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col space-y-2">
                          {item.items.map((subItem, subIdx) =>
                            subItem.path ? (
                              <MobileLink
                                key={subIdx}
                                href={String(subItem.path)}
                                segment={String(segment)}
                                setOpen={setOpen}
                                disabled={subItem.disabled}
                                className="m-1"
                              >
                                {subItem.title}
                              </MobileLink>
                            ) : (
                              <div
                                key={subIdx}
                                className="text-foreground/70 transition-colors"
                              >
                                {subItem.title}
                              </div>
                            )
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </>
              ) : (
                <>
                  <MobileLink
                    href={String(item.path || "#")}
                    segment={String(segment)}
                    setOpen={setOpen}
                    disabled={item.disabled}
                    className="text-sm capitalize block py-2"
                  >
                    {item.title}
                  </MobileLink>
                </>
              )
            )}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

interface MobileLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  disabled?: boolean;
  segment: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function MobileLink({
  children,
  href,
  disabled,
  segment,
  setOpen,
  className,
  ...props
}: MobileLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "text-foreground/70 transition-colors hover:text-foreground",
        href.includes(segment) && "text-foreground font-medium",
        disabled && "pointer-events-none opacity-60",
        className
      )}
      onClick={() => setOpen(false)}
      {...props}
    >
      {children}
    </Link>
  );
}
