import { hash } from "bcrypt-ts"
import { prisma } from "@/lib/db/prisma"

/**
 * Seeds the admin user in the database.
 * This script should be run once during initial setup.
 */
async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables")
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    console.log("Admin user already exists")
    return
  }

  const hashedPassword = await hash(password, 12)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: "Administrator",
      role: "admin",
    },
  })

  console.log(`Admin user created with email: ${user.email}`)
}

seedAdminUser()
  .catch((error) => {
    console.error("Error seeding admin user:", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
