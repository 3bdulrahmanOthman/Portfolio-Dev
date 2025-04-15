import { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface User {
    role?: string;
  }

  interface JWT {
    role: UserRole;
  }

  interface Session {
    user: User & Session["user"];
  }
}