import { Editor } from '@tiptap/react';

export const isToolActive = (
  editor: Editor | null,
  format: string
): boolean => {
  if (!editor) return false;
  return editor.isActive(format);
};


export function isExtensionEnabled(editor: Editor | null, name: string): boolean {
  return !!editor?.extensionManager.extensions.find(ext => ext.name === name);
}
