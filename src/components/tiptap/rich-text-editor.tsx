"use client";

import "./editor.css";

import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";

import { ImageExtension } from "@/components/tiptap/extensions/image";
import { ImagePlaceholder } from "@/components/tiptap/extensions/image-placeholder";
import SearchAndReplace from "@/components/tiptap/extensions/search-and-replace";
import { TipTapFloatingMenu } from "@/components/tiptap/extensions/floating-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

import { EditorToolbar } from "./extensions/editor-toolbar";
import { cn } from "@/lib/utils";
import { ToolbarButton } from "./_components/toolbar-button";
import { Maximize, Minimize } from "lucide-react";

interface RichTextEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
  className?: string;
}

export function RichTextEditor({
  initialContent,
  onChange,
  className,
}: RichTextEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "F11") {
        e.preventDefault();
        setIsFullscreen((prev) => !prev);
      } else if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  useEffect(() => {
    if (isFullscreen && wrapperRef.current) {
      wrapperRef.current.requestFullscreen?.();
    } else if (!isFullscreen && document.fullscreenElement) {
      document.exitFullscreen?.();
    }
  }, [isFullscreen]);

  const extensions = [
    StarterKit.configure({
      orderedList: {
        HTMLAttributes: {
          class: "list-decimal",
        },
      },
      bulletList: {
        HTMLAttributes: {
          class: "list-disc",
        },
      },
      heading: {
        levels: [1, 2, 3, 4],
      },
    }),
    Placeholder.configure({
      emptyNodeClass: "is-editor-empty",
      placeholder: ({ node }) => {
        switch (node.type.name) {
          case "heading":
            return `Heading ${node.attrs.level}`;
          case "detailsSummary":
            return "Section title";
          case "codeBlock":
            return "";
          default:
            return "Write, type '/' for commands";
        }
      },
      includeChildren: false,
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    TextStyle,
    Subscript,
    Superscript,
    Underline,
    Link,
    Color,
    Highlight.configure({
      multicolor: true,
    }),
    ImageExtension,
    ImagePlaceholder,
    SearchAndReplace,
    Typography,
  ];

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: initialContent,
    editorProps: {
      attributes: {
        class: "focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="border rounded-md p-4">
        <div className="h-[500px] flex items-center justify-center">
          <div className="text-muted-foreground">Loading editor...</div>
        </div>
      </div>
    );
  }

  if (!editor) {
    return (
      <div className="border rounded-md p-4">
        <div className="h-[500px] flex items-center justify-center">
          <div className="text-muted-foreground">Editor failed to load</div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "group border rounded-md relative transition-all bg-background overflow-hidden",
        isFullscreen
          ? "fixed inset-0 z-50 w-full h-full max-w-none max-h-none shadow-lg"
          : "",
        className
      )}
      style={
        isFullscreen ? { padding: " ", background: "var(--background)" } : {}
      }
      tabIndex={-1}
    >
      <ToolbarButton
        Icon={isFullscreen ? Minimize : Maximize}
        tooltip={isFullscreen ? "Exit Fullscreen (Esc)" : "Fullscreen (F11)"}
        onClick={() => setIsFullscreen((f) => !f)}
        className={cn(
          "opacity-0 group-hover:opacity-100 transition-opacity absolute  z-10",
          isFullscreen ? "bottom-4 right-6" : "bottom-2 right-4"
        )}
      />

      <EditorToolbar
        editor={editor}
        withUndo
        withRedo
        withHeadings
        withBold
        withItalic
        withUnderline
        withStrikeThrough
        withLink
        withBulletList
        withOrderedList
        withBlockquote
        withCode
        withCodeBlock
        withHorizontalRule
        withImage
        withHighlight
        withSearch
        withAlignment
        withEraser
      />

      <TipTapFloatingMenu editor={editor} />
      <ScrollArea
        className={cn(
          isFullscreen ? "h-full overflow-y-auto" : "h-80 overflow-y-hidden"
        )}
      >
        <EditorContent editor={editor} />
      </ScrollArea>
    </div>
  );
}
