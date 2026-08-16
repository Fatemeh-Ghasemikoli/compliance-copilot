import "server-only";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export const SESSION_COOKIE = "session";

const secret = process.env.AUTH_SECRET;
if (!secret) {
  throw new Error("AUTH_SECRET environment variable is not set");
}
const encodedKey = new TextEncoder().encode(secret);

export interface SessionPayload extends JWTPayload {
  userId: string;
}

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

/**
 * Verifies a session JWT without reading cookies itself, so it can be
 * used both from Route Handlers/Server Components (via getSession) and
 * from proxy.ts (which reads the cookie off `request.cookies` directly).
 */
export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify<SessionPayload>(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null;
  }
}
