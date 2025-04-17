import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();

  if (session?.user?.role === "admin") {
    return new NextResponse(null, { status: 200 });
  }

  return new NextResponse(null, { status: 403 });
}