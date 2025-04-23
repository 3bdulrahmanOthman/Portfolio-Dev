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
import { isToolActive } from "../utils";

interface EditorToolbarProps {
  editor: Editor | null;
  withUndo?: boolean;
  withRedo?: boolean;
  withHeadings?: boolean;
  withBlockquote?: boolean;
  withCode?: boolean;
  withCodeBlock?: boolean;
  withBold?: boolean;
  withItalic?: boolean;
  withUnderline?: boolean;
  withStrikeThrough?: boolean;
  withLink?: boolean;
  withBulletList?: boolean;
  withOrderedList?: boolean;
  withHorizontalRule?: boolean;
  withImage?: boolean;
  withHighlight?: boolean;
  withSearch?: boolean;
  withAlignment?: boolean;
  withEraser?: boolean;
  className?: string;
}

export const EditorToolbar = (props: EditorToolbarProps) => {
  const {
    editor,
    withUndo,
    withRedo,
    withHeadings,
    withBlockquote,
    withCode,
    withCodeBlock,
    withBold,
    withItalic,
    withUnderline,
    withStrikeThrough,
    withLink,
    withBulletList,
    withOrderedList,
    withHorizontalRule,
    withImage,
    withHighlight,
    withSearch,
    withAlignment,
    withEraser,
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
            {withEraser && (
              <ToolbarButton
                Icon={Eraser}
                tooltip="Clear Formatting (⌘ + ⇧ + C)"
                onClick={() =>
                  editor?.chain().focus().clearNodes().unsetAllMarks().run()
                }
              />
            )}

            {withHeadings && <HeadingsToolbar editor={editor} />}
            {withHighlight && <ColorHighlightToolbar editor={editor} />}
            {withBlockquote && (
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
            {withCode && (
              <ToolbarButton
                Icon={Code2}
                isActive={isToolActive(editor, "code")}
                tooltip="Code"
                onClick={() => editor.chain().focus().toggleCode().run()}
                disabled={!editor.can().chain().focus().toggleCode().run()}
              />
            )}
            {withCodeBlock && (
              <ToolbarButton
                Icon={Code}
                isActive={isToolActive(editor, "codeBlock")}
                tooltip="Code Block"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
              />
            )}
            {withBold && (
              <ToolbarButton
                Icon={BoldIcon}
                isActive={isToolActive(editor, "bold")}
                tooltip="Bold"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
              />
            )}
            {withItalic && (
              <ToolbarButton
                Icon={ItalicIcon}
                isActive={isToolActive(editor, "italic")}
                tooltip="Italic (⌘ + I)"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
              />
            )}
            {withUnderline && (
              <ToolbarButton
                Icon={UnderlineIcon}
                isActive={isToolActive(editor, "underline")}
                tooltip="Underline (⌘ + U)"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                disabled={!editor.can().chain().focus().toggleUnderline().run()}
              />
            )}
            {withStrikeThrough && (
              <ToolbarButton
                Icon={Strikethrough}
                isActive={isToolActive(editor, "strike")}
                tooltip="Strikethrough (⌘ + ⇧ + X)"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
              />
            )}
            {withLink && <LinkToolbar editor={editor} />}
            {withBulletList && (
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
            {withOrderedList && (
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
            {withHorizontalRule && (
              <ToolbarButton
                Icon={SeparatorHorizontal}
                tooltip="Horizontal Rule"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
              />
            )}
            {withImage && (
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

            {withSearch && <SearchAndReplaceToolbar editor={editor} />}
            {withAlignment && <AlignmentToolbar editor={editor} />}

            <div className="ml-auto"></div>

            {withUndo && (
              <ToolbarButton
                Icon={Undo2}
                tooltip="Undo"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
              />
            )}
            {withRedo && (
              <ToolbarButton
                Icon={Redo2}
                tooltip="Redo"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
              />
            )}
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
