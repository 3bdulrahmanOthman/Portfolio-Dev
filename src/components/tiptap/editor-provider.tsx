"use client";

import type { Editor } from "@tiptap/react";
import React from "react";

export interface EditorContextProps {
  editor: Editor | null;
}
const EditorContext = React.createContext<EditorContextProps>({ editor: null });

export interface EditorProviderProps extends EditorContextProps {
  children: React.ReactNode;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({
  editor,
  children,
}) => {
  return (
    <EditorContext.Provider value={{ editor }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = React.useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};
