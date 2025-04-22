"use client";

import { useEffect, useState } from "react";
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
import { FloatingToolbar } from "@/components/tiptap/extensions/floating-toolbar";
import { EditorToolbar } from "@/components/tiptap/toolbars/editor-toolbar";
import { ScrollArea } from "@/components/ui/scroll-area";

import "./tiptap.css";

interface TextEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
}

export function TextEditor({
  initialContent,
  onChange,
}: TextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

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
    <div className="border rounded-lg">
      <EditorToolbar editor={editor} />
      <FloatingToolbar editor={editor} />
      <TipTapFloatingMenu editor={editor} />
      <ScrollArea className="h-80 overflow-y-hidden">
        <EditorContent editor={editor} />
      </ScrollArea>
    </div>
  );
}
