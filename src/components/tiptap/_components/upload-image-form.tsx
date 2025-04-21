"use client";

import { useCallback, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { Icons } from "@/components/icons";
import { showErrorToast } from "@/lib/handle-error";
import { uploadFiles } from "@/lib/uploadthing";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const uploadSchema = z.object({
  image: z
    .instanceof(File)
    .nullable()
    .refine((file) => !file || file.type.startsWith("image/"), {
      message: "Please upload a valid image file",
    }),
  altText: z.string().optional(),
});

type ImageUploadFormProps = {
  onSuccess: (src: string, alt?: string) => void;
};

export const ImageUploadForm = ({ onSuccess }: ImageUploadFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<z.infer<typeof uploadSchema>>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      image: null,
      altText: "",
    },
  });

  const altText = form.watch("altText");

  const onUpload = useCallback(
    async (
      files: File[],
      { onProgress }: { onProgress: (file: File, progress: number) => void }
    ) => {
      try {
        startTransition(async () => {
          const [res] = await uploadFiles("imageUploader", {
            files,
            onUploadProgress: ({ file, progress }) =>
              onProgress(file, progress),
          });

          onSuccess(res.ufsUrl, altText);
          toast.success("Image uploaded successfully");
          setFiles([]);
          form.reset();
        });
      } catch (error) {
        showErrorToast(error);
      }
    },
    [altText, form, onSuccess]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})} className="space-y-4">
        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem>
              <FormControl>
                <FileUpload
                  accept="image/*"
                  maxFiles={1}
                  maxSize={4 * 1024 * 1024}
                  disabled={isPending}
                  onAccept={(files) => {
                    setFiles(files);
                    form.clearErrors("image");
                  }}
                  onUpload={onUpload}
                  onFileReject={(_, message) =>
                    form.setError("image", { type: "manual", message })
                  }
                  className="w-full"
                >
                  <FileUploadDropzone>
                    <div className="flex flex-col items-center">
                      <div className="shrink-0 rounded-full border border-dashed p-4">
                        <Icons.image className="size-7" />
                      </div>
                      <p className="font-medium text-sm">
                        Drag & drop images here
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Or click to browse (1 file, max 4MB)
                      </p>
                    </div>
                    <FileUploadTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 w-fit"
                      >
                        Browse files
                      </Button>
                    </FileUploadTrigger>
                  </FileUploadDropzone>

                  <FileUploadList>
                    {files.map((file, index) => (
                      <FileUploadItem key={index} value={file}>
                        <div className="flex w-full items-center gap-2">
                          <FileUploadItemPreview />
                          <FileUploadItemMetadata />
                          <FileUploadItemDelete asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7"
                              onClick={() => {
                                const updated = [...files];
                                updated.splice(index, 1);
                                setFiles(updated);
                              }}
                            >
                              <Icons.close />
                            </Button>
                          </FileUploadItemDelete>
                        </div>
                        <FileUploadItemProgress />
                      </FileUploadItem>
                    ))}
                  </FileUploadList>
                </FileUpload>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="altText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alt Text</FormLabel>
              <FormControl>
                <Input placeholder="Alt text (optional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
