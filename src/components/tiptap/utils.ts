import { Editor } from '@tiptap/react';

export const isToolActive = (
  editor: Editor | null,
  format: string
): boolean => {
  if (!editor) return false;
  return editor.isActive(format);
};
