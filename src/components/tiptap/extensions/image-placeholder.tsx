"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  NODE_HANDLES_SELECTED_STYLE_CLASSNAME,
} from "@/lib/tiptap-utils";
import {
  type CommandProps,
  Node,
  type NodeViewProps,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  mergeAttributes,
} from "@tiptap/react";
import { useState } from "react";
import { EmptyCard } from "@/components/empty-card";
import { Icons } from "@/components/icons";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ImageUploadForm } from "../_components/upload-image-form";
import EmbedImageForm from "../_components/embed-image-form";

export interface ImagePlaceholderOptions {
  HTMLAttributes: React.HTMLProps<HTMLDivElement>;
  onUpload?: (url: string) => void;
  onError?: (error: string) => void;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    imagePlaceholder: {
      /**
       * Inserts an image placeholder
       */
      insertImagePlaceholder: () => ReturnType;
    };
  }
}

export const ImagePlaceholder = Node.create<ImagePlaceholderOptions>({
  name: "image-placeholder",

  addOptions() {
    return {
      HTMLAttributes: {},
      onUpload: () => {},
      onError: () => {},
    };
  },

  group: "block",

  parseHTML() {
    return [{ tag: `div[data-type="${this.name}"]` }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImagePlaceholderComponent, {
      className: NODE_HANDLES_SELECTED_STYLE_CLASSNAME,
    });
  },

  addCommands() {
    return {
      insertImagePlaceholder: () => (props: CommandProps) => {
        return props.commands.insertContent({
          type: "image-placeholder",
        });
      },
    };
  },
});

function ImagePlaceholderComponent(props: NodeViewProps) {
  const { editor } = props;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <NodeViewWrapper className="w-full">
      <div className="relative">
        {!isExpanded ? (
          <EmptyCard
            onClick={() => setIsExpanded(!isExpanded)}
            title={"Click to upload or drag and drop"}
            description="SVG, PNG, JPG or GIF"
            action={
              <Button
                variant="ghost"
                size="icon"
                className="size-7 absolute right-2 top-2"
                onClick={() => setIsExpanded(false)}
              >
                <Icons.close />
              </Button>
            }
          />
        ) : (
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Add Image</CardTitle>
              <CardDescription>Upload an image</CardDescription>

              <Button
                variant="ghost"
                size="icon"
                className="size-7 absolute right-2 top-2"
                onClick={() => setIsExpanded(false)}
              >
                <Icons.close />
              </Button>
            </CardHeader>

            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">
                  <Icons.cloudUpload className="mr-2 size-4" />
                  Upload
                </TabsTrigger>
                <TabsTrigger value="url">
                  <Icons.globe className="mr-2 size-4" />
                  URL
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload">
                <ImageUploadForm
                  onSuccess={(src, alt) => {
                    editor.chain().focus().setImage({ src, alt }).run();
                  }}
                />
              </TabsContent>

              <TabsContent value="url">
                <EmbedImageForm
                  onSubmitImage={(url, altText) => {
                    editor
                      .chain()
                      .focus()
                      .setImage({ src: url, alt: altText })
                      .run();
                    setIsExpanded(false);
                  }}
                />
              </TabsContent>
            </Tabs>
          </Card>
        )}
      </div>
    </NodeViewWrapper>
  );
}
