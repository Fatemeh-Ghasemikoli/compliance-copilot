import "server-only";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  encrypt,
  verifySessionToken,
  type SessionPayload,
} from "@/app/lib/jwt";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export { SESSION_COOKIE, verifySessionToken };
export type { SessionPayload };

export async function createSession(userId: string): Promise<void> {
  const token = await encrypt({ userId });
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(Date.now() + SESSION_DURATION_MS),
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
