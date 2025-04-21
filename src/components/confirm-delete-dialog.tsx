"use client";

import type { Row } from "@tanstack/react-table";
import { Loader, Trash } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";

interface ConfirmDeleteDialogProps<T>
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  rows: Row<T>["original"][];
  showTrigger?: boolean;
  onSuccess?: () => void;
  onConfirm: (params: { ids: string[] }) => Promise<{ error?: string }>;
  label: string;
}

export function ConfirmDeleteDialog<T>({
  rows,
  showTrigger = true,
  onSuccess,
  onConfirm,
  label,
  ...props
}: ConfirmDeleteDialogProps<T>) {
  const [isDeletePending, startDeleteTransition] = React.useTransition();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const itemIdentifier = React.useMemo(() => {
    if (rows.length === 1) {
      const item = rows[0];
      const title = item["title" as keyof T] ?? item["name" as keyof T] ?? rows.length;
      return String(title);
    }

    return rows.length;
  }, [rows]);

  function onDelete() {
    startDeleteTransition(async () => {
      const { error } = await onConfirm({
        ids: rows.map((r) => r["id" as keyof T] as string),
      });

      if (error) {
        toast.error(error);
        return;
      }

      props.onOpenChange?.(false);
      toast.success(`${itemIdentifier} deleted`);
      onSuccess?.();
    });
  }
  
  if (!isMobile) {
    return (
      <Dialog {...props}>
        {showTrigger ? (
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Trash className="mr-2 size-4" aria-hidden="true" />
              Delete ({itemIdentifier})
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your{" "}
              <span className="font-medium">{itemIdentifier}</span>{" "}
              {rows.length === 1 ? label : `${label}s`} from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              aria-label="Delete selected rows"
              variant="destructive"
              onClick={onDelete}
              disabled={isDeletePending}
            >
              {isDeletePending && (
                <Loader
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer {...props}>
      {showTrigger ? (
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm">
            <Trash className="mr-2 size-4" aria-hidden="true" />
            Delete ({itemIdentifier})
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            This action cannot be undone. This will permanently delete your{" "}
            <span className="font-medium">{itemIdentifier}</span>{" "}
            {rows.length === 1 ? label : `${label}s`} from our servers.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            onClick={onDelete}
            disabled={isDeletePending}
          >
            {isDeletePending && (
              <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
            )}
            Delete
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
