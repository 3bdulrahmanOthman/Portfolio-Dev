"use client";

import { Strikethrough } from "lucide-react";
import React from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useToolbar } from "./toolbar-provider";

const StrikeThroughToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
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
							editor?.isActive("strike") && "bg-accent",
							className,
						)}
						onClick={(e) => {
							editor?.chain().focus().toggleStrike().run();
							onClick?.(e);
						}}
						disabled={!editor?.can().chain().focus().toggleStrike().run()}
						ref={ref}
						{...props}
					>
						{children ?? <Strikethrough className="size-4" />}
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<span>Strikethrough</span>
					<span className="ml-1 text-xs text-gray-11">(cmd + shift + x)</span>
				</TooltipContent>
			</Tooltip>
		);
	},
);

StrikeThroughToolbar.displayName = "StrikeThroughToolbar";

export { StrikeThroughToolbar };
