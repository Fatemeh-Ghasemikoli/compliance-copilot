import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyPassword } from "@/app/lib/password";
import { createSession } from "@/app/lib/session";

function invalidCredentialsResponse() {
  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return invalidCredentialsResponse();
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return invalidCredentialsResponse();
  }

  const passwordValid = await verifyPassword(password, user.password);
  if (!passwordValid) {
    return invalidCredentialsResponse();
  }

  await createSession(user.id);
  return NextResponse.json({ success: true });
}
