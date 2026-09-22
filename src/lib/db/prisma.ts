import { PrismaClient } from "../../../generated/prisma/client"
import { withAccelerate } from "@prisma/extension-accelerate"

// Prisma 7: the Accelerate proxy URL is passed to the client constructor
// (the schema datasource no longer carries the connection URL).
export const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL!,
}).$extends(withAccelerate())
