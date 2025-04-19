import { prisma } from '@/lib/db/prisma'
import { Prisma } from '@prisma/client'
import { hash } from 'bcrypt-ts'

async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL as Prisma.UserCreateInput["email"]
  const password = process.env.ADMIN_PASSWORD as Prisma.UserCreateInput["password"]

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

async function main() {
  await seedAdminUser()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })