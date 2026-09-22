/**
 * One-off admin password rotation.
 *
 * Usage:
 *   1. Set NEW_ADMIN_PASSWORD in .env (or export it in the shell).
 *   2. Run:
 *        node --import tsx --import ./scripts/lib/wasm-module-hook.mjs scripts/rotate-admin-password.ts
 *      (The WASM hook is required for any standalone Prisma script: without
 *      it, the generated client's bundler-only `*.wasm?module` import fails
 *      under bare Node. See scripts/lib/wasm-module-hook.mjs.)
 *   3. Keep the NEW_ADMIN_PASSWORD entry in .env as the live admin
 *      credential (it now holds the current password).
 *
 * Values are read from the environment only. The script prints a status line
 * and never echoes any secret value.
 */

type PrismaModule = typeof import("../src/lib/db/prisma");
let prismaModule: PrismaModule | undefined;

async function main() {
  // Load .env before the Prisma client module evaluates: it reads
  // DATABASE_URL at import time. process.loadEnvFile requires Node >= 21.
  // (.env is optional when the variables come from the shell.)
  try {
    process.loadEnvFile();
  } catch {}

  prismaModule = await import("../src/lib/db/prisma");
  const { hash } = await import("bcrypt-ts");

  const email = process.env.ADMIN_EMAIL;
  const newPassword = process.env.NEW_ADMIN_PASSWORD;

  if (!email) {
    throw new Error("ADMIN_EMAIL must be set in the environment");
  }
  if (!newPassword) {
    throw new Error("NEW_ADMIN_PASSWORD must be set in the environment");
  }

  const hashedPassword = await hash(newPassword, 12);

  const user = await prismaModule.prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  console.log(`Password rotated for user ${user.id} (${user.email}).`);
  console.log(
    "Reminder: NEW_ADMIN_PASSWORD in .env is now the live admin password."
  );

  await prismaModule.prisma.$disconnect();
}

main().catch((error) => {
  console.error(
    "Rotation failed:",
    error instanceof Error ? error.message : "unknown error"
  );
  process.exit(1);
});
