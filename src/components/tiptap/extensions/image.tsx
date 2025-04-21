"use client";

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type React from "react";
import TiptapImage from "@tiptap/extension-image";
import {
  type NodeViewProps,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ImageUploadForm } from "../_components/upload-image-form";
import { Icons } from "@/components/icons";
import { Label } from "@/components/ui/label";
import NextImage from "next/image";

export const ImageExtension = TiptapImage.extend({
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: "100%",
      },
      height: {
        default: null,
      },
      align: {
        default: "center",
      },
      caption: {
        default: "",
      },
      aspectRatio: {
        default: null,
      },
      blurDataURL: {
        default: null,
      },
    };
  },

  addNodeView: () => {
    return ReactNodeViewRenderer(TiptapImageComponent);
  },
});

function TiptapImageComponent(props: NodeViewProps) {
  const { node, editor, selected, deleteNode, updateAttributes } = props;
  const imageRef = useRef<HTMLImageElement | null>(null);
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const [resizing, setResizing] = useState(false);
  const [resizingPosition, setResizingPosition] = useState<"left" | "right">(
    "left"
  );
  const [resizeInitialWidth, setResizeInitialWidth] = useState(0);
  const [resizeInitialMouseX, setResizeInitialMouseX] = useState(0);
  const [editingCaption, setEditingCaption] = useState(false);
  const [caption, setCaption] = useState(node.attrs.caption || "");
  const [openedMore, setOpenedMore] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [altText, setAltText] = useState(node.attrs.alt || "");

  // Memoized handlers for better performance
  const handleResizingPosition = useCallback(
    ({
      e,
      position,
    }: {
      e: React.MouseEvent<HTMLDivElement, MouseEvent>;
      position: "left" | "right";
    }) => {
      startResize(e);
      setResizingPosition(position);
    },
    []
  );

  function startResize(event: React.MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    setResizing(true);
    setResizeInitialMouseX(event.clientX);
    if (imageRef.current) {
      setResizeInitialWidth(imageRef.current.offsetWidth);
    }
  }

  const resize = useCallback(
    (event: MouseEvent) => {
      if (!resizing) return;

      let dx = event.clientX - resizeInitialMouseX;
      if (resizingPosition === "left") {
        dx = resizeInitialMouseX - event.clientX;
      }

      const newWidth = Math.max(resizeInitialWidth + dx, 150);
      const parentWidth = nodeRef.current?.parentElement?.offsetWidth ?? 0;

      if (newWidth < parentWidth) {
        updateAttributes({
          width: newWidth,
        });
      }
    },
    [
      resizing,
      resizeInitialMouseX,
      resizeInitialWidth,
      resizingPosition,
      updateAttributes,
    ]
  );

  const endResize = useCallback(() => {
    setResizing(false);
    setResizeInitialMouseX(0);
    setResizeInitialWidth(0);
  }, []);

  const handleTouchStart = useCallback(
    (event: React.TouchEvent, position: "left" | "right") => {
      event.preventDefault();
      setResizing(true);
      setResizingPosition(position);
      setResizeInitialMouseX(event.touches[0]?.clientX ?? 0);
      if (imageRef.current) {
        setResizeInitialWidth(imageRef.current.offsetWidth);
      }
    },
    []
  );

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (!resizing) return;

      let dx =
        (event.touches[0]?.clientX ?? resizeInitialMouseX) -
        resizeInitialMouseX;
      if (resizingPosition === "left") {
        dx =
          resizeInitialMouseX -
          (event.touches[0]?.clientX ?? resizeInitialMouseX);
      }

      const newWidth = Math.max(resizeInitialWidth + dx, 150);
      const parentWidth = nodeRef.current?.parentElement?.offsetWidth ?? 0;

      if (newWidth < parentWidth) {
        updateAttributes({
          width: newWidth,
        });
      }
    },
    [
      resizing,
      resizeInitialMouseX,
      resizeInitialWidth,
      resizingPosition,
      updateAttributes,
    ]
  );

  const handleTouchEnd = useCallback(() => {
    setResizing(false);
    setResizeInitialMouseX(0);
    setResizeInitialWidth(0);
  }, []);

  const handleCaptionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCaption(e.target.value);
    },
    []
  );

  const handleCaptionBlur = useCallback(() => {
    updateAttributes({ caption });
    setEditingCaption(false);
  }, [caption, updateAttributes]);

  const handleCaptionKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleCaptionBlur();
      }
    },
    [handleCaptionBlur]
  );

  const handleImageUrlSubmit = useCallback(() => {
    if (imageUrl) {
      updateAttributes({
        src: imageUrl,
        alt: altText,
      });
      setImageUrl("");
      setAltText("");
      setOpenedMore(false);
    }
  }, [imageUrl, altText, updateAttributes]);

  const handleImageUploadSuccess = useCallback(
    (src: string, alt?: string) => {
      updateAttributes({
        src,
        alt: alt || node.attrs.alt || "",
      });
      setOpenedMore(false);
    },
    [node.attrs.alt, updateAttributes]
  );

  const handleAltTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAltText(e.target.value);
    },
    []
  );

  // Set up event listeners with proper cleanup
  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", endResize);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", endResize);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [resize, endResize, handleTouchMove, handleTouchEnd]);

  // Handle image aspect ratio calculation on load
  const handleImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      const aspectRatio = img.naturalWidth / img.naturalHeight;

      updateAttributes({
        aspectRatio,
        // Store original dimensions in the node for future reference
        originalWidth: img.naturalWidth,
        originalHeight: img.naturalHeight,
      });
    },
    [updateAttributes]
  );

  // Handle full width image
  const handleFullWidth = useCallback(() => {
    const aspectRatio = node.attrs.aspectRatio;
    if (aspectRatio) {
      const parentWidth = nodeRef.current?.parentElement?.offsetWidth ?? 0;
      updateAttributes({
        width: parentWidth,
        height: parentWidth / aspectRatio,
      });
    }
  }, [node.attrs.aspectRatio, updateAttributes]);

  // Determine if we should use a placeholder or the actual image
  const imageSrc = node.attrs.src || "/placeholder.svg";

  // Calculate width and height for the Next.js Image component
  const imageWidth =
    typeof node.attrs.width === "string"
      ? parseInt(node.attrs.width) || 500
      : node.attrs.width || 500;

  const imageHeight = node.attrs.aspectRatio
    ? Math.round(imageWidth / node.attrs.aspectRatio)
    : node.attrs.height
    ? parseInt(node.attrs.height)
    : 300;

  return (
    <NodeViewWrapper
      ref={nodeRef}
      className={cn(
        "relative flex flex-col rounded-md border-2 border-transparent transition-all duration-200",
        selected ? "border-blue-300" : "",
        node.attrs.align === "left" && "left-0 -translate-x-0",
        node.attrs.align === "center" && "left-1/2 -translate-x-1/2",
        node.attrs.align === "right" && "left-full -translate-x-full"
      )}
      style={{ width: node.attrs.width }}
      data-testid="tiptap-image"
    >
      <div
        className={cn(
          "group relative flex flex-col rounded-md",
          resizing && ""
        )}
      >
        <figure className="relative m-0">
          <div
            className="relative rounded-lg overflow-hidden transition-shadow duration-200 hover:shadow-lg"
            style={{
              width: "100%",
              aspectRatio: node.attrs.aspectRatio
                ? `${node.attrs.aspectRatio}`
                : "auto",
            }}
          >
            <NextImage
              ref={imageRef as React.Ref<HTMLImageElement>}
              src={imageSrc}
              alt={node.attrs.alt || "Editor image"}
              title={node.attrs.title}
              width={imageWidth}
              height={imageHeight}
              className="rounded-lg object-cover"
              onLoad={handleImageLoad}
              placeholder={node.attrs.blurDataURL ? "blur" : "empty"}
              blurDataURL={node.attrs.blurDataURL}
              style={{ width: "100%", height: "auto" }}
              sizes={`(max-width: 768px) 100vw, ${imageWidth}px`}
              priority={selected}
            />
          </div>
          {editor?.isEditable && (
            <>
              <div
                className="absolute inset-y-0 z-20 flex w-[25px] cursor-col-resize items-center justify-start p-2"
                style={{ left: 0 }}
                onMouseDown={(event) => {
                  handleResizingPosition({ e: event, position: "left" });
                }}
                onTouchStart={(event) => handleTouchStart(event, "left")}
                aria-label="Resize image from left"
              >
                <div className="z-20 h-[70px] w-1 rounded-xl border bg-[rgba(0,0,0,0.65)] opacity-0 transition-all group-hover:opacity-100" />
              </div>
              <div
                className="absolute inset-y-0 z-20 flex w-[25px] cursor-col-resize items-center justify-end p-2"
                style={{ right: 0 }}
                onMouseDown={(event) => {
                  handleResizingPosition({ e: event, position: "right" });
                }}
                onTouchStart={(event) => handleTouchStart(event, "right")}
                aria-label="Resize image from right"
              >
                <div className="z-20 h-[70px] w-1 rounded-xl border bg-[rgba(0,0,0,0.65)] opacity-0 transition-all group-hover:opacity-100" />
              </div>
            </>
          )}
        </figure>

        {editingCaption ? (
          <Input
            value={caption}
            onChange={handleCaptionChange}
            onBlur={handleCaptionBlur}
            onKeyDown={handleCaptionKeyDown}
            className="mt-2 text-center text-sm text-muted-foreground focus:ring-0"
            placeholder="Add a caption..."
            autoFocus
            aria-label="Image caption"
          />
        ) : (
          <div
            className="mt-2 cursor-text text-center text-sm text-muted-foreground"
            onClick={() => editor?.isEditable && setEditingCaption(true)}
            role="button"
            tabIndex={0}
            aria-label={caption ? "Edit caption" : "Add caption"}
          >
            {caption || "Add a caption..."}
          </div>
        )}

        {editor?.isEditable && (
          <div
            className={cn(
              "absolute right-4 top-4 flex items-center gap-1 rounded-md border bg-background/80 p-1 opacity-0 backdrop-blur transition-opacity",
              !resizing && "group-hover:opacity-100",
              openedMore && "opacity-100"
            )}
            aria-label="Image controls"
          >
            <Button
              size="icon"
              className={cn(
                "size-7",
                node.attrs.align === "left" && "bg-accent"
              )}
              variant="ghost"
              onClick={() => updateAttributes({ align: "left" })}
              aria-label="Align left"
              aria-pressed={node.attrs.align === "left"}
              type="button"
            >
              <Icons.alignLeft className="size-4" />
            </Button>
            <Button
              size="icon"
              className={cn(
                "size-7",
                node.attrs.align === "center" && "bg-accent"
              )}
              variant="ghost"
              onClick={() => updateAttributes({ align: "center" })}
              aria-label="Align center"
              aria-pressed={node.attrs.align === "center"}
              type="button"
            >
              <Icons.alignCenter className="size-4" />
            </Button>
            <Button
              size="icon"
              className={cn(
                "size-7",
                node.attrs.align === "right" && "bg-accent"
              )}
              variant="ghost"
              onClick={() => updateAttributes({ align: "right" })}
              aria-label="Align right"
              aria-pressed={node.attrs.align === "right"}
              type="button"
            >
              <Icons.alignRight className="size-4" />
            </Button>
            <Separator orientation="vertical" className="h-[20px]" />
            <DropdownMenu open={openedMore} onOpenChange={setOpenedMore}>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  className="size-7"
                  variant="ghost"
                  aria-label="More options"
                >
                  <Icons.ellipsisVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                alignOffset={-90}
                className="mt-1 text-sm"
              >
                <DropdownMenuItem onClick={() => setEditingCaption(true)}>
                  <Icons.edit className="mr-2 size-4" /> Edit Caption
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Icons.image className="mr-2 size-4" /> Replace Image
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="p-2 w-fit min-w-52">
                    <div className="space-y-4">
                      <ImageUploadForm
                        onSuccess={handleImageUploadSuccess}
                        showAltField={false}
                      />

                      <div>
                        <Label className="mb-2 text-xs">Or use URL</Label>
                        <div className="space-y-2">
                          <Input
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="Enter image URL..."
                            className="text-xs"
                          />
                          <Button
                            onClick={handleImageUrlSubmit}
                            className="w-full"
                            disabled={!imageUrl}
                            size="sm"
                          >
                            Replace with URL
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label className="mb-2 text-xs">Alt Text</Label>
                        <Input
                          value={altText}
                          onChange={handleAltTextChange}
                          placeholder="Alt text (optional)"
                          className="text-xs"
                        />
                      </div>
                    </div>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem onClick={handleFullWidth}>
                  <Icons.maximize className="mr-2 size-4" /> Full Width
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="!text-destructive"
                  onClick={deleteNode}
                >
                  <Icons.trash className="mr-2 size-4 text-destructive" />{" "}
                  Delete Image
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}
