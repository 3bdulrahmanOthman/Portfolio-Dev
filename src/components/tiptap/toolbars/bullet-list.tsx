"use client";

import { List } from "lucide-react";
import React from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useToolbar } from "./toolbar-provider";

const BulletListToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, onClick, children, ...props }, ref) => {
		const { editor } = useToolbar();

		return (
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className={cn(
							"size-8 p-0 sm:size-9",
							editor?.isActive("bulletList") && "bg-accent",
							className,
						)}
						onClick={(e) => {
							editor?.chain().focus().toggleBulletList().run();
							onClick?.(e);
						}}
						disabled={!editor?.can().chain().focus().toggleBulletList().run()}
						ref={ref}
						{...props}
					>
						{children ?? <List className="size-4" />}
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<span>Bullet list</span>
				</TooltipContent>
			</Tooltip>
		);
	},
);

BulletListToolbar.displayName = "BulletListToolbar";

export { BulletListToolbar };
