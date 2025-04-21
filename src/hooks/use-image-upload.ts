"use client"

import type React from "react"

import { RefObject, useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { UploadThingError } from "uploadthing/server"
import { uploadFiles } from "@/lib/uploadthing"

export interface UseImageUploadOptions {
  /**
   * Callback function when an image is successfully uploaded
   */
  onUpload?: (url: string) => void
  /**
   * Callback function when an error occurs during upload
   */
  onError?: (error: string) => void
  /**
   * Maximum file size in bytes (default: 4MB)
   */
  maxSize?: number
  /**
   * Accepted file types (default: image/*)
   */
  accept?: string
}

export interface UseImageUploadResult {
  /**
   * URL for the image preview
   */
  previewUrl: string | null
  /**
   * Reference to the file input element
   */
  fileInputRef: RefObject<HTMLInputElement | null>
  /**
   * Name of the selected file
   */
  fileName: string | null
  /**
   * Whether an upload is in progress
   */
  uploading: boolean
  /**
   * Error message if upload failed
   */
  error: string | null
  /**
   * Handle file selection change
   */
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>
  /**
   * Handle clicking on the thumbnail/preview
   */
  handleThumbnailClick: () => void
  /**
   * Remove the selected file and preview
   */
  handleRemove: () => void
  /**
   * Upload the selected file
   */
  uploadFile: (file: File) => Promise<string>
}

/**
 * Hook for handling image uploads with preview and integration with uploadthing
 */
export function useImageUpload({
  onUpload,
  onError,
  maxSize = 4 * 1024 * 1024, // 4MB
  accept = "image/*",
}: UseImageUploadOptions = {}): UseImageUploadResult {
  const previewRef = useRef<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Upload file using uploadthing
  const uploadFile = useCallback(
    async (file: File): Promise<string> => {
      try {
        setUploading(true)
        setError(null)

        // Validate file size
        if (file.size > maxSize) {
          const errorMsg = `File size exceeds ${maxSize / (1024 * 1024)}MB limit`
          setError(errorMsg)
          onError?.(errorMsg)
          throw new Error(errorMsg)
        }

        // Validate file type
        if (accept && !file.type.match(accept.replace("*", "."))) {
          const errorMsg = `File type not accepted. Please upload ${accept.replace("image/", "")}`
          setError(errorMsg)
          onError?.(errorMsg)
          throw new Error(errorMsg)
        }

        // Upload file using uploadthing
        const [res] = await uploadFiles("imageUploader", {
          files: [file],
          onUploadProgress: ({ progress }) => {
            // You can use progress if needed
            console.log(`Upload progress: ${progress}%`)
          },
        })

        // Return the URL from the response
        return res.ufsUrl
      } catch (error) {
        let errorMessage = "Upload failed"

        if (error instanceof UploadThingError) {
          errorMessage = error.data && "error" in error.data ? error.data.error : "Upload failed"
        } else if (error instanceof Error) {
          errorMessage = error.message
        }

        setError(errorMessage)
        onError?.(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setUploading(false)
      }
    },
    [maxSize, accept, onError],
  )

  const handleThumbnailClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      try {
        // Create preview
        const localUrl = URL.createObjectURL(file)
        setPreviewUrl(localUrl)
        previewRef.current = localUrl
        setFileName(file.name)

        // Upload file
        const uploadedUrl = await uploadFile(file)

        // Call onUpload callback with the uploaded URL
        onUpload?.(uploadedUrl)

        // Show success toast
        toast.success("Image uploaded successfully")
      } catch (err) {
        // Clean up preview on error
        if (previewRef.current) {
          URL.revokeObjectURL(previewRef.current)
          setPreviewUrl(null)
          setFileName(null)
          previewRef.current = null
        }

        // Show error toast
        toast.error(err instanceof Error ? err.message : "Upload failed")
      }
    },
    [uploadFile, onUpload],
  )

  const handleRemove = useCallback(() => {
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current)
    }
    setPreviewUrl(null)
    setFileName(null)
    previewRef.current = null
    setError(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current)
      }
    }
  }, [])

  return {
    previewUrl,
    fileName,
    fileInputRef,
    uploading,
    error,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,
    uploadFile,
  }
}
