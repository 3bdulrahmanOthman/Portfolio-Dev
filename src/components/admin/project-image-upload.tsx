"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

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
import { uploadFiles } from "@/lib/uploadthing";
import { showErrorToast } from "@/lib/handle-error";
import { Icons } from "../icons";

interface ProjectImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  fileReject: (file: File, message: string) => void
}

export function ProjectImageUpload({
  value,
  onChange,
  fileReject,
}: ProjectImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleUpload = async (
    files: File[],
    {
      onProgress,
    }: {
      onProgress: (file: File, progress: number) => void;
    }
  ) => {
    try {
      setIsUploading(true);

      const [res] = await uploadFiles("imageUploader", {
        files,
        onUploadProgress: ({ file, progress }) => {
          onProgress(file, progress);
        },
      });

      onChange(res.ufsUrl);
      toast.success("Image uploaded successfully");
    } catch (error) {
      showErrorToast(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {value && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
          <Image
            src={value || "/placeholder.svg"}
            alt="Project image"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 600px"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2 cursor-pointer opacity-85 hover:opacity-100 transition-colors size-7"
            onClick={() => onChange("")}
          >
            <Icons.trash />
          </Button>
        </div>
      )}

      {!value && (
        <FileUpload
          accept="image/*"
          maxFiles={1}
          maxSize={2 * 1024 * 1024}
          onAccept={(files) => setFiles(files)}
          onUpload={handleUpload}
          onFileReject={fileReject}
          disabled={isUploading}
        >
          <FileUploadDropzone className="flex-row border-dashed">
            <Icons.cloudUpload className="size-4" />
            Drag and drop or
            <FileUploadTrigger asChild>
              <Button variant="link" size="sm" className="p-0">
                choose files
              </Button>
            </FileUploadTrigger>
            to upload
          </FileUploadDropzone>
          <FileUploadList>
            {files.map((file, index) => (
              <FileUploadItem key={index} value={file}>
                <div className="flex w-full items-center gap-2">
                  <FileUploadItemPreview />
                  <FileUploadItemMetadata />
                  <FileUploadItemDelete asChild>
                    <Button variant="ghost" size="icon" className="size-7">
                      <Icons.trash />
                    </Button>
                  </FileUploadItemDelete>
                </div>
                <FileUploadItemProgress />
              </FileUploadItem>
            ))}
          </FileUploadList>
        </FileUpload>
      )}
    </div>
  );
}
