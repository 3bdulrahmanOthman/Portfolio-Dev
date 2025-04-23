"use client";

import { BubbleMenu, type Editor } from "@tiptap/react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { EditorProvider } from "../editor-provider";

import { HeadingsToolbar } from "../toolbars/headings";
import { LinkToolbar } from "../toolbars/link";
import { ColorHighlightToolbar } from "../toolbars/color-and-highlight";
import { SearchAndReplaceToolbar } from "../toolbars/search-and-replace-toolbar";
import { AlignmentToolbar } from "../toolbars/alignment";
import { cn } from "@/lib/utils";
import { ToolbarButton } from "../_components/toolbar-button";
import {
  BoldIcon,
  Code,
  Code2,
  Eraser,
  ImageIcon,
  ItalicIcon,
  List,
  ListOrdered,
  Redo2,
  SeparatorHorizontal,
  Strikethrough,
  TextQuote,
  UnderlineIcon,
  Undo2,
} from "lucide-react";
import { isExtensionEnabled, isToolActive } from "../utils";

interface EditorToolbarProps {
  editor: Editor | null;
  className?: string;
}

export const EditorToolbar = (props: EditorToolbarProps) => {
  const {
    editor,
    className,
  } = props;

  const isMobile = useMediaQuery("(max-width: 768px)");
  if (!editor) return null;

  const toolbarContent = (
    <EditorProvider editor={editor}>
      <TooltipProvider>
        <ScrollArea>
          <div
            className={cn(
              "flex items-center px-2 py-1 gap-0.5",
              !isMobile && "border-b",
              className
            )}
          >
            <ToolbarButton
              Icon={Eraser}
              tooltip="Clear Formatting (⌘ + ⇧ + C)"
              onClick={() =>
                editor?.chain().focus().clearNodes().unsetAllMarks().run()
              }
            />

            {isExtensionEnabled(editor, "heading") && (
              <HeadingsToolbar editor={editor} />
            )}
            {isExtensionEnabled(editor, "textStyle") && (
              <ColorHighlightToolbar editor={editor} />
            )}
            {isExtensionEnabled(editor, "blockquote") && (
              <ToolbarButton
                Icon={TextQuote}
                isActive={isToolActive(editor, "blockquote")}
                tooltip="Blockquote"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                disabled={
                  !editor.can().chain().focus().toggleBlockquote().run()
                }
              />
            )}
            {isExtensionEnabled(editor, "code") && (
              <ToolbarButton
                Icon={Code2}
                isActive={isToolActive(editor, "code")}
                tooltip="Code"
                onClick={() => editor.chain().focus().toggleCode().run()}
                disabled={!editor.can().chain().focus().toggleCode().run()}
              />
            )}
            {isExtensionEnabled(editor, "codeBlock") && (
              <ToolbarButton
                Icon={Code}
                isActive={isToolActive(editor, "codeBlock")}
                tooltip="Code Block"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
              />
            )}
            {isExtensionEnabled(editor, "bold") && (
              <ToolbarButton
                Icon={BoldIcon}
                isActive={isToolActive(editor, "bold")}
                tooltip="Bold"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
              />
            )}
            {isExtensionEnabled(editor, "italic") && (
              <ToolbarButton
                Icon={ItalicIcon}
                isActive={isToolActive(editor, "italic")}
                tooltip="Italic (⌘ + I)"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
              />
            )}
            {isExtensionEnabled(editor, "underline") && (
              <ToolbarButton
                Icon={UnderlineIcon}
                isActive={isToolActive(editor, "underline")}
                tooltip="Underline (⌘ + U)"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                disabled={!editor.can().chain().focus().toggleUnderline().run()}
              />
            )}
            {isExtensionEnabled(editor, "strike") && (
              <ToolbarButton
                Icon={Strikethrough}
                isActive={isToolActive(editor, "strike")}
                tooltip="Strikethrough (⌘ + ⇧ + X)"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
              />
            )}
            {isExtensionEnabled(editor, "link") && (
              <LinkToolbar editor={editor} />
            )}
            {isExtensionEnabled(editor, "bulletList") && (
              <ToolbarButton
                Icon={List}
                isActive={isToolActive(editor, "bulletList")}
                tooltip="Bullet list"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                disabled={
                  !editor.can().chain().focus().toggleBulletList().run()
                }
              />
            )}
            {isExtensionEnabled(editor, "orderedList") && (
              <ToolbarButton
                Icon={ListOrdered}
                isActive={isToolActive(editor, "orderedList")}
                tooltip="Ordered list"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                disabled={
                  !editor.can().chain().focus().toggleOrderedList().run()
                }
              />
            )}
            {isExtensionEnabled(editor, "horizontalRule") && (
              <ToolbarButton
                Icon={SeparatorHorizontal}
                tooltip="Horizontal Rule"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
              />
            )}
            {isExtensionEnabled(editor, "image-placeholder") && (
              <ToolbarButton
                Icon={ImageIcon}
                isActive={isToolActive(editor, "image-placeholder")}
                tooltip="Image"
                aria-label="Insert Image"
                title="Insert Image"
                onClick={() =>
                  editor?.chain().focus().insertImagePlaceholder().run()
                }
              />
            )}

            {isExtensionEnabled(editor, "searchAndReplace") && (
              <SearchAndReplaceToolbar editor={editor} />
            )}
            {isExtensionEnabled(editor, "textAlign") && (
              <AlignmentToolbar editor={editor} />
            )}

            <div className="ml-auto"></div>

            <ToolbarButton
              Icon={Undo2}
              tooltip="Undo"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
            />
            <ToolbarButton
              Icon={Redo2}
              tooltip="Redo"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
            />
          </div>
          <ScrollBar className="size-full opacity-0" orientation="horizontal" />
        </ScrollArea>
      </TooltipProvider>
    </EditorProvider>
  );

  if (isMobile) {
    return (
      <BubbleMenu
        editor={editor}
        key="mobile-toolbar"
        tippyOptions={{ duration: 0, placement: "bottom", offset: [0, 10] }}
        shouldShow={() => editor.isEditable && editor.isFocused}
        className="w-full min-w-full mx-0 shadow-sm border rounded-sm bg-background"
      >
        {toolbarContent}
      </BubbleMenu>
    );
  }

  return <>{toolbarContent}</>;
};
