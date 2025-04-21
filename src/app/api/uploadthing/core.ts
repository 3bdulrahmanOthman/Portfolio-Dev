import { createUploadthing, type FileRouter } from "uploadthing/next"
import { rateLimit } from "@/lib/rate-limit"
import { auth } from "@/auth"
import { UploadThingError } from "uploadthing/server"

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user || session?.user?.role !== "admin") throw new UploadThingError("Unauthorized")

      await rateLimit({ id: `image_${session?.user.id}`, limit: 5 })

      return { userId: session?.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Image upload complete for userId:", metadata.userId)
      console.log("File URL:", file.ufsUrl)

      return { uploadedBy: metadata.userId, url: file.ufsUrl }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
